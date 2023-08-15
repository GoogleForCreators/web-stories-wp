<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Font_Post_Type;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use WP_REST_Request;
use WP_REST_Server;
use WP_UnitTest_Factory;

/**
 * Class Stories_Users_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Users_Controller
 */
class Stories_Users_Controller extends DependencyInjectedRestTestCase {

	protected static int $admin_id;

	protected static int $author_id;

	/**
	 * Test instance.
	 */
	private \Google\Web_Stories\REST_API\Stories_Users_Controller $controller;

	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ): void {
		self::$admin_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);

		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);

		$post_type = Story_Post_Type::POST_TYPE_SLUG;

		$factory->post->create_many(
			3,
			[
				'post_status' => 'publish',
				'post_author' => self::$admin_id,
				'post_type'   => $post_type,
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$this->controller = $this->injector->make( \Google\Web_Stories\REST_API\Stories_Users_Controller::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/users', $routes );
		$this->assertCount( 2, $routes['/web-stories/v1/users'] );
	}

	/**
	 * @covers ::get_items_permissions_check
	 */
	public function test_get_items_no_permissions_for_capabilities_query(): void {
		$this->controller->register();

		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );
		$this->assertNotNull( $post_type_object );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/users' );
		$request->set_param( 'capabilities', [ $post_type_object->cap->edit_posts ] );

		$this->assertWPError(
			$this->controller->get_items_permissions_check( $request )
		);
	}

	/**
	 * @covers ::get_items_permissions_check
	 */
	public function test_get_items_permissions_check_can_edit_stories(): void {
		wp_set_current_user( self::$admin_id );

		$this->controller->register();

		$post_type_object = get_post_type_object( Font_Post_Type::POST_TYPE_SLUG );
		$this->assertNotNull( $post_type_object );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/users' );
		$request->set_param( 'capabilities', [ $post_type_object->cap->edit_posts ] );

		$this->assertNotWPError(
			$this->controller->get_items_permissions_check( $request )
		);
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_returns_users_without_published_posts(): void {
		wp_set_current_user( self::$author_id );

		$this->controller->register();

		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );
		$this->assertNotNull( $post_type_object );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/users' );
		$request->set_param( 'orderby', 'name' );
		$request->set_param( 'page', 1 );
		$request->set_param( 'per_page', 10 );
		$request->set_param( 'capabilities', [ $post_type_object->cap->edit_posts ] );
		$request->set_param( '_fields', 'id' );

		$response = $this->controller->get_items( $request );

		$this->assertNotWPError( $response );

		$data = $response->get_data();

		$this->assertIsArray( $data );

		$this->assertContains( self::$author_id, wp_list_pluck( $data, 'id' ) );
	}

	/**
	 * @covers ::user_posts_count_public
	 * @covers \Google\Web_Stories\Story_Post_Type::clear_user_posts_count
	 */
	public function test_count_user_posts(): void {
		$this->controller->register();
		$post_type = $this->injector->make( Story_Post_Type::class );
		$post_type->register();

		$result1 = $this->call_private_method(
			[ $this->controller, 'user_posts_count_public' ],
			[
				self::$admin_id,
				$post_type->get_slug(),
			]
		);
		$this->assertEquals( 3, $result1 );

		$post_id = self::factory()->post->create(
			[
				'post_type'   => $post_type->get_slug(),
				'post_status' => 'publish',
				'post_author' => self::$admin_id,
			]
		);

		$this->assertNotWPError( $post_id );

		$result2 = $this->call_private_method(
			[ $this->controller, 'user_posts_count_public' ],
			[
				self::$admin_id,
				$post_type->get_slug(),
			]
		);

		$this->assertEquals( 4, $result2 );

		wp_delete_post( $post_id, true );

		$result3 = $this->call_private_method(
			[ $this->controller, 'user_posts_count_public' ],
			[
				self::$admin_id,
				$post_type->get_slug(),
			]
		);

		$this->assertEquals( 3, $result3 );
	}

	/**
	 * @covers ::user_posts_count_public
	 * @covers \Google\Web_Stories\Story_Post_Type::clear_user_posts_count
	 */
	public function test_count_user_posts_invalid(): void {
		$this->controller->register();

		$post_type = $this->injector->make( Story_Post_Type::class );
		$post_type->register();
		$result1 = $this->call_private_method(
			[ $this->controller, 'user_posts_count_public' ],
			[
				-1,
				$post_type->get_slug(),
			]
		);
		$this->assertEquals( 0, $result1 );

		$result1 = $this->call_private_method( [ $this->controller, 'user_posts_count_public' ], [ self::$admin_id, 'invalid' ] );

		$this->assertEquals( 0, $result1 );
	}
}
