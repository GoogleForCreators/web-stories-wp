<?php
/**
 * Class Page_Template_Controller
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

declare(strict_types = 1);

namespace Google\Web_Stories\REST_API;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Page_Template_Controller class.
 *
 * @phpstan-type SchemaEntry array{
 *   description: string,
 *   type: string,
 *   context: string[],
 *   default?: mixed,
 * }
 * @phpstan-type Schema array{
 *   properties: array{
 *     permalink_template?: SchemaEntry,
 *     generated_slug?: SchemaEntry
 *   }
 * }
 */
class Page_Template_Controller extends Stories_Base_Controller {
	/**
	 * Retrieves a collection of page templates.
	 *
	 * @since 1.7.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$response = parent::get_items( $request );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		if ( $request['_web_stories_envelope'] ) {
			/**
			 * Embed directive.
			 *
			 * @var string|string[] $embed
			 */
			$embed    = $request['_embed'] ?? false;
			$embed    = $embed ? rest_parse_embed_param( $embed ) : false;
			$response = rest_get_server()->envelope_response( $response, $embed );
		}
		return $response;
	}

	/**
	 * Retrieves the query params for the posts collection.
	 *
	 * @since 1.7.0
	 *
	 * @return array<string, array<string, mixed>> Collection parameters.
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

	/**
	 * Retrieves the attachment's schema, conforming to JSON Schema.
	 *
	 * Removes some unneeded fields to improve performance by
	 * avoiding some expensive database queries.
	 *
	 * @since 1.10.0
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

		/**
		 * Schema.
		 *
		 * @phpstan-var Schema $schema
		 */
		$schema = parent::get_item_schema();

		unset(
			$schema['properties']['permalink_template'],
			$schema['properties']['generated_slug']
		);

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
	 * Checks if a given request has access to read posts.
	 *
	 * @since 1.14.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$ret = parent::get_items_permissions_check( $request );

		if ( is_wp_error( $ret ) ) {
			return $ret;
		}

		$post_type = get_post_type_object( $this->post_type );

		if ( ! $post_type || ! current_user_can( $post_type->cap->edit_posts ) ) {
			return new \WP_Error(
				'rest_forbidden_context',
				__( 'Sorry, you are not allowed to edit page templates.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Checks if a given request has access to read a post.
	 *
	 * @since 1.14.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access for the item, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		$ret = parent::get_item_permissions_check( $request );

		if ( is_wp_error( $ret ) ) {
			return $ret;
		}

		$post_type = get_post_type_object( $this->post_type );

		if ( ! $post_type || ! current_user_can( $post_type->cap->edit_posts ) ) {
			return new \WP_Error(
				'rest_forbidden_context',
				__( 'Sorry, you are not allowed to edit page templates.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}
}
