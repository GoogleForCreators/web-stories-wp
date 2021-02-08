<?php
/**
 * Class Core_Themes_Support
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Customizer;

/**
 * Class Core_Themes_Support.
 */
class Core_Themes_Support {

	/**
	 * Current theme
	 *
	 * @var string
	 */
	protected $template = '';

	/**
	 * Default array of core themes to add support to.
	 *
	 * @var array
	 */
	protected static $supported_themes = [
		'twentytwentyone',
		'twentytwenty',
		'twentynineteen',
		'twentyseventeen',
		'twentysixteen',
		'twentyfifteen',
		'twentyfourteen',
		'twentythirteen',
		'twentytwelve',
		'twentyeleven',
		'twentyten',
		'classic',
		'default',
	];

	/**
	 * Get list of supported core themes.
	 *
	 * @since 1.3.0
	 *
	 * @return string[] Slugs for supported themes.
	 */
	public static function get_supported_themes() {
		return self::$supported_themes;
	}

	/**
	 * Adds theme support for Web Stories.
	 *
	 * This will enable add_theme_support with predefined
	 * options supported themes.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function extend_theme_support() {
		add_theme_support( 'web-stories' );
	}

	/**
	 * Embed Webstories.
	 *
	 * Embeds web stories with default customizer settings.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function embed_web_stories() {

		if ( class_exists( 'Google\Web_Stories\Customizer' ) ) {
			$customizer = new Customizer();
			echo $customizer->render_stories(); // phpcs:ignore -- WordPress.Security.EscapeOutput.OutputNotEscaped - Escaped web stories HTML.
		}

	}

	/**
	 * Sets current theme.
	 *
	 * @since 1.3.0
	 *
	 * @return string
	 */
	public function get_current_theme() {
		return get_template();
	}

	/**
	 * Adds theme support and hook to embed the web stories.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function init() {

		$this->template = $this->get_current_theme();

		if ( ! in_array( $this->template, self::get_supported_themes(), true ) ) {
			return;
		}

		$this->extend_theme_support();
		add_action( 'wp_body_open', [ $this, 'embed_web_stories' ] );
	}
}
