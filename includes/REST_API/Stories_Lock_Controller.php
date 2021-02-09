<?php
/**
 * Class Stories_Lock_Controller
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\REST_API;

use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use WP_Post_Type;

/**
 * API endpoint for post locking.
 *
 * Class Stories_Lock_Controller
 */
class Stories_Lock_Controller extends Stories_Base_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'post-lock/(?P<id>\d+)';
	}

	/**
	 * Registers routes for post locking.
	 *
	 * @return void
	 * @see register_rest_route()
	 *
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'lock_check' ],
					'permission_callback' => [ $this, 'permissions_check' ],
					'args'                => [
						'id' => [
							'description'       => __( 'Web Story ID.', 'web-stories' ),
							'required'          => true,
							'type'              => 'integer',
							'sanitize_callback' => 'absint',
						],
					],
				],
			]
		);
	}

	/**
	 * Lock check, return true for now.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 */
	public function lock_check( $request ) {
		return rest_ensure_response( $this->get_lock_status( $request->get_param( 'id' ) ) );
	}

	/**
	 * Checks if current user can alter post locking.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 *
	 */
	public function permissions_check() {
		if ( ! current_user_can( 'edit_web-stories' ) ) {
			return new WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}

	/**
	 * Taken from wp_refresh_post_lock().
	 *
	 * @param int $id Web Story ID.
	 */
	protected function get_lock_status( int $post_id ) {
		$response = [];
		$send     = [];
		if ( ! $post_id ) {
			return $response;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $response;
		}

		$user_id = $this->check_post_lock( $post_id );
		$user    = get_userdata( $user_id );
		if ( $user ) {
			$error = array(
				/* translators: %s: User's display name. */
				'text' => sprintf( __( '%s has taken over and is currently editing.' ), $user->display_name ),
			);

			if ( get_option( 'show_avatars' ) ) {
				$error['avatar_src']    = get_avatar_url( $user->ID, array( 'size' => 64 ) );
				$error['avatar_src_2x'] = get_avatar_url( $user->ID, array( 'size' => 128 ) );
			}

			$send['lock_error'] = $error;
		} else {
			$new_lock = $this->set_post_lock( $post_id );
			if ( $new_lock ) {
				$send['new_lock'] = implode( ':', $new_lock );
			}
		}

		$response['wp-refresh-post-lock'] = $send;

		return $response;
	}

	/**
	 * Check to see if the post is currently being edited by another user.
	 *
	 * @param int|WP_Post $post_id ID or object of the post to check for editing.
	 *
	 * @return int|false ID of the user with lock. False if the post does not exist, post is not locked,
	 *                   the user with lock does not exist, or the post is locked by current user.
	 *
	 */
	protected function check_post_lock( $post_id ) {
		$post = get_post( $post_id );
		if ( ! $post ) {
			return false;
		}

		$lock = get_post_meta( $post->ID, '_edit_lock', true );
		if ( ! $lock ) {
			return false;
		}

		$lock = explode( ':', $lock );
		$time = $lock[0];
		$user = isset( $lock[1] ) ? $lock[1] : get_post_meta( $post->ID, '_edit_last', true );

		if ( ! get_userdata( $user ) ) {
			return false;
		}

		/** This filter is documented in wp-admin/includes/ajax-actions.php */
		$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

		if ( $time && $time > time() - $time_window && get_current_user_id() != $user ) {
			return $user;
		}

		return false;
	}

	/**
	 * Mark the post as currently being edited by the current user
	 *
	 * @param int|WP_Post $post_id ID or object of the post being edited.
	 *
	 * @return array|false Array of the lock time and user ID. False if the post does not exist, or
	 *                     there is no current user.
	 *
	 */
	protected function set_post_lock( $post_id ) {
		$post = get_post( $post_id );
		if ( ! $post ) {
			return false;
		}

		$user_id = get_current_user_id();
		if ( 0 == $user_id ) {
			return false;
		}

		$now  = time();
		$lock = "$now:$user_id";

		update_post_meta( $post->ID, '_edit_lock', $lock );

		return array( $now, $user_id );
	}
}
