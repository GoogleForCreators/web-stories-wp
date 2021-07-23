<?php
/**
 * Class Page_Template_Controller
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

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Page_Template_Controller class.
 */
class Page_Template_Controller extends Stories_Base_Controller {
	/**
	 * Retrieves a collection of page templates.
	 *
	 * @since 1.7.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$response = parent::get_items( $request );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		if ( $request['_web_stories_envelope'] ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$response = rest_get_server()->envelope_response( $response, isset( $request['_embed'] ) ? $request['_embed'] : false );
		}
		return $response;
	}

	/**
	 * Retrieves the query params for the posts collection.
	 *
	 * @since 1.7.0
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params(): array {
		$query_params = parent::get_collection_params();

		$query_params['_web_stories_envelope'] = [
			'description' => __( 'Envelope request for preloading.', 'web-stories' ),
			'type'        => 'boolean',
			'default'     => false,
		];

		return $query_params;
	}
}
