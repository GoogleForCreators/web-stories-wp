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

use WP_REST_Posts_Controller;
use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Request;
use WP_REST_Server;
use WP_Error;

/**
 * Class Stories_Lock_Controller
 *
 * @package Google\Web_Stories\REST_API
 */
class Stories_Lock_Controller extends WP_REST_Controller {
	/**
	 * Parent post controller.
	 *
	 * @var WP_REST_Controller
	 */
	private $parent_controller;

	/**
	 * Post type.
	 *
	 * @var string
	 */
	protected $post_type;

	/**
	 * Constructor.
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type ) {
		$this->post_type   = $post_type;
		$this->namespace   = 'web-stories/v1';
		$rest_base         = $post_type;
		$post_type_object  = get_post_type_object( $post_type );
		$parent_controller = null;

		if ( $post_type_object instanceof \WP_Post_Type ) {
			$parent_controller = $post_type_object->get_rest_controller();
			$rest_base         = ! empty( $post_type_object->rest_base ) ? $post_type_object->rest_base : $post_type_object->name;
		}

		if ( ! $parent_controller ) {
			$parent_controller = new WP_REST_Posts_Controller( $post_type );
		}

		$this->parent_controller = $parent_controller;
		$this->rest_base         = (string) $rest_base;
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 *
	 * @return void
	 */
	public function register_routes() {
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
					'permission_callback' => [ $this->parent_controller, 'update_item_permissions_check' ],
					'args'                => [
						'context' => $this->get_context_param( [ 'default' => 'view' ] ),
					],

				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this->parent_controller, 'update_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this->parent_controller, 'update_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::DELETABLE ),
				],
			]
		);
	}

	/**
	 * Get post lock
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success.
	 */
	public function get_item( $request ) {
		$lock = $this->get_lock( $request['id'] );

		return $this->prepare_item_for_response( $lock, $request );
	}

	/**
	 * Update post lock
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success.
	 */
	public function update_item( $request ) {
		if ( ! function_exists( 'wp_set_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}

		wp_set_post_lock( $request['id'] );
		$lock = $this->get_lock( $request['id'] );

		return $this->prepare_item_for_response( $lock, $request );
	}

	/**
	 * Delete post lock
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response Response object on success.
	 */
	public function delete_item( $request ) {
		$lock     = $this->get_lock( $request['id'] );
		$previous = $this->prepare_item_for_response( $lock, $request );
		$result   = delete_post_meta( $request['id'], '_edit_lock' );
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
	 * @return array|false Lock as string or default to false.
	 */
	protected function get_lock( $post_id ) {
		$lock = get_post_meta( $post_id, '_edit_lock', true );

		if ( $lock ) {
			$_lock                = explode( ':', $lock );
			list ( $time, $user ) = $_lock;
			if ( $time && $user ) {
				$lock = compact( 'time', 'user' );
			}
		}

		return $lock;
	}

	/**
	 * Prepares a single lock output for response.
	 *
	 * @param array|false     $lock Lock value, default to false is not set.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_item_for_response( $lock, $request ) {
		$nonce = wp_create_nonce( 'wp_rest' );
		$data  = [
			'locked' => false,
			'nonce'  => $nonce,
		];

		if ( $lock ) {
			/** This filter is documented in wp-admin/includes/ajax-actions.php */
			$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

			if ( $lock['time'] && $lock['time'] > time() - $time_window ) {
				$data = [
					'locked' => true,
					'time'   => $lock['time'],
					'user'   => (int) $lock['user'],
					'nonce'  => $nonce,
				];
			}
		}
		// Wrap the data in a response object.
		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		$response = rest_ensure_response( $data );
		if ( ! is_wp_error( $response ) ) {
			$response->add_links( $this->prepare_links( $lock, $request['id'] ) );
		}

		return $response;
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param array|false $lock Lock state.
	 * @param int         $post_id Post object ID.
	 * @return array Links for the given term.
	 */
	protected function prepare_links( $lock, $post_id ) {
		$base  = $this->namespace . '/' . $this->rest_base;
		$links = [
			'self' => [
				'href' => rest_url( trailingslashit( $base ) . $post_id . '/lock' ),
			],
		];

		if ( $lock ) {
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
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
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
