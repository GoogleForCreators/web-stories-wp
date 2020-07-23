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

/**
 * Trait Publisher
 *
 * @package Google\Web_Stories\Traits
 */
trait Publisher {
	/**
	 * Publisher logo placeholder for static content output which will be replaced server-side.
	 *
	 * Uses a fallback logo to always create valid AMP in FE.
	 *
	 * @return string
	 */
	public function get_publisher_logo_placeholder() {
		return WEBSTORIES_PLUGIN_DIR_URL . 'assets/images/fallback-wordpress-publisher-logo.png';
	}

	/**
	 * Returns the publisher data.
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
	 * Gets a valid publisher logo URL. Loops through sizes and looks for a square image.
	 *
	 * @param integer $image_id Attachment ID.
	 *
	 * @return string|false Either the URL or false if error.
	 */
	private function get_valid_publisher_image( $image_id ) {
		$logo_image_url = false;

		// Get metadata for finding a square image.
		$metadata = wp_get_attachment_metadata( $image_id );
		if ( empty( $metadata ) ) {
			return $logo_image_url;
		}
		// First lets check if the image is square by default.
		$fullsize_img = wp_get_attachment_image_src( $image_id, 'full', false );
		if ( $metadata['width'] === $metadata['height'] && is_array( $fullsize_img ) ) {
			return array_shift( $fullsize_img );
		}

		if ( empty( $metadata['sizes'] ) ) {
			return $logo_image_url;
		}

		// Loop through other size to find a square image.
		foreach ( $metadata['sizes'] as $size ) {
			if ( $size['width'] === $size['height'] && $size['width'] >= 96 ) {
				$logo_img = wp_get_attachment_image_src( $image_id, [ $size['width'], $size['height'] ], false );
				if ( is_array( $logo_img ) ) {
					return array_shift( $logo_img );
				}
			}
		}

		// If a square image was not found, return the full size nevertheless,
		// the editor should take care of warning about incorrect size.
		return is_array( $fullsize_img ) ? array_shift( $fullsize_img ) : false;
	}

	/**
	 * Helper function to get option name.
	 *
	 * @return string
	 */
	public function get_publisher_logo_option_name() {
		return 'web_stories_publisher_logos';
	}

	/**
	 * Helper function to get option default.
	 *
	 * @return array
	 */
	public function get_publisher_logo_option_default() {
		return [
			'active' => 0,
			'all'    => [],
		];
	}

	/**
	 * Get the publisher logo.
	 *
	 * @link https://developers.google.com/search/docs/data-types/article#logo-guidelines
	 * @link https://amp.dev/documentation/components/amp-story/#publisher-logo-src-guidelines
	 *
	 * @return string Publisher logo image URL. WordPress logo if no site icon or custom logo defined, and no logo provided via 'amp_site_icon_url' filter.
	 */
	public function get_publisher_logo() {
		$logo_image_url = null;

		$publisher_logo_settings = get_option( $this->get_publisher_logo_option_name(), $this->get_publisher_logo_option_default() );
		$has_publisher_logo      = ! empty( $publisher_logo_settings['active'] );
		if ( $has_publisher_logo ) {
			$publisher_logo_id = absint( $publisher_logo_settings['active'] );
			$logo_image_url    = $this->get_valid_publisher_image( $publisher_logo_id );
		}

		// @todo Once we are enforcing setting publisher logo in the editor, we shouldn't need the fallback options.
		// Currently, it's marked as required but that's not actually enforced.

		// Finding fallback image.
		$custom_logo_id = get_theme_mod( 'custom_logo' );
		if ( empty( $logo_image_url ) && has_custom_logo() && $custom_logo_id ) {
			$logo_image_url = $this->get_valid_publisher_image( $custom_logo_id );
		}

		// Try Site Icon, though it is not ideal for non-Story because it should be square.
		$site_icon_id = get_option( 'site_icon' );
		if ( empty( $logo_image_url ) && $site_icon_id ) {
			$logo_image_url = $this->get_valid_publisher_image( $site_icon_id );
		}

		// Fallback to serving the WordPress logo.
		$placeholder = $this->get_publisher_logo_placeholder();
		if ( empty( $logo_image_url ) ) {
			$logo_image_url = $placeholder;
		}

		/**
		 * Filters the publisher's logo.
		 *
		 * This should point to a square image.
		 *
		 * @param string $logo_image_url URL to the publisher's logo.
		 * @param string $placeholder    URL to the placeholder logo.
		 */
		return apply_filters( 'web_stories_publisher_logo', $logo_image_url, $placeholder );
	}
}
