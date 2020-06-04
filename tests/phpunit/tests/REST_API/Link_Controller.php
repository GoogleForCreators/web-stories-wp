<?php

namespace Google\Web_Stories\Tests\REST_API;

use Spy_REST_Server;
use WP_REST_Request;

class Link_Controller extends \WP_Test_REST_TestCase {
	/**
	 * @var \WP_REST_Server
	 */
	protected $server;

	protected static $editor;
	protected static $subscriber;

	const INVALID_URL = 'https://www.notreallyawebsite.com/foobar.html';
	const EMPTY_URL   = 'https://empty.example.com';
	const EXAMPLE_URL = 'https://example.com';
	const VALID_URL   = 'https://amp.dev';

	/**
	 * Count of the number of requests attempted.
	 *
	 * @var int
	 */
	protected $request_count = 0;

	public static function wpSetUpBeforeClass( $factory ) {
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

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$subscriber );
		self::delete_user( self::$editor );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		add_filter( 'pre_http_request', [ $this, 'mock_http_request' ], 10, 3 );

		$this->request_count = 0;
	}

	public function tearDown() {
		parent::tearDown();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		remove_filter( 'pre_http_request', [ $this, 'mock_http_request' ] );
	}

	/**
	 * Intercept link processing requests and mock responses.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @param string $url     The request URL.
	 * @return array Response data.
	 */
	public function mock_http_request( $preempt, $r, $url ) {
		$this->request_count += 1;

		if ( false !== strpos( $url, self::EMPTY_URL ) ) {
			return [
				'response' => [
					'code' => 200,
				],
				'body'     => '<html></html>',
			];
		}

		if ( false !== strpos( $url, self::EXAMPLE_URL ) ) {
			return [
				'response' => [
					'code' => 200,
				],
				'body'     => file_get_contents( __DIR__ . '/../../data/example.com.html' ),
			];
		}

		if ( false !== strpos( $url, self::VALID_URL ) ) {
			return [
				'response' => [
					'code' => 200,
				],
				'body'     => file_get_contents( __DIR__ . '/../../data/amp.dev.html' ),
			];
		}

		return [
			'response' => [
				'code' => 404,
			],
		];
	}

	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/link', $routes );

		$route = $routes['/web-stories/v1/link'];
		$this->assertCount( 1, $route );
		$this->assertArrayHasKey( 'callback', $route[0] );
		$this->assertArrayHasKey( 'permission_callback', $route[0] );
		$this->assertArrayHasKey( 'methods', $route[0] );
		$this->assertArrayHasKey( 'args', $route[0] );
	}

	public function test_without_permission() {
		// Test without a login.
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertEquals( 400, $response->get_status() );

		// Test with a user that does not have edit_posts capability.
		wp_set_current_user( self::$subscriber );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', self::VALID_URL );
		$response = rest_get_server()->dispatch( $request );

		$this->assertEquals( 403, $response->get_status() );
		$data = $response->get_data();
		$this->assertEquals( $data['code'], 'rest_forbidden' );
	}

	public function test_invalid_url() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', self::INVALID_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 200, $response->get_status() );
		$this->assertEqualSetsWithIndex(
			[
				'title'       => '',
				'image'       => '',
				'description' => '',
			],
			$data
		);
	}

	public function test_url_empty_string() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', '' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 0, $this->request_count );
		$this->assertEquals( 404, $response->get_status() );
		$this->assertEquals( $data['code'], 'rest_invalid_url' );
	}

	public function test_empty_url() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', self::EMPTY_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$expected = [
			'title'       => '',
			'image'       => '',
			'description' => '',
		];

		// Subsequent requests is cached and so it should not cause a request.
		rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	public function test_example_url() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', self::EXAMPLE_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$expected = [
			'title'       => 'Example Domain',
			'image'       => '',
			'description' => '',
		];

		// Subsequent requests is cached and so it should not cause a request.
		rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	public function test_valid_url() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', self::VALID_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$expected = [
			'title'       => 'AMP - a web component framework to easily create user-first web experiences - amp.dev',
			'image'       => 'https://amp.dev/static/img/sharing/default-600x314.png',
			'description' => 'Whether you are a publisher, e-commerce company, storyteller, advertiser or email sender, AMP makes it easy to create great experiences on the web. Use AMP to build websites, stories, ads and emails.',
		];

		// Subsequent requests is cached and so it should not cause a request.
		rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	public function test_removes_trailing_slashes() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', self::EXAMPLE_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$expected = [
			'title'       => 'Example Domain',
			'image'       => '',
			'description' => '',
		];

		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/link' );
		$request->set_param( 'url', self::EXAMPLE_URL . '/' );
		rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}
}
