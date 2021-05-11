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

use Google\Web_Stories\Settings;
use Google\Web_Stories\Tests\Test_REST_TestCase;
use Spy_REST_Server;
use WP_REST_Request;

/**
 * Class Page_Template_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Page_Template_Controller
 */
class Page_Template_Controller extends Test_REST_TestCase {

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

		$future_date = strtotime( '+1 day' );

		$factory->post->create_many(
			3,
			[
				'post_status' => 'future',
				'post_date'   => strftime( '%Y-%m-%d %H:%M:%S', $future_date ),
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

		$this->add_caps_to_roles();

		$this->set_permalink_structure( '/%postname%/' );
	}

	public function tearDown() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$this->remove_caps_from_roles();

		$this->set_permalink_structure( '' );

		parent::tearDown();
	}

	/**
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/web-story', $routes );
		$this->assertCount( 2, $routes['/web-stories/v1/web-story'] );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_format() {
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'status', [ 'draft' ] );
		$request->set_param( 'context', 'edit' );
		$request->set_param( '_web_stories_envelope', true );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		// Body of request.
		$this->assertArrayHasKey( 'headers', $data );
		$this->assertArrayHasKey( 'body', $data );
		$this->assertArrayHasKey( 'status', $data );

		$this->assertEquals( 3, $data['headers']['X-WP-Total'] );
	}
}
