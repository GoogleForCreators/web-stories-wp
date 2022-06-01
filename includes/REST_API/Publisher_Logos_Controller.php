<?php
/**
 * Class Publisher_Logos_Controller
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
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
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use WP_Error;
use WP_Post;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Class to access publisher logos via the REST API.
 *
 * @since 1.12.0
 */
class Publisher_Logos_Controller extends REST_Controller implements HasRequirements {

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Constructor.
	 *
	 * @param Settings        $settings Settings instance.
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Settings $settings, Story_Post_Type $story_post_type ) {
		$this->settings        = $settings;
		$this->story_post_type = $story_post_type;

		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'publisher-logos';
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
		return [ 'settings', 'story_post_type' ];
	}

	/**
	 * Registers routes for links.
	 *
	 * @since 1.12.0
	 *
	 * @see register_rest_route()
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'permissions_check' ],
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			[
				'args' => [
					'id' => [
						'description' => __( 'Publisher logo ID.', 'web-stories' ),
						'type'        => 'integer',
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
					'permission_callback' => [ $this, 'permissions_check' ],
				],
			]
		);
	}

	/**
	 * Checks if a given request has access to get and create items.
	 *
	 * @since 1.12.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function permissions_check() {
		if ( ! $this->story_post_type->has_cap( 'edit_posts' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to manage publisher logos.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Checks if a given request has access to manage a single item.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to manage publisher logos.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Retrieves all active publisher logos.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$publisher_logos_ids = (array) $this->settings->get_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, [] );
		_prime_post_caches( $publisher_logos_ids );
		$publisher_logos = $this->filter_publisher_logos( $publisher_logos_ids );
		$results         = [];

		foreach ( $publisher_logos as $logo ) {
			/**
			 * We're expecting a post object after the filtering above.
			 *
			 * @var WP_Post $post
			 */
			$post = get_post( $logo );

			$data      = $this->prepare_item_for_response( $post, $request );
			$results[] = $this->prepare_response_for_collection( $data );
		}

		// Ensure the default publisher logo is first in the list.
		$active = array_column( $results, 'active' );
		array_multisort( $active, SORT_DESC, $results );

		return rest_ensure_response( $results );
	}

	/**
	 * Adds a new publisher logo to the collection.
	 *
	 * Supports adding multiple logos at once.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		$publisher_logos = $this->filter_publisher_logos( (array) $this->settings->get_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, [] ) );

		/**
		 * Publisher logo ID(s).
		 *
		 * Could be a single attachment ID or an array of attachment IDs.
		 *
		 * @var int|int[] $logo_id
		 */
		$logo_id = $request['id'];

		$posts = (array) $logo_id;

		if ( empty( $posts ) ) {
			return new \WP_Error(
				'rest_invalid_id',
				__( 'Invalid ID', 'web-stories' ),
				[ 'status' => 400 ]
			);
		}

		foreach ( $posts as $post_id ) {
			$post = get_post( $post_id );

			if ( ! $post || 'attachment' !== $post->post_type ) {
				return new \WP_Error(
					'rest_invalid_id',
					__( 'Invalid ID', 'web-stories' ),
					[ 'status' => 400 ]
				);
			}

			if ( \in_array( $post->ID, $publisher_logos, true ) ) {
				return new \WP_Error(
					'rest_publisher_logo_exists',
					__( 'Publisher logo already exists', 'web-stories' ),
					[ 'status' => 400 ]
				);
			}

			$publisher_logos[] = $post->ID;
		}

		$this->settings->update_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, $publisher_logos );

		$active_publisher_logo_id = absint( $this->settings->get_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO ) );

		if ( 1 === \count( $publisher_logos ) || ! \in_array( $active_publisher_logo_id, $publisher_logos, true ) ) {
			$this->settings->update_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $posts[0] );
		}

		$results = [];

		foreach ( $posts as $post ) {
			/**
			 * Post object.
			 *
			 * @var WP_Post $post
			 */
			$post = get_post( $post );

			$data = $this->prepare_item_for_response( $post, $request );

			if ( 1 === \count( $posts ) ) {
				return $data;
			}

			$results[] = $this->prepare_response_for_collection( $data );
		}

		return rest_ensure_response( $results );
	}

	/**
	 * Removes a publisher logo from the collection.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		/**
		 * Publisher logo ID.
		 *
		 * @var int $logo_id
		 */
		$logo_id = $request['id'];

		$post = $this->get_publisher_logo( $logo_id );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$prepared = $this->prepare_item_for_response( $post, $request );

		$publisher_logos = $this->filter_publisher_logos( (array) $this->settings->get_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, [] ) );
		$publisher_logos = array_values( array_diff( $publisher_logos, [ $post->ID ] ) );

		$active_publisher_logo_id = absint( $this->settings->get_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO ) );

		if ( $post->ID === $active_publisher_logo_id || ! \in_array( $active_publisher_logo_id, $publisher_logos, true ) ) {
			// Mark the first available publisher logo as the new default.
			$this->settings->update_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, ! empty( $publisher_logos[0] ) ? $publisher_logos[0] : 0 );
		}

		$this->settings->update_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, $publisher_logos );

		return new WP_REST_Response(
			[
				'deleted'  => true,
				'previous' => $prepared->get_data(),
			]
		);
	}

	/**
	 * Updates a publisher logo in the collection.
	 *
	 * Can only be used to make it the "active" one.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		/**
		 * Publisher logo ID.
		 *
		 * @var int $logo_id
		 */
		$logo_id = $request['id'];

		$post = $this->get_publisher_logo( $logo_id );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		if ( $request['active'] ) {
			$this->settings->update_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $post->ID );
		}

		return $this->prepare_item_for_response( $post, $request );
	}

	/**
	 * Get an existing publisher logo's post object, if valid.
	 *
	 * @since 1.12.0
	 *
	 * @param int $id Supplied ID.
	 * @return WP_Post|WP_Error Post object if ID is valid, WP_Error otherwise.
	 */
	protected function get_publisher_logo( $id ) {
		$publisher_logos = $this->filter_publisher_logos( (array) $this->settings->get_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, [] ) );

		$post = get_post( $id );

		if ( ! $post || ! \in_array( $post->ID, $publisher_logos, true ) ) {
			return new \WP_Error(
				'rest_invalid_id',
				__( 'Invalid ID', 'web-stories' ),
				[ 'status' => 400 ]
			);
		}

		return $post;
	}

	/**
	 * Prepares a single publisher logo output for response.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_Post         $post    Post object.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $post, $request ): WP_REST_Response {
		$fields = $this->get_fields_for_response( $request );

		// Base fields for every post.
		$data = [];

		if ( rest_is_field_included( 'id', $fields ) ) {
			$data['id'] = $post->ID;
		}

		if ( rest_is_field_included( 'title', $fields ) ) {
			$data['title'] = get_the_title( $post->ID );
		}

		if ( rest_is_field_included( 'active', $fields ) ) {
			$active_publisher_logo_id = absint( $this->settings->get_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO ) );
			$data['active']           = $post->ID === $active_publisher_logo_id;
		}

		if ( rest_is_field_included( 'url', $fields ) ) {
			$data['url'] = wp_get_attachment_url( $post->ID );
		}

		/**
		 * Wrapped response object.
		 *
		 * @var WP_REST_Response $response Response object.
		 */
		$response = rest_ensure_response( $data );

		$links = $this->prepare_links( $post );
		$response->add_links( $links );

		return $response;
	}

	/**
	 * Filters publisher logos to remove non-existent or invalid ones.
	 *
	 * @param int[] $publisher_logos List of publisher logos.
	 * @return int[] Filtered list of publisher logos.
	 */
	protected function filter_publisher_logos( $publisher_logos ): array {
		return array_filter( $publisher_logos, 'wp_attachment_is_image' );
	}

	/**
	 * Prepares links for the request.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_Post $post Post object.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $post ): array {
		$base = sprintf( '%s/%s', $this->namespace, $this->rest_base );

		// Entity meta.
		$links = [
			'self'       => [
				'href' => rest_url( trailingslashit( $base ) . $post->ID ),
			],
			'collection' => [
				'href' => rest_url( $base ),
			],
		];

		return $links;
	}

	/**
	 * Retrieves the publisher logo's schema, conforming to JSON Schema.
	 *
	 * @since 1.12.0
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'publisher-logo',
			'type'       => 'object',
			'properties' => [
				'id'     => [
					'description' => __( 'Publisher logo ID.', 'web-stories' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'title'  => [
					'description' => __( 'Publisher logo title.', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'url'    => [
					'description' => __( 'Publisher logo URL.', 'web-stories' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'active' => [
					'description' => __( 'Whether the publisher logo is the default one.', 'web-stories' ),
					'type'        => 'boolean',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
			],
		];

		return $schema;
	}
}
