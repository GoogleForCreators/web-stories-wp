<?php
/**
 * Class Woocommerce_Query
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
use Google\Web_Stories\Model\Image;
use Google\Web_Stories\Model\Product;
use Google\Web_Stories\Model\Rating;
use WP_Error;

/**
 * Class Woocommerce_Query.
 */
class Woocommerce_Query implements Product_Query {
	/**
	 * Get products by search term.
	 *
	 * @since 1.20.0
	 *
	 * @param string $search_term Search term.
	 * @return Product[]|WP_Error
	 */
	public function get_search( string $search_term ) {

		if ( ! function_exists( 'wc_get_products' ) ) {
			return new WP_Error( 'rest_unknown', __( 'Woocommerce is not installed.', 'web-stories' ), [ 'status' => 400 ] );
		}

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
				's'       => $search_term,
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

					return new Image(
						[
							'url' => $url,
							'alt' => $alt,
						]
					);
				},
				$product_image_ids
			);

			$rating = new Rating(
				[
					'value' => $product->get_average_rating(),
					'count' => $product->get_rating_count(),
					'url'   => $product->get_permalink(),
				]
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
					'aggregate_rating' => $rating,
					'details'          => wp_strip_all_tags( $product->get_short_description() ),
					'url'              => $product->get_permalink(),
				]
			);

			$results[] = $product_object;
		}

		return $results;
	}
}
