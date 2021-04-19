<?php
/**
 * Copyright 2021 Google LLC
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

use Google\Web_Stories\Tests\Capabilities_Setup;
use Google\Web_Stories\Tests\Private_Access;
use Spy_REST_Server;
use WP_REST_Request;

/**
 * Class Lock_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Lock_Controller
 */
class Lock_Controller extends \WP_Test_REST_TestCase {
	use Private_Access, Capabilities_Setup;

	protected $server;

	protected static $author_id;
	protected static $subscriber;
	protected static $editor;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$subscriber = $factory->user->create(
			[
				'role' => 'subscriber',
			]
		);
		self::$author_id  = $factory->user->create(
			[
				'role' => 'author',
			]
		);
		self::$editor     = $factory->user->create(
			[
				'role'       => 'editor',
				'user_email' => 'editor@example.com',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$author_id );
		self::delete_user( self::$subscriber );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->add_caps_to_roles();
	}

	public function tearDown() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$this->remove_caps_from_roles();

		parent::tearDown();
	}

	/**
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/web-story/(?P<id>[\d]+)/lock', $routes );
		$this->assertCount( 3, $routes['/web-stories/v1/web-story/(?P<id>[\d]+)/lock'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item() {
		wp_set_current_user( self::$author_id );
		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertArrayHasKey( 'locked', $data );
		$this->assertFalse( $data['locked'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item_no_story() {
		wp_set_current_user( self::$author_id );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/99999/lock' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_post_invalid_id', $response, 404 );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item_not_a_story() {
		wp_set_current_user( self::$author_id );

		$post_id = self::factory()->post->create(
			[
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $post_id . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_post_invalid_id', $response, 404 );
	}

	/**
	 * @covers ::get_item
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item_no_perm() {
		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_cannot_edit', $response, 401 );
	}

	/**
	 * @covers ::get_item
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item_wrong_perm() {
		wp_set_current_user( self::$subscriber );
		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_cannot_edit', $response, 403 );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 * @covers ::prepare_links
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item_with_lock() {
		wp_set_current_user( self::$author_id );
		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$new_lock = ( time() - 100 ) . ':' . self::$author_id;
		update_post_meta( $story, '_edit_lock', $new_lock );
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$links    = $response->get_links();
		$this->assertArrayHasKey( 'locked', $data );
		$this->assertTrue( $data['locked'] );

		$this->assertArrayHasKey( 'self', $links );
		$this->assertArrayHasKey( 'author', $links );
	}

	/**
	 * @covers ::update_item
	 * @covers ::prepare_item_for_response
	 * @covers ::update_item_permissions_check
	 */
	public function test_update_item() {
		wp_set_current_user( self::$author_id );
		$story = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);

		$request  = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertArrayHasKey( 'locked', $data );
		$this->assertTrue( $data['locked'] );
	}

	/**
	 * @covers ::delete_item
	 * @covers ::prepare_item_for_response
	 * @covers ::delete_item_permissions_check
	 */
	public function test_delete_item() {
		wp_set_current_user( self::$author_id );
		$story = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);

		$request  = new WP_REST_Request( \WP_REST_Server::DELETABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'deleted', $data );
		$this->assertArrayHasKey( 'previous', $data );
		$this->assertArrayHasKey( 'locked', $data['previous'] );
		$this->assertFalse( $data['deleted'] );
		$this->assertFalse( $data['previous']['locked'] );
	}

	/**
	 * @covers ::delete_item
	 * @covers ::prepare_item_for_response
	 * @covers ::delete_item_permissions_check
	 */
	public function test_delete_item_with_lock() {
		wp_set_current_user( self::$author_id );
		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$new_lock = ( time() - 100 ) . ':' . self::$author_id;
		update_post_meta( $story, '_edit_lock', $new_lock );

		$request  = new WP_REST_Request( \WP_REST_Server::DELETABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'deleted', $data );
		$this->assertArrayHasKey( 'previous', $data );
		$this->assertArrayHasKey( 'locked', $data['previous'] );
		$this->assertTrue( $data['deleted'] );
		$this->assertTrue( $data['previous']['locked'] );
	}

	/**
	 * @covers ::delete_item
	 * @covers ::prepare_item_for_response
	 * @covers ::delete_item_permissions_check
	 */
	public function test_delete_item_with_lock_another_user() {
		wp_set_current_user( self::$editor );
		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$new_lock = ( time() - 100 ) . ':' . self::$author_id;
		update_post_meta( $story, '_edit_lock', $new_lock );

		$request  = new WP_REST_Request( \WP_REST_Server::DELETABLE, '/web-stories/v1/web-story/' . $story . '/lock' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_cannot_delete_others_lock', $response, 403 );
	}

	/**
	 * @covers ::get_lock
	 */
	public function test_get_lock() {
		$controller = new \Google\Web_Stories\REST_API\Stories_Lock_Controller();
		$story      = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$new_lock   = ( time() - 100 ) . ':' . self::$author_id;
		update_post_meta( $story, '_edit_lock', $new_lock );
		$data = $this->call_private_method( $controller, 'get_lock', [ $story ] );
		$this->assertArrayHasKey( 'time', $data );
		$this->assertArrayHasKey( 'user', $data );
		$this->assertEquals( $data['user'], self::$author_id );
	}
}
