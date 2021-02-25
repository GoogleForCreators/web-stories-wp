<?php
/**
 * Class Stories_Base_Controller
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

use Google\Web_Stories\Decoder;
use Google\Web_Stories\Experiments;
use Google\Web_Stories\Media;
use stdClass;
use WP_Error;
use WP_Post;
use WP_REST_Posts_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Stories_Base_Controller class.
 *
 * Override the WP_REST_Posts_Controller class to add `post_content_filtered` to REST request.
 */
class Stories_Base_Controller extends WP_REST_Posts_Controller {
	/**
	 * Decoder instance.
	 *
	 * @var Decoder Decoder instance.
	 */
	private $decoder;

	/**
	 * Experiments.
	 *
	 * @var Experiments
	 */
	private $experiments;

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
		$this->namespace   = 'web-stories/v1';
		$this->decoder     = new Decoder();
		$this->experiments = new Experiments();
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 *
	 * @return void
	 */
	public function register_routes() {
		parent::register_routes();

		if ( ! $this->experiments->is_experiment_enabled( 'enablePostLocking' ) ) {
			return;
		}

		$lock_args = [];

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
					'callback'            => [ $this, 'get_lock' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $lock_args,
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_lock' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $lock_args,
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_lock' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $lock_args,
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
	public function get_lock( $request ) {
		return $this->prepare_lock_for_response( $request );
	}

	/**
	 * Update post lock
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success.
	 */
	public function update_lock( $request ) {
		if ( ! function_exists( 'wp_set_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}

		wp_set_post_lock( $request['id'] );

		return $this->prepare_lock_for_response( $request );
	}

	/**
	 * Delete post lock
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response Response object on success.
	 */
	public function delete_lock( $request ) {
		$previous = $this->prepare_lock_for_response( $request );
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
	 * Prepares a single lock output for response.
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_lock_for_response( $request ) {
		$lock = get_post_meta( $request['id'], '_edit_lock', true );

		$data  = [
			'locked' => false,
		];
		$links = [];

		if ( $lock ) {
			$lock                 = explode( ':', $lock );
			list ( $time, $user ) = $lock;

			/** This filter is documented in wp-admin/includes/ajax-actions.php */
			$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

			if ( $time && $time > time() - $time_window ) {
				$data = [
					'locked' => true,
					'time'   => $time,
					'user'   => (int) $user,
				];

				$links['author'] = [
					'href'       => rest_url( 'web-stories/v1/users/' . $user ),
					'embeddable' => true,
				];
			}
		}
		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );
		if ( ! is_wp_error( $response ) ) {
			$response->add_links( $links );
		}

		return $response;
	}

	/**
	 * Prepares a single story for create or update. Add post_content_filtered field to save/insert.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return stdClass|WP_Error Post object or WP_Error.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_post = parent::prepare_item_for_database( $request );

		if ( is_wp_error( $prepared_post ) ) {
			return $prepared_post;
		}

		// Ensure that content and story_data are updated together.
		if (
			( ! empty( $request['story_data'] ) && empty( $request['content'] ) ) ||
			( ! empty( $request['content'] ) && empty( $request['story_data'] ) )
		) {
			return new WP_Error( 'rest_empty_content', __( 'content and story_data should always be updated together.', 'web-stories' ), [ 'status' => 412 ] );
		}

		if ( isset( $request['content'] ) ) {
			$prepared_post->post_content = $this->decoder->base64_decode( $prepared_post->post_content );
		}

		// If the request is updating the content as well, let's make sure the JSON representation of the story is saved, too.
		if ( isset( $request['story_data'] ) ) {
			$prepared_post->post_content_filtered = wp_json_encode( $request['story_data'] );
		}

		return $prepared_post;
	}

	/**
	 * Prepares a single template output for response.
	 *
	 * Adds post_content_filtered field to output.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post         $post Post object.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $post, $request ) {
		$response = parent::prepare_item_for_response( $post, $request );
		$fields   = $this->get_fields_for_response( $request );
		$data     = $response->get_data();
		$schema   = $this->get_item_schema();

		if ( in_array( 'story_data', $fields, true ) ) {
			$post_story_data    = json_decode( $post->post_content_filtered, true );
			$data['story_data'] = rest_sanitize_value_from_schema( $post_story_data, $schema['properties']['story_data'] );
		}

		if ( in_array( 'featured_media_url', $fields, true ) ) {
			$image                      = get_the_post_thumbnail_url( $post, Media::POSTER_PORTRAIT_IMAGE_SIZE );
			$data['featured_media_url'] = ! empty( $image ) ? $image : $schema['properties']['featured_media_url']['default'];
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->filter_response_by_context( $data, $context );
		$links   = $response->get_links();

		// Wrap the data in a response object.
		$response = new WP_REST_Response( $data );
		foreach ( $links as $rel => $rel_links ) {
			foreach ( $rel_links as $link ) {
				$response->add_link( $rel, $link['href'], $link['attributes'] );
			}
		}

		/* This filter is documented in wp-includes/rest-api/endpoints/class-wp-rest-posts-controller.php */
		return apply_filters( "rest_prepare_{$this->post_type}", $response, $post, $request );
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param WP_Post $post Post object.
	 *
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $post ) {
		$links = parent::prepare_links( $post );

		if ( ! $this->experiments->is_experiment_enabled( 'enablePostLocking' ) ) {
			return $links;
		}

		$base     = sprintf( '%s/%s', $this->namespace, $this->rest_base );
		$lock_url = rest_url( trailingslashit( $base ) . $post->ID . '/lock' );

		$links['https://api.w.org/lock'] = [
			'href'       => $lock_url,
			'embeddable' => true,
		];

		$lock = get_post_meta( $post->ID, '_edit_lock', true );

		if ( $lock ) {
			$lock                 = explode( ':', $lock );
			list ( $time, $user ) = $lock;

			/** This filter is documented in wp-admin/includes/ajax-actions.php */
			$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

			if ( $time && $time > time() - $time_window ) {
				$links['https://api.w.org/lockuser'] = [
					'href'       => rest_url( sprintf( '%s/%s', $this->namespace, 'users/' ) . $user ),
					'embeddable' => true,
				];
			}
		}

		return $links;
	}

	/**
	 * Retrieves the story's schema, conforming to JSON Schema.
	 *
	 * @since 1.0.0
	 *
	 * @return array Item schema as an array.
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = parent::get_item_schema();

		$schema['properties']['story_data'] = [
			'description' => __( 'Story data stored as a JSON object. Stored in post_content_filtered field.', 'web-stories' ),
			'type'        => 'object',
			'context'     => [ 'edit' ],
			'default'     => [],
		];

		$schema['properties']['featured_media_url'] = [
			'description' => __( 'URL for the story\'s poster image (portrait)', 'web-stories' ),
			'type'        => 'string',
			'format'      => 'uri',
			'context'     => [ 'view', 'edit', 'embed' ],
			'readonly'    => true,
			'default'     => '',
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}
}
