<?php
/**
 * Plugin Name: E2E Tests Post Lock mock
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Mock post lock.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 */

namespace Google\Web_Stories\E2E\PostLock;

const USERNAME = 'test_locker';

function filter_meta( $value, $object_id, $meta_key ) {
	if ( '_edit_lock' !== $meta_key ) {
		return $value;
	}

	$user = get_user_by( 'login', USERNAME );
	if ( ! $user ) {
		return $value;
	}
	$user_id = $user->ID;
	$now     = time();

	return "$now:$user_id";
}
add_filter( 'get_post_metadata', __NAMESPACE__ . '\filter_meta', 10, 3 );

function activate() {
	$user = get_user_by( 'login', USERNAME );
	if ( ! $user ) {
		wp_insert_user(
			[
				'user_login' => USERNAME,
				'role'       => 'author',
				'user_email' => 'lock@example.com',
				'user_pass'  => 'fsfdsfds',
			]
		);
	}
}

function deactivate() {
	$user = get_user_by( 'login', USERNAME );
	if ( $user ) {
		wp_delete_user( $user->ID );
	}
}

register_activation_hook( __FILE__, __NAMESPACE__ . '\activate' );
register_deactivation_hook( __FILE__, __NAMESPACE__ . '\deactivate' );

