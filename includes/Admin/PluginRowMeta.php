<?php
/**
 * PluginRowMeta class.
 *
 * Updates the plugin row meta for the plugin.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Service_Base;

/**
 * Updates the plugin row meta for the plugin.
 */
class PluginRowMeta extends Service_Base {

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.6.0
	 */
	public function register(): void {
		add_filter( 'plugin_row_meta', [ $this, 'get_plugin_row_meta' ], 10, 2 );
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'admin_init';
	}

	/**
	 * Updates the plugin row meta with links to review plugin and get support.
	 *
	 * @since 1.6.0
	 *
	 * @param string[]|mixed $meta        An array of the plugin's metadata, including the version, author, author URI,
	 *                              and plugin URI.
	 * @param string         $plugin_file Path to the plugin file relative to the plugins directory.
	 * @return string[]|mixed Plugin row meta.
	 */
	public function get_plugin_row_meta( $meta, $plugin_file ) {
		if ( plugin_basename( WEBSTORIES_PLUGIN_FILE ) !== $plugin_file ) {
			return $meta;
		}
		if ( ! \is_array( $meta ) ) {
			return $meta;
		}
		$additional_meta = [
			'<a href="https://wordpress.org/support/plugin/web-stories/" target="_blank">' . esc_html__( 'Contact support', 'web-stories' ) . '</a>',
			'<a href="https://wordpress.org/support/plugin/web-stories/reviews/#new-post" target="_blank">' . esc_html__( 'Leave review', 'web-stories' ) . '</a>',
		];

		return array_merge( $meta, $additional_meta );
	}
}
