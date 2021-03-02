<?php
/**
 * Trait AMP
 *
 * @package   Google\Web_Stories\Traits
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2021 Google LLC
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


namespace Google\Web_Stories\Traits;

use Google\Web_Stories\Story_Post_Type;

/**
 * Trait Amp
 *
 * @package Google\Web_Stories\Traits
 */
trait Amp {

	/**
	 * Determine whether the current response being served as AMP.
	 *
	 * @since 1.5.0
	 *
	 * @return bool Whether it is singular story post (and thus an AMP endpoint).
	 */
	function is_amp() {
		if ( is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return true;
		}

		// Check for `amp_is_request()` first since `is_amp_endpoint()` is deprecated.
		if ( function_exists( '\amp_is_request' ) ) {
			return amp_is_request();
		}

		if ( function_exists( '\is_amp_endpoint' ) ) {
			return is_amp_endpoint();
		}

		return false;
	}
}
