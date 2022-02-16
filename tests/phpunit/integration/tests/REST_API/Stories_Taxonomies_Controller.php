<?php

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class Stories_Taxonomies_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller
 */
class Stories_Taxonomies_Controller extends DependencyInjectedRestTestCase {
	protected static $taxonomy_object;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
		self::$taxonomy_object = new DummyTaxonomy();
		self::$taxonomy_object->register_taxonomy();
	}

	public static function wpTearDownAfterClass(): void {
		self::$taxonomy_object->unregister_taxonomy();
	}

	public function set_up(): void {
		parent::set_up();

		$this->controller = $this->injector->make( \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller::class );
	}

	/**
	 * @covers ::prepare_item_for_response
	 */
	public function test_prepare_item_for_response(): void {
		$this->controller->register();

		$slug     = $this->get_private_property( self::$taxonomy_object, 'taxonomy_slug' );
		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies/' . $slug );
		$response = rest_get_server()->dispatch( $request );
		$links    = $response->get_links();
		$this->assertArrayHasKey( 'https://api.w.org/items', $links );
		$this->assertStringContainsString( 'web-stories/v1', $links['https://api.w.org/items'][0]['href'] );
	}
}
