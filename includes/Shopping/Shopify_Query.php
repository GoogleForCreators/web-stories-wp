<?php
/**
 * Class Shopify_Query
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

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

namespace Google\Web_Stories\Shopping;

use Google\Web_Stories\Interfaces\Product_Query;
use Google\Web_Stories\Settings;
use WP_Error;
use WP_Http;

/**
 * Class Shopify_Query
 *
 * @phpstan-type ShopifyGraphQLError array{message: string, extensions: array{code: string, requestId: string}}[]
 * @phpstan-type ShopifyGraphQLPriceRange array{minVariantPrice: array{amount: int, currencyCode: string}}
 * @phpstan-type ShopifyGraphQLProductImage array{url: string, altText: string}
 * @phpstan-type ShopifyGraphQLProduct array{id: string, handle: string, title: string, vendor: string, description: string, onlineStoreUrl?: string, images: array{edges: array{node: ShopifyGraphQLProductImage}[]}, priceRange: ShopifyGraphQLPriceRange}
 * @phpstan-type ShopifyGraphQLResponse array{errors?: ShopifyGraphQLError, data: array{products: array{edges: array{node: ShopifyGraphQLProduct}[]}}}
 */
class Shopify_Query implements Product_Query {
	protected const API_VERSION = '2022-01';

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Constructor.
	 *
	 * @param Settings $settings Settings instance.
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Returns the Shopify host name.
	 *
	 * @since 1.21.0
	 *
	 * @return string Shopify host.
	 */
	protected function get_host(): string {
		/**
		 * Host name.
		 *
		 * @var string $host
		 */
		$host = $this->settings->get_setting( Settings::SETTING_NAME_SHOPIFY_HOST );
		return $host;
	}

	/**
	 * Returns the Shopify access token.
	 *
	 * @since 1.21.0
	 *
	 * @return string Shopify access token.
	 */
	protected function get_access_token(): string {
		/**
		 * Access token.
		 *
		 * @var string $access_token
		 */
		$access_token = $this->settings->get_setting( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN );
		return $access_token;
	}

	/**
	 * Remotely executes a GraphQL query.
	 *
	 * @since 1.21.0
	 *
	 * @param string $query GraphQL query to execute.
	 * @return string|WP_Error Query result or error object on failure.
	 */
	protected function execute_query( string $query ) {
		$host         = $this->get_host();
		$access_token = $this->get_access_token();

		if ( empty( $host ) || empty( $access_token ) ) {
			return new WP_Error( 'rest_missing_credentials', __( 'Missing API credentials.', 'web-stories' ), [ 'status' => 400 ] );
		}

		if ( ! preg_match( '/^[\w-]+\.myshopify\.com$/i', $host ) ) {
			return new WP_Error( 'rest_invalid_hostname', __( 'Invalid Shopify hostname.', 'web-stories' ), [ 'status' => 400 ] );
		}

		$url = esc_url_raw(
			sprintf(
				'https://%1$s/api/%2$s/graphql.json',
				$host,
				self::API_VERSION
			)
		);

		$response = wp_remote_post(
			$url,
			[
				'headers' => [
					'Content-Type'                      => 'application/graphql',
					'X-Shopify-Storefront-Access-Token' => $access_token,
				],
				'body'    => $query,
			]
		);

		$status_code = wp_remote_retrieve_response_code( $response );

		if ( WP_Http::UNAUTHORIZED === $status_code || WP_Http::NOT_FOUND === $status_code ) {
			return new WP_Error( 'rest_invalid_credentials', __( 'Invalid API credentials.', 'web-stories' ), [ 'status' => $status_code ] );
		}

		if ( WP_Http::OK !== $status_code ) {
			return new WP_Error( 'rest_unknown', __( 'Error fetching products', 'web-stories' ), [ 'status' => $status_code ] );
		}

		return wp_remote_retrieve_body( $response );
	}

	/**
	 * Returns the GraphQL query for getting all products from the store.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term to filter products by.
	 * @param string $sort_by sort order for query.
	 * @return string The assembled GraphQL query.
	 */
	protected function get_products_query( string $search_term, string $sort_by = '' ): string {
		$search_string = empty( $search_term ) ? '*' : '*' . $search_term . '*';
		$sort          = $this->parse_sort_by( $sort_by );
		$sort_key      = $sort['sort_key'];
		$reverse       = $sort['reverse'];
		return <<<QUERY
{
  products(first: 100, sortKey: $sort_key, reverse: $reverse, query: "title:$search_string") {
    edges {
      node {
        id
        handle
        title
        vendor
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        onlineStoreUrl
        images(first: 10) {
          edges {
            node {
              url(transform:{maxWidth:1000,maxHeight:1000})
              altText
            }
          }
        }
      }
    }
  }
}
QUERY;
	}

	/**
	 * Remotely fetches all products from the store.
	 *
	 * Retrieves cached data if available.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term to filter products by.
	 * @param string $sort_by sort order for query.
	 * @return array|WP_Error Response data or error object on failure.
	 */
	protected function fetch_remote_products( string $search_term, string $sort_by = '' ) {
		
		/**
		 * Filters the Shopify products data TTL value.
		 *
		 * @since 1.21.0
		 *
		 * @param int $time Time to live (in seconds). Default is 5 minutes.
		 */
		$cache_ttl = apply_filters( 'web_stories_shopify_data_cache_ttl', 5 * MINUTE_IN_SECONDS );
		$cache_key = 'web_stories_shopify_data_' . md5( $search_term . '-' . $sort_by );

		$data = get_transient( $cache_key );

		if ( \is_string( $data ) && ! empty( $data ) ) {
			return (array) json_decode( $data, true );
		}

		$query = $this->get_products_query( $search_term, $sort_by );

		$body = $this->execute_query( $query );

		if ( is_wp_error( $body ) ) {
			return $body;
		}

		/**
		 * Shopify GraphQL API response.
		 *
		 * @var ShopifyGraphQLResponse $result
		 */
		$result = json_decode( $body, true );

		// TODO(#11268): Error handling.
		if ( isset( $result['errors'] ) ) {
			return new WP_Error( 'rest_unknown', __( 'Error fetching products', 'web-stories' ), [ 'status' => 404 ] );
		}

		// TODO: Maybe cache errors too?
		set_transient( $cache_key, $body, $cache_ttl );

		return $result;
	}

	
	/**
	 * Get products by search term.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term.
	 * @param string $sort_by sort condition for product query.
	 * @return Product[]|WP_Error
	 */
	public function get_search( string $search_term, string $sort_by = '' ) {
		
		$result = $this->fetch_remote_products( $search_term, $sort_by );
		
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$results = [];

		foreach ( $result['data']['products']['edges'] as $edge ) {
			$product = $edge['node'];

			$images = [];

			foreach ( $product['images']['edges'] as $image_edge ) {
				$image    = $image_edge['node'];
				$images[] = [
					'url' => $image['url'],
					'alt' => $image['altText'] ?? '',
				];
			}

			// URL is null if the resource is currently not published to the Online Store sales channel,
			// or if the shop is password-protected.
			// In this case, we can fall back to a manually constructed product URL.
			$product_url = $product['onlineStoreUrl'] ?? sprintf( 'https://%1$s/products/%2$s/', $this->get_host(), $product['handle'] );

			$results[] = new Product(
				[
					'id'             => $product['id'],
					'title'          => $product['title'],
					'brand'          => $product['vendor'],
					// TODO: Maybe eventually provide full price range.
					// See https://github.com/ampproject/amphtml/issues/37957.
					'price'          => (float) $product['priceRange']['minVariantPrice']['amount'],
					'price_currency' => $product['priceRange']['minVariantPrice']['currencyCode'],
					'images'         => $images,
					'details'        => $product['description'],
					// URL is null if the resource is currently not published to the Online Store sales channel,
					// or if the shop is password-protected.
					'url'            => $product_url,
				]
			);
		}

		return $results;
	}

	/**
	 * Parse sort type into array for product query
	 *
	 * @since 1.21.0
	 *
	 * @param string $sort_by sort condition for product query.
	 * @return array
	 */
	protected function parse_sort_by( string $sort_by ): array {
		
		switch ( $sort_by ) {
			case 'a-z':
				$order = 'TITLE|false';
				break;
			case 'z-a':
				$order = 'TITLE|true';
				break;
			case 'price-low':
				$order = 'PRICE|false';
				break;
			case 'price-high':
				$order = 'PRICE|true';
				break;
			default:
				$order = 'CREATED_AT|false';
		}
		
		list($sort_key, $reverse) = explode( '|', $order );
		return compact( 'sort_key', 'reverse' );
	}
}
