<?php
/**
 * Class Core_Themes_Support
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

declare(strict_types = 1);

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Admin\Customizer;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Service_Base;
use function Google\Web_Stories\render_theme_stories;

/**
 * Class Core_Themes_Support.
 */
class Core_Themes_Support extends Service_Base {

	/**
	 * Default array of core themes to add support to.
	 *
	 * @var string[]
	 */
	protected static array $supported_themes = [
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
	];

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private Assets $assets;

	/**
	 * Core theme supports constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Assets $assets Assets instance.
	 */
	public function __construct( Assets $assets ) {
		$this->assets = $assets;
	}

	/**
	 * Adds theme support for Web Stories.
	 *
	 * This will enable add_theme_support with predefined
	 * options supported themes.
	 *
	 * @since 1.5.0
	 */
	public function extend_theme_support(): void {
		add_theme_support( 'web-stories' );
	}

	/**
	 * Embed Webstories.
	 *
	 * Embeds web stories with default customizer settings.
	 *
	 * @since 1.5.0
	 */
	public function embed_web_stories(): void {
		$stylesheet = get_stylesheet();
		if ( is_readable( \sprintf( '%sassets/css/web-stories-theme-style-%s.css', WEBSTORIES_PLUGIN_DIR_PATH, $stylesheet ) ) ) {
			$this->assets->enqueue_style_asset( 'web-stories-theme-style-' . $stylesheet, [] );
		}
		?>
		<div class="web-stories-theme-header-section">
			<?php render_theme_stories(); ?>
		</div>
		<?php
	}

	/**
	 * Add a class if it is one of supported core themes.
	 *
	 * @since 1.5.0
	 *
	 * @param array|mixed $classes Array of body classes.
	 * @return array|mixed Updated array of classes.
	 *
	 * @template T
	 *
	 * @phpstan-return ($classes is array<T> ? array<T> : mixed)
	 */
	public function add_core_theme_classes( $classes ) {
		if ( ! \is_array( $classes ) ) {
			return $classes;
		}
		$classes[] = 'has-web-stories';

		return $classes;
	}

	/**
	 * Adds theme support and hook to embed the web stories.
	 *
	 * @since 1.5.0
	 */
	public function register(): void {
		if ( ! \in_array( get_stylesheet(), self::$supported_themes, true ) ) {
			return;
		}

		$this->extend_theme_support();

		// Not using Settings::get_setting() to avoid calling rest_sanitize_value_from_schema().

		/**
		 * Customizer options.
		 *
		 * @var array<string, mixed> $options
		 */
		$options = get_option( Customizer::STORY_OPTION, [] );

		// Load theme specific styles and render function only if selected to show stories.
		if ( empty( $options['show_stories'] ) ) {
			return;
		}

		add_filter( 'body_class', [ $this, 'add_core_theme_classes' ] );
		add_action( 'wp_body_open', [ $this, 'embed_web_stories' ] );
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'wp_head';
	}
}
