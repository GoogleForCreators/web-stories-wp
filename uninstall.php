<?php
/**
 * Plugin uninstall handler.
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

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	return;
}


$erase = (bool) get_option( \Google\Web_Stories\Settings::SETTING_NAME_DATA_REMOVAL );

/**
 * Filters whether data should be erased when uninstalling the plugin.
 *
 * @since 1.0.0
 *
 * @param bool $erase Whether to erase data. Default false.
 */
$erase = (bool) apply_filters( 'web_stories_erase_data_on_uninstall', $erase );

if ( false === $erase ) {
	return;
}

require_once WEBSTORIES_PLUGIN_DIR_PATH . '/includes/uninstall.php';

if ( is_multisite() ) {
	\Google\Web_Stories\delete_site_options();
	$site_ids = get_sites(
		[
			'fields'                 => 'ids',
			'number'                 => '',
			'update_site_cache'      => false,
			'update_site_meta_cache' => false,
		]
	);

	foreach ( $site_ids as $site_id ) {
		// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.switch_to_blog_switch_to_blog
		switch_to_blog( $site_id );

		\Google\Web_Stories\delete_site();
	}

	restore_current_blog();
} else {
	\Google\Web_Stories\delete_site();
}
\Google\Web_Stories\delete_stories_user_meta();
