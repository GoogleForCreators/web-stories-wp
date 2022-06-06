<?php
/**
 * Class Stories_Base_Controller
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

use Google\Web_Stories\Decoder;
use Google\Web_Stories\Services;
use stdClass;
use WP_Error;
use WP_Post;
use WP_REST_Posts_Controller;
use WP_REST_Request;
use WP_REST_Response;

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
		$post_type_object = get_post_type_object( $post_type );
		$this->namespace  = isset( $post_type_object, $post_type_object->rest_namespace ) && \is_string( $post_type_object->rest_namespace ) ?
			$post_type_object->rest_namespace :
			'web-stories/v1';

		$injector = Services::get_injector();
		if ( ! method_exists( $injector, 'make' ) ) {
			return;
		}
		$this->decoder = $injector->make( Decoder::class );
	}

	/**
	 * Prepares a single story for create or update. Add post_content_filtered field to save/insert.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return stdClass|WP_Error Post object or WP_Error.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_post = parent::prepare_item_for_database( $request );

		if ( is_wp_error( $prepared_post ) ) {
			return $prepared_post;
		}

		$schema = $this->get_item_schema();
		// Post content.
		if ( ! empty( $schema['properties']['content'] ) ) {

			// Ensure that content and story_data are updated together.
			if (
				( ! empty( $request['story_data'] ) && empty( $request['content'] ) ) ||
				( ! empty( $request['content'] ) && empty( $request['story_data'] ) )
			) {
				return new \WP_Error( 'rest_empty_content', __( 'content and story_data should always be updated together.', 'web-stories' ), [ 'status' => 412 ] );
			}

			if ( isset( $request['content'] ) ) {
				$prepared_post->post_content = $this->decoder->base64_decode( $prepared_post->post_content );
			}
		}

		// If the request is updating the content as well, let's make sure the JSON representation of the story is saved, too.
		if ( ! empty( $schema['properties']['story_data'] ) && isset( $request['story_data'] ) ) {
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
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $post, $request ): WP_REST_Response {
		$response = parent::prepare_item_for_response( $post, $request );
		$fields   = $this->get_fields_for_response( $request );
		$schema   = $this->get_item_schema();

		/**
		 * Response data.
		 *
		 * @var array $data
		 */
		$data = $response->get_data();

		if ( rest_is_field_included( 'story_data', $fields ) ) {
			$post_story_data    = json_decode( $post->post_content_filtered, true );
			$data['story_data'] = rest_sanitize_value_from_schema( $post_story_data, $schema['properties']['story_data'] );
		}

		/**
		 * Request context.
		 *
		 * @var string $context
		 */
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

		/** This filter is documented in wp-includes/rest-api/endpoints/class-wp-rest-posts-controller.php */
		return apply_filters( "rest_prepare_{$this->post_type}", $response, $post, $request );
	}

	/**
	 * Creates a single story.
	 *
	 * Override the existing method so we can set parent id.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, WP_Error object on failure.
	 */
	public function create_item( $request ) {
		/**
		 * Original post ID.
		 *
		 * @var int $original_id
		 */
		$original_id = ! empty( $request['original_id'] ) ? $request['original_id'] : null;
		if ( ! $original_id ) {
			return parent::create_item( $request );
		}

		$original_post = $this->get_post( $original_id );
		if ( is_wp_error( $original_post ) ) {
			return $original_post;
		}

		if ( ! $this->check_read_permission( $original_post ) ) {
			return new \WP_Error(
				'rest_cannot_create',
				__( 'Sorry, you are not allowed to duplicate this story.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		$request->set_param( 'content', $original_post->post_content );
		$request->set_param( 'excerpt', $original_post->post_excerpt );

		$title = sprintf(
			/* translators: %s: story title. */
			__( '%s (Copy)', 'web-stories' ),
			$original_post->post_title
		);
		$request->set_param( 'title', $title );

		$story_data = json_decode( $original_post->post_content_filtered, true );
		if ( $story_data ) {
			$request->set_param( 'story_data', $story_data );
		}

		$thumbnail_id = get_post_thumbnail_id( $original_post );
		if ( $thumbnail_id ) {
			$request->set_param( 'featured_media', $thumbnail_id );
		}

		return parent::create_item( $request );
	}

	/**
	 * Retrieves the story's schema, conforming to JSON Schema.
	 *
	 * @since 1.0.0
	 *
	 * @return array Item schema as an array.
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = parent::get_item_schema();

		$schema['properties']['story_data'] = [
			'description' => __( 'Story data', 'web-stories' ),
			'type'        => 'object',
			'context'     => [ 'view', 'edit' ],
			'default'     => [],
		];

		$schema['properties']['original_id'] = [
			'description' => __( 'Unique identifier for original story id.', 'web-stories' ),
			'type'        => 'integer',
			'context'     => [ 'view', 'edit', 'embed' ],
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Prepares links for the request.
	 *
	 * Ensures that {@see Stories_Users_Controller} is used for author embeds.
	 *
	 * @since 1.10.0
	 *
	 * @param WP_Post $post Post object.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $post ): array {
		$links = parent::prepare_links( $post );

		if ( ! empty( $post->post_author ) && post_type_supports( $post->post_type, 'author' ) ) {
			$links['author'] = [
				'href'       => rest_url( sprintf( '%s/%s/%s', $this->namespace, 'users', $post->post_author ) ),
				'embeddable' => true,
			];
		}

		// If we have a featured media, add that.
		$featured_media = get_post_thumbnail_id( $post->ID );
		if ( $featured_media ) {
			$image_url = rest_url( sprintf( '%s/%s/%s', $this->namespace, 'media', $featured_media ) );

			$links['https://api.w.org/featuredmedia'] = [
				'href'       => $image_url,
				'embeddable' => true,
			];
		}

		if ( ! \in_array( $post->post_type, [ 'attachment', 'nav_menu_item', 'revision' ], true ) ) {
			$attachments_url = rest_url( sprintf( '%s/%s', $this->namespace, 'media' ) );
			$attachments_url = add_query_arg( 'parent', $post->ID, $attachments_url );

			$links['https://api.w.org/attachment'] = [
				'href' => $attachments_url,
			];
		}

		$links = $this->add_taxonomy_links( $links, $post );

		return $links;
	}

	/**
	 * Adds a REST API links for the taxonomies.
	 *
	 * @since 1.12.0
	 *
	 * @param array   $links Links for the given post.
	 * @param WP_Post $post Post object.
	 * @return array Modified list of links.
	 */
	private function add_taxonomy_links( array $links, WP_Post $post ): array {
		$taxonomies = get_object_taxonomies( $post->post_type, 'objects' );

		if ( empty( $taxonomies ) ) {
			return $links;
		}
		$links['https://api.w.org/term'] = [];

		foreach ( $taxonomies as $taxonomy_obj ) {
			// Skip taxonomies that are not public.
			if ( empty( $taxonomy_obj->show_in_rest ) ) {
				continue;
			}

			$controller = $taxonomy_obj->get_rest_controller();

			if ( ! $controller ) {
				continue;
			}

			$namespace = method_exists( $controller, 'get_namespace' ) ? $controller->get_namespace() : 'wp/v2';
			$tax       = $taxonomy_obj->name;
			$tax_base  = ! empty( $taxonomy_obj->rest_base ) ? $taxonomy_obj->rest_base : $tax;

			$query_params = [ 
				'post'     => $post->ID,
				'per_page' => 100,
			];

			$terms_url = add_query_arg(
				$query_params,
				rest_url( sprintf( '%s/%s', $namespace, $tax_base ) )
			);

			$links['https://api.w.org/term'][] = [
				'href'       => $terms_url,
				'taxonomy'   => $tax,
				'embeddable' => true,
			];
		}
		return $links;
	}

	/**
	 * Get the link relations available for the post and current user.
	 *
	 * @since 1.10.0
	 *
	 * @param WP_Post         $post    Post object.
	 * @param WP_REST_Request $request Request object.
	 * @return array List of link relations.
	 */
	protected function get_available_actions( $post, $request ): array {
		$rels = parent::get_available_actions( $post, $request );

		if ( $this->check_delete_permission( $post ) ) {
			$rels[] = 'https://api.w.org/action-delete';
		}

		if ( $this->check_update_permission( $post ) ) {
			$rels[] = 'https://api.w.org/action-edit';
		}

		return $rels;
	}

	/**
	 * Return namespace.
	 *
	 * @since 1.12.0
	 */
	public function get_namespace(): string {
		return $this->namespace;
	}
}
