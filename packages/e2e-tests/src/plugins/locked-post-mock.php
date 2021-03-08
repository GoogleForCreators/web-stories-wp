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

use Google\Web_Stories\Story_Post_Type;

function activate() {
	$user_id = wp_insert_user( [
		'user_login' => 'test_locker',
		'role'       => 'author',
		'user_email' => 'lock@example.com'
	] );

	$story_data = [
		"pages" => [
			[
				"elements" => [
					[
						"opacity"             => 100,
						"flip"                => [
							"vertical"   => false,
							"horizontal" => false
						],
						"rotationAngle"       => 10,
						"lockAspectRatio"     => true,
						"backgroundColor"     => [
							"color" => [
								"r" => 255,
								"g" => 255,
								"b" => 255
							]
						],
						"x"                   => 1,
						"y"                   => 1,
						"width"               => 1,
						"height"              => 1,
						"mask"                => [
							"type" => "rectangle"
						],
						"isBackground"        => true,
						"isDefaultBackground" => true,
						"type"                => "shape",
						"id"                  => "d58c2be2-f8a0-4e00-b21a-ddd32d1ac04b"
					],
				]
			],
		],
	];

	$post_id = wp_insert_post( [
		'post_author'           => $user_id,
		'post_title'            => 'Test Story',
		'post_type'             => Story_Post_Type::POST_TYPE_SLUG,
		'post_content_filtered' => wp_json_encode( $story_data ),
	] );

	$now  = time();
	$lock = "$now:$user_id";

	update_post_meta( $post_id, '_edit_lock', $lock );
}

function deactivate() {
	$user = get_user_by( 'login', 'test_locker' );
	if ( $user ) {
		wp_delete_user( $user->ID );
	}
}

register_activation_hook( __FILE__, __NAMESPACE__ . '\activate' );
register_deactivation_hook( __FILE__, __NAMESPACE__ . '\deactivate' );
