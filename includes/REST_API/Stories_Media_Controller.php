<?php
/**
 * Class Stories_Media_Controller
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

use Google\Web_Stories\Traits\Types;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Stories_Media_Controller class.
 */
class Stories_Media_Controller extends \WP_REST_Attachments_Controller {
	use Types;
	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @since 1.0.0
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type ) {
		parent::__construct( $post_type );
		$this->namespace = 'web-stories/v1';
	}

	/**
	 * Retrieves a collection of media.
	 *
	 * Read _web_stories_envelope param to envelope response.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$response = parent::get_items( $request );

		if ( $request['_web_stories_envelope'] && ! is_wp_error( $response ) ) {
			$response = rest_get_server()->envelope_response( $response, false );
		}
		return $response;
	}

	/**
	 * Updates a single attachment.
	 *
	 * Override the existing method so we can set parent id.
	 *
	 * @since 1.2.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, WP_Error object on failure.
	 */
	public function update_item( $request ) {
		// WP_REST_Attachments_Controller doesn't allow setting an attachment as the parent post.
		// Hence we are working around this here.
		$parent_post = ! empty( $request['post'] ) ? (int) $request['post'] : null;
		unset( $request['post'] );

		if ( ! $parent_post ) {
			return parent::update_item( $request );

		}

		if ( 'revision' === get_post_type( $parent_post ) ) {
			return new WP_Error(
				'rest_invalid_param',
				__( 'Invalid parent type.', 'web-stories' ),
				[ 'status' => 400 ]
			);
		}

		$attachment_before = get_post( $request['id'] );

		$args   = [
			'ID'          => $request['id'],
			'post_parent' => $parent_post,
		];
		$result = wp_update_post( $args, true );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$attachment = get_post( $request['id'] );

		$request->set_param( 'context', 'edit' );

		/** This action is documented in wp-includes/rest-api/endpoints/class-wp-rest-attachments-controller.php */
		do_action( 'rest_after_insert_attachment', $attachment, $request, false );

		if ( function_exists( 'wp_after_insert_post' ) ) {
			wp_after_insert_post( $attachment, true, $attachment_before );
		}

		$response = $this->prepare_item_for_response( $attachment, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves the query params for the posts collection.
	 *
	 * @since 1.0.0
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params['_web_stories_envelope'] = [
			'description' => __( 'Envelope request for preloading.', 'web-stories' ),
			'type'        => 'boolean',
			'default'     => false,
		];

		return $query_params;
	}

	/**
	 * Filter request by allowed mime types.
	 *
	 * @since 1.2.0
	 *
	 * @param array           $prepared_args Optional. Array of prepared arguments. Default empty array.
	 * @param WP_REST_Request $request       Optional. Request to prepare items for.
	 * @return array Array of query arguments.
	 */
	protected function prepare_items_query( $prepared_args = [], $request = null ) {
		$query_args = parent::prepare_items_query( $prepared_args, $request );

		if ( empty( $request['mime_type'] ) && empty( $request['media_type'] ) ) {
			$media_types      = $this->get_media_types();
			$media_type_mimes = array_values( $media_types );
			$media_type_mimes = array_filter( $media_type_mimes );
			$media_type_mimes = array_merge( ...$media_type_mimes );

			$query_args['post_mime_type'] = $media_type_mimes;
		}

		return $query_args;
	}


	/**
	 * Retrieves the supported media types.
	 *
	 * Media types are considered the MIME type category.
	 *
	 * @since 1.2.0
	 *
	 * @return array Array of supported media types.
	 */
	protected function get_media_types() {
		return $this->get_allowed_mime_types();
	}
}
