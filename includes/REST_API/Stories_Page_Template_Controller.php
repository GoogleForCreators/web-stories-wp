<?php
/**
 * Class Stories_Page_Template_Controller
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

use stdClass;
use WP_Error;
use WP_Post;
use WP_REST_Posts_Controller;
use WP_REST_Request;
use WP_REST_Response;
/**
 * Class Stories_Page_Template_Controller
 *
 * @package Google\Web_Stories\REST_API
 */
class Stories_Page_Template_Controller extends WP_REST_Posts_Controller {
	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @since 1.6.0
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type ) {
		parent::__construct( $post_type );
		$this->namespace = 'web-stories/v1';
	}

	/**
	 * Prepares a single story for create or update. Add post_content_filtered field to save/insert.
	 *
	 * @since 1.6.0
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

		// If the request is updating the content as well, let's make sure the JSON representation of the story is saved, too.
		if ( isset( $request['page_data'] ) ) {
			$prepared_post->post_content_filtered = wp_json_encode( $request['page_data'] );
		}

		return $prepared_post;
	}

	/**
	 * Prepares a single template output for response.
	 *
	 * Adds post_content_filtered field to output.
	 *
	 * @since 1.6.0
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

		if ( in_array( 'page_data', $fields, true ) ) {
			$post_page_data    = json_decode( $post->post_content_filtered );
			$data['page_data'] = rest_sanitize_value_from_schema( $post_page_data, $schema['properties']['page_data'] );
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

		$schema['properties']['page_data'] = [
			'description' => __( 'Page template data stored as a JSON object. Stored in post_content_filtered field.', 'web-stories' ),
			'type'        => 'object',
			'context'     => [ 'view', 'edit', 'embed' ],
			'default'     => [],
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}
}
