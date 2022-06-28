<?php
/**
 * Class ShortPixel_Patch.
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

namespace Google\Web_Stories\Admin;

/**
 * Class ShortPixel_Patch
 */
class ShortPixel_Patch implements Conditional, Service, Registerable {
	/**
	 * Check whether the conditional object is currently needed.
	 *
	 * @since 1.10.0
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	public static function is_needed(): bool {
		return is_admin();
	}

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.10.0
	 */
	public function register(): void {
		// add_filter( 'shortpixel_image_urls', [ $this, 'image_urls' ], 10, 2 );
	}

	/**
	 * Ensures page template urls bypass optimisation.
	 *
	 * @since 1.22.0
	 *
	 * @param string[] $urls  Urls that will be sent to optimisation.
	 * @param int $post_id Post ID.
	 * @return string[] The filtered Urls.
	 */
	public function image_urls( $urls, $post_id ) {
		return $urls;
	}
}
