<?php
/**
 * Class WooCommerce_Query
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

use Google\Web_Stories\Integrations\WooCommerce;
use Google\Web_Stories\Interfaces\Product_Query;
use WC_Query;
use WP_Error;

/**
 * Class WooCommerce_Query.
 */
class WooCommerce_Query implements Product_Query {
	/**
	 * WooCommerce instance.
	 *
	 * @var WooCommerce WooCommerce instance.
	 */
	private $woocommerce;

	/**
	 * Constructor.
	 *
	 * @param WooCommerce $woocommerce WooCommerce instance.
	 */
	public function __construct( WooCommerce $woocommerce ) {
		$this->woocommerce = $woocommerce;
	}

	/**
	 * Get products by search term.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term.
	 * @param int    $page        Number of page for paginated requests.
	 * @param int    $per_page    Number of products to be fetched.
	 * @param string $orderby     Sort collection by product attribute.
	 * @param string $order       Order sort attribute ascending or descending.
	 * @return array|WP_Error
	 */
	public function get_search( string $search_term, int $page = 1, int $per_page = 100, string $orderby = 'date', string $order = 'desc' ) {
		$status = $this->woocommerce->get_plugin_status();

		if ( ! $status['installed'] ) {
			return new WP_Error( 'rest_woocommerce_not_installed', __( 'WooCommerce is not installed.', 'web-stories' ), [ 'status' => 400 ] );
		}

		if ( ! $status['active'] ) {
			return new WP_Error( 'rest_woocommerce_not_activated', __( 'WooCommerce is not activated. Please activate it again try again.', 'web-stories' ), [ 'status' => 400 ] );
		}

		$args = [
			'status'   => 'publish',
			'page'     => $page,
			'limit'    => $per_page,
			's'        => $search_term,
			'orderby'  => $orderby,
			'order'    => $order,
			'paginate' => true,
		];
		if ( 'price' === $orderby ) {
			$wc_query = new WC_Query();
			$wc_args  = $wc_query->get_catalog_ordering_args( $orderby, strtoupper( $order ) );
			$args     = array_merge( $args, $wc_args );
		}

		/**
		 * Product query object.
		 *
		 * @var \stdClass $product_query
		 */
		$product_query = wc_get_products( $args );

		$has_next_page = ( $product_query->max_num_pages > $page );

		/**
		 * Products.
		 *
		 * @var \WC_Product[] $wc_products
		 */
		$wc_products = $product_query->products;

		$product_image_ids = [];
		foreach ( $wc_products as $product ) {
			$product_image_ids[] = $this->get_product_image_ids( $product );
		}
		$products_image_ids = array_merge( [], ...$product_image_ids );

		/**
		 * Warm the object cache with post and meta information for all found
		 * images to avoid making individual database calls.
		 */
		_prime_post_caches( $products_image_ids, false, true );

		$products = [];
		foreach ( $wc_products as $product ) {

			$images = array_map(
				[ $this, 'get_product_image' ],
				$this->get_product_image_ids( $product )
			);

			$product_object = new Product(
				[
					// amp-story-shopping requires non-numeric IDs.
					'id'               => 'wc-' . $product->get_id(),
					'title'            => $product->get_title(),
					'brand'            => '', // TODO: Figure out how to best provide that.
					'price'            => (float) $product->get_price(),
					'price_currency'   => get_woocommerce_currency(),
					'images'           => $images,
					'aggregate_rating' => [
						'rating_value' => (float) $product->get_average_rating(),
						'review_count' => $product->get_rating_count(),
						'review_url'   => $product->get_permalink(),
					],
					'details'          => wp_strip_all_tags( $product->get_short_description() ),
					'url'              => $product->get_permalink(),
				]
			);

			$products[] = $product_object;
		}

		return compact( 'products', 'has_next_page' );
	}

	/**
	 * Get all product image ids (feature image + gallery_images).
	 *
	 * @since 1.21.0
	 *
	 * @param \WC_Product $product Product.
	 * @return array
	 */
	protected function get_product_image_ids( $product ): array {
		$product_image_ids = $product->get_gallery_image_ids();
		array_unshift( $product_image_ids, $product->get_image_id() );
		$product_image_ids = array_map( 'absint', $product_image_ids );
		return array_unique( array_filter( $product_image_ids ) );
	}

	/**
	 * Get product image, url and alt.
	 *
	 * @since 1.21.0
	 *
	 * @param int $image_id Attachment ID.
	 * @return array
	 */
	protected function get_product_image( int $image_id ): array {
		$url = wp_get_attachment_image_url( $image_id, 'large' );

		if ( ! $url ) {
			return [];
		}

		$alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );

		if ( empty( $alt ) ) {
			$alt = '';
		}

		return compact( 'url', 'alt' );
	}
}
