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
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Stories_Renderer\Renderer;
use Google\Web_Stories\Traits\Assets;
use function Google\Web_Stories\render_theme_stories;

/**
 * Class Core_Themes_Support.
 */
class Core_Themes_Support extends Service_Base {
	use Assets;

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
	];

	/**
	 * Adds theme support for Web Stories.
	 *
	 * This will enable add_theme_support with predefined
	 * options supported themes.
	 *
	 * @since 1.5.0
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
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function embed_web_stories() {
		$stylesheet = get_stylesheet();
		if ( is_readable( sprintf( '%sassets/css/web-stories-theme-style-%s.css', WEBSTORIES_PLUGIN_DIR_PATH, $stylesheet ) ) ) {
			$this->enqueue_style( 'web-stories-theme-style-' . $stylesheet, [ Renderer::STYLE_HANDLE ] );
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
	 * @param array $classes Array of body classes.
	 *
	 * @return array Updated array of classes.
	 */
	public function add_core_theme_classes( $classes ) {

		$classes[] = 'has-web-stories';

		return $classes;
	}

	/**
	 * Adds theme support and hook to embed the web stories.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function register() {

		if ( ! in_array( get_stylesheet(), self::$supported_themes, true ) ) {
			return;
		}

		$this->extend_theme_support();

		$options = get_option( Customizer::STORY_OPTION );

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
	 * @return string Registration action to use.
	 */
	public static function get_registration_action() {
		return 'after_setup_theme';
	}
}
