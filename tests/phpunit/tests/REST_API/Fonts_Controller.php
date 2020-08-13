<?php

namespace Google\Web_Stories\Tests\REST_API;

use Spy_REST_Server;
use WP_REST_Request;

class Fonts_Controller extends \WP_Test_REST_TestCase {
	protected $server;

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );
	}

	public function tearDown() {
		parent::tearDown();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;
	}

	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/fonts', $routes );
		$this->assertCount( 1, $routes['/web-stories/v1/fonts'] );
	}

	public function test_get_item_schema() {
		$request  = new WP_REST_Request( 'OPTIONS', '/web-stories/v1/fonts' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );

		$properties = $data['schema']['properties'];
		$this->assertCount( 7, $properties );
		$this->assertArrayHasKey( 'family', $properties );
		$this->assertArrayHasKey( 'service', $properties );
		$this->assertArrayHasKey( 'fallbacks', $properties );
		$this->assertArrayHasKey( 'weights', $properties );
		$this->assertArrayHasKey( 'styles', $properties );
		$this->assertArrayHasKey( 'variants', $properties );
		$this->assertArrayHasKey( 'metrics', $properties );
	}
}
