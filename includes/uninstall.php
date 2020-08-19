<?php
/**
 * Uninstall helpers.
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

namespace Google\Web_Stories;

/**
 * Deletes options and transients.
 *
 * @return void
 */
function delete_options() {
	global $wpdb;

	$prefix = 'web_stories\_%';

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$options = $wpdb->get_col(
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
			$prefix
		)
	);

	if ( ! empty( $options ) ) {
		array_map( 'delete_option', (array) $options );
	}


	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$transients = $wpdb->get_col(
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
			'_transient_' . $prefix,
			'_transient_timeout_' . $prefix
		)
	);

	if ( ! empty( $transients ) ) {
		array_map( 'delete_option', (array) $transients );
	}
}

/**
 * Deletes options and transients on multisite.
 *
 * @return void
 */
function delete_site_options() {
	global $wpdb;

	$prefix = 'web_stories\_%';

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$options = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT * FROM $wpdb->sitemeta WHERE meta_key LIKE %s",
			$prefix
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
			'_site_transient_' . $prefix,
			'_site_transient_timeout_' . $prefix
		)
	);

	if ( ! empty( $transients ) ) {
		array_map( 'delete_site_option', (array) $transients );
	}
}

/**
 * Deletes all associated post meta data.
 *
 * @return void
 */
function delete_stories_post_meta() {
	delete_post_meta_by_key( 'web_stories_is_poster' );
	delete_post_meta_by_key( 'web_stories_poster_id' );
}

/**
 * Deletes all stories & templates.
 *
 * @return void
 */
function delete_posts() {
	$cpt_posts = get_posts(
		[
			'fields'           => 'ids',
			'suppress_filters' => false,
			'post_type'        => [ Story_Post_Type::POST_TYPE_SLUG, Template_Post_Type::POST_TYPE_SLUG ],
			'posts_per_page'   => - 1,
		]
	);

	foreach ( $cpt_posts as $post_id ) {
		wp_delete_post( (int) $post_id, true );
	}
}
/**
 * Remove user capabilities.
 *
 * @return void
 */
function remove_caps() {
	$story_post_type = new Story_Post_Type( new Experiments() );
	$story_post_type->remove_caps_from_roles();
}

/**
 * Delete all data on a site.
 *
 * @return void
 */
function delete_site() {
	delete_options();
	delete_posts();
	delete_stories_post_meta();
	remove_caps();
}
