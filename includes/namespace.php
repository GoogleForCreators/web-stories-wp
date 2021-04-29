<?php
/**
 * Plugin initialization file.
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

use WP_REST_Request;
use WP_Error;
use WP_Site;

/**
 * Run logic to setup a new site with web stories.
 *
 * @since 1.2.0
 *
 * @return void
 */
function setup_new_site() {
	$injector = Services::get_injector();
	if ( ! method_exists( $injector, 'make' ) ) {
		return;
	}
	$story = $injector->make( Story_Post_Type::class );
	$story->register();
	// TODO Register cap to roles within class itself.
	$story->add_caps_to_roles();
	rewrite_flush();

	// Not using Services::get(...) because the class is only registered on 'admin_init', which we might not be in here.
	// TODO move this logic to Database_Upgrader class.
	$database_upgrader = $injector->make( Database_Upgrader::class );
	$database_upgrader->register();
}


/**
 * Flush rewrites.
 *
 * @since 1.7.0
 *
 * @return void
 */
function rewrite_flush() {
	if ( ! defined( '\WPCOM_IS_VIP_ENV' ) || false === \WPCOM_IS_VIP_ENV ) {
		flush_rewrite_rules( false ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.flush_rewrite_rules_flush_rewrite_rules
	}
}

/**
 * Handles plugin activation.
 *
 * Throws an error if the site is running on PHP < 5.6
 *
 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
 *
 * @since 1.0.0
 *
 * @param bool $network_wide Whether to activate network-wide.
 *
 * @return void
 */
function activate( $network_wide = false ) {
	get_plugin_instance()->activate( $network_wide );

	do_action( 'web_stories_activation', $network_wide );
}

/**
 * Hook into new site when they are created and run activation hook.
 *
 * @since 1.0.0
 *
 * @param int|WP_Site $site Site ID or object.
 *
 * @return void
 */
function new_site( $site ) {
	if ( ! is_multisite() ) {
		return;
	}
	$site = get_site( $site );
	if ( ! $site ) {
		return;
	}
	$site_id = (int) $site->blog_id;
	switch_to_blog( $site_id );
	setup_new_site();
	restore_current_blog();
}
add_action( 'wp_initialize_site', __NAMESPACE__ . '\new_site', PHP_INT_MAX );


/**
 * Hook into delete site.
 *
 * @since 1.1.0
 *
 * @param WP_Error    $error Unused.
 * @param int|WP_Site $site Site ID or object.
 *
 * @return void
 */
function remove_site( $error, $site ) {
	if ( ! is_multisite() ) {
		return;
	}
	$site = get_site( $site );
	if ( ! $site ) {
		return;
	}

	$injector = Services::get_injector();
	if ( ! method_exists( $injector, 'make' ) ) {
		return;
	}
	$story = $injector->make( Story_Post_Type::class );

	$site_id = (int) $site->blog_id;
	switch_to_blog( $site_id );
	$story->remove_caps_from_roles();
	restore_current_blog();
}

add_action( 'wp_validate_site_deletion', __NAMESPACE__ . '\remove_site', PHP_INT_MAX, 2 );

/**
 * Handles plugin deactivation.
 *
 * @since 1.0.0
 *
 * @param bool $network_wide Whether to deactivate network-wide.
 *
 * @return void
 */
function deactivate( $network_wide ) {
	get_plugin_instance()->deactivate( $network_wide );

	do_action( 'web_stories_deactivation', $network_wide );
}

register_activation_hook( WEBSTORIES_PLUGIN_FILE, __NAMESPACE__ . '\activate' );
register_deactivation_hook( WEBSTORIES_PLUGIN_FILE, __NAMESPACE__ . '\deactivate' );


/**
 * Initializes functionality to improve compatibility with the AMP plugin.
 *
 * Loads a separate PHP file that allows defining functions in the global namespace.
 *
 * Runs on the 'wp' hook to ensure the WP environment has been fully set up,
 *
 * @return void
 */
function load_amp_plugin_compat() {
	require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/compat/amp.php';
}
add_action( 'wp', __NAMESPACE__ . '\load_amp_plugin_compat' );


/**
 * Include necessary files.
 *
 * @return void
 */
function includes() {
	require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/functions.php';
}
add_action( 'init', __NAMESPACE__ . '\includes' );


/**
 * Append result of internal request to REST API for purpose of preloading data to be attached to a page.
 * Expected to be called in the context of `array_reduce`.
 *
 * Like rest_preload_api_request() in core, but embeds links and removes trailing slashes.
 *
 * @link  https://core.trac.wordpress.org/ticket/51722
 *
 * @since 1.2.0
 *
 * @see   \rest_preload_api_request
 * @SuppressWarnings(PHPMD.NPathComplexity)
 *
 * @param array        $memo Reduce accumulator.
 * @param string|array $path REST API path to preload.
 *
 * @return array Modified reduce accumulator.
 */
function rest_preload_api_request( $memo, $path ) {
	// array_reduce() doesn't support passing an array in PHP 5.2,
	// so we need to make sure we start with one.
	if ( ! is_array( $memo ) ) {
		$memo = [];
	}

	if ( empty( $path ) ) {
		return $memo;
	}

	$method = 'GET';
	if ( is_array( $path ) && 2 === count( $path ) ) {
		$method = end( $path );
		$path   = reset( $path );

		if ( ! in_array( $method, [ 'GET', 'OPTIONS' ], true ) ) {
			$method = 'GET';
		}
	}

	$path_parts = wp_parse_url( $path );
	if ( false === $path_parts ) {
		return $memo;
	}

	$request = new WP_REST_Request( $method, untrailingslashit( $path_parts['path'] ) );
	$embed   = false;
	if ( ! empty( $path_parts['query'] ) ) {
		$query_params = [];
		parse_str( $path_parts['query'], $query_params );
		$embed = isset( $query_params['_embed'] ) ? $query_params['_embed'] : false;
		$request->set_query_params( $query_params );
	}

	$response = rest_do_request( $request );
	if ( 200 === $response->status ) {
		$server = rest_get_server();
		$data   = $server->response_to_data( $response, $embed );

		if ( 'OPTIONS' === $method ) {
			$response = rest_send_allow_header( $response, $server, $request );

			$memo[ $method ][ $path ] = [
				'body'    => $data,
				'headers' => $response->headers,
			];
		} else {
			$memo[ $path ] = [
				'body'    => $data,
				'headers' => $response->headers,
			];
		}
	}

	return $memo;
}

get_plugin_instance()->register();

/**
 * Web stories Plugin Instance
 *
 * @return Plugin
 */
function get_plugin_instance() {
	global $web_stories;

	if ( null === $web_stories ) {
		$web_stories = new Plugin();
	}

	return $web_stories;
}
