<?php
/**
 * Class Status_Check
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

namespace Google\Web_Stories\REST_API;

use Google\Web_Stories\Story_Post_Type;
use WP_REST_Server;
use WP_REST_Controller;
use WP_Post_Type;

/**
 * API endpoint check status.
 *
 * Class Status_Check
 */
class Status_Check extends WP_REST_Controller {
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'status-check';
	}

	/**
	 * Registers routes for links.
	 *
	 * @see register_rest_route()
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => [ $this, 'status_check' ],
					'permission_callback' => [ $this, 'status_check_permissions_check' ],
					'args'                => [],
				],
			]
		);
	}

	/**
	 * Status check.
	 *
	 * @since 1.1.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function status_check( $request ) {
		$has_upload_media_action  = current_user_can( 'upload_files' );
		$has_publish_action       = false;
		$has_assign_author_action = false;
		$post_type_object         = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );

		if ( $post_type_object instanceof WP_Post_Type ) {
			if ( property_exists( $post_type_object->cap, 'publish_posts' ) ) {
				$has_publish_action = current_user_can( $post_type_object->cap->publish_posts );
			}
			if ( property_exists( $post_type_object->cap, 'edit_others_posts' ) ) {
				$has_assign_author_action = current_user_can( $post_type_object->cap->edit_others_posts );
			}
		}

		$capabilities = [
			'hasPublishAction'      => $has_publish_action,
			'hasAssignAuthorAction' => $has_assign_author_action,
			'hasUploadMediaAction'  => $has_upload_media_action,
		];

		return rest_ensure_response( $capabilities );
	}

	/**
	 * Checks if current user can process status.
	 *
	 * @since 1.1.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function status_check_permissions_check() {
		if ( ! current_user_can( 'edit_web-stories' ) ) {
			return new WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed status.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}
}
