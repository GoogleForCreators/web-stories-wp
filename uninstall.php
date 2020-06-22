<?php
/**
 * Plugin uninstall handler.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Template_Post_Type;

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

/**
 * Filters whether data should be erased when uninstalling the plugin.
 *
 * @param bool $erase Whether to erase data. Default false.
 */
$erase = (bool) apply_filters( 'web_stories_erase_data_on_uninstall', false );

if ( false === $erase ) {
	return;
}

global $wpdb;

$prefix = 'web_stories\_%';

// Delete options and transients.
// phpcs:ignore WordPress.DB.DirectDatabaseQuery
$options = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
		$prefix
	),
	ARRAY_N
);

if ( ! empty( $options ) ) {
	array_map( 'delete_option', (array) $options );
}

// phpcs:ignore WordPress.DB.DirectDatabaseQuery
$transients = $wpdb->get_results(
	$wpdb->prepare(
		"SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE",
		'_transient_' . $prefix,
		'_transient_timeout_' . $prefix
	),
	ARRAY_N
);

if ( ! empty( $transients ) ) {
	array_map( 'delete_transient', (array) $transients );
}

// Clear network data if multisite.
if ( is_multisite() ) {
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$options = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->sitemeta WHERE meta_key LIKE %s",
			$prefix
		),
		ARRAY_N
	);

	if ( ! empty( $options ) ) {
		array_map( 'delete_option', (array) $options );
	}

	// phpcs:ignore WordPress.DB.DirectDatabaseQuery
	$transients = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT option_name FROM $wpdb->sitemeta WHERE meta_key LIKE %s OR meta_key LIKE %s",
			'_site_transient_' . $prefix,
			'_site_transient_timeout_' . $prefix
		),
		ARRAY_N
	);

	if ( ! empty( $transients ) ) {
		array_map( 'delete_transient', (array) $transients );
	}
}

// Delete post meta.
delete_post_meta_by_key( 'web_stories_is_poster' );
delete_post_meta_by_key( 'web_stories_poster_id' );

// Delete all stories & templates.
$cpt_posts = get_posts(
	[
		'fields'           => 'ids',
		'suppress_filters' => false,
		'post_type'        => [ Story_Post_Type::POST_TYPE_SLUG, Template_Post_Type::POST_TYPE_SLUG ],
		'posts_per_page'   => - 1,
	]
);

foreach ( $cpt_posts as $custom_post ) {
	wp_delete_post( $custom_post->ID, true );
}

// Clear options cache.
wp_cache_flush();
