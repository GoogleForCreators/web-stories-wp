<?php
/**
 * Uninstall helpers.
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

namespace Google\Web_Stories;

const PREFIX = 'web_stories\_%';

/**
 * Deletes options and transients.
 *
 * @since 1.0.0
 */
function delete_options(): void {
	global $wpdb;

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$options = $wpdb->get_col(
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
			PREFIX
		)
	);

	if ( ! empty( $options ) ) {
		array_map( 'delete_option', (array) $options );
	}


	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$transients = $wpdb->get_col(
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
			'_transient_' . PREFIX,
			'_transient_timeout_' . PREFIX
		)
	);

	if ( ! empty( $transients ) ) {
		array_map( 'delete_option', (array) $transients );
	}
}

/**
 * Deletes options and transients on multisite.
 *
 * @since 1.0.0
 */
function delete_site_options(): void {
	global $wpdb;

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$options = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT * FROM $wpdb->sitemeta WHERE meta_key LIKE %s",
			PREFIX
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
			'_site_transient_' . PREFIX,
			'_site_transient_timeout_' . PREFIX
		)
	);

	if ( ! empty( $transients ) ) {
		array_map( 'delete_site_option', (array) $transients );
	}
}
