<?php

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Tests\Integration\Test_REST_TestCase;
use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
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

	public static function wpSetUpBeforeClass( $factory ) {
		self::$taxonomy_object = new DummyTaxonomy();
		self::$taxonomy_object->register_taxonomy();
	}

	public static function wpTearDownAfterClass() {
		self::$taxonomy_object->unregister_taxonomy();
	}

	/**
	 * @covers ::prepare_item_for_response
	 */
	public function test_prepare_item_for_response() {
		$slug     = $this->get_private_property( self::$taxonomy_object, 'taxonomy_slug' );
		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies/' . $slug );
		$response = rest_get_server()->dispatch( $request );
		$links    = $response->get_links();
		$this->assertArrayHasKey( 'https://api.w.org/items', $links );
		$this->assertContains( 'web-stories/v1', $links['https://api.w.org/items'][0]['href'] );
	}
}
