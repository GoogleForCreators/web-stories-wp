<?php
/**
 * Interface Product_Query
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

declare(strict_types = 1);

namespace Google\Web_Stories\Interfaces;

use Google\Web_Stories\Shopping\Product;
use WP_Error;

/**
 * Interface Product_Query.
 */
interface Product_Query {
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
	 * @return array{products: array<Product>, has_next_page: bool}|WP_Error
	 */
	public function get_search( string $search_term, int $page = 1, int $per_page = 100, string $orderby = 'date', string $order = 'desc' );
}
