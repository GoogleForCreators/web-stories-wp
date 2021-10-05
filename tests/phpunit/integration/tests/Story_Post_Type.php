<?php
/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories\Tests\Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Post_Type
 */
class Story_Post_Type extends DependencyInjectedTestCase {
	use Capabilities_Setup;

	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Story_Post_Type
	 */
	protected $instance;

	/**
	 * @var \Google\Web_Stories\Settings
	 */
	private $settings;

	/**
	 * Archive page ID.
	 *
	 * @var int
	 */
	protected static $archive_page_id;

	/**
	 * @var string
	 */
	protected $redirect_location;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Story_Post_Type Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( self::$story_id, $poster_attachment_id );

		self::$archive_page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );
	}

	public function set_up() {
		parent::set_up();

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );

		$this->settings = new \Google\Web_Stories\Settings();
		$this->instance = new \Google\Web_Stories\Story_Post_Type( $this->settings, $experiments );

		$this->add_caps_to_roles();

		add_filter( 'wp_redirect', [ $this, 'filter_wp_redirect' ] );
	}

	public function tear_down() {
		$this->remove_caps_from_roles();

		$this->redirect_location = null;
		remove_filter( 'wp_redirect', [ $this, 'filter_wp_redirect' ] );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		parent::tear_down();
	}

	public function filter_wp_redirect( $location ): bool {
		$this->redirect_location = $location;

		return false;
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$this->instance->register();

		$this->assertSame(
			10,
			has_filter(
				'_wp_post_revision_fields',
				[
					$this->instance,
					'filter_revision_fields',
				] 
			) 
		);
		$this->assertSame( 10, has_filter( 'wp_insert_post_data', [ $this->instance, 'change_default_title' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'bulk_post_updated_messages',
				[
					$this->instance,
					'bulk_post_updated_messages',
				] 
			) 
		);
		$this->assertSame( 10, has_filter( 'pre_handle_404', [ $this->instance, 'redirect_post_type_archive_urls' ] ) );

		$this->assertSame(
			10,
			has_action(
				'add_option_' . $this->settings::SETTING_NAME_ARCHIVE,
				[
					$this->instance,
					'update_archive_setting',
				] 
			) 
		);
		$this->assertSame(
			10,
			has_action(
				'update_option_' . $this->settings::SETTING_NAME_ARCHIVE,
				[
					$this->instance,
					'update_archive_setting',
				] 
			) 
		);
	}

	/**
	 * @covers ::get_post_type_icon
	 */
	public function test_get_post_type_icon() {
		$valid = $this->call_private_method( $this->instance, 'get_post_type_icon' );
		$this->assertStringContainsString( 'data:image/svg+xml;base64', $valid );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type() {

		$post_type = $this->instance->register_post_type();
		$this->assertTrue( $post_type->has_archive );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type_disabled() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'disabled' );
		$post_type = $this->instance->register_post_type();
		$this->assertFalse( $post_type->has_archive );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type_default() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'default' );
		$post_type = $this->instance->register_post_type();
		$this->assertTrue( $post_type->has_archive );
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta() {
		$this->call_private_method( $this->instance, 'register_meta' );

		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::PUBLISHER_LOGO_META_KEY, $this->instance::POST_TYPE_SLUG ) );
	}

	/**
	 * @covers ::change_default_title
	 */
	public function test_change_default_title() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
				'post_status'  => 'auto-draft',
				'post_title'   => 'Auto draft',
			]
		);

		$this->assertSame( '', $post->post_title );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_default() {
		$actual = $this->call_private_method( $this->instance, 'get_has_archive' );
		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_disabled_experiments() {
		$experiments    = new \Google\Web_Stories\Experiments( $this->settings );
		$this->instance = new \Google\Web_Stories\Story_Post_Type( $this->settings, $experiments );

		$actual = $this->call_private_method( $this->instance, 'get_has_archive' );
		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_disabled() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'disabled' );

		$actual = $this->call_private_method( $this->instance, 'get_has_archive' );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );

		$this->assertFalse( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_but_no_page() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );

		$actual = $this->call_private_method( $this->instance, 'get_has_archive' );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );

		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_but_invalid_page() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		$actual = $this->call_private_method( $this->instance, 'get_has_archive' );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$actual = $this->call_private_method( $this->instance, 'get_has_archive' );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertIsString( $actual );
		$this->assertSame( urldecode( get_page_uri( self::$archive_page_id ) ), $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_not_published() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'draft',
			]
		);

		$actual = $this->call_private_method( $this->instance, 'get_has_archive' );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'publish',
			]
		);

		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::pre_get_posts
	 */
	public function test_pre_get_posts_default_archive() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'default' );

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->go_to( $archive_link );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );

		$this->assertQueryTrue( 'is_archive', 'is_post_type_archive' );
	}

	/**
	 * @covers ::pre_get_posts
	 */
	public function test_pre_get_posts_custom_archive() {
		$this->set_permalink_structure( '/%postname%/' );

		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$this->instance->register_post_type();

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->go_to( $archive_link );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertQueryTrue( 'is_page', 'is_singular' );
	}

	/**
	 * @covers ::pre_get_posts
	 */
	public function test_pre_get_posts_custom_archive_not_published() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'draft',
			]
		);

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->go_to( $archive_link );

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'publish',
			]
		);

		$this->assertQueryTrue( 'is_archive', 'is_post_type_archive' );
	}

	/**
	 * @covers ::filter_display_post_states
	 */
	public function test_filter_display_post_states() {
		$actual = $this->call_private_method(
			$this->instance,
			'filter_display_post_states',
			[
				[],
				get_post( self::$archive_page_id ),
			] 
		);

		$this->assertSame( [], $actual );
	}

	/**
	 * @covers ::filter_display_post_states
	 */
	public function test_filter_display_post_states_custom_archive() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$actual = $this->call_private_method(
			$this->instance,
			'filter_display_post_states',
			[
				[],
				get_post( self::$archive_page_id ),
			] 
		);

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertEqualSetsWithIndex(
			[
				'web_stories_archive_page' => __( 'Web Stories Archive Page', 'web-stories' ),
			],
			$actual
		);
	}

	/**
	 * @covers ::filter_display_post_states
	 */
	public function test_filter_display_post_states_custom_archive_not_published() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'draft',
			]
		);

		$actual = $this->call_private_method(
			$this->instance,
			'filter_display_post_states',
			[
				[],
				get_post( self::$archive_page_id ),
			] 
		);

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'publish',
			]
		);

		$this->assertSame( [], $actual );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_experiment_disabled() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		$query  = new \WP_Query();
		$result = $this->instance->redirect_post_type_archive_urls( true, $query );

		$this->assertTrue( $result );
		$this->assertNull( $this->redirect_location );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_bypass() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		$query  = new \WP_Query();
		$result = $this->instance->redirect_post_type_archive_urls( true, $query );

		$this->assertTrue( $result );
		$this->assertNull( $this->redirect_location );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_ugly_permalinks() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		// Needed so that the archive page change takes effect.
		$this->instance->register_post_type();

		$query  = new \WP_Query();
		$result = $this->instance->redirect_post_type_archive_urls( false, $query );

		$this->assertFalse( $result );
		$this->assertNull( $this->redirect_location );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_pretty_permalinks() {
		$this->set_permalink_structure( '/%postname%/' );

		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		// Needed so that the archive page change takes effect.
		$this->instance->register_post_type();

		$query  = new \WP_Query();
		$result = $this->instance->redirect_post_type_archive_urls( false, $query );

		$this->assertFalse( $result );
		$this->assertNull( $this->redirect_location );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_page() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		// Needed so that the archive page change takes effect.
		$this->instance->register_post_type();

		$query                    = new \WP_Query();
		$query->query['pagename'] = $this->instance::REWRITE_SLUG;
		$query->set( 'name', $this->instance::REWRITE_SLUG );
		$query->set( 'page', self::$story_id );

		add_filter( 'post_type_link', '__return_false' );
		add_filter( 'post_type_archive_link', '__return_false' );

		$result = $this->instance->redirect_post_type_archive_urls( false, $query );

		remove_filter( 'post_type_link', '__return_false' );
		remove_filter( 'post_type_archive_link', '__return_false' );

		$this->assertFalse( $result );
		$this->assertNull( $this->redirect_location );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_pagename_set() {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		// Needed so that the archive page change takes effect.
		$this->instance->register_post_type();

		$query                    = new \WP_Query();
		$query->query['pagename'] = $this->instance::REWRITE_SLUG;
		$query->set( 'pagename', $this->instance::REWRITE_SLUG );

		add_filter( 'post_type_archive_link', '__return_false' );

		$result = $this->instance->redirect_post_type_archive_urls( false, $query );

		remove_filter( 'post_type_archive_link', '__return_false' );

		$this->assertFalse( $result );
		$this->assertNull( $this->redirect_location );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_existing_custom_page() {
		$this->set_permalink_structure( '/%postname%/' );

		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		// Needed so that the archive page change takes effect.
		$this->instance->register_post_type();

		$query                    = new \WP_Query();
		$query->query['pagename'] = $this->instance::REWRITE_SLUG;
		$query->set( 'pagename', $this->instance::REWRITE_SLUG );

		$result = $this->instance->redirect_post_type_archive_urls( false, $query );

		$this->assertFalse( $result );
		$this->assertSame( get_permalink( self::$archive_page_id ), $this->redirect_location );
	}
}
