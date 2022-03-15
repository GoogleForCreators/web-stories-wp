<?php
/**
 * Plugin Name: E2E Tests Post Lock mock
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Mock post lock.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
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

namespace Google\Web_Stories\E2E_Tests\PostLock;

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

