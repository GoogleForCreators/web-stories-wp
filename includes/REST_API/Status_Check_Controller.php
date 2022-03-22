<?php
/**
 * Class Status_Check_Controller
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

namespace Google\Web_Stories\REST_API;

use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Story_Post_Type;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * API endpoint check status.
 *
 * Class Status_Check_Controller
 */
class Status_Check_Controller extends REST_Controller implements HasRequirements {

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;

		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'status-check';
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'story_post_type' ];
	}

	/**
	 * Registers routes for links.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::ALLMETHODS,
					'callback'            => [ $this, 'status_check' ],
					'permission_callback' => [ $this, 'status_check_permissions_check' ],
					'args'                => [
						'content' => [
							'description' => __( 'Test HTML content.', 'web-stories' ),
							'required'    => true,
							'type'        => 'string',
						],
					],
				],
			]
		);
	}

	/**
	 * Status check, return true for now.
	 *
	 * @since 1.1.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function status_check( $request ) {
		$data = [
			'success' => true,
		];

		$response = $this->prepare_item_for_response( $data, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Prepares a status data output for response.
	 *
	 * @since 1.10.0
	 *
	 * @param array           $status    Status array.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_item_for_response( $status, $request ) {
		$fields = $this->get_fields_for_response( $request );
		$schema = $this->get_item_schema();

		$data = [];

		if ( rest_is_field_included( 'success', $fields ) ) {
			$data['success'] = rest_sanitize_value_from_schema( $status['success'], $schema['properties']['success'] );
		}

		/**
		 * Request context.
		 *
		 * @var string $context
		 */
		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		return rest_ensure_response( $data );
	}

	/**
	 * Retrieves the status schema, conforming to JSON Schema.
	 *
	 * @since 1.10.0
	 *
	 * @return array Item schema as an array.
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'status',
			'type'       => 'object',
			'properties' => [
				'success' => [
					'description' => __( 'Whether check was successful', 'web-stories' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			],
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Checks if current user can process status.
	 *
	 * @since 1.1.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function status_check_permissions_check() {
		if ( ! $this->story_post_type->has_cap( 'edit_posts' ) ) {
			return new \WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed run status check.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}
}
