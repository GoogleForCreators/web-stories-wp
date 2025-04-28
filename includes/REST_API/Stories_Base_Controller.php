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

declare(strict_types = 1);

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
 * @SuppressWarnings("PHPMD.ExcessiveClassComplexity")
 *
 * Override the WP_REST_Posts_Controller class to add `post_content_filtered` to REST request.
 *
 * @phpstan-type Link array{
 *   href?: string,
 *   embeddable?: bool,
 *   taxonomy?: string
 * }
 * @phpstan-type Links array<string, Link|Link[]>
 * @phpstan-type SchemaEntry array{
 *   description: string,
 *   type: string,
 *   context: string[],
 *   default?: mixed,
 * }
 * @phpstan-type Schema array{
 *   properties: array{
 *     content?: SchemaEntry,
 *     story_data?: SchemaEntry
 *   }
 * }
 * @phpstan-type RegisteredMetadata array{
 *   type: string,
 *   description: string,
 *   single: bool,
 *   sanitize_callback?: callable,
 *   auth_callback: callable,
 *   show_in_rest: bool|array{schema: array<string, mixed>},
 *   default?: mixed
 * }
 */
class Stories_Base_Controller extends WP_REST_Posts_Controller {
	/**
	 * Decoder instance.
	 *
	 * @var Decoder Decoder instance.
	 */
	private Decoder $decoder;

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

		$injector = Services::get_injector();
		/**
		 * Decoder instance.
		 *
		 * @var Decoder $decoder Decoder instance.
		 */
		$decoder = $injector->make( Decoder::class );

		$this->decoder = $decoder;
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
	 *
	 * @phpstan-param WP_REST_Request<covariant array{context: string}> $request
	 */
	public function prepare_item_for_response( $post, $request ): WP_REST_Response {
		$response = parent::prepare_item_for_response( $post, $request );
		$fields   = $this->get_fields_for_response( $request );

		/**
		 * Schema.
		 *
		 * @phpstan-var Schema $schema
		 */
		$schema = $this->get_item_schema();

		/**
		 * Response data.
		 *
		 * @var array<string,mixed> $data
		 */
		$data = $response->get_data();

		if ( ! empty( $schema['properties']['story_data'] ) && rest_is_field_included( 'story_data', $fields ) ) {
			$post_story_data    = json_decode( $post->post_content_filtered, true );
			$data['story_data'] = post_password_required( $post ) ? (object) [] : rest_sanitize_value_from_schema( $post_story_data, $schema['properties']['story_data'] );
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->filter_response_by_context( $data, $context );
		$links   = $response->get_links();

		// Wrap the data in a response object.
		$response = new WP_REST_Response( $data );
		foreach ( $links as $rel => $rel_links ) {
			foreach ( $rel_links as $link ) {
				// @phpstan-ignore method.internal (false positive)
				$response->add_link( $rel, $link['href'], $link['attributes'] );
			}
		}

		/** This filter is documented in wp-includes/rest-api/endpoints/class-wp-rest-posts-controller.php */
		return apply_filters( "rest_prepare_{$this->post_type}", $response, $post, $request );
	}

	/**
	 * Retrieves the story's schema, conforming to JSON Schema.
	 *
	 * @since 1.0.0
	 *
	 * @return array Item schema data.
	 *
	 * @phpstan-return Schema
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			/**
			 * Schema.
			 *
			 * @phpstan-var Schema $schema
			 */
			$schema = $this->add_additional_fields_schema( $this->schema );
			return $schema;
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

		/**
		 * Schema.
		 *
		 * @phpstan-var Schema $schema
		 */
		$schema = $this->add_additional_fields_schema( $this->schema );
		return $schema;
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

		/**
		 * Schema.
		 *
		 * @phpstan-var Schema $schema
		 */
		$schema = $this->get_item_schema();

		// Post content.
		if ( ! empty( $schema['properties']['content'] ) ) {

			// Ensure that content and story_data are updated together.
			// Exception: new auto-draft created from a template.
			if (
				(
				( ! empty( $request['story_data'] ) && empty( $request['content'] ) ) ||
				( ! empty( $request['content'] ) && empty( $request['story_data'] ) )
				) && ( 'auto-draft' !== $prepared_post->post_status )
			) {
				return new \WP_Error(
					'rest_empty_content',
					\sprintf(
						/* translators: 1: content, 2: story_data */
						__( '%1$s and %2$s should always be updated together.', 'web-stories' ),
						'content',
						'story_data'
					),
					[ 'status' => 412 ]
				);
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
	 * Get registered post meta.
	 *
	 * @since 1.23.0
	 *
	 * @param WP_Post $original_post Post Object.
	 * @return array<string, mixed> $meta
	 */
	protected function get_registered_meta( WP_Post $original_post ): array {
		$meta_keys = get_registered_meta_keys( 'post', $this->post_type );
		$meta      = [];
		/**
		 * Meta key settings.
		 *
		 * @var array $settings
		 * @phpstan-var RegisteredMetadata $settings
		 */
		foreach ( $meta_keys as $key => $settings ) {
			if ( $settings['show_in_rest'] ) {
				$meta[ $key ] = get_post_meta( $original_post->ID, $key, $settings['single'] );
			}
		}

		return $meta;
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
	 *
	 * @phpstan-return Links
	 */
	protected function prepare_links( $post ): array {
		$links = parent::prepare_links( $post );

		if ( ! empty( $post->post_author ) && post_type_supports( $post->post_type, 'author' ) ) {
			$links['author'] = [
				'href'       => rest_url( \sprintf( '%s/%s/%s', $this->namespace, 'users', $post->post_author ) ),
				'embeddable' => true,
			];
		}

		// If we have a featured media, add that.
		$featured_media = get_post_thumbnail_id( $post->ID );
		if ( $featured_media ) {
			$image_url = rest_url( \sprintf( '%s/%s/%s', $this->namespace, 'media', $featured_media ) );

			$links['https://api.w.org/featuredmedia'] = [
				'href'       => $image_url,
				'embeddable' => true,
			];
		}

		if ( ! \in_array( $post->post_type, [ 'attachment', 'nav_menu_item', 'revision' ], true ) ) {
			$attachments_url = rest_url( \sprintf( '%s/%s', $this->namespace, 'media' ) );
			$attachments_url = add_query_arg( 'parent', $post->ID, $attachments_url );

			$links['https://api.w.org/attachment'] = [
				'href' => $attachments_url,
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
	 * @return string[] List of link relations.
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
}
