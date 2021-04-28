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

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Post_Type
 */
class Story_Post_Type extends Test_Case {
	use Private_Access, Capabilities_Setup;

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
	}

	public function setUp() {
		parent::setUp();
		$this->add_caps_to_roles();
	}

	public function tearDown() {
		$this->set_permalink_structure( '' );
		$_SERVER['REQUEST_URI'] = '';

		$this->remove_caps_from_roles();

		parent::tearDown();
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$story_post_type = $this->get_story_object();
		$story_post_type->register();

		$this->assertSame( 10, has_filter( 'pre_handle_404', [ $story_post_type, 'redirect_post_type_archive_urls' ] ) );
		$this->assertSame( 10, has_filter( '_wp_post_revision_fields', [ $story_post_type, 'filter_revision_fields' ] ) );
		$this->assertSame( 10, has_filter( 'wp_insert_post_data', [ $story_post_type, 'change_default_title' ] ) );
		$this->assertSame( 10, has_filter( 'bulk_post_updated_messages', [ $story_post_type, 'bulk_post_updated_messages' ] ) );
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
		$story_post_type = $this->get_story_object();
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
		$story_post_type = $this->get_story_object();
		$filtered_params = $story_post_type->filter_rest_collection_params( $query_params, $post_type );
		$this->assertEquals( $filtered_params, $query_params );
	}

	/**
	 * @covers ::get_post_type_icon
	 */
	public function test_get_post_type_icon() {
		$story_post_type = $this->get_story_object();
		$valid           = $this->call_private_method( $story_post_type, 'get_post_type_icon' );
		$this->assertContains( 'data:image/svg+xml;base64', $valid );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_true() {
		$story_post_type = $this->get_story_object();
		$query           = new \WP_Query();
		$result          = $story_post_type->redirect_post_type_archive_urls( true, $query );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_no_permalink() {
		$story_post_type = $this->get_story_object();
		$query           = new \WP_Query();
		$result          = $story_post_type->redirect_post_type_archive_urls( false, $query );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_permalinks() {
		$this->set_permalink_structure( '/%postname%/' );

		$story_post_type = $this->get_story_object();
		$query           = new \WP_Query();
		$result          = $story_post_type->redirect_post_type_archive_urls( false, $query );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::redirect_post_type_archive_urls
	 */
	public function test_redirect_post_type_archive_urls_page() {
		$this->set_permalink_structure( '/%postname%/' );

		$story_post_type = $this->get_story_object();

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

		$story_post_type = $this->get_story_object();

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

		$story_post_type = $this->get_story_object();

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

		$story_post_type = $this->get_story_object();
		$story_post_type->register();

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

	protected function get_story_object() {
		return new \Google\Web_Stories\Story_Post_Type();
	}
}
