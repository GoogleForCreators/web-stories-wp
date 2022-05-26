<?php
/**
 * Copyright 2022 Google LLC
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

use Google\Web_Stories\Settings;
use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use Google\Web_Stories\Tests\Integration\Mock_Vendor_Setup;
use WP_REST_Request;

/**
 * Class Products_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Products_Controller
 */
class Products_Controller extends DependencyInjectedRestTestCase {
	use Mock_Vendor_Setup;

	protected static $editor;
	protected static $subscriber;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Products_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
		self::$subscriber = $factory->user->create(
			[
				'role' => 'subscriber',
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
		update_option( Settings::SETTING_NAME_SHOPPING_PROVIDER, 'mock' );
		$this->setup_vendors();

		$this->controller = $this->injector->make( \Google\Web_Stories\REST_API\Products_Controller::class );
	}

	public function tear_down(): void {
		delete_option( Settings::SETTING_NAME_SHOPPING_PROVIDER );
		$this->remove_vendors();

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->controller->register();

		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/products', $routes );
	}

	/**
	 * @covers ::get_items_permissions_check
	 * @covers ::get_items
	 */
	public function test_no_user(): void {
		$this->controller->register();

		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/products' );
		$request->set_param( 'search', 'test' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	/**
	 * @covers ::get_items_permissions_check
	 * @covers ::get_items
	 */
	public function test_without_permission(): void {
		$this->controller->register();

		wp_set_current_user( self::$subscriber );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/products' );
		$request->set_param( 'search', 'test' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_forbidden', $response, 403 );
	}

	/**
	 * @covers ::get_items_permissions_check
	 * @covers ::get_items
	 */
	public function test_permission(): void {
		$this->controller->register();

		$per_page = 10;
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/products' );
		$request->set_param( 'search', 'test' );
		$request->set_param( 'per_page', $per_page );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertCount( $per_page, $data );

		foreach ( $data as $product ) {
			$this->assertArrayHasKey( 'productId', $product );
			$this->assertArrayHasKey( 'productTitle', $product );
			$this->assertArrayHasKey( 'productBrand', $product );
		}
	}

	/**
	 * @covers ::get_fields_for_response
	 * @covers ::get_items
	 */
	public function test_fields(): void {
		$this->controller->register();

		$per_page = 10;
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/products' );
		$request->set_param( 'search', 'test' );
		$request->set_param( '_fields', 'productId' );
		$request->set_param( 'per_page', $per_page );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertCount( $per_page, $data );

		foreach ( $data as $product ) {
			$this->assertArrayHasKey( 'productId', $product );
			$this->assertArrayNotHasKey( 'productTitle', $product );
			$this->assertArrayNotHasKey( 'productBrand', $product );
		}
	}

	/**
	 * @covers ::get_items_permissions_check
	 * @covers ::get_items
	 */
	public function test_return_error(): void {
		$this->controller->register();
		update_option( Settings::SETTING_NAME_SHOPPING_PROVIDER, 'error' );
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/products' );
		$request->set_param( 'search', 'test' );
		$response = rest_get_server()->dispatch( $request );


		$this->assertErrorResponse( 'mock_error', $response, 400 );
	}

	/**
	 * @covers ::get_items_permissions_check
	 * @covers ::get_items
	 */
	public function test_return_none(): void {
		$this->controller->register();
		update_option( Settings::SETTING_NAME_SHOPPING_PROVIDER, 'none' );
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/products' );
		$request->set_param( 'search', 'test' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'unable_to_find_class', $response, 400 );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_json_schema_validation(): void {
		$this->controller->register();
		$per_page = 10;
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/products' );
		$request->set_param( 'search', 'test' );
		$request->set_param( 'per_page', $per_page );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertCount( $per_page, $data );

		foreach ( $data as $product ) {
			$this->assertMatchesProductSchema( $product );
		}
	}
}
