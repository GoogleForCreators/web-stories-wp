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

use Google\Web_Stories\Tests\Story_Post_Type;
use Spy_REST_Server;
use WP_REST_Request;

class Stories_Controller extends \WP_Test_REST_TestCase {
	protected $server;

	protected static $user_id;
	protected static $user2_id;
	protected static $user3_id;

	protected static $author_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);

		self::$user2_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Jane Doe',
			]
		);

		self::$user3_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Zane Doe',
			]
		);

		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);

		$post_type = \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG;

		$factory->post->create_many(
			3,
			[
				'post_status' => 'publish',
				'post_author' => self::$user_id,
				'post_type'   => $post_type,
			]
		);

		$factory->post->create_many(
			2,
			[
				'post_status' => 'publish',
				'post_author' => self::$user2_id,
				'post_type'   => $post_type,
			]
		);

		$factory->post->create_many(
			2,
			[
				'post_status' => 'publish',
				'post_author' => self::$user3_id,
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
		self::delete_user( self::$user2_id );
		self::delete_user( self::$user3_id );
		self::delete_user( self::$author_id );
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

	public function test_filter_posts_by_author_display_names() {
		$request = new WP_REST_Request( 'GET', '/wp/v2/web-story' );
		$request->set_param( 'order', 'asc' );
		$request->set_param( 'orderby', 'story_author' );

		$response = rest_get_server()->dispatch( $request );
		$results  = wp_list_pluck( $response->get_data(), 'author' );

		$this->assertSame(
			[
				self::$user_id,
				self::$user_id,
				self::$user_id,
				self::$user2_id,
				self::$user2_id,
				self::$user3_id,
				self::$user3_id,
			],
			$results,
			'Expected posts ordered by author display names'
		);

		$request = new WP_REST_Request( 'GET', '/wp/v2/web-story' );
		$request->set_param( 'order', 'desc' );
		$request->set_param( 'orderby', 'story_author' );

		$response = rest_get_server()->dispatch( $request );
		$results  = wp_list_pluck( $response->get_data(), 'author' );

		$this->assertSame(
			[
				self::$user3_id,
				self::$user3_id,
				self::$user2_id,
				self::$user2_id,
				self::$user_id,
				self::$user_id,
				self::$user_id,
			],
			$results,
			'Expected posts ordered by author display names'
		);
	}

	public function test_filter_posts_clauses_irrelevant_query() {
		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$initial_clauses = [
			'join'    => '',
			'orderby' => '',
		];

		$query = new \WP_Query();
		$query->set( 'post_type', 'post' );
		$query->set( 'orderby', 'story_author' );

		$orderby = $controller->filter_posts_clauses( $initial_clauses, $query );
		$this->assertEquals( $orderby, $initial_clauses );

		$query = new \WP_Query();
		$query->set( 'post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$query->set( 'orderby', 'author' );

		$orderby = $controller->filter_posts_clauses( $initial_clauses, $query );
		$this->assertEquals( $orderby, $initial_clauses );
	}

	public function test_create_item_as_author_should_not_strip_markup() {
		wp_set_current_user( self::$author_id );

		$unsanitized_content    = file_get_contents( __DIR__ . '/../../data/story_post_content.html' );
		$unsanitized_story_data = json_decode( file_get_contents( __DIR__ . '/../../data/story_post_content_filtered.json' ), true );

		$request = new WP_REST_Request( 'POST', '/wp/v2/web-story' );
		$request->set_body_params(
			[
				'content'    => $unsanitized_content,
				'story_data' => $unsanitized_story_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertEquals( $unsanitized_content, $new_data['content']['raw'] );
		$this->assertEquals( $unsanitized_story_data, $new_data['story_data'] );
	}

	public function test_update_item_as_author_should_not_strip_markup() {
		wp_set_current_user( self::$author_id );

		$unsanitized_content    = file_get_contents( __DIR__ . '/../../data/story_post_content.html' );
		$unsanitized_story_data = json_decode( file_get_contents( __DIR__ . '/../../data/story_post_content_filtered.json' ), true );

		$story = self::factory()->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$request = new WP_REST_Request( 'PUT', '/wp/v2/web-story/' . $story );
		$request->set_body_params(
			[
				'content'    => $unsanitized_content,
				'story_data' => $unsanitized_story_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertEquals( $unsanitized_content, $new_data['content']['raw'] );
		$this->assertEquals( $unsanitized_story_data, $new_data['story_data'] );
	}
}
