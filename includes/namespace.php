<?php
/**
 * Plugin initialization file.
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

use WP_Error;
use WP_REST_Request;
use WP_Site;

/**
 * Handles plugin activation.
 *
 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
 *
 * @since 1.0.0
 *
 * @param bool $network_wide Whether to activate network-wide.
 */
function activate( $network_wide = false ): void {
	$network_wide = (bool) $network_wide;

	// Runs all PluginActivationAware services.
	// This will also flush rewrite rules.
	PluginFactory::create()->on_plugin_activation( $network_wide );

	/**
	 * Fires after plugin activation.
	 *
	 * @param bool $network_wide Whether to activate network-wide.
	 */
	do_action( 'web_stories_activation', $network_wide );
}

register_activation_hook( WEBSTORIES_PLUGIN_FILE, __NAMESPACE__ . '\activate' );

/**
 * Hook into new site creation on Multisite.
 *
 * @since 1.0.0
 *
 * @param int|WP_Site $site Site ID or object.
 */
function new_site( $site ): void {
	if ( ! is_multisite() ) {
		return;
	}

	$site = get_site( $site );

	if ( ! $site ) {
		return;
	}

	// Runs all SiteInitializationAware services.
	// This will also flush rewrite rules.
	PluginFactory::create()->on_site_initialization( $site );
}

add_action( 'wp_initialize_site', __NAMESPACE__ . '\new_site', PHP_INT_MAX );

/**
 * Hook into site removal on Multisite.
 *
 * @since 1.1.0
 *
 * @param WP_Error    $error Unused.
 * @param int|WP_Site $site Site ID or object.
 */
function remove_site( $error, $site ): void {
	if ( ! is_multisite() ) {
		return;
	}

	$site = get_site( $site );

	if ( ! $site ) {
		return;
	}

	PluginFactory::create()->on_site_removal( $site );
}

add_action( 'wp_validate_site_deletion', __NAMESPACE__ . '\remove_site', PHP_INT_MAX, 2 );

/**
 * Handles plugin deactivation.
 *
 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
 *
 * @since 1.0.0
 *
 * @param bool $network_wide Whether to deactivate network-wide.
 */
function deactivate( $network_wide = false ): void {
	$network_wide = (bool) $network_wide;

	// Runs all PluginDeactivationAware services.
	// This will also flush rewrite rules.
	PluginFactory::create()->on_plugin_deactivation( $network_wide );

	/**
	 * Fires after plugin deactivation.
	 *
	 * @param bool $network_wide Whether to deactivate network-wide.
	 */
	do_action( 'web_stories_deactivation', $network_wide );
}

register_deactivation_hook( WEBSTORIES_PLUGIN_FILE, __NAMESPACE__ . '\deactivate' );

/**
 * Initializes functionality to improve compatibility with the AMP plugin.
 *
 * Loads a separate PHP file that allows defining functions in the global namespace.
 *
 * Runs on the 'wp' hook to ensure the WP environment has been fully set up,
 */
function load_amp_plugin_compat(): void {
	require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/compat/amp.php';
}

add_action( 'wp', __NAMESPACE__ . '\load_amp_plugin_compat' );

/**
 * Load functions for use by plugin developers.
 *
 * @todo Move to autoloader
 */
function load_functions(): void {
	require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/functions.php';
}

add_action( 'init', __NAMESPACE__ . '\load_functions' );

/**
 * Append result of internal request to REST API for purpose of preloading data to be attached to a page.
 * Expected to be called in the context of `array_reduce`.
 *
 * Like rest_preload_api_request() in core, but embeds links and removes trailing slashes.
 *
 * @SuppressWarnings(PHPMD.NPathComplexity)
 *
 * @since 1.2.0
 *
 * @link https://core.trac.wordpress.org/ticket/51722
 * @link https://core.trac.wordpress.org/ticket/51636
 * @see \rest_preload_api_request
 *
 * @param array        $memo Reduce accumulator.
 * @param string|array $path REST API path to preload.
 * @return array Modified reduce accumulator.
 */
function rest_preload_api_request( $memo, $path ): array {
	// array_reduce() doesn't support passing an array in PHP 5.2,
	// so we need to make sure we start with one.
	if ( ! \is_array( $memo ) ) {
		$memo = [];
	}

	if ( empty( $path ) ) {
		return $memo;
	}

	$method = 'GET';
	if ( \is_array( $path ) ) {
		if ( 2 !== \count( $path ) ) {
			return $memo;
		}

		$method = end( $path );
		$path   = (string) reset( $path );

		if ( ! \in_array( $method, [ 'GET', 'OPTIONS' ], true ) ) {
			$method = 'GET';
		}
	}

	$path_parts = wp_parse_url( (string) $path );
	if ( ! \is_array( $path_parts ) ) {
		return $memo;
	}

	$request = new WP_REST_Request( $method, untrailingslashit( (string) $path_parts['path'] ) );
	if ( ! empty( $path_parts['query'] ) ) {
		$query_params = [];
		parse_str( $path_parts['query'], $query_params );
		$request->set_query_params( $query_params );
	}

	$response = rest_do_request( $request );
	if ( 200 === $response->status ) {
		$server = rest_get_server();
		/**
		 * Embed directive.
		 *
		 * @var string|array $embed
		 */
		$embed = $request['_embed'] ?? false;
		$embed = $embed ? rest_parse_embed_param( $embed ) : false;
		$data  = $server->response_to_data( $response, $embed );

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

/**
 * Returns the Web stories plugin instance.
 *
 * Can be used by other plugins to integrate with the plugin
 * or to simply detect whether the plugin is active.
 */
function get_plugin_instance(): Plugin {
	return PluginFactory::create();
}

/**
 * Bootstrap the plugin.
 *
 * @since 1.11.0
 */
function bootstrap_plugin(): void {
	PluginFactory::create()->register();
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\bootstrap_plugin' );
