<?php
/**
 * Uninstaller class.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\PluginUninstallAware;

/**
 * Uninstaller class.
 */
class Uninstaller extends Plugin {

	protected const PREFIX = 'web_stories\_%';

	/**
	 * Delete network and site option.
	 *
	 * @since 1.26.0
	 */
	public function remove_options(): void {
		if ( ! is_multisite() ) {
			$this->delete_options();
		}
		$this->delete_site_options();
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

			$this->delete_options();
		}

		restore_current_blog();
	}

	/**
	 * Deletes options and transients.
	 *
	 * @since 1.26.0
	 */
	protected function delete_options(): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$options = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
				self::PREFIX
			)
		);

		if ( ! empty( $options ) ) {
			array_map( 'delete_option', (array) $options );
		}


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
	 * Deletes options and transients on multisite.
	 *
	 * @since 1.26.0
	 */
	protected function delete_site_options(): void {
		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$options = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM $wpdb->sitemeta WHERE meta_key LIKE %s",
				self::PREFIX
			)
		);

		if ( ! empty( $options ) ) {
			foreach ( (array) $options as $option ) {
				delete_network_option( $option->site_id, $option->meta_key );
			}
		}

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

	/**
	 * Schedule the potential registration of a single service.
	 *
	 * This takes into account whether the service registration needs to be delayed or not.
	 *
	 * @since 1.26.0
	 *
	 * @param string       $id    ID of the service to register.
	 * @param class-string $class Class of the service to register.
	 */
	protected function schedule_potential_service_registration( $id, $class ): void {
		$this->maybe_register_service( $id, $class );
	}

	/**
	 * Register a single service, provided its conditions are met.
	 *
	 * @since 1.26.0
	 *
	 * @param string       $id    ID of the service to register.
	 * @param class-string $class Class of the service to register.
	 */
	protected function maybe_register_service( string $id, $class ): void {
		// Ensure we don't register the same service more than once.
		if ( $this->service_container->has( $id ) ) {
			return;
		}

		if ( ! is_a( $class, PluginUninstallAware::class, true ) ) {
			return;
		}

		$service = $this->instantiate_service( $class );

		$this->service_container->put( $id, $service );
	}
}
