<?php
/**
 * Copyright 2021 Google LLC
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

use Google\Web_Stories\Font_Post_Type;
use Google\Web_Stories\Tests\Integration\RestTestCase;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class Font_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Font_Controller
 */
class Font_Controller extends RestTestCase {
	protected $server;

	protected static $admin_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Font_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
		self::$admin_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);

		$factory->post->create(
			[
				'post_type'    => Font_Post_Type::POST_TYPE_SLUG,
				'post_status'  => 'publish',
				'post_title'   => 'Overpass Regular',
				'post_content' => '{"family":"Overpass Regular","fallbacks":["sans-serif"],"weights":[400],"styles":["regular"],"variants":[[0,400]],"url":"https:\/\/overpass-30e2.kxcdn.com\/overpass-regular.ttf","service":"custom","metrics":{"upm":1000,"asc":982,"des":-284,"tAsc":750,"tDes":-250,"tLGap":266,"wAsc":1062,"wDes":378,"xH":511,"capH":700,"yMin":-378,"yMax":1062,"hAsc":982,"hDes":-284,"lGap":266}}',
			]
		);

		$factory->post->create(
			[
				'post_type'    => Font_Post_Type::POST_TYPE_SLUG,
				'post_status'  => 'publish',
				'post_title'   => 'Gingrich Small Regular',
				'post_content' => '{"family":"Gingrich Small Regular","fallbacks":["sans-serif"],"weights":[400],"styles":["regular"],"variants":[[0,400]],"url":"https:\/\/www.barrons.com\/fonts\/woffs\/gingrich\/GingrichSmall-Regular.woff","service":"custom","metrics":{"upm":1000,"asc":830,"des":-170,"tAsc":830,"tDes":-170,"tLGap":200,"wAsc":1060,"wDes":226,"xH":522,"capH":750,"yMin":-226,"yMax":1060,"hAsc":830,"hDes":-170,"lGap":200}}',
			]
		);

		$factory->post->create(
			[
				'post_type'    => Font_Post_Type::POST_TYPE_SLUG,
				'post_status'  => 'publish',
				'post_title'   => 'Vazir Regular',
				'post_content' => '{"family":"Vazir Regular","fallbacks":["sans-serif"],"weights":[400],"styles":["regular"],"variants":[[0,400]],"url":"https:\/\/cdn.jsdelivr.net\/gh\/rastikerdar\/vazir-font@v30.1.0\/dist\/Vazir-Regular.ttf","service":"custom","metrics":{"upm":2048,"asc":2200,"des":-1100,"tAsc":2200,"tDes":-1100,"tLGap":0,"wAsc":2200,"wDes":1100,"xH":1082,"capH":1638,"yMin":-1116,"yMax":2163,"hAsc":2200,"hDes":-1100,"lGap":0}}',
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$this->controller = new \Google\Web_Stories\REST_API\Font_Controller( Font_Post_Type::POST_TYPE_SLUG );
	}

	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema(): void {
		$actual = $this->controller->get_item_schema();

		$this->assertCount( 9, array_keys( $actual['properties'] ) );
		$this->assertArrayHasKey( 'family', $actual['properties'] );
		$this->assertArrayHasKey( 'fallbacks', $actual['properties'] );
		$this->assertArrayHasKey( 'weights', $actual['properties'] );
		$this->assertArrayHasKey( 'styles', $actual['properties'] );
		$this->assertArrayHasKey( 'variants', $actual['properties'] );
		$this->assertArrayHasKey( 'service', $actual['properties'] );
		$this->assertArrayHasKey( 'metrics', $actual['properties'] );
		$this->assertArrayHasKey( 'id', $actual['properties'] );
		$this->assertArrayHasKey( 'url', $actual['properties'] );
	}

	/**
	 * @covers ::get_collection_params
	 */
	public function test_get_collection_params(): void {
		$this->controller->register_routes();

		$collection_params = $this->controller->get_collection_params();
		$this->assertArrayHasKey( 'search', $collection_params );
		$this->assertArrayHasKey( 'include', $collection_params );
		$this->assertArrayHasKey( 'service', $collection_params );
		$this->assertArrayHasKey( 'enum', $collection_params['service'] );
	}

	/**
	 * @covers ::get_items_permissions_check
	 */
	public function test_get_items_no_permission(): void {
		$this->controller->register_routes();

		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/fonts' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_filter_by_service_builtin(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$admin_id );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/fonts' );
		$request->set_param( 'service', 'builtin' );

		$response = rest_get_server()->dispatch( $request );

		$data = $response->get_data();

		foreach ( $data as $font ) {
			$this->assertArrayHasKey( 'service', $font );
			$this->assertNotSame( 'custom', $font['service'] );
			$this->assertTrue( 'system' === $font['service'] || 'fonts.google.com' === $font['service'] );
		}
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_filter_by_service_custom(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$admin_id );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/fonts' );
		$request->set_param( 'service', 'custom' );

		$response = rest_get_server()->dispatch( $request );

		$data = $response->get_data();

		$this->assertCount( 3, $data );

		foreach ( $data as $font ) {
			$this->assertArrayHasKey( 'service', $font );
			$this->assertSame( 'custom', $font['service'] );
		}
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_include(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$admin_id );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/fonts' );
		$request->set_param( 'include', [ 'Overpass Regular', 'Arial', 'Roboto' ] );

		$response = rest_get_server()->dispatch( $request );

		$data = $response->get_data();

		$this->assertCount( 3, $data );
		$this->assertSame( 'Arial', $data[0]['family'] );
		$this->assertSame( 'Overpass Regular', $data[1]['family'] );
		$this->assertSame( 'Roboto', $data[2]['family'] );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_search(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$admin_id );

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/fonts' );
		$request->set_param( 'search', 'oVeR' );

		$response = rest_get_server()->dispatch( $request );

		$data = $response->get_data();

		$this->assertCount( 9, $data );

		foreach ( $data as $font ) {
			$this->assertStringContainsStringIgnoringCase( 'over', $font['family'] );
		}
	}

	/**
	 * @covers ::create_item
	 * @covers ::prepare_item_for_database
	 */
	public function test_create_item(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$admin_id );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/fonts' );

		$request->set_param( 'family', 'Vazir Regular 2' );
		$request->set_param( 'fallbacks', [ 'sans-serif' ] );
		$request->set_param( 'weights', [ 400 ] );
		$request->set_param( 'styles', [ 'regular' ] );
		$request->set_param( 'variants', [ [ 0, 400 ] ] );
		$request->set_param( 'url', 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf' );
		$request->set_param(
			'metrics',
			[
				'upm'   => 2048,
				'asc'   => 2200,
				'des'   => -1100,
				'tAsc'  => 2200,
				'tDes'  => -1100,
				'tLGap' => 0,
				'wAsc'  => 2200,
				'wDes'  => 1100,
				'xH'    => 1082,
				'capH'  => 1638,
				'yMin'  => -1116,
				'yMax'  => 2163,
				'hAsc'  => 2200,
				'hDes'  => -1100,
				'lGap'  => 0,
			]
		);

		$response = rest_get_server()->dispatch( $request );

		$data = $response->get_data();

		$this->assertArrayHasKey( 'id', $data );
		$this->assertIsInt( $data['id'] );
		$this->assertArrayHasKey( 'family', $data );
		$this->assertArrayHasKey( 'fallbacks', $data );
		$this->assertArrayHasKey( 'weights', $data );
		$this->assertArrayHasKey( 'styles', $data );
		$this->assertArrayHasKey( 'variants', $data );
		$this->assertArrayHasKey( 'url', $data );
		$this->assertArrayHasKey( 'metrics', $data );
		$this->assertArrayHasKey( 'service', $data );

		$post = get_post( $data['id'] );

		unset( $data['id'] );
		$this->assertEqualSetsWithIndex(
			[
				'family'    => 'Vazir Regular 2',
				'fallbacks' => [ 'sans-serif' ],
				'weights'   => [ 400 ],
				'styles'    => [ 'regular' ],
				'variants'  => [ [ 0, 400 ] ],
				'url'       => 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf',
				'metrics'   => [
					'upm'   => 2048,
					'asc'   => 2200,
					'des'   => -1100,
					'tAsc'  => 2200,
					'tDes'  => -1100,
					'tLGap' => 0,
					'wAsc'  => 2200,
					'wDes'  => 1100,
					'xH'    => 1082,
					'capH'  => 1638,
					'yMin'  => -1116,
					'yMax'  => 2163,
					'hAsc'  => 2200,
					'hDes'  => -1100,
					'lGap'  => 0,
				],
				'service'   => 'custom',
			],
			$data
		);

		$this->assertSame( 'Vazir Regular 2', $post->post_title );
		$this->assertSame( 'publish', $post->post_status );
		$this->assertSame(
			'{"family":"Vazir Regular 2","fallbacks":["sans-serif"],"weights":[400],"styles":["regular"],"variants":[[0,400]],"metrics":{"upm":2048,"asc":2200,"des":-1100,"tAsc":2200,"tDes":-1100,"tLGap":0,"wAsc":2200,"wDes":1100,"xH":1082,"capH":1638,"yMin":-1116,"yMax":2163,"hAsc":2200,"hDes":-1100,"lGap":0},"url":"https:\/\/cdn.jsdelivr.net\/gh\/rastikerdar\/vazir-font@v30.1.0\/dist\/Vazir-Regular.ttf"}',
			$post->post_content
		);
	}


	/**
	 * @covers ::create_item
	 * @covers ::prepare_item_for_database
	 * @covers ::font_exists
	 */
	public function test_create_item_duplicate(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$admin_id );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/fonts' );

		$request->set_param( 'family', 'VaZiR ReGuLaR' );
		$request->set_param( 'fallbacks', [ 'sans-serif' ] );
		$request->set_param( 'weights', [ 400 ] );
		$request->set_param( 'styles', [ 'regular' ] );
		$request->set_param( 'variants', [ [ 0, 400 ] ] );
		$request->set_param( 'url', 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf' );
		$request->set_param(
			'metrics',
			[
				'upm'   => 2048,
				'asc'   => 2200,
				'des'   => - 1100,
				'tAsc'  => 2200,
				'tDes'  => - 1100,
				'tLGap' => 0,
				'wAsc'  => 2200,
				'wDes'  => 1100,
				'xH'    => 1082,
				'capH'  => 1638,
				'yMin'  => - 1116,
				'yMax'  => 2163,
				'hAsc'  => 2200,
				'hDes'  => - 1100,
				'lGap'  => 0,
			]
		);

		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_invalid_field', $response, 400 );
	}

	/**
	 * @covers ::delete_item
	 */
	public function test_delete_item(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$admin_id );

		$post_id = self::factory()->post->create(
			[
				'post_type'    => Font_Post_Type::POST_TYPE_SLUG,
				'post_status'  => 'publish',
				'post_title'   => 'Vazir Regular 3',
				'post_content' => '{"family":"Vazir Regular 3","fallbacks":["sans-serif"],"weights":[400],"styles":["regular"],"variants":[[0,400]],"url":"https:\/\/cdn.jsdelivr.net\/gh\/rastikerdar\/vazir-font@v30.1.0\/dist\/Vazir-Regular.ttf","service":"custom","metrics":{"upm":2048,"asc":2200,"des":-1100,"tAsc":2200,"tDes":-1100,"tLGap":0,"wAsc":2200,"wDes":1100,"xH":1082,"capH":1638,"yMin":-1116,"yMax":2163,"hAsc":2200,"hDes":-1100,"lGap":0}}',
			]
		);

		$request = new WP_REST_Request( WP_REST_Server::DELETABLE, '/web-stories/v1/fonts/' . $post_id );

		$response = rest_get_server()->dispatch( $request );

		$data = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertArrayHasKey( 'deleted', $data );
		$this->assertTrue( $data['deleted'] );
		$this->assertNull( get_post( $post_id ) );
	}
}
