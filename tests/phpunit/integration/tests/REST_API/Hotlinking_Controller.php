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
use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class Hotlinking_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Hotlinking_Controller
 */
class Hotlinking_Controller extends DependencyInjectedRestTestCase {
	protected static $subscriber;
	protected static $editor;

	public const URL_INVALID        = 'https://https://invalid.commmm';
	public const URL_404            = 'https://example.com/404/test.jpg';
	public const URL_500            = 'https://example.com/500/test.jpg';
	public const URL_SVG            = 'https://example.com/test.svg';
	public const URL_VALID          = 'http://example.com/test.jpg';
	public const URL_DOMAIN         = 'http://google.com';
	public const URL_MALFORMED_MIME = 'https://example.com/test.png';
	public const URL_PATH           = '/test.jpg';

	public const REST_URL = '/web-stories/v1/hotlink/validate';

	/**
	 * Count of the number of requests attempted.
	 *
	 * @var int
	 */
	protected $request_count = 0;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Hotlinking_Controller
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

		add_filter( 'pre_http_request', [ $this, 'mock_http_request' ], 10, 3 );
		$this->request_count = 0;

		$this->controller = $this->injector->make( \Google\Web_Stories\REST_API\Hotlinking_Controller::class );
	}

	public function tear_down(): void {
		remove_filter( 'pre_http_request', [ $this, 'mock_http_request' ] );

		parent::tear_down();
	}

	/**
	 * Intercept link processing requests and mock responses.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @param string $url     The request URL.
	 * @return array|WP_Error Response data.
	 */
	public function mock_http_request( $preempt, $r, $url ) {
		++ $this->request_count;

		if ( false !== strpos( $url, self::URL_INVALID ) ) {
			return $preempt;
		}

		if ( self::URL_VALID === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/jpeg',
					'content-length' => 5000,
				],
				'response' => [ 'code' => 200 ],
			];
		}

		if ( self::URL_SVG === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/svg+xml',
					'content-length' => 5000,
				],
				'response' => [ 'code' => 200 ],
			];
		}

		if ( self::URL_MALFORMED_MIME === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/png; charset=utf-8',
					'content-length' => 1000,
				],
				'response' => [ 'code' => 200 ],
			];
		}

		if ( self::URL_404 === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/jpeg',
					'content-length' => 5000,
				],
				'response' => [ 'code' => 404 ],
			];
		}

		if ( self::URL_500 === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/jpeg',
					'content-length' => 5000,
				],
				'response' => [ 'code' => 500 ],
			];
		}

		return $preempt;
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->controller->register();

		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( self::REST_URL, $routes );
	}

	/**
	 * @covers ::validate_url
	 */
	public function test_validate_url(): void {
		$result = $this->controller->validate_url( self::URL_VALID );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::validate_url
	 */
	public function test_validate_url_empty(): void {
		$result = $this->controller->validate_url( '' );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::validate_url
	 */
	public function test_validate_url_domain(): void {
		$result = $this->controller->validate_url( self::URL_DOMAIN );
		$this->assertErrorResponse( 'rest_invalid_url_path', $result, 400 );
	}

	/**
	 * @covers ::validate_url
	 */
	public function test_validate_url_path(): void {
		$result = $this->controller->validate_url( self::URL_PATH );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::validate_url
	 */
	public function test_validate_url_invalid(): void {
		$result = $this->controller->validate_url( '-1' );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::validate_url
	 */
	public function test_validate_url_invalid2(): void {
		$result = $this->controller->validate_url( 'wibble' );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema(): void {
		$data = $this->controller->get_item_schema();

		$properties = $data['properties'];
		$this->assertArrayHasKey( 'ext', $properties );
		$this->assertArrayHasKey( 'file_name', $properties );
		$this->assertArrayHasKey( 'file_size', $properties );
		$this->assertArrayHasKey( 'mime_type', $properties );
		$this->assertArrayHasKey( 'type', $properties );
		$this->assertArrayHasKey( 'enum', $properties['type'] );
		$this->assertEqualSets( [ 'audio', 'image', 'video' ], $properties['type']['enum'] );
	}

	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 */
	public function test_parse_url_without_permission(): void {
		$this->controller->register();

		// Test without a login.
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_VALID );
		$response = rest_get_server()->dispatch( $request );

		$this->assertEquals( 401, $response->get_status() );

		// Test with a user that does not have edit_posts capability.
		wp_set_current_user( self::$subscriber );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_VALID );
		$response = rest_get_server()->dispatch( $request );

		$this->assertEquals( 403, $response->get_status() );
		$data = $response->get_data();
		$this->assertEquals( $data['code'], 'rest_forbidden' );
	}

	public function test_url_invalid_url(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_INVALID );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 0, $this->request_count );
		$this->assertEquals( 400, $response->get_status() );
		$this->assertEquals( 'rest_invalid_param', $data['code'] );
	}

	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 */
	public function test_parse_url_empty_string(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', '' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 0, $this->request_count );
		$this->assertEquals( 400, $response->get_status() );
		$this->assertEquals( $data['code'], 'rest_invalid_param' );
	}

	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 */
	public function test_parse_url(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_VALID );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertEqualSets(
			[
				'ext'       => 'jpg',
				'file_name' => 'test.jpg',
				'file_size' => 5000,
				'mime_type' => 'image/jpeg',
				'type'      => 'image',
			],
			$data
		);
	}

	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 */
	public function test_parse_url_cache(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_VALID );
		$response = rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );
		$data = $response->get_data();
		$this->assertEqualSets(
			[
				'ext'       => 'jpg',
				'file_name' => 'test.jpg',
				'file_size' => 5000,
				'mime_type' => 'image/jpeg',
				'type'      => 'image',
			],
			$data
		);
		$response = rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );
		$data = $response->get_data();
		$this->assertEqualSets(
			[
				'ext'       => 'jpg',
				'file_name' => 'test.jpg',
				'file_size' => 5000,
				'mime_type' => 'image/jpeg',
				'type'      => 'image',
			],
			$data
		);
	}

	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 */
	public function test_parse_url_404(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_404 );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_invalid_url', $response, 404 );
	}

	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 */
	public function test_parse_url_500(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_500 );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_invalid_url', $response, 404 );
	}


	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 * @covers ::prepare_item_for_response
	 */
	public function test_parse_url_svg(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_SVG );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_invalid_ext', $response, 400 );
	}

	/**
	 * @covers ::parse_url
	 * @covers ::parse_url_permissions_check
	 */
	public function test_parse_url_malformed_mime_type(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_MALFORMED_MIME );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertEqualSets(
			[
				'ext'       => 'png',
				'file_name' => 'test.png',
				'file_size' => 1000,
				'mime_type' => 'image/png',
				'type'      => 'image',
			],
			$data
		);
	}
}
