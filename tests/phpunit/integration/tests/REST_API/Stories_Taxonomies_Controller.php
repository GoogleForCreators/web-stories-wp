<?php

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Tests\Integration\Test_REST_TestCase;
use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use Spy_REST_Server;
use WP_REST_Request;
use WP_REST_Server;
/**
 * Class Stories_Taxonomies_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller
 */
class Stories_Taxonomies_Controller extends Test_REST_TestCase {
	protected static $taxonomy_object;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$taxonomy_object = new DummyTaxonomy();
		self::$taxonomy_object->register_taxonomy();
	}

	public static function wpTearDownAfterClass() {
		self::$taxonomy_object->unregister_taxonomy();
	}

	public function set_up() {
		parent::set_up();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->controller = new \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller();
	}

	public function tear_down() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		parent::tear_down();
	}

	/**
	 * @covers ::prepare_item_for_response
	 */
	public function test_prepare_item_for_response() {
		$this->controller->register();

		$slug     = $this->get_private_property( self::$taxonomy_object, 'taxonomy_slug' );
		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies/' . $slug );
		$response = rest_get_server()->dispatch( $request );
		$links    = $response->get_links();
		$this->assertArrayHasKey( 'https://api.w.org/items', $links );
		$this->assertStringContainsString( 'web-stories/v1', $links['https://api.w.org/items'][0]['href'] );
	}
}
