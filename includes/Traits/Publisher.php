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

use Google\Web_Stories\Media;
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
	public function get_publisher_logo_placeholder() {
		return WEBSTORIES_PLUGIN_DIR_URL . 'assets/images/fallback-wordpress-publisher-logo.png';
	}

	/**
	 * Returns the publisher data.
	 *
	 * @since 1.0.0
	 *
	 * @return array Publisher name and logo.
	 */
	public function get_publisher_data() {
		$publisher      = get_bloginfo( 'name' );
		$publisher_logo = $this->get_publisher_logo();

		return [
			'name' => $publisher,
			'logo' => $publisher_logo,
		];
	}

	/**
	 * Get the publisher logo.
	 *
	 * @since 1.0.0
	 *
	 * @link https://developers.google.com/search/docs/data-types/article#logo-guidelines
	 * @link https://amp.dev/documentation/components/amp-story/#publisher-logo-src-guidelines
	 *
	 * @return string|null Publisher logo image URL, or null if no publisher logos are available.
	 */
	public function get_publisher_logo() {
		$logo_image_url = null;

		$active_publisher_logo = absint( get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO ) );

		if ( $active_publisher_logo ) {
			$logo_image_url = wp_get_attachment_image_url( $active_publisher_logo, Media::PUBLISHER_LOGO_IMAGE_SIZE );

			if ( ! $logo_image_url ) {
				$logo_image_url = null;
			}
		}

		$placeholder = $this->get_publisher_logo_placeholder();

		/**
		 * Filters the publisher's logo.
		 *
		 * This should point to a square image.
		 *
		 * @since 1.0.0
		 * @since 1.1.0 The $placeholder parameter was deprecated.
		 *
		 * @param string|null $logo_image_url URL to the publisher's logo if set.
		 * @param string      $placeholder    Deprecated.
		 */
		return apply_filters( 'web_stories_publisher_logo', $logo_image_url, $placeholder );
	}
}
