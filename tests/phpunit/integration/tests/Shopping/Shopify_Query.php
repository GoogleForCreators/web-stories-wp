<?php
/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\Tests\Integration\Shopping;

use Google\Web_Stories\Settings;
use Google\Web_Stories\Shopping\Product;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Shopping\Shopify_Query
 */
class Shopify_Query extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Shopping\Shopify_Query
	 */
	private $instance;

	/**
	 * Count of the number of requests attempted.
	 *
	 * @var int
	 */
	protected $request_count = 0;

	/**
	 * Most recent request body.
	 *
	 * @var string
	 */
	protected $request_body;

	public function set_up(): void {
		parent::set_up();

		$this->request_count = 0;
		$this->request_body  = null;
		$this->response_body = null;

		$this->instance = $this->injector->make( \Google\Web_Stories\Shopping\Shopify_Query::class );
	}

	/**
	 * Mock default response.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @return mixed Response data.
	 */
	public function mock_response_default( $preempt, $r ) {
		++$this->request_count;
		$this->request_body = $r['body'];

		return [
			'response' => [
				'code' => 200,
			],
			'body'     => file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/shopify_response_default.json' ),
		];
	}

	/**
	 * Mock unauthorized response.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @return mixed Response data.
	 */
	public function mock_response_unauthorized( $preempt, $r ) {
		++$this->request_count;
		$this->request_body = $r['body'];

		return [
			'response' => [
				'code' => 401,
			],
		];
	}

	/**
	 * Mock 404 response.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @return mixed Response data.
	 */
	public function mock_response_not_found( $preempt, $r ) {
		++$this->request_count;
		$this->request_body = $r['body'];

		return [
			'response' => [
				'code' => 404,
			],
		];
	}

	/**
	 * Mock extensions[code] response.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @return mixed Response data.
	 */
	public function mock_response_extensions_code( $preempt, $r ) {
		++$this->request_count;
		$this->request_body = $r['body'];
		return [
			'response' => [
				'code' => 200,
			],
			'body'     => $this->response_body,
		];
	}

	/**
	 * Mock no results response.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @return mixed Response data.
	 */
	public function mock_response_no_results( $preempt, $r ) {
		++$this->request_count;
		$this->request_body = $r['body'];

		return [
			'response' => [
				'code' => 200,
			],
			'body'     => wp_json_encode( [ 'data' => [ 'products' => [ 'edges' => [] ] ] ] ),
		];
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_host
	 * @covers ::get_access_token
	 */
	public function test_fetch_remote_products_missing_credentials(): void {
		$actual = $this->instance->get_search( '' );

		$this->assertWPError( $actual );
		$this->assertSame( 'rest_missing_credentials', $actual->get_error_code() );
	}

	/**
	 * @covers ::fetch_remote_products
	 */
	public function test_fetch_remote_products_missing_host(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		$actual = $this->instance->get_search( '' );

		$this->assertWPError( $actual );
		$this->assertSame( 'rest_missing_credentials', $actual->get_error_code() );
	}

	/**
	 * @covers ::fetch_remote_products
	 */
	public function test_fetch_remote_products_missing_access_token(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );

		$actual = $this->instance->get_search( '' );

		$this->assertWPError( $actual );
		$this->assertSame( 'rest_missing_credentials', $actual->get_error_code() );
	}

	/**
	 * @covers ::fetch_remote_products
	 */
	public function test_fetch_remote_products_invalid_hostname(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.yourshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		$actual = $this->instance->get_search( '' );

		$this->assertWPError( $actual );
		$this->assertSame( 'rest_invalid_hostname', $actual->get_error_code() );
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 */
	public function test_fetch_remote_products_returns_from_transient(): void {
		$search_term = '';
		$after       = '';
		$per_page    = 100;
		$orderby     = 'date';
		$order       = 'desc';

		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		$cache_key = $this->call_private_method(
			$this->instance,
			'get_cache_key',
			[
				$search_term,
				$after,
				$per_page,
				$orderby,
				$order,
			] 
		);
		set_transient(
			$cache_key,
			wp_json_encode(
				[
					'data' => [
						'products' => [
							'edges'    => [],
							'pageInfo' => [ 'hasNextPage' => false ],
						],
					],
				]
			)
		);
		$actual = $this->instance->get_search( $search_term, 1, $per_page, $orderby, $order );

		$this->assertNotWPError( $actual );
		$this->assertEqualSets(
			[
				'products'      => [],
				'has_next_page' => false,
			],
			$actual
		);
		$this->assertSame( 0, $this->request_count );
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 * @covers ::get_products_query
	 * @covers ::execute_query
	 */
	public function test_get_search_default_response(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		add_filter( 'pre_http_request', [ $this, 'mock_response_default' ], 10, 2 );

		$actual = $this->instance->get_search( '' );

		remove_filter( 'pre_http_request', [ $this, 'mock_response_default' ] );

		$this->assertNotWPError( $actual );
		$this->assertArrayHasKey( 'products', $actual );
		$this->assertNotEmpty( $actual['products'] );
		$this->assertCount( 3, $actual['products'] );
		$this->assertSame( 1, $this->request_count );
		$this->assertStringContainsString( 'query: "title:*"', $this->request_body );

		foreach ( $actual['products'] as $product ) {
			$this->assertInstanceOf( Product::class, $product );

			$this->assertMatchesProductSchema( json_decode( wp_json_encode( $product ), true ) );
		}
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 * @covers ::get_products_query
	 * @covers ::execute_query
	 */
	public function test_get_search_unauthorized_response(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		add_filter( 'pre_http_request', [ $this, 'mock_response_unauthorized' ], 10, 2 );

		$actual = $this->instance->get_search( '' );

		remove_filter( 'pre_http_request', [ $this, 'mock_response_unauthorized' ] );

		$this->assertWPError( $actual );
		$this->assertSame( 'rest_invalid_credentials', $actual->get_error_code() );
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 * @covers ::get_products_query
	 * @covers ::execute_query
	 */
	public function test_get_search_not_found_response(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		add_filter( 'pre_http_request', [ $this, 'mock_response_not_found' ], 10, 2 );

		$actual = $this->instance->get_search( '' );

		remove_filter( 'pre_http_request', [ $this, 'mock_response_not_found' ] );

		$this->assertWPError( $actual );
		$this->assertSame( 'rest_invalid_credentials', $actual->get_error_code() );
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 * @covers ::get_products_query
	 * @covers ::execute_query
	 */
	public function test_get_search_empty_search_response(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		add_filter( 'pre_http_request', [ $this, 'mock_response_no_results' ], 10, 2 );

		$actual = $this->instance->get_search( 'some search term' );

		remove_filter( 'pre_http_request', [ $this, 'mock_response_no_results' ] );

		$this->assertNotWPError( $actual );
		$this->assertArrayHasKey( 'products', $actual );
		$this->assertEmpty( $actual['products'] );
		$this->assertCount( 0, $actual['products'] );
		$this->assertSame( 1, $this->request_count );
		$this->assertStringContainsString( 'query: "title:*some search term*"', $this->request_body );
	}

	/**
	* @dataProvider data_test_get_search_sort_by_query
	*/
	public function data_test_get_search_sort_by_query(): array {
		return [
			'Default search'  => [
				[ 'some search term', 1, 100, 'date', '' ],
				[ 'sortKey: CREATED_AT', 'reverse: true' ],
			],
			'Sort title asc'  => [
				[ '', 1, 100, 'title', 'asc' ],
				[ 'sortKey: TITLE', 'reverse: false' ],
			],
			'Sort title desc' => [
				[ '', 1, 100, 'title', 'desc' ],
				[ 'sortKey: TITLE', 'reverse: true' ],
			],
			'Sort price asc'  => [
				[ '', 1, 100, 'price', 'asc' ],
				[ 'sortKey: PRICE', 'reverse: false' ],
			],
			'Sort price desc' => [
				[ '', 1, 100, 'price', 'desc' ],
				[ 'sortKey: PRICE', 'reverse: true' ],
			],
		];
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 * @covers ::get_products_query
	 * @covers ::execute_query
	 * @covers ::parse_sort_by
	 * @dataProvider data_test_get_search_sort_by_query
	 */
	public function test_get_search_sort_by_query( $args, $expected ): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );
		add_filter( 'pre_http_request', [ $this, 'mock_response_no_results' ], 10, 2 );
		$actual = $this->instance->get_search( ...$args );
		remove_filter( 'pre_http_request', [ $this, 'mock_response_no_results' ] );
		$this->assertNotWPError( $actual );
		$this->assertStringContainsString( $expected[0], $this->request_body );
		$this->assertStringContainsString( $expected[1], $this->request_body );
	}

	/**
	* @dataProvider data_test_get_search_extensions_code_response
	*/
	public function data_test_get_search_extensions_code_response(): array {
		return [
			'THROTTLED'             => [
				'throttled',
				'rest_throttled',
			],
			'ACCESS_DENIED'         => [
				'access_denied',
				'rest_invalid_credentials',
			],
			'SHOP_INACTIVE'         => [
				'shop_inactive',
				'rest_inactive_shop',
			],

			'INTERNAL_SERVER_ERROR' => [
				'internal_server_error',
				'rest_internal_error',
			],
			'UKKNOWN_ERROR'         => [
				'unknown',
				'rest_unknown',
			],
		];
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 * @covers ::get_products_query
	 * @covers ::execute_query
	 * @dataProvider data_test_get_search_extensions_code_response
	 */
	public function test_get_search_extensions_code_response( $args, $expected ): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );

		$this->response_body = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/shopify_response_' . $args . '.json' );

		add_filter( 'pre_http_request', [ $this, 'mock_response_extensions_code' ], 10, 2 );

		$actual = $this->instance->get_search( '' );

		remove_filter( 'pre_http_request', [ $this, 'mock_response_extensions_code' ] );

		$this->assertWPError( $actual );
		$this->assertSame( $expected, $actual->get_error_code() );
	}
}
