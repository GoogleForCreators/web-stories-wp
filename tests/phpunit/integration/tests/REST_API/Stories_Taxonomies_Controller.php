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

	/**
	 * @covers ::get_items
	 */
	public function test_get_items(): void {
		$this->controller->register();

		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies' );
		$response = rest_get_server()->dispatch( $request );

		$request->set_param( 'hierarchical', false );
		$response_flat = rest_get_server()->dispatch( $request );

		$request->set_param( 'hierarchical', true );
		$response_hierarchical = rest_get_server()->dispatch( $request );

		$this->assertFalse( $response->is_error() );
		$this->assertNotEmpty( $response->get_data() );
		$this->assertCount(
			\count( $response_hierarchical->get_data() ) + \count( $response_flat->get_data() ),
			$response->get_data()
		);
	}

	/**
	 * @covers ::get_items
	 * @covers ::get_collection_params
	 */
	public function test_get_items_hierarchical_false(): void {
		$this->controller->register();

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies' );
		$request->set_param( 'hierarchical', false );
		$response = rest_get_server()->dispatch( $request );

		$this->assertFalse( $response->is_error() );
		$this->assertNotEmpty( $response->get_data() );

		$hierarchical_values = wp_list_pluck( array_values( $response->get_data() ), 'hierarchical' );

		foreach ( $hierarchical_values as $hierarchical ) {
			$this->assertFalse( $hierarchical );
		}
	}

	/**
	 * @covers ::get_items
	 * @covers ::get_collection_params
	 */
	public function test_get_items_show_ui_false(): void {
		$this->controller->register();

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies' );
		$request->set_param( 'show_ui', false );
		$request->set_param( 'type', 'attachment' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertFalse( $response->is_error() );
		$data = $response->get_data();
		$this->assertNotEmpty( $data );
		$this->assertCount( 1, $data );
		$this->assertArrayHasKey( 'web_story_media_source', $data );
		$this->assertArrayHasKey( 'name', $data['web_story_media_source'] );
		$this->assertSame( 'Source', $data['web_story_media_source']['name'] );
	}

	/**
	 * @covers ::get_items
	 * @covers ::get_collection_params
	 */
	public function test_get_items_hierarchical_true(): void {
		$this->controller->register();

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies' );
		$request->set_param( 'hierarchical', true );
		$response = rest_get_server()->dispatch( $request );

		$this->assertFalse( $response->is_error() );
		$this->assertNotEmpty( $response->get_data() );

		$hierarchical_values = wp_list_pluck( array_values( $response->get_data() ), 'hierarchical' );

		foreach ( $hierarchical_values as $hierarchical ) {
			$this->assertTrue( $hierarchical );
		}
	}
}
