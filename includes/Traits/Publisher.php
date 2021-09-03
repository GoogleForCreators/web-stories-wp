<?php
/**
 * Trait Publisher
 *
 * @package   Google\Web_Stories\Traits
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

namespace Google\Web_Stories\Traits;

use Google\Web_Stories\Media\Image_Sizes;
use Google\Web_Stories\Settings;

/**
 * Trait Publisher
 *
 * @package Google\Web_Stories\Traits
 */
trait Publisher {
	/**
	 * Publisher logo placeholder for static content output which will be replaced server-side.
	 *
	 * @since 1.0.0
	 * @deprecated 1.1.0
	 *
	 * @return string
	 */
	public function get_publisher_logo_placeholder(): string {
		return WEBSTORIES_PLUGIN_DIR_URL . 'assets/images/fallback-wordpress-publisher-logo.png';
	}

	/**
	 * Get the publisher name.
	 *
	 * @since 1.7.0
	 *
	 * @return string Publisher Name.
	 */
	public function get_publisher_name(): string {
		$name = get_bloginfo( 'name' );
		/**
		 * Filters the publisher's name
		 *
		 * @since 1.7.0
		 *
		 * @param string $name Publisher Name.
		 */
		$name = apply_filters( 'web_stories_publisher_name', $name );

		return esc_attr( $name );
	}
}
