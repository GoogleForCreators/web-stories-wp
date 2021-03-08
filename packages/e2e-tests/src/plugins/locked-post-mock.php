<?php
/**
 * Plugin Name: E2E Tests Post Lock mock
 * Plugin URI:  https://github.com/google/web-stories-wp
 * Description: Mock post lock.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 *
 * @package   Google\Site_Kit
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Web_Stories\E2E\PostLock;


function filter_meta( $value, $object_id, $meta_key ) {
	if ( '_edit_lock' !== $meta_key ) {
		return $value;
	}

	$user    = get_user_by( 'login', 'author' );
	$user_id = $user->ID;
	$now     = time();
	$lock    = "$now:$user_id";

	return $lock;
}

add_filter( 'get_post_metadata', __NAMESPACE__ . '\filter_meta', 10, 3 );

