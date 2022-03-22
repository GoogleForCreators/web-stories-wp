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

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;

/**
 * Class Stories_Users_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Users_Controller
 */
class Stories_Users_Controller extends DependencyInjectedRestTestCase {

	protected static $user_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Stories_Users_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
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
	 * @covers ::filter_user_query
	 */
	public function test_filter_user_query_pre_wp_59(): void {
		if ( is_wp_version_compatible( '5.9-beta' ) ) {
			$this->markTestSkipped( 'This test requires WordPress < 5.9.' );
		}

		$actual = $this->controller->filter_user_query( [ 'who' => 'authors' ] );
		$this->assertEqualSets(
			[
				'who' => 'authors',
			],
			$actual
		);
	}

	/**
	 * @covers ::filter_user_query
	 */
	public function test_filter_user_query_wp_59(): void {
		if ( ! is_wp_version_compatible( '5.9-beta' ) ) {
			$this->markTestSkipped( 'This test requires WordPress 5.9.' );
		}

		$actual = $this->controller->filter_user_query( [ 'who' => 'authors' ] );
		$this->assertEqualSets(
			[
				'capabilities' => [ 'edit_web-stories' ],
			],
			$actual
		);
	}

	/**
	 * @covers ::filter_user_query
	 */
	public function test_filter_user_query_capabilities_query_supported(): void {
		add_filter( 'rest_user_collection_params', [ $this, 'filter_rest_user_collection_params' ] );

		$actual = $this->controller->filter_user_query( [ 'who' => 'authors' ] );

		remove_filter( 'rest_user_collection_params', [ $this, 'filter_rest_user_collection_params' ] );

		$this->assertEqualSets(
			[
				'capabilities' => [ 'edit_web-stories' ],
			],
			$actual
		);
	}

	public function filter_rest_user_collection_params( array $query_params ): array {
		$query_params['capabilities'] = [
			'type'  => 'array',
			'items' => [
				'type' => 'string',
			],
		];

		return $query_params;
	}

	/**
	 * @covers ::filter_user_query
	 */
	public function test_filter_user_query_wp_59_existing_query(): void {
		if ( version_compare( get_bloginfo( 'version' ), '5.9.0-beta', '<' ) ) {
			$this->markTestSkipped( 'This test requires WordPress 5.9.' );
		}

		$actual = $this->controller->filter_user_query(
			[
				'who'          => 'authors',
				'capabilities' => [ 'edit_posts' ],
			]
		);
		$this->assertEqualSets(
			[
				'capabilities' => [ 'edit_posts', 'edit_web-stories' ],
			],
			$actual
		);
	}

	/**
	 * @covers ::filter_user_query
	 */
	public function test_filter_user_query_no_change(): void {
		$args    = [
			'orderby' => 'registered',
			'order'   => 'ASC',
		];
		$results = $this->controller->filter_user_query( $args );
		$this->assertEqualSets( $args, $results );
	}

	/**
	 * @covers ::user_posts_count_public
	 * @covers \Google\Web_Stories\Story_Post_Type::clear_user_posts_count
	 */
	public function test_count_user_posts(): void {
		$this->controller->register();
		$post_type = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$post_type->register();

		$result1 = $this->call_private_method(
			$this->controller,
			'user_posts_count_public',
			[
				self::$user_id,
				$post_type->get_slug(),
			]
		);
		$this->assertEquals( 3, $result1 );

		$post_id = self::factory()->post->create(
			[
				'post_type'   => $post_type->get_slug(),
				'post_status' => 'publish',
				'post_author' => self::$user_id,
			]
		);
		$result2 = $this->call_private_method(
			$this->controller,
			'user_posts_count_public',
			[
				self::$user_id,
				$post_type->get_slug(),
			]
		);

		$this->assertEquals( 4, $result2 );

		wp_delete_post( $post_id, true );

		$result3 = $this->call_private_method(
			$this->controller,
			'user_posts_count_public',
			[
				self::$user_id,
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

		$post_type = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$post_type->register();
		$result1 = $this->call_private_method(
			$this->controller,
			'user_posts_count_public',
			[
				-1,
				$post_type->get_slug(),
			]
		);
		$this->assertEquals( 0, $result1 );

		$result1 = $this->call_private_method( $this->controller, 'user_posts_count_public', [ self::$user_id, 'invalid' ] );

		$this->assertEquals( 0, $result1 );
	}
}
