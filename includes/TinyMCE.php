<?php
/**
 * TinyMCE Class.
 *
 * Necessary operations for classic editor compatibility.
 *
 * @package   Google\Web_Stories
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

namespace Google\Web_Stories;

use Google\Web_Stories\Traits\Assets;

/**
 * Class TinyMCE
 *
 * @package Google\Web_Stories
 */
class TinyMCE {

	use Assets;

	/**
	 * Initialization actions.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function init() {
		if ( $this->is_block_editor() ) {
			return;
		}

		add_filter( 'mce_buttons', [ $this, 'tinymce_web_stories_button' ] );
		add_filter( 'mce_external_plugins', [ $this, 'web_stories_mce_plugin' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'web_stories_tinymce_scripts' ] );
		add_action( 'admin_footer', [ $this, 'web_stories_tinymce_root_element' ] );
	}

	/**
	 * Add web stories button in TinyMCE editor.
	 *
	 * @since 1.5.0
	 *
	 * @param array $buttons Array of TinyMCE buttons.
	 *
	 * @return array
	 */
	public function tinymce_web_stories_button( array $buttons ) {
		$buttons[] = 'web_stories';

		return $buttons;
	}

	/**
	 * Register web stories plugin for tinycemce editor.
	 *
	 * @since 1.5.0
	 *
	 * @param array $plugins Array of TinyMCE plugin scripts.
	 *
	 * @return array
	 */
	public function web_stories_mce_plugin( array $plugins ) {

		$plugins['web_stories'] = trailingslashit( WEBSTORIES_PLUGIN_DIR_URL ) . 'assets/js/tinymce-button.js';

		return $plugins;
	}

	/**
	 * Enqueue scripts related to tinymce button for web stories.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function web_stories_tinymce_scripts() {
		$this->enqueue_style( 'wp-components' );

		// Can't use enqueue_script() because the script needs to be loaded via the mce_external_plugins filter.
		$asset = $this->get_asset_metadata( 'tinymce-button' );
		foreach ( $asset['dependencies'] as $script ) {
			wp_enqueue_script( $script );
		}
	}

	/**
	 * Root element for tinymce editor.
	 * This is useful for performing some react operations.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function web_stories_tinymce_root_element() {
		?>
		<div id="web-stories-tinymce"></div>
		<?php
	}

	/**
	 * Check if current screen is block editor.
	 *
	 * @since 1.5.0
	 *
	 * @return bool
	 */
	private function is_block_editor() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( ( $screen instanceof \WP_Screen ) ) {
			return $screen->is_block_editor();
		}

		return false;
	}
}
