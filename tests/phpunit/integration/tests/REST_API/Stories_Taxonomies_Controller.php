<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Taxonomy\Taxonomy_Base;
use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use WP_REST_Request;
use WP_REST_Server;
use WP_UnitTest_Factory;

/**
 * Class Stories_Taxonomies_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller
 */
class Stories_Taxonomies_Controller extends DependencyInjectedRestTestCase {
	protected static Taxonomy_Base $taxonomy_object;

	/**
	 * Admin user for test.
	 */
	protected static int $admin_id;

	/**
	 * Test instance.
	 */
	private \Google\Web_Stories\REST_API\Stories_Taxonomies_Controller $controller;

	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ): void {
		self::$admin_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

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

		$slug     = self::$taxonomy_object->get_taxonomy_slug();
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
		$this->assertIsArray( $response->get_data() );
		$this->assertIsArray( $response_hierarchical->get_data() );
		$this->assertIsArray( $response_flat->get_data() );
		$this->assertCount(
			\count( $response_hierarchical->get_data() ) + \count( $response_flat->get_data() ),
			$response->get_data()
		);
	}

	/**
	 * @covers ::get_items
	 * @covers ::get_collection_params
	 * @dataProvider data_show_ui
	 */
	public function test_get_items_show_ui( bool $show_ui ): void {
		wp_set_current_user( self::$admin_id );
		$this->controller->register();

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies' );
		$request->set_param( 'show_ui', $show_ui );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertFalse( $response->is_error() );
		$data = $response->get_data();
		$this->assertNotEmpty( $data );
		$this->assertIsArray( $data );
		foreach ( $data as $tax ) {
			$this->assertIsArray( $tax );
			$this->assertArrayHasKey( 'visibility', $tax );
			$this->assertArrayHasKey( 'show_ui', $tax['visibility'] );
			$this->assertSame( $show_ui, $tax['visibility']['show_ui'] );
		}
	}

	/**
	 * @covers ::get_items
	 * @covers ::get_collection_params
	 * @dataProvider data_show_ui
	 */
	public function test_get_items_hierarchical( bool $hierarchical ): void {
		$this->controller->register();

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/taxonomies' );
		$request->set_param( 'hierarchical', $hierarchical );
		$response = rest_get_server()->dispatch( $request );

		$this->assertFalse( $response->is_error() );
		$data = $response->get_data();
		$this->assertNotEmpty( $data );
		$this->assertIsArray( $data );
		foreach ( $data as $tax ) {
			$this->assertIsArray( $tax );
			$this->assertArrayHasKey( 'hierarchical', $tax );
			$this->assertSame( $hierarchical, $tax['hierarchical'] );
		}
	}

	/**
	 * @return array<string, bool[]>
	 */
	public function data_show_ui(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}
}
