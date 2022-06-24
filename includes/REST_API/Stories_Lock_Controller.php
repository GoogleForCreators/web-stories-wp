<?php
/**
 * Class Stories_Lock_Controller
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
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Class Stories_Lock_Controller
 */
class Stories_Lock_Controller extends REST_Controller implements HasRequirements {

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Parent post controller.
	 *
	 * @var WP_REST_Controller
	 */
	private $parent_controller;

	/**
	 * Constructor.
	 *
	 * @since 1.6.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;

		$rest_base         = $story_post_type->get_rest_base();
		$parent_controller = $story_post_type->get_parent_controller();

		$this->parent_controller = $parent_controller;
		$this->rest_base         = $rest_base;
		$this->namespace         = $story_post_type->get_rest_namespace();
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
	 * Registers the routes for the objects of the controller.
	 *
	 * @since 1.6.0
	 *
	 * @see register_rest_route()
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)/lock',
			[
				'args' => [
					'id' => [
						'description' => __( 'Unique identifier for the object.', 'web-stories' ),
						'type'        => 'integer',
					],
				],
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [
						'context' => $this->get_context_param( [ 'default' => 'view' ] ),
					],

				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::DELETABLE ),
				],
			]
		);
	}

	/**
	 * Get post lock
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success.
	 */
	public function get_item( $request ) {
		/**
		 * Post ID.
		 *
		 * @var int $post_id
		 */
		$post_id = $request['id'];

		$lock = $this->get_lock( $post_id );

		return $this->prepare_item_for_response( $lock, $request );
	}

	/**
	 * Update post lock
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success.
	 */
	public function update_item( $request ) {
		if ( ! function_exists( 'wp_set_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}

		/**
		 * Post ID.
		 *
		 * @var int $post_id
		 */
		$post_id = $request['id'];

		wp_set_post_lock( $post_id );
		$lock = $this->get_lock( $post_id );

		return $this->prepare_item_for_response( $lock, $request );
	}

	/**
	 * Delete post lock
	 *
	 * @since 1.6.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response Response object on success.
	 */
	public function delete_item( $request ): WP_REST_Response {
		/**
		 * Post ID.
		 *
		 * @var int $post_id
		 */
		$post_id = $request['id'];

		$lock     = $this->get_lock( $post_id );
		$previous = $this->prepare_item_for_response( $lock, $request );
		$result   = delete_post_meta( $post_id, '_edit_lock' );
		$data     = [];
		if ( ! is_wp_error( $previous ) ) {
			$data = $previous->get_data();
		}
		$response = new WP_REST_Response();
		$response->set_data(
			[
				'deleted'  => $result,
				'previous' => $data,
			]
		);

		return $response;
	}

	/**
	 * Get the lock, if the ID is valid.
	 *
	 * @param int $post_id Supplied ID.
	 * @return array{time?: int, user?: int}|false Lock data or false.
	 */
	protected function get_lock( int $post_id ) {
		/**
		 * Lock data.
		 *
		 * @var string|false $lock
		 */
		$lock = get_post_meta( $post_id, '_edit_lock', true );

		if ( ! empty( $lock ) ) {
			[ $time, $user ] = explode( ':', $lock );
			if ( $time && $user ) {
				return [
					'time' => (int) $time,
					'user' => (int) $user,
				];
			}
		}

		return false;
	}

	/**
	 * Checks if a given request has access to read a lock.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		return $this->parent_controller->update_item_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to update a lock.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		return $this->parent_controller->update_item_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to delete a lock.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		$result = $this->parent_controller->update_item_permissions_check( $request );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		/**
		 * Post ID.
		 *
		 * @var int $post_id
		 */
		$post_id = $request['id'];

		$lock = $this->get_lock( $post_id );
		if ( \is_array( $lock ) && isset( $lock['user'] ) && get_current_user_id() !== (int) $lock['user'] ) {
			return new \WP_Error(
				'rest_cannot_delete_others_lock',
				__( 'Sorry, you are not allowed delete others lock.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Prepares a single lock output for response.
	 *
	 * @since 1.6.0
	 *
	 * @param array{time?: int, user?: int}|false $item Lock value, default to false is not set.
	 * @param WP_REST_Request                     $request Request object.
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_item_for_response( $item, $request ) {
		$fields = $this->get_fields_for_response( $request );
		$schema = $this->get_item_schema();

		$nonce     = wp_create_nonce( 'wp_rest' );
		$lock_data = [
			'locked' => false,
			'time'   => '',
			'user'   => 0,
			'nonce'  => $nonce,
		];

		if ( ! empty( $item ) ) {
			/** This filter is documented in wp-admin/includes/ajax-actions.php */
			$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

			if ( $item['time'] && $item['time'] > time() - $time_window ) {
				$lock_data = [
					'locked' => true,
					'time'   => $item['time'],
					'user'   => (int) $item['user'],
					'nonce'  => $nonce,
				];
			}
		}

		$data         = [];
		$check_fields = array_keys( $lock_data );
		foreach ( $check_fields as $check_field ) {
			if ( ! empty( $schema['properties'][ $check_field ] ) && rest_is_field_included( $check_field, $fields ) ) {
				$data[ $check_field ] = rest_sanitize_value_from_schema( $lock_data[ $check_field ], $schema['properties'][ $check_field ] );
			}
		}

		/**
		 * Request context.
		 *
		 * @var string $context
		 */
		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		/**
		 * Response object.
		 *
		 * @var WP_REST_Response $response
		 */
		$response = rest_ensure_response( $data );

		/**
		 * Post ID.
		 *
		 * @var int $post_id
		 */
		$post_id = $request['id'];

		$response->add_links( $this->prepare_links( $item, $post_id ) );

		$post_type = $this->story_post_type->get_slug();

		/**
		 * Filters the lock data for a response.
		 *
		 * The dynamic portion of the hook name, `$post_type`, refers to the post type slug.
		 *
		 * @since 1.6.0
		 *
		 * @param WP_REST_Response $response The response object.
		 * @param array|false      $item     Lock array if available.
		 * @param WP_REST_Request  $request  Request object.
		 */
		return apply_filters( "rest_prepare_{$post_type}_lock", $response, $item, $request );
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param array{time?: int, user?: int}|false $lock Lock state.
	 * @param int                                 $post_id Post object ID.
	 * @return array{self: array{href?: string}, author?: array{href: string, embeddable: true}} Links for the given term.
	 */
	protected function prepare_links( $lock, int $post_id ): array {
		$base  = $this->namespace . '/' . $this->rest_base;
		$links = [
			'self' => [
				'href' => rest_url( trailingslashit( $base ) . $post_id . '/lock' ),
			],
		];

		if ( ! empty( $lock ) ) {
			/** This filter is documented in wp-admin/includes/ajax-actions.php */
			$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

			if ( $lock['time'] && $lock['time'] > time() - $time_window ) {
				$links['author'] = [
					'href'       => rest_url( sprintf( '%s/%s/%s', $this->namespace, 'users', $lock['user'] ) ),
					'embeddable' => true,
				];
			}
		}

		return $links;
	}

	/**
	 * Retrieves the post's schema, conforming to JSON Schema.
	 *
	 * @since 1.6.0
	 *
	 * @return array<string, string|array<string, array<string,string|string[]>>> Item schema data.
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'lock',
			'type'       => 'object',
			'properties' => [
				'time'   => [
					'description' => __( 'Unix time of lock', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'nonce'  => [
					'description' => __( 'Nonce value', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
				],
				'locked' => [
					'description' => __( 'If the current object is locked or not.', 'web-stories' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'user'   => [
					'description' => __( 'The ID for the author of the lock.', 'web-stories' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			],
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}
}
