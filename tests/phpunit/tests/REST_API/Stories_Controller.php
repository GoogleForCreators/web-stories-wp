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

namespace Google\Web_Stories\Tests\REST_API;

use Spy_REST_Server;
use WP_REST_Request;

class Stories_Controller extends \WP_Test_REST_TestCase {
	protected $server;

	protected static $user_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		$post_type = \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG;

		$factory->post->create_many(
			7,
			[
				'post_status' => 'publish',
				'post_author' => self::$user_id,
				'post_type'   => $post_type,
			]
		);

		$factory->post->create_many(
			3,
			[
				'post_status' => 'draft',
				'post_author' => self::$user_id,
				'post_type'   => $post_type,
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );
	}

	public function tearDown() {
		parent::tearDown();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;
	}

	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/wp/v2/web-story', $routes );
		$this->assertCount( 2, $routes['/wp/v2/web-story'] );
	}


	public function test_get_items() {
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( 'GET', '/wp/v2/web-story' );
		$request->set_param( 'author', self::$user_id );
		$request->set_param( 'status', [ 'draft' ] );
		$request->set_param( 'context', 'edit' );
		$response       = rest_get_server()->dispatch( $request );
		$headers        = $response->get_headers();
		$statues        = $headers['X-WP-TotalByStatus'];
		$statues_decode = json_decode( $statues, true );

		$this->assertArrayHasKey( 'all', $statues_decode );
		$this->assertArrayHasKey( 'publish', $statues_decode );
		$this->assertArrayHasKey( 'draft', $statues_decode );

		$this->assertEquals( 10, $statues_decode['all'] );
		$this->assertEquals( 7, $statues_decode['publish'] );
		$this->assertEquals( 3, $statues_decode['draft'] );

		$this->assertEquals( 3, $headers['X-WP-Total'] );
	}

	public function test_get_item_schema() {
		$request  = new WP_REST_Request( 'OPTIONS', '/wp/v2/web-story' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );

		$properties = $data['schema']['properties'];
		$this->assertArrayHasKey( 'story_data', $properties );
		$this->assertArrayHasKey( 'featured_media_url', $properties );
	}

	public function test_filter_posts_orderby() {
		wp_set_current_user( self::$user_id );
		do_action( 'init' );
		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$initial_orderby = 'foo bar';

		$query = new \WP_Query();
		$query->set( 'post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$query->set( 'orderby', 'story_author' );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );

		$this->assertEquals( $orderby, "wp_posts.post_author = '" . self::$user_id . "' DESC, wp_posts.post_author DESC, wp_posts.post_modified DESC" );

		// Registered during init.
		unregister_block_type( 'web-stories/embed' );
	}

	public function test_filter_posts_orderby_irrelevant_query() {
		do_action( 'init' );
		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$initial_orderby = 'foo bar';

		$query = new \WP_Query();
		$query->set( 'post_type', 'foo' );
		$query->set( 'orderby', 'story_author' );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );
		$this->assertEquals( $orderby, $initial_orderby );

		$query->set( 'post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$query->set( 'orderby', 'author' );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );
		$this->assertEquals( $orderby, $initial_orderby );

		$query->set( 'orderby', 'story_author' );
		wp_set_current_user( 0 );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );
		$this->assertEquals( $orderby, $initial_orderby );

		// Registered during init.
		unregister_block_type( 'web-stories/embed' );
	}
}
