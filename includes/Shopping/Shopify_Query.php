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
 * @phpstan-type ShopifyGraphQLResponse array{errors?: ShopifyGraphQLError, data: array{products: array{edges: array{node: ShopifyGraphQLProduct}[], pageInfo: array{hasNextPage: bool, endCursor: string}}}}
 */
class Shopify_Query implements Product_Query {
	protected const API_VERSION = '2022-04';

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
	 * @param string $search_term  Search term to filter products by.
	 * @param string $after        The cursor to retrieve nodes after in the connection.
	 * @param int    $per_page     Number of products to be fetched.
	 * @param string $orderby      Sort collection by product attribute.
	 * @param string $order        Order sort attribute ascending or descending.
	 * @return string              The assembled GraphQL query.
	 */
	protected function get_products_query( string $search_term, string $after, int $per_page, string $orderby, string $order ): string {
		$search_string = empty( $search_term ) ? '*' : '*' . $search_term . '*';
		$sortkey       = 'date' === $orderby ? 'CREATED_AT' : strtoupper( $orderby );
		$reverse       = 'asc' === $order ? 'false' : 'true';
		$after         = empty( $after ) ? 'null' : sprintf( '"%s"', $after );

		return <<<QUERY
{
  products(first: $per_page, after: $after, sortKey: $sortkey, reverse: $reverse, query: "title:$search_string") {
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
    pageInfo {
       hasNextPage
       endCursor
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
	 * @param string $search_term  Search term to filter products by.
	 * @param string $after        The cursor to retrieve nodes after in the connection.
	 * @param int    $per_page     Number of products to be fetched.
	 * @param string $orderby      Sort retrieved products by parameter.
	 * @param string $order        Whether to order products in ascending or descending order.
	 *                             Accepts 'asc' (ascending) or 'desc' (descending).
	 * @return array|WP_Error      Response data or error object on failure.
	 */
	protected function get_remote_products( string $search_term, string $after, int $per_page, string $orderby, string $order ) {
		/**
		 * Filters the Shopify products data TTL value.
		 *
		 * @since 1.21.0
		 *
		 * @param int $time Time to live (in seconds). Default is 5 minutes.
		 */
		$cache_ttl = apply_filters( 'web_stories_shopify_data_cache_ttl', 5 * MINUTE_IN_SECONDS );
		$cache_key = $this->get_cache_key( $search_term, $after, $per_page, $orderby, $order );

		$data = get_transient( $cache_key );

		if ( \is_string( $data ) && ! empty( $data ) ) {
			return (array) json_decode( $data, true );
		}

		$query = $this->get_products_query( $search_term, $after, $per_page, $orderby, $order );
		$body  = $this->execute_query( $query );
		if ( is_wp_error( $body ) ) {
			return $body;
		}

		/**
		 * Shopify GraphQL API response.
		 *
		 * @var ShopifyGraphQLResponse $result
		 */
		$result = json_decode( $body, true );
		if ( isset( $result['errors'] ) ) {
			$wp_error = new WP_Error();
			foreach ( $result['errors'] as $error ) {
				$error_code = $error['extensions']['code'];
				// https://shopify.dev/api/storefront#status_and_error_codes.
				switch ( $error_code ) {
					case 'THROTTLED':
						$wp_error->add( 'rest_throttled', __( 'Shopify API rate limit exceeded. Try again later.', 'web-stories' ), [ 'status' => 429 ] );
						break;
					case 'ACCESS_DENIED':
						$wp_error->add( 'rest_invalid_credentials', __( 'Invalid Shopify API credentials provided.', 'web-stories' ), [ 'status' => 401 ] );
						break;
					case 'SHOP_INACTIVE':
						$wp_error->add( 'rest_inactive_shop', __( 'Inactive Shopify shop.', 'web-stories' ), [ 'status' => 403 ] );
						break;
					case 'INTERNAL_SERVER_ERROR':
						$wp_error->add( 'rest_internal_error', __( 'Shopify experienced an internal server error.', 'web-stories' ), [ 'status' => 500 ] );
						break;
					default:
						$wp_error->add( 'rest_unknown', __( 'Error fetching products from Shopify.', 'web-stories' ), [ 'status' => 500 ] );
				}
			}

			return $wp_error;
		}

		// TODO: Maybe cache errors too?
		set_transient( $cache_key, $body, $cache_ttl );

		return $result;
	}

	/**
	 * Get cache key for properties.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term  Search term to filter products by.
	 * @param string $after        The cursor to retrieve nodes after in the connection.
	 * @param int    $per_page     Number of products to be fetched.
	 * @param string $orderby      Sort retrieved products by parameter.
	 * @param string $order        Whether to order products in ascending or descending order.
	 *                             Accepts 'asc' (ascending) or 'desc' (descending).
	 */
	protected function get_cache_key( $search_term, $after, $per_page, $orderby, $order ): string {
		$cache_args = (string) wp_json_encode( compact( 'search_term', 'after', 'per_page', 'orderby', 'order' ) );

		return 'web_stories_shopify_data_' . md5( $cache_args );
	}

	/**
	 * Remotely fetches all products from the store.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term to filter products by.
	 * @param int    $page        Number of page for paginated requests.
	 * @param int    $per_page    Number of products to be fetched.
	 * @param string $orderby     Sort retrieved products by parameter.
	 * @param string $order       Whether to order products in ascending or descending order.
	 *                            Accepts 'asc' (ascending) or 'desc' (descending).
	 * @return array|WP_Error Response data or error object on failure.
	 */
	protected function fetch_remote_products( string $search_term, int $page, int $per_page, string $orderby, string $order ) {
		$after = '';
		if ( $page > 1 ) {
			// Loop around all the pages, getting the endCursor of each page, until you get the last one.
			for ( $i = 1; $i < $page; $i ++ ) {
				$result = $this->get_remote_products( $search_term, $after, $per_page, $orderby, $order );
				if ( is_wp_error( $result ) ) {
					return $result;
				}

				$has_next_page = $result['data']['products']['pageInfo']['hasNextPage'];
				if ( ! $has_next_page ) {
					return new WP_Error( 'rest_no_page', __( 'Error fetching products from Shopify.', 'web-stories' ), [ 'status' => 404 ] );
				}
				$after = (string) $result['data']['products']['pageInfo']['endCursor'];
			}
		}

		return $this->get_remote_products( $search_term, $after, $per_page, $orderby, $order );
	}

	/**
	 * Get products by search term.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term.
	 * @param int    $page        Number of page for paginated requests.
	 * @param int    $per_page    Number of products to be fetched.
	 * @param string $orderby     Sort retrieved products by parameter. Default 'date'.
	 * @param string $order       Whether to order products in ascending or descending order.
	 *                            Accepts 'asc' (ascending) or 'desc' (descending). Default 'desc'.
	 * @return array|WP_Error
	 */
	public function get_search( string $search_term, int $page = 1, int $per_page = 100, string $orderby = 'date', string $order = 'desc' ) {
		$result = $this->fetch_remote_products( $search_term, $page, $per_page, $orderby, $order );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$products = [];

		$has_next_page = $result['data']['products']['pageInfo']['hasNextPage'] ?? false;

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

			$products[] = new Product(
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

		return compact( 'products', 'has_next_page' );
	}
}
