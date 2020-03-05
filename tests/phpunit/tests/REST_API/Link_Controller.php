<?php

namespace Google\Web_Stories\Tests\REST_API;

use Spy_REST_Server;
use WP_REST_Request;

class Link_Controller extends \WP_Test_REST_TestCase {
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

		$this->assertArrayHasKey( '/amp/v1/link', $routes );
		$this->assertCount( 1, $routes['/amp/v1/link'] );
	}

	public function test_get_item_schema() {
		$request = new WP_REST_Request( 'OPTIONS', '/amp/v1/link' );
		$request->set_query_params(
			[
				'url' => 'https://amp.dev/',
			]
		);
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );

		$this->assertCount( 3, $properties );
		$this->assertArrayHasKey( 'title', $data );
		$this->assertArrayHasKey( 'image', $data );
		$this->assertArrayHasKey( 'description', $description );
	}
}
