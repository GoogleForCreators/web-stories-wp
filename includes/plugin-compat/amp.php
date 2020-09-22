<?php
/**
 * AMP plugin compatibility functionality.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2020 Google LLC
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

use Google\Web_Stories\Story_Post_Type;

if ( ! function_exists( '\is_amp_endpoint' ) ) {
	/**
	 * Determine whether the current response being served as AMP.
	 *
	 * Polyfill to ensure compatibility with plugins checking for AMP
	 * when the AMP plugin itself is not available.
	 *
	 * @since 1.0.0
	 *
	 * @return bool Whether it is singular story post (and thus an AMP endpoint).
	 */
	function is_amp_endpoint() {
		return is_singular( Story_Post_Type::POST_TYPE_SLUG );
	}
}

if ( ! function_exists( '\amp_is_request' ) ) {
	/**
	 * Determine whether the current response being served as AMP.
	 *
	 * Polyfill to ensure compatibility with plugins checking for AMP
	 * when the AMP plugin itself is not available.
	 *
	 * @since 1.0.0
	 *
	 * @return bool Whether it is singular story post (and thus an AMP endpoint).
	 */
	function amp_is_request() {
		return is_amp_endpoint();
	}
}
