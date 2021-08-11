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

use Google\Web_Stories\User\Preferences;
use Google\Web_Stories\Media\Media_Source_Taxonomy;
use Google\Web_Stories\Media\Video\Optimization;
use Google\Web_Stories\Media\Video\Muting;
use Google\Web_Stories\Media\Video\Poster;

/**
 * Deletes options and transients.
 *
 * @since 1.0.0
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
 * @since 1.0.0
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
 * @since 1.0.0
 *
 * @return void
 */
function delete_stories_post_meta() {
	delete_post_meta_by_key( Poster::POSTER_POST_META_KEY );
	delete_post_meta_by_key( Poster::POSTER_ID_POST_META_KEY );
	delete_post_meta_by_key( Optimization::OPTIMIZED_ID_POST_META_KEY );
	delete_post_meta_by_key( Muting::MUTED_ID_POST_META_KEY );
	delete_post_meta_by_key( Muting::IS_MUTED_POST_META_KEY );
}

/**
 * Deletes all associated user meta data.
 *
 * @since 1.3.0
 *
 * @return void
 */
function delete_stories_user_meta() {
	delete_metadata( 'user', 0, Preferences::OPTIN_META_KEY, '', true );
	delete_metadata( 'user', 0, Preferences::ONBOARDING_META_KEY, '', true );
	delete_metadata( 'user', 0, Preferences::MEDIA_OPTIMIZATION_META_KEY, '', true );
}

/**
 * Deletes all stories & templates.
 *
 * @since 1.0.0
 *
 * @return void
 */
function delete_posts() {
	// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.get_posts_get_posts -- False positive.
	$cpt_posts = get_posts(
		[
			'fields'           => 'ids',
			'suppress_filters' => false,
			'post_type'        => [
				Story_Post_Type::POST_TYPE_SLUG,
				Template_Post_Type::POST_TYPE_SLUG,
				Page_Template_Post_Type::POST_TYPE_SLUG,
			],
			'posts_per_page'   => - 1,
		]
	);

	foreach ( $cpt_posts as $post_id ) {
		wp_delete_post( (int) $post_id, true );
	}
}

/**
 * Deletes all media source terms.
 *
 * @since 1.10.0
 *
 * @return void
 */
function delete_terms() {
	$taxonomy = Media_Source_Taxonomy::TAXONOMY_SLUG;
	$term_ids = get_terms(
		[
			'taxonomy'   => $taxonomy,
			'hide_empty' => false,
			'fields'     => 'ids',
		]
	);

	if ( empty( $term_ids ) || ! is_array( $term_ids ) ) {
		return;
	}

	foreach ( $term_ids as $term_id ) {
		wp_delete_term( $term_id, $taxonomy );
	}
}

/**
 * Remove user capabilities.
 *
 * @since 1.0.0
 *
 * @return void
 */
function remove_caps() {
	$capabilities = Services::get( 'user.capabilities' );
	$capabilities->remove_caps_from_roles();
}

/**
 * Delete all data on a site.
 *
 * @since 1.0.0
 *
 * @return void
 */
function delete_site() {
	delete_options();
	delete_posts();
	delete_terms();
	delete_stories_post_meta();
	remove_caps();
}
