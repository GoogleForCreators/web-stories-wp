<?php
/**
 * Class Products_Controller
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

namespace Google\Web_Stories\REST_API;

use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Class to access publisher logos via the REST API.
 *
 * @since 1.20.0
 *
 * @phpstan-type ShopifyGraphQLError array{message: string, extensions: array{code: string, requestId: string}}[]
 * @phpstan-type ShopifyGraphQLPriceRange array{minVariantPrice: array{amount: int, currencyCode: string}}
 * @phpstan-type ShopifyGraphQLProductImage array{url: string, altText: string}
 * @phpstan-type ShopifyGraphQLProduct array{id: string, handle: string, title: string, vendor: string, description: string, onlineStoreUrl?: string, images: array{edges: array{node: ShopifyGraphQLProductImage}[]}, priceRange: ShopifyGraphQLPriceRange}
 * @phpstan-type ShopifyGraphQLResponse array{errors?: ShopifyGraphQLError, data: array{products: array{edges: array{node: ShopifyGraphQLProduct}[]}}}
 */
class Products_Controller extends REST_Controller implements HasRequirements {

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Constructor.
	 *
	 * @param Settings        $settings Settings instance.
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Settings $settings, Story_Post_Type $story_post_type ) {
		$this->settings        = $settings;
		$this->story_post_type = $story_post_type;

		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'products';
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.20.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'settings', 'story_post_type' ];
	}

	/**
	 * Registers routes for links.
	 *
	 * @since 1.20.0
	 *
	 * @see register_rest_route()
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);
	}

	/**
	 * Checks if a given request has access to get and create items.
	 *
	 * @since 1.20.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		if ( ! $this->story_post_type->has_cap( 'edit_posts' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to manage publisher logos.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Retrieves all products.
	 *
	 * @since 1.20.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$results = [];

		// TODO(#11154): Refactor to extract product query logic out of this controller.
		$shopify_host         = $this->settings->get_setting( Settings::SETTING_NAME_SHOPIFY_HOST );
		$shopify_access_token = $this->settings->get_setting( Settings::SETTING_NAME_SHOPIFY_ACCESS_TOKEN );

		if ( ! empty( $shopify_host ) && ! empty( $shopify_access_token ) ) {
			return $this->get_items_shopify( $request );
		}

		if ( function_exists( 'wc_get_products' ) ) {
			return $this->get_items_woocommerce( $request );
		}

		return rest_ensure_response( $results );
	}

	/**
	 * Retrieves all Shopify products.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @since 1.20.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	protected function get_items_shopify( $request ) {
		/**
		 * Search term.
		 *
		 * @var string $search_term
		 */
		$search_term = $request['search'];

		/**
		 * Filters the shopify products data TTL value.
		 *
		 * @since 1.20.0
		 *
		 * @param int $time Time to live (in seconds). Default is 1 day.
		 * @param WP_REST_Request $request Full details about the request.
		 */
		$cache_ttl = apply_filters( 'web_stories_shopify_data_cache_ttl', DAY_IN_SECONDS, $request ); // TODO: lower default TTL.
		$cache_key = ! empty( $request['search'] ) ? 'web_stories_shopify_data_' . md5( $search_term ) : 'web_stories_shopify_data_default';

		$data = get_transient( $cache_key );

		if ( \is_string( $data ) && ! empty( $data ) ) {
			/**
			 * Decoded cached products data.
			 *
			 * @var array|null $products
			 */
			$products = json_decode( $data, true );

			if ( $products ) {
				return rest_ensure_response( $products );
			}
		}

		$results = [];

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
			return new \WP_Error( 'rest_unknown', __( 'Error fetching products', 'web-stories' ), [ 'status' => 404 ] );
		}

		/**
		 * Shopify GraphQL API response.
		 *
		 * @var ShopifyGraphQLResponse $result
		 */
		$result = json_decode( wp_remote_retrieve_body( $response ), true );

		// TODO: Error handling.
		if ( isset( $result['errors'] ) ) {
			return new \WP_Error( 'rest_unknown', __( 'Error fetching products', 'web-stories' ), [ 'status' => 404 ] );
		}

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

			$results[] = [
				'productId'            => $product['id'],
				'productTitle'         => $product['title'],
				'productBrand'         => $product['vendor'],
				// TODO: Maybe eventually provide full price range.
				// See https://github.com/ampproject/amphtml/issues/37957.
				'productPrice'         => $product['priceRange']['minVariantPrice']['amount'],
				'productPriceCurrency' => $product['priceRange']['minVariantPrice']['currencyCode'],
				'productImages'        => $images,
				'productDetails'       => $product['description'],
				// URL is null if the resource is currently not published to the Online Store sales channel,
				// or if the shop is password-protected.
				'productUrl'           => $product_url,
			];
		}

		set_transient( $cache_key, wp_json_encode( $results ), $cache_ttl );

		return rest_ensure_response( $results );
	}


	/**
	 * Retrieves all WooCommerce products.
	 *
	 * @since 1.20.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	protected function get_items_woocommerce( $request ) {
		$results = [];

		/**
		 * Products.
		 *
		 * @var \WC_Product[] $products
		 */
		$products = wc_get_products(
			[
				'status'  => 'publish',
				'limit'   => 100,
				'orderby' => 'date',
				'order'   => 'DESC',
				's'       => $request['search'],
			]
		);

		foreach ( $products as $product ) {
			$product_image_ids = $product->get_gallery_image_ids();

			/*
			 * Warm the object cache with post and meta information for all found
			 * images to avoid making individual database calls.
			 */
			_prime_post_caches( $product_image_ids, false, true );

			$images = array_map(
				static function( $image_id ) {
					$url = wp_get_attachment_url( $image_id );
					$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );

					return [
						'url' => $url,
						'alt' => $alt,
					];
				},
				$product_image_ids
			);

			$results[] = [
				// amp-story-shopping requires non-numeric IDs.
				'productId'            => 'wc-' . $product->get_id(),
				'productTitle'         => $product->get_title(),
				'productBrand'         => '', // TODO: Figure out how to best provide that.
				'productPrice'         => $product->get_price(),
				'productPriceCurrency' => get_woocommerce_currency(),
				'productImages'        => $images,
				'aggregateRating'      => [
					'ratingValue' => $product->get_average_rating(),
					'reviewCount' => $product->get_rating_count(),
					'reviewUrl'   => $product->get_permalink(),
				],
				'productDetails'       => wp_strip_all_tags( $product->get_short_description() ),
				'productUrl'           => $product->get_permalink(),
			];
		}

		return rest_ensure_response( $results );
	}

	/**
	 * Retrieves the publisher logo's schema, conforming to JSON Schema.
	 *
	 * @since 1.20.0
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'publisher-logo',
			'type'       => 'object',
			'properties' => [
				'productId'       => [
					'description' => __( 'Product ID.', 'web-stories' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'productTitle'    => [
					'description' => __( 'Product title.', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'productBrand'    => [
					'description' => __( 'Product brand.', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'productPrice'    => [
					'description' => __( 'Product price.', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'productCurrency' => [
					'description' => __( 'Product currency.', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'productImages'   => [
					'description' => __( 'Product brand.', 'web-stories' ),
					'type'        => 'array',
					'items'       => [
						'type'       => 'object',
						'properties' => [
							'url' => [
								'description' => __( 'Product image URL', 'web-stories' ),
								'type'        => 'string',
								'context'     => [ 'view', 'edit', 'embed' ],
							],
							'alt' => [
								'description' => __( 'Product image alt text', 'web-stories' ),
								'type'        => 'string',
								'format'      => 'uri',
								'context'     => [ 'view', 'edit', 'embed' ],
							],
						],
					],
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'aggregateRating' => [
					'description' => __( 'Product rating.', 'web-stories' ),
					'type'        => 'object',
					'properties'  => [
						'ratingValue' => [
							'description' => __( 'Average rating.', 'web-stories' ),
							'type'        => 'number',
							'context'     => [ 'view', 'edit', 'embed' ],
						],
						'reviewCount' => [
							'description' => __( 'Number of reviews.', 'web-stories' ),
							'type'        => 'number',
							'context'     => [ 'view', 'edit', 'embed' ],
						],
						'reviewUrl'   => [
							'description' => __( 'Product review URL.', 'web-stories' ),
							'type'        => 'string',
							'format'      => 'uri',
							'context'     => [ 'view', 'edit', 'embed' ],
						],
					],
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'productDetails'  => [
					'description' => __( 'Product description.', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
			],
		];

		return $schema;
	}
}
