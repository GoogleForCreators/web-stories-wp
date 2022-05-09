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

namespace Google\Web_Stories\Tests\Integration\Vendors;

use Google\Web_Stories\Interfaces\Product_Query;
use Google\Web_Stories\Product\Product;
use WP_Error;

/**
 *
 */
class Mock_Vendor implements Product_Query {

	/**
	 * Get products by search term.
	 *
	 * @since 1.21.0
	 *
	 * @param string $search_term Search term.
	 * @return Product[]|WP_Error
	 */
	public function get_search( string $search_term ) {
		$products = [];
		for ( $x = 0; $x < 10; $x ++ ) {
			$products[] = new Product(
				[
					'id'             => wp_unique_id(),
					'title'          => 'Product ' . $x,
					'brand'          => 'Google',
					'price'          => 1.00 * $x,
					'price_currency' => 'USD',
					'images'         => [],
					'details'        => 'Description',
					'url'            => 'http://www.google.com/product/' . $x,
				]
			);
		}

		return $products;
	}
}
