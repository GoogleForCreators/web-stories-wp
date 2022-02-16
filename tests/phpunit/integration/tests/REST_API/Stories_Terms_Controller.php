<?php

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use Google\Web_Stories\Tests\Integration\RestTestCase;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class Stories_Terms_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Terms_Controller
 */
class Stories_Terms_Controller extends RestTestCase {
	protected static $taxonomy_object;

	public static function wpSetUpBeforeClass( $factory ): void {
		self::$taxonomy_object = new DummyTaxonomy();
		self::$taxonomy_object->register_taxonomy();
	}

	public static function wpTearDownAfterClass(): void {
		self::$taxonomy_object->unregister_taxonomy();
	}

	/**
	 * @covers ::prepare_links
	 */
	public function test_prepare_links(): void {
		$slug     = $this->get_private_property( self::$taxonomy_object, 'taxonomy_slug' );
		$term_id  = self::factory()->term->create( [ 'taxonomy' => $slug ] );
		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/' . $slug . '/' . $term_id );
		$response = rest_get_server()->dispatch( $request );
		$links    = $response->get_links();
		$this->assertArrayHasKey( 'about', $links );
		$this->assertArrayHasKey( 'href', $links['about'][0] );
		$this->assertStringContainsString( 'web-stories/v1', $links['about'][0]['href'] );
	}
}
