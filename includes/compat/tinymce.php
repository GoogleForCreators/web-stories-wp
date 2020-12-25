<?php
/**
 * TinyMCE functions for classic editor support.
 *
 * @package Google\Web_Stories
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

namespace Google\Web_Stories;

/**
 * Add web stories button in TinyMCE editor.
 *
 * @param array $buttons Array of TinyMCE buttons.
 *
 * @return array
 */
function tinymce_web_stories_button( array $buttons ) {
	array_push( $buttons, 'web_stories' );

	return $buttons;
}

add_filter( 'mce_buttons', __NAMESPACE__ . '\tinymce_web_stories_button' );

/**
 * Register web stories plugin for tinycemce editor.
 *
 * @param array $plugins Array of TinyMCE plugin scripts.
 *
 * @return array
 */
function web_stories_mce_plugin( array $plugins ) {
	$plugins['web_stories'] = trailingslashit( WEBSTORIES_PLUGIN_DIR_URL ) . 'assets/js/web-stories-button.js';

	return $plugins;
}

add_filter( 'mce_external_plugins', __NAMESPACE__ . '\web_stories_mce_plugin' );

/**
 * Enqueue scripts related to tinymce button for web stories.
 *
 * @return void
 */
function web_stories_tinymce_scripts() {
	if ( is_tinymce_editor() ) {

		wp_enqueue_style(
			'web-stories-mce-components',
			trailingslashit( WEBSTORIES_ASSETS_URL ) . 'css/web-stories-button.css',
			[],
			WEBSTORIES_VERSION
		);
	}
}

add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\web_stories_tinymce_scripts' );

/**
 * Root element for tinymce editor.
 * This is useful for performing some react operations.
 *
 * @return void
 */
function web_stories_tinymce_root_element() {
	if ( is_tinymce_editor() ) {
		echo '<div id="web-stories-tinymce"></div>';
	}
}

add_action( 'admin_footer', __NAMESPACE__ . '\web_stories_tinymce_root_element' );

/**
 * Check if current screen is TinyMCE editor.
 *
 * @return bool
 */
function is_tinymce_editor() {
	global $current_screen;

	if ( ( $current_screen instanceof \WP_Screen ) &&
	property_exists( $current_screen, 'is_block_editor' ) &&
	true === (bool) $current_screen->is_block_editor
	) {
		return true;
	}

	return true;
}
