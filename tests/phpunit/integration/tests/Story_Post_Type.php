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

use Google\Web_Stories\Settings;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Post_Type
 */
class Story_Post_Type extends TestCase {
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
	 * Archive page ID.
	 *
	 * @var int
	 */
	protected static $archive_page_id;

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

	public function setUp() {
		parent::setUp();
		$this->add_caps_to_roles();
	}

	public function tearDown() {
		$this->remove_caps_from_roles();
		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_ARCHIVE );

		parent::tearDown();
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$story_post_type->register();

		$this->assertSame( 10, has_filter( '_wp_post_revision_fields', [ $story_post_type, 'filter_revision_fields' ] ) );
		$this->assertSame( 10, has_filter( 'wp_insert_post_data', [ $story_post_type, 'change_default_title' ] ) );
		$this->assertSame( 10, has_filter( 'bulk_post_updated_messages', [ $story_post_type, 'bulk_post_updated_messages' ] ) );

		$this->assertSame( 10, has_action( 'add_option_' . \Google\Web_Stories\Settings::SETTING_NAME_ARCHIVE, [ $story_post_type, 'update_archive_setting' ] ) );
		$this->assertSame( 10, has_action( 'update_option_' . \Google\Web_Stories\Settings::SETTING_NAME_ARCHIVE, [ $story_post_type, 'update_archive_setting' ] ) );
	}

	/**
	 * @covers ::get_post_type_icon
	 */
	public function test_get_post_type_icon() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$valid           = $this->call_private_method( $story_post_type, 'get_post_type_icon' );
		$this->assertContains( 'data:image/svg+xml;base64', $valid );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$post_type       = $story_post_type->register_post_type();
		$this->assertTrue( $post_type->has_archive );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type_disabled() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_ARCHIVE, 'disabled' );
		$post_type = $story_post_type->register_post_type();
		$this->assertFalse( $post_type->has_archive );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type_default() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_ARCHIVE, 'default' );
		$post_type = $story_post_type->register_post_type();
		$this->assertTrue( $post_type->has_archive );
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$this->call_private_method( $story_post_type, 'register_meta' );

		$this->assertTrue( registered_meta_key_exists( 'post', $story_post_type::PUBLISHER_LOGO_META_KEY, $story_post_type::POST_TYPE_SLUG ) );
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
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'get_has_archive' );
		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_disabled() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'disabled' );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'get_has_archive' );

		delete_option( Settings::SETTING_NAME_ARCHIVE );

		$this->assertFalse( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_but_no_page() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'get_has_archive' );

		delete_option( Settings::SETTING_NAME_ARCHIVE );

		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_but_invalid_page() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'get_has_archive' );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'get_has_archive' );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertIsString( $actual );
		$this->assertSame( urldecode( get_page_uri( self::$archive_page_id ) ), $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_not_published() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'draft',
			]
		);

		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'get_has_archive' );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

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
		update_option( Settings::SETTING_NAME_ARCHIVE, 'default' );

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->go_to( $archive_link );

		delete_option( Settings::SETTING_NAME_ARCHIVE );

		$this->assertQueryTrue( 'is_archive', 'is_post_type_archive' );
	}

	/**
	 * @covers ::pre_get_posts
	 */
	public function test_pre_get_posts_custom_archive() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->go_to( $archive_link );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertQueryTrue( 'is_page', 'is_singular' );
	}

	/**
	 * @covers ::pre_get_posts
	 */
	public function test_pre_get_posts_custom_archive_not_published() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'draft',
			]
		);

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->go_to( $archive_link );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

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
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'filter_display_post_states', [ [], get_post( self::$archive_page_id ) ] );

		$this->assertSame( [], $actual );
	}

	/**
	 * @covers ::filter_display_post_states
	 */
	public function test_filter_display_post_states_custom_archive() {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'filter_display_post_states', [ [], get_post( self::$archive_page_id ) ] );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

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
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'draft',
			]
		);

		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$actual          = $this->call_private_method( $story_post_type, 'filter_display_post_states', [ [], get_post( self::$archive_page_id ) ] );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'publish',
			]
		);

		$this->assertSame( [], $actual );
	}
}
