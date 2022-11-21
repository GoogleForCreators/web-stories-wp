<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use WP_REST_Request;

/**
 * Class Lock_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Lock_Controller
 */
class Stories_Lock_Controller extends DependencyInjectedRestTestCase {
	protected static int $author_id;
	protected static int $subscriber;
	protected static int $editor;

	/**
	 * Test instance.
	 */
	private \Google\Web_Stories\REST_API\Stories_Lock_Controller $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
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

	public function set_up(): void {
		parent::set_up();

		$this->controller = $this->injector->make( \Google\Web_Stories\REST_API\Stories_Lock_Controller::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/web-story/(?P<id>[\d]+)/lock', $routes );
		$this->assertCount( 3, $routes['/web-stories/v1/web-story/(?P<id>[\d]+)/lock'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item(): void {
		$this->controller->register();

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
	public function test_get_item_no_story(): void {
		$this->controller->register();

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
	public function test_get_item_not_a_story(): void {
		$this->controller->register();

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
	public function test_get_item_no_perm(): void {
		$this->controller->register();

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
	public function test_get_item_wrong_perm(): void {
		$this->controller->register();

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
	public function test_get_item_with_lock(): void {
		$this->controller->register();

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
		$this->assertArrayHasKey( 'user', $data );
		$this->assertArrayHasKey( 'id', $data['user'] );
		$this->assertArrayHasKey( 'name', $data['user'] );
		$this->assertArrayHasKey( 'avatar', $data['user'] );
		$this->assertSame( self::$author_id, $data['user']['id'] );
		$this->assertTrue( $data['locked'] );

		$this->assertArrayHasKey( 'self', $links );
		$this->assertArrayHasKey( 'author', $links );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 * @covers ::prepare_links
	 * @covers ::get_item_permissions_check
	 */
	public function test_get_item_with_lock_disabled_avatar(): void {
		update_option( 'show_avatars', false );
		$this->controller->register();

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
		$this->assertArrayHasKey( 'user', $data );
		$this->assertArrayHasKey( 'id', $data['user'] );
		$this->assertArrayHasKey( 'name', $data['user'] );
		$this->assertArrayNotHasKey( 'avatar', $data['user'] );
		$this->assertSame( self::$author_id, $data['user']['id'] );
		$this->assertTrue( $data['locked'] );

		$this->assertArrayHasKey( 'self', $links );
		$this->assertArrayHasKey( 'author', $links );
	}

	/**
	 * @covers ::update_item
	 * @covers ::prepare_item_for_response
	 * @covers ::update_item_permissions_check
	 */
	public function test_update_item(): void {
		$this->controller->register();

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
	public function test_delete_item(): void {
		$this->controller->register();

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
	public function test_delete_item_with_lock(): void {
		$this->controller->register();

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
	public function test_delete_item_with_lock_another_user(): void {
		$this->controller->register();

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
	public function test_get_lock(): void {
		$this->controller->register();

		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$author_id,
			]
		);
		$new_lock = ( time() - 100 ) . ':' . self::$author_id;

		update_post_meta( $story, '_edit_lock', $new_lock );
		$data = $this->call_private_method( $this->controller, 'get_lock', [ $story ] );
		$this->assertArrayHasKey( 'time', $data );
		$this->assertArrayHasKey( 'user', $data );
		$this->assertEquals( $data['user'], self::$author_id );
	}
}
