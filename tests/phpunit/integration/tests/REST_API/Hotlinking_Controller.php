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

	public const URL_INVALID      = 'https://https://invalid.commmm';
	public const URL_404          = 'https://example.com/404/test.jpg';
	public const URL_500          = 'https://example.com/500/test.jpg';
	public const URL_SVG          = 'https://example.com/test.svg';
	public const URL_VALID        = 'http://example.com/test.jpg';
	public const URL_DOMAIN       = 'http://google.com';
	public const URL_WITH_CHARSET = 'https://example.com/test.png';
	public const URL_PATH         = '/test.jpg';

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
	public function mock_http_request( $preempt, $r, string $url ) {
		++ $this->request_count;

		if ( false !== strpos( $url, self::URL_INVALID ) ) {
			return $preempt;
		}

		// URL_VALID
		if ( 'http://93.184.216.34/test.jpg' === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/jpeg',
					'content-length' => 5000,
				],
				'response' => [ 'code' => 200 ],
			];
		}

		// URL_SVG
		if ( 'https://93.184.216.34/test.svg' === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/svg+xml',
					'content-length' => 5000,
				],
				'response' => [ 'code' => 200 ],
			];
		}

		// URL_WITH_CHARSET
		if ( 'https://93.184.216.34/test.png' === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/png; charset=utf-8',
					'content-length' => 1000,
				],
				'response' => [ 'code' => 200 ],
			];
		}

		// URL_404
		if ( 'https://93.184.216.34/404/test.jpg' === $url ) {
			return [
				'headers'  => [
					'content-type'   => 'image/jpeg',
					'content-length' => 5000,
				],
				'response' => [ 'code' => 404 ],
			];
		}

		// URL_500
		if ( 'https://93.184.216.34.com/500/test.jpg' === $url ) {
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
	 * @covers ::validate_callback
	 */
	public function test_validate_url(): void {
		$result = $this->controller->validate_callback( self::URL_VALID );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::validate_callback
	 */
	public function test_validate_url_empty(): void {
		$result = $this->controller->validate_callback( '' );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::validate_callback
	 */
	public function test_validate_url_domain(): void {
		$result = $this->controller->validate_callback( self::URL_DOMAIN );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::validate_callback
	 */
	public function test_validate_url_path(): void {
		$result = $this->controller->validate_callback( self::URL_PATH );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::validate_callback
	 */
	public function test_validate_url_invalid(): void {
		$result = $this->controller->validate_callback( '-1' );
		$this->assertErrorResponse( 'rest_invalid_url', $result, 400 );
	}

	/**
	 * @covers ::validate_callback
	 */
	public function test_validate_url_invalid2(): void {
		$result = $this->controller->validate_callback( 'wibble' );
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
		$this->assertEqualSets( [ 'audio', 'image', 'video', 'caption' ], $properties['type']['enum'] );
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
		$this->assertEquals( 'rest_forbidden', $data['code'] );
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
		$this->assertTrue( $response->is_error() );
		$this->assertEquals( 400, $response->get_status() );
		$this->assertEquals( 'rest_invalid_param', $data['code'] );
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

		$this->assertFalse( $response->is_error() );
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

		$this->assertFalse( $response->is_error() );
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

		$this->assertFalse( $response->is_error() );
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
	public function test_parse_url_with_charset_in_content_type_header(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( WP_REST_Server::READABLE, self::REST_URL );
		$request->set_param( 'url', self::URL_WITH_CHARSET );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertFalse( $response->is_error() );
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

	/**
	 * @covers ::get_allowed_mime_types
	 */
	public function test_get_allowed_mime_types(): void {
		$story_post_type = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$types           = $this->injector->make( \Google\Web_Stories\Media\Types::class );
		$experiments     = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );
		$controller = new \Google\Web_Stories\REST_API\Hotlinking_Controller( $story_post_type, $types, $experiments );
		$mime_types = $this->call_private_method( $controller, 'get_allowed_mime_types' );
		$this->assertArrayHasKey( 'audio', $mime_types );
		$this->assertArrayHasKey( 'video', $mime_types );
		$this->assertArrayHasKey( 'caption', $mime_types );
		$this->assertArrayHasKey( 'video', $mime_types );
		$this->assertSame( 'text/vtt', $mime_types['caption'][0] );
	}

	/**
	 * Test that validate_url validates URLs.
	 *
	 * @param string       $url            The URL to validate.
	 * @param string       $expected       Expected result.
	 * @param false|string $cb_safe_ports  The name of the callback to http_allowed_safe_ports or false if none.
	 *                                     Default false.
	 *
	 * @dataProvider data_validate_url_should_validate
	 * @covers ::validate_url
	 */
	public function test_validate_url_should_validate( string $url, string $expected, $cb_safe_ports = false ): void {
		if ( $cb_safe_ports ) {
			add_filter( 'http_allowed_safe_ports', [ $this, $cb_safe_ports ] );
		}

		$this->assertSame( $expected, $this->call_private_method( $this->controller, 'validate_url', [ $url ] ) );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public function data_validate_url_should_validate(): array {
		return [
			'no port specified'                 => [
				'url'      => 'http://example.com/caniload.php',
				'expected' => 'http://93.184.216.34/caniload.php',
			],
			'a port considered safe by default' => [
				'url'      => 'https://example.com:8080/caniload.php',
				'expected' => 'https://93.184.216.34:8080/caniload.php',
			],
			'a port considered safe by filter'  => [
				'url'           => 'https://example.com:81/caniload.php',
				'expected'      => 'https://93.184.216.34:81/caniload.php',
				'cb_safe_ports' => 'callback_custom_safe_ports',
			],
		];
	}

	/**
	 * Tests that validate_url validates a url that uses an unsafe port
	 * but which matches the host and port used by the site's home url.
	 *
	 * @covers ::validate_url
	 */
	public function test_validate_url_should_validate_with_an_unsafe_port_when_the_host_and_port_match_the_home_url(): void {
		$original_home    = get_option( 'home' );
		$home_parsed      = wp_parse_url( $original_home );
		$home_scheme_host = implode( '://', \array_slice( $home_parsed, 0, 2 ) );
		$home_modified    = $home_scheme_host . ':83';

		update_option( 'home', $home_modified );

		$url = $home_modified . '/caniload.php';

		$actual = $this->call_private_method( $this->controller, 'validate_url', [ $url ] );

		update_option( 'home', $original_home );

		$this->assertSame( $url, $actual );
	}

	/**
	 * Test that validate_url does not validate invalid URLs.
	 *
	 * @param string       $url            The URL to validate.
	 * @param false|string $cb_safe_ports  The name of the callback to http_allowed_safe_ports or false if none.
	 *                                     Default false.
	 * @param bool         $external_host  Whether or not the host is external.
	 *                                     Default false.
	 *
	 * @dataProvider data_validate_url_should_not_validate
	 * @covers ::validate_url
	 */
	public function test_validate_url_should_not_validate( string $url, $cb_safe_ports = false, bool $external_host = false ): void {
		if ( $external_host ) {
			add_filter( 'http_request_host_is_external', '__return_true' );
		}

		if ( $cb_safe_ports ) {
			add_filter( 'http_allowed_safe_ports', [ $this, $cb_safe_ports ] );
		}

		$this->assertFalse( $this->call_private_method( $this->controller, 'validate_url', [ $url ] ) );
	}

	/**
	 * Data provider.
	 *
	 * @return array
	 */
	public function data_validate_url_should_not_validate(): array {
		return [
			'url as string 0'                              => [
				'url' => '0',
			],
			'url as string 1'                              => [
				'url' => '1',
			],
			'an empty url'                                 => [
				'url' => '',
			],
			'a url with a non-http/https protocol'         => [
				'url' => 'ftp://example.com:81/caniload.php',
			],
			'a malformed url'                              => [
				'url' => 'http:///example.com:81/caniload.php',
			],
			'a host that cannot be parsed'                 => [
				'url' => 'http:example.com/caniload.php',
			],
			'login information'                            => [
				'url' => 'http://user:pass@example.com/caniload.php',
			],
			'a host with invalid characters'               => [
				'url' => 'http://[exam]ple.com/caniload.php',
			],
			'a host whose IPv4 address cannot be resolved' => [
				'url' => 'http://exampleeeee.com/caniload.php',
			],
			'an external request when not allowed'         => [
				'url' => 'http://192.168.0.1/caniload.php',
			],
			'a port not considered safe by default'        => [
				'url' => 'https://example.com:81/caniload.php',
			],
			'a port not considered safe by filter'         => [
				'url'           => 'https://example.com:82/caniload.php',
				'cb_safe_ports' => 'callback_custom_safe_ports',
			],
			'all safe ports removed by filter'             => [
				'url'           => 'https://example.com:81/caniload.php',
				'cb_safe_ports' => 'callback_remove_safe_ports',
			],
		];
	}

	public function callback_custom_safe_ports(): array {
		return [ 81, 444, 8081 ];
	}

	public function callback_remove_safe_ports(): array {
		return [];
	}
}
