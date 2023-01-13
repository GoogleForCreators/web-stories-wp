<?php
/**
 * Remove Transients class.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Infrastructure\Service;

/**
 * Remove Transients class.
 */
class Remove_Transients implements Service, PluginUninstallAware {
	protected const PREFIX = 'web_stories\_%';

	/**
	 * Delete network and site transients.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		if ( wp_using_ext_object_cache() ) {
			return;
		}

		if ( ! is_multisite() ) {
			$this->delete_transients();
			return;
		}

		$this->delete_network_transients();
		$site_ids = get_sites(
			[
				'fields'                 => 'ids',
				'number'                 => 0,
				'update_site_cache'      => false,
				'update_site_meta_cache' => false,
			]
		);

		foreach ( $site_ids as $site_id ) {
			// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.switch_to_blog_switch_to_blog
			switch_to_blog( $site_id );

			$this->delete_transients();
		}

		restore_current_blog();
	}

	/**
	 * Delete transients.
	 *
	 * @since 1.26.0
	 */
	protected function delete_transients(): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$transients = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
				'_transient_' . self::PREFIX,
				'_transient_timeout_' . self::PREFIX
			)
		);

		if ( ! empty( $transients ) ) {
			array_map( 'delete_option', (array) $transients );
		}
	}

	/**
	 * Delete transients on multisite.
	 *
	 * @since 1.26.0
	 */
	protected function delete_network_transients(): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$transients = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT meta_key FROM $wpdb->sitemeta WHERE meta_key LIKE %s OR meta_key LIKE %s",
				'_site_transient_' . self::PREFIX,
				'_site_transient_timeout_' . self::PREFIX
			)
		);

		if ( ! empty( $transients ) ) {
			array_map( 'delete_site_option', (array) $transients );
		}
	}
}
