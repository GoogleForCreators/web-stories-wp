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

namespace Google\Web_Stories\Product;

use Google\Web_Stories\Interfaces\Product_Query;
use Google\Web_Stories\Model\Product;
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
	 * Get products by search term.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term.
	 * @return Product[]|WP_Error
	 */
	public function get_search( string $search_term ) {

		/**
		 * Shopify host.
		 *
		 * @var string $host
		 */
		$host = $this->settings->get_setting( Settings::SETTING_NAME_SHOPIFY_HOST );

		/**
		 * Shopify access token.
		 *
		 * @var string $access_token
		 */
		$access_token = $this->settings->get_setting( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN );

		if ( empty( $host ) || empty( $access_token ) ) {
			return new WP_Error( 'rest_unknown', __( 'Shopify access data required.', 'web-stories' ), [ 'status' => 400 ] );
		}

		/**
		 * Filters the shopify products data TTL value.
		 *
		 * @since 1.21.0
		 *
		 * @param int $time Time to live (in seconds). Default is 1 day.
		 */
		$cache_ttl = apply_filters( 'web_stories_shopify_data_cache_ttl', DAY_IN_SECONDS ); // TODO: lower default TTL.
		$cache_key = ! empty( $search_term ) ? 'web_stories_shopify_data_' . md5( $search_term ) : 'web_stories_shopify_data_default';

		$data = get_transient( $cache_key );

		if ( \is_string( $data ) && ! empty( $data ) ) {
			/**
			 * Decoded cached products data.
			 *
			 * @var array|null $products
			 */
			$products = json_decode( $data, true );

			if ( \is_array( $products ) ) {
				return $products;
			}
		}

		// TODO(#11154): Maybe move to a class constant.
		$api_version = '2022-01';

		// TODO(#11154): Proper sanitization.
		$url = sprintf(
			'https://%1$s/api/%2$s/graphql.json',
			$host,
			$api_version
		);

		$search_string = empty( $search_term ) ? '*' : '*' . $search_term . '*';

		// TODO(#11154): Support different sortKeys.
		// Maybe use "available_for_sale:true AND " query to only show items in stock.
		$query = <<<QUERY
{
  products(first: 100, sortKey: CREATED_AT, query: "title:$search_string") {
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
              url
              altText
            }
          }
        }
      }
    }
  }
}
QUERY;

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

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			return new WP_Error( 'rest_unknown', __( 'Error fetching products', 'web-stories' ), [ 'status' => 404 ] );
		}

		/**
		 * Shopify GraphQL API response.
		 *
		 * @var ShopifyGraphQLResponse $result
		 */
		$result = json_decode( wp_remote_retrieve_body( $response ), true );

		// TODO: Error handling.
		if ( isset( $result['errors'] ) ) {
			return new WP_Error( 'rest_unknown', __( 'Error fetching products', 'web-stories' ), [ 'status' => 404 ] );
		}

		$results = [];

		foreach ( $result['data']['products']['edges'] as $edge ) {
			$product = $edge['node'];

			$images = [];

			foreach ( $product['images']['edges'] as $image_edge ) {
				$image    = $image_edge['node'];
				$images[] = [
					'url' => $image['url'],
					'alt' => $image['altText'],
				];
			}

			// URL is null if the resource is currently not published to the Online Store sales channel,
			// or if the shop is password-protected.
			// In this case, we can fall back to a manually constructed product URL.
			$product_url = $product['onlineStoreUrl'] ?? sprintf( 'https://%1$s/products/%2$s/', $host, $product['handle'] );

			$results[] = new Product(
				[
					'id'              => $product['id'],
					'title'           => $product['title'],
					'brand'           => $product['vendor'],
					// TODO: Maybe eventually provide full price range.
					// See https://github.com/ampproject/amphtml/issues/37957.
					'price'           => (float) $product['priceRange']['minVariantPrice']['amount'],
					'price_currency'  => $product['priceRange']['minVariantPrice']['currencyCode'],
					'images'          => $images,
					'details'         => $product['description'],
					// URL is null if the resource is currently not published to the Online Store sales channel,
					// or if the shop is password-protected.
					'url'             => $product_url,
				]
			);
		}

		set_transient( $cache_key, wp_json_encode( $results ), $cache_ttl );

		return $results;
	}
}
