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

namespace Google\Web_Stories\Interfaces;

use Google\Web_Stories\Model\Product;
use WP_Error;

/**
 * Interface Product_Query.
 */
interface Product_Query {
	/**
	 * Get results.
	 *
	 * @since 1.20.0
	 *
	 * @return Product[]
	 */
	public function get_results(): array;

	/**
	 * Set results.
	 *
	 * @since 1.20.0
	 *
	 * @param Product[] $results Array of Products.
	 */
	public function set_results( array $results ): void;

	/**
	 * Get products by search term.
	 *
	 * @since 1.20.0
	 *
	 * @param string $search_term Search term.
	 * @return void|WP_Error
	 */
	public function do_search( string $search_term );
}
