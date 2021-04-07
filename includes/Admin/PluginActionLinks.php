<?php
/**
 * PluginActionLinks class.
 *
 * Updates the plugin action links for the plugin.
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Service_Base;

/**
 * Updates the plugin action links for the plugin.
 */
class PluginActionLinks extends Service_Base {
	/**
	 * Runs on instantiation.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function register() {
		$basename = plugin_basename( WEBSTORIES_PLUGIN_FILE );
		add_filter( 'plugin_action_links_' . $basename, [ $this, 'action_links' ] );
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action() {
		return 'admin_init';
	}

	/**
	 * Add action link to plugin settings page.
	 *
	 * @since 1.6.0
	 *
	 * @param  array $links Plugin action links.
	 *
	 * @return array
	 */
	public function action_links( $links ) {
		$slug    = sprintf( 'edit.php?post_type=%s&page=stories-dashboard#/editor-settings', Story_Post_Type::POST_TYPE_SLUG );
		$url     = get_admin_url( null, $slug );
		$links[] = sprintf(
			'<a href="%s">%s</a>',
			esc_url( $url ),
			esc_html__( 'Settings', 'web-stories' )
		);

		return $links;
	}
}
