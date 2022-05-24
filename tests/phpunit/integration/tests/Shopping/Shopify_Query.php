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
		$orderby     = 'date';
		$order       = 'desc';

		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );
		set_transient( 'web_stories_shopify_data_' . md5( $search_term . '-' . $orderby . '-' . $order ), wp_json_encode( [ 'data' => [ 'products' => [ 'edges' => [] ] ] ] ) );

		$actual = $this->instance->get_search( '', $orderby, $order );

		$this->assertNotWPError( $actual );
		$this->assertSame( [], $actual );
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
		$this->assertNotEmpty( $actual );
		$this->assertCount( 3, $actual );
		$this->assertSame( 1, $this->request_count );
		$this->assertStringContainsString( 'query: "title:*"', $this->request_body );

		foreach ( $actual as $product ) {
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

		$actual = $this->instance->get_search( 'some search term', '', '' );

		remove_filter( 'pre_http_request', [ $this, 'mock_response_no_results' ] );

		$this->assertNotWPError( $actual );
		$this->assertEmpty( $actual );
		$this->assertCount( 0, $actual );
		$this->assertSame( 1, $this->request_count );
		$this->assertStringContainsString( 'query: "title:*some search term*"', $this->request_body );
	}

	/**
	 * @covers ::fetch_remote_products
	 * @covers ::get_search
	 * @covers ::get_products_query
	 * @covers ::execute_query
	 * @covers ::parse_sort_by
	 */
	public function test_get_search_sort_by_query(): void {
		update_option( Settings::SETTING_NAME_SHOPIFY_HOST, 'example.myshopify.com' );
		update_option( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN, '1234' );
		add_filter( 'pre_http_request', [ $this, 'mock_response_no_results' ], 10, 2 );
		
		$actual = $this->instance->get_search( 'some search term' );
		$this->assertNotWPError( $actual );
		$this->assertStringContainsString( 'sortKey: CREATED_AT', $this->request_body );
		$this->assertStringContainsString( 'reverse: true', $this->request_body );
		
		$actual = $this->instance->get_search( 'some search term', 'title', 'asc' );
		$this->assertNotWPError( $actual );
		$this->assertStringContainsString( 'sortKey: TITLE', $this->request_body );
		$this->assertStringContainsString( 'reverse: false', $this->request_body );

		$actual = $this->instance->get_search( 'some search term', 'title', 'desc' );
		$this->assertNotWPError( $actual );
		$this->assertStringContainsString( 'sortKey: TITLE', $this->request_body );
		$this->assertStringContainsString( 'reverse: true', $this->request_body );

		$actual = $this->instance->get_search( 'some search term', 'price', 'asc' );
		$this->assertNotWPError( $actual );
		$this->assertStringContainsString( 'sortKey: PRICE', $this->request_body );
		$this->assertStringContainsString( 'reverse: false', $this->request_body );
		
		$actual = $this->instance->get_search( 'some search term', 'price', 'desc' );
		$this->assertNotWPError( $actual );
		$this->assertStringContainsString( 'sortKey: PRICE', $this->request_body );
		$this->assertStringContainsString( 'reverse: true', $this->request_body );

		remove_filter( 'pre_http_request', [ $this, 'mock_response_no_results' ] );
	}


}
