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

namespace Google\Web_Stories\Tests;

use DOMDocument;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Post_Type
 */
class Story_Post_Type extends \WP_UnitTestCase {
	use Private_Access;

	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Subscriber user for test.
	 *
	 * @var int
	 */
	protected static $subscriber_id;

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id      = $factory->user->create(
			[ 'role' => 'administrator' ]
		);
		self::$subscriber_id = $factory->user->create(
			[ 'role' => 'subscriber' ]
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
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$story_post_type->init();

		$this->assertSame( 10, has_filter( 'admin_enqueue_scripts', [ $story_post_type, 'admin_enqueue_scripts' ] ) );
		$this->assertSame( 10, has_filter( 'show_admin_bar', [ $story_post_type, 'show_admin_bar' ] ) );
		$this->assertSame( 10, has_filter( 'replace_editor', [ $story_post_type, 'replace_editor' ] ) );
		$this->assertSame( 10, has_filter( 'use_block_editor_for_post_type', [ $story_post_type, 'filter_use_block_editor_for_post_type' ] ) );
		$this->assertSame( PHP_INT_MAX, has_filter( 'template_include', [ $story_post_type, 'filter_template_include' ] ) );
		$this->assertSame( 10, has_filter( '_wp_post_revision_fields', [ $story_post_type, 'filter_revision_fields' ] ) );
		$this->assertSame( 10, has_filter( 'the_content_feed', [ $story_post_type, 'embed_image' ] ) );
		$this->assertSame( 10, has_filter( 'the_excerpt_rss', [ $story_post_type, 'embed_image' ] ) );
		$this->assertSame( PHP_INT_MAX, has_filter( 'the_content', [ $story_post_type, 'embed_player' ] ) );
		$this->assertSame( PHP_INT_MAX, has_filter( 'the_excerpt', [ $story_post_type, 'embed_player' ] ) );
		$this->assertSame( 10, has_filter( 'bulk_post_updated_messages', [ $story_post_type, 'bulk_post_updated_messages' ] ) );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_admin() {
		wp_set_current_user( self::$admin_id );

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );

		$post_type = new \Google\Web_Stories\Story_Post_Type( $experiments );
		$results   = $post_type->get_editor_settings();
		$this->assertTrue( $results['config']['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_subscriber() {
		wp_set_current_user( self::$subscriber_id );

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );

		$post_type = new \Google\Web_Stories\Story_Post_Type( $experiments );
		$results   = $post_type->get_editor_settings();
		$this->assertFalse( $results['config']['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::filter_rest_collection_params
	 */
	public function test_filter_rest_collection_params() {
		$query_params = [
			'foo',
			'orderby' => [
				'enum' => [],
			],
		];

		$post_type       = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$filtered_params = $story_post_type->filter_rest_collection_params( $query_params, $post_type );
		$this->assertEquals(
			$filtered_params,
			[
				'foo',
				'orderby' => [
					'enum' => [ 'story_author' ],
				],
			]
		);
	}

	/**
	 * @covers ::filter_rest_collection_params
	 */
	public function test_filter_rest_collection_params_incorrect_post_type() {
		$query_params = [
			'foo',
			'orderby' => [
				'enum' => [],
			],
		];

		$post_type       = new \stdClass();
		$post_type->name = 'post';
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$filtered_params = $story_post_type->filter_rest_collection_params( $query_params, $post_type );
		$this->assertEquals( $filtered_params, $query_params );
	}

	/**
	 * @covers ::get_post_type_icon
	 */
	public function test_get_post_type_icon() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$valid           = $this->call_private_method( $story_post_type, 'get_post_type_icon' );
		$this->assertContains( 'data:image/svg+xml;base64', $valid );
	}

	/**
	 * @covers ::admin_enqueue_scripts
	 */
	public function test_admin_enqueue_scripts() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );

		$story_post_type           = new \Google\Web_Stories\Story_Post_Type( $experiments );
		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$story_post_type->admin_enqueue_scripts( 'post.php' );

		unset( $GLOBALS['current_screen'] );

		$this->assertTrue( wp_script_is( \Google\Web_Stories\Story_Post_Type::WEB_STORIES_SCRIPT_HANDLE, 'registered' ) );
		$this->assertTrue( wp_style_is( \Google\Web_Stories\Story_Post_Type::WEB_STORIES_SCRIPT_HANDLE, 'registered' ) );
	}

	/**
	 * @covers ::filter_use_block_editor_for_post_type
	 */
	public function test_filter_use_block_editor_for_post_type() {
		$story_post_type  = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$use_block_editor = $story_post_type->filter_use_block_editor_for_post_type( true, $story_post_type::POST_TYPE_SLUG );
		$this->assertFalse( $use_block_editor );
	}

	/**
	 * @covers ::filter_template_include
	 */
	public function test_filter_template_include() {
		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );
		$story_post_type  = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$template_include = $story_post_type->filter_template_include( 'current' );
		$this->assertContains( WEBSTORIES_PLUGIN_DIR_PATH, $template_include );
	}

	/**
	 * @covers ::show_admin_bar
	 */
	public function test_show_admin_bar() {
		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$show_admin_bar  = $story_post_type->show_admin_bar( 'current' );
		$this->assertFalse( $show_admin_bar );
		$this->assertTrue( is_singular( $story_post_type::POST_TYPE_SLUG ) );
	}

	/**
	 * @covers ::add_caps_to_roles
	 */
	public function test_add_caps_to_roles() {
		$post_type_object = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$all_capabilities = array_values( (array) $post_type_object->cap );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$story_post_type->add_caps_to_roles();

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );

		foreach ( $all_capabilities as $cap ) {
			$this->assertTrue( $administrator->has_cap( $cap ) );
			$this->assertTrue( $editor->has_cap( $cap ) );
		}
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_true() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$query           = new \WP_Query();
		$result          = $story_post_type->redirect_post_type_archive_urls( true, $query );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_no_permalink() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$query           = new \WP_Query();
		$result          = $story_post_type->redirect_post_type_archive_urls( false, $query );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_permalinks() {
		$this->set_permalink_structure( '/%postname%/' );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$query           = new \WP_Query();
		$result          = $story_post_type->redirect_post_type_archive_urls( false, $query );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_page() {
		$this->set_permalink_structure( '/%postname%/' );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );

		$query                    = new \WP_Query();
		$query->query['pagename'] = 'stories';
		$query->set( 'name', 'stories' );
		$query->set( 'page', self::$story_id );

		add_filter( 'post_type_link', '__return_false' );
		add_filter( 'post_type_archive_link', '__return_false' );
		$result = $story_post_type->redirect_post_type_archive_urls( false, $query );
		remove_filter( 'post_type_link', '__return_false' );
		remove_filter( 'post_type_archive_link', '__return_false' );

		$this->assertFalse( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_pagename_set() {
		$this->set_permalink_structure( '/%postname%/' );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );

		$query                    = new \WP_Query();
		$query->query['pagename'] = 'stories';
		$query->set( 'pagename', 'stories' );

		add_filter( 'post_type_archive_link', '__return_false' );
		$result = $story_post_type->redirect_post_type_archive_urls( false, $query );
		remove_filter( 'post_type_archive_link', '__return_false' );

		$this->assertFalse( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_pagename_child_set() {
		$this->set_permalink_structure( '/%postname%/' );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );

		$query                    = new \WP_Query();
		$query->query['pagename'] = 'client/stories';
		$query->set( 'pagename', 'stories' );

		add_filter( 'post_type_archive_link', '__return_false' );
		$result = $story_post_type->redirect_post_type_archive_urls( false, $query );
		remove_filter( 'post_type_archive_link', '__return_false' );

		$this->assertFalse( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_pagename_feed() {
		$this->set_permalink_structure( '/%postname%/' );

		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$story_post_type->init();

		$query                    = new \WP_Query();
		$query->query['pagename'] = 'stories';
		$query->set( 'pagename', 'stories' );
		$query->set( 'feed', 'feed' );

		add_filter( 'post_type_archive_feed_link', '__return_false' );
		$result = $story_post_type->redirect_post_type_archive_urls( false, $query );
		remove_filter( 'post_type_archive_feed_link', '__return_false' );

		$this->assertFalse( $result );
	}

	/**
	 * @covers ::remove_caps_from_roles
	 */
	public function test_remove_caps_from_roles() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$story_post_type->remove_caps_from_roles();
		$post_type_object = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$all_capabilities = array_values( (array) $post_type_object->cap );
		$all_roles        = wp_roles();
		$roles            = array_values( (array) $all_roles->role_objects );

		foreach ( $roles as $role ) {
			foreach ( $all_capabilities as $cap ) {
				$this->assertFalse( $role->has_cap( $cap ) );
			}
		}
		// Add back roles after test.
		$story_post_type->add_caps_to_roles();
	}

	/**
	 * @covers ::add_caps_to_roles
	 * @group ms-required
	 */
	public function test_add_caps_to_roles_multisite() {
		$blog_id = $this->factory->blog->create();
		switch_to_blog( $blog_id );

		$post_type_object = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$all_capabilities = array_values( (array) $post_type_object->cap );

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );

		foreach ( $all_capabilities as $cap ) {
			$this->assertTrue( $administrator->has_cap( $cap ) );
			$this->assertTrue( $editor->has_cap( $cap ) );
		}

		restore_current_blog();
	}

	/**
	 * @covers ::embed_image
	 * @throws \Exception
	 */
	public function test_the_content_feed() {
		$this->go_to( '/?feed=rss2&post_type=' . \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$feed = $this->do_rss2();

		$this->assertContains( '<img', $feed );
		$this->assertContains( 'images/test-image.jpg', $feed );
		$this->assertContains( 'wp-block-web-stories-embed', $feed );
	}

	/**
	 * @covers ::embed_player
	 */
	public function test_embed_player() {
		$this->go_to( get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG ) );

		$content = get_echo( 'the_content' );
		$this->assertContains( '<amp-story-player', $content );

		$excerpt = get_echo( 'the_excerpt' );
		$this->assertContains( '<amp-story-player', $excerpt );
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
	 * @covers ::filter_list_of_allowed_filetypes
	 * @group ms-required
	 */
	public function test_filter_list_of_allowed_filetypes() {
		$site_exts = explode( ' ', get_site_option( 'upload_filetypes', 'jpg jpeg png gif' ) );
		$this->assertContains( 'vtt', $site_exts );
	}

	/**
	 * This is a bit of a hack used to buffer feed content.
	 *
	 * @link https://github.com/WordPress/wordpress-develop/blob/ab9aee8af474ac512b31b012f3c7c44fab31a990/tests/phpunit/tests/feed/rss2.php#L78-L94
	 */
	protected function do_rss2() {
		ob_start();
		// Nasty hack! In the future it would better to leverage do_feed( 'rss2' ).
		try {
			// phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
			@require ABSPATH . 'wp-includes/feed-rss2.php';
			$out = ob_get_clean();
		} catch ( Exception $e ) {
			$out = ob_get_clean();
			throw($e);
		}
		return $out;
	}
}
