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
 * Class Stories_Users_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Users_Controller
 */
class Stories_Users_Controller extends Test_REST_TestCase {

	protected $server;

	protected static $user_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
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

		$this->assertArrayHasKey( '/web-stories/v1/users', $routes );
		$this->assertCount( 2, $routes['/web-stories/v1/users'] );
	}

	/**
	 * @covers ::count_user_posts
	 * @covers \Google\Web_Stories\Story_Post_Type::clear_user_posts_count
	 */
	public function test_count_user_posts() {
		$controller = new \Google\Web_Stories\REST_API\Stories_Users_Controller();
		$post_type  = new \Google\Web_Stories\Story_Post_Type();
		$post_type->register();
		$result1 = $this->call_private_method( $controller, 'count_user_posts', [
			self::$user_id,
			\Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG
		] );
		$this->assertEquals( 3, $result1 );

		$post_id = self::factory()->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'publish',
				'post_author' => self::$user_id,
			]
		);
		$result2 = $this->call_private_method( $controller, 'count_user_posts', [
			self::$user_id,
			\Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG
		] );

		$this->assertEquals( 4, $result2 );

		wp_delete_post( $post_id, true );

		$result3 = $this->call_private_method( $controller, 'count_user_posts', [
			self::$user_id,
			\Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG
		] );

		$this->assertEquals( 3, $result3 );
	}

	/**
	 * @covers ::count_user_posts
	 * @covers \Google\Web_Stories\Story_Post_Type::clear_user_posts_count
	 */
	public function test_count_user_posts_invalid() {
		$controller = new \Google\Web_Stories\REST_API\Stories_Users_Controller();
		$post_type  = new \Google\Web_Stories\Story_Post_Type();
		$post_type->register();
		$result1 = $this->call_private_method( $controller, 'count_user_posts', [
			-1,
			\Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG
		] );
		$this->assertEquals( 0, $result1 );

		$result1 = $this->call_private_method( $controller, 'count_user_posts', [
			self::$user_id,
			'invalid'
		] );
		$this->assertEquals( 0, $result1 );
	}
}
