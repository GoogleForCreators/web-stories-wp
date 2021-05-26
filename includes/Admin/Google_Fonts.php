<?php
/**
 * Class Google_Fonts.
 *
 * Registers Google fonts for admin screens.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Infrastructure\Conditional;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use WP_Styles;

/**
 * Class Google_Fonts
 *
 * Enqueue Google Fonts stylesheet.
 *
 * @package Google\Web_Stories\Admin
 */
class Google_Fonts implements Conditional, Service, Registerable {
	/**
	 * Web stories font handle.
	 *
	 * @var string
	 */
	const HANDLE = 'web-stories-fonts';

	/**
	 * Check whether the conditional object is currently needed.
	 *
	 * @since 1.8.0
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	public static function is_needed() {
		return is_admin() && ! wp_doing_ajax();
	}

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.8.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'wp_default_styles', [ $this, 'register_style' ] );
	}

	/**
	 * Registers the google font style.
	 *
	 * @since 1.8.0
	 *
	 * @param WP_Styles $wp_styles WP_Styles instance.
	 *
	 * @return void
	 */
	public function register_style( WP_Styles $wp_styles ) {
		// PHPCS ignore reason: WP will strip multiple `family` args from the Google fonts URL while adding the version string,
		// so we need to avoid specifying a version at all.
		$wp_styles->add(
			self::HANDLE,
			'https://fonts.googleapis.com/css?family=Google+Sans|Google+Sans:b|Google+Sans:500&display=swap',
			[],
			WEBSTORIES_VERSION
		);
	}
}
