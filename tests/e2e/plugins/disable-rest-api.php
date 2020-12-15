<?php
/**
 * Plugin Name: E2E Tests Disable REST API
 * Plugin URI:  https://github.com/google/web-stories-wp
 * Description: Utility plugin to disable rest api.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 *
 */

namespace Google\Web_Stories\E2E\Disable_REST_API;

/**
 * Helper function to disable REST API.
 *
 * @param bool|WP_Error $result
 *
 * @return bool|WP_Error
 */
function disable_rest_api( $result ) {
	// If a previous authentication check was applied,
	// pass that result along without modification.
	if ( true === $result || is_wp_error( $result ) ) {
		return $result;
	}

	return new WP_Error(
		'rest_not_logged_in',
		__( 'You are not currently logged in.', 'web-stories' ),
		[ 'status' => \rest_authorization_required_code() ]
	);

}

add_filter( 'rest_authentication_errors', __NAMESPACE__ . '\disable_rest_api' );
