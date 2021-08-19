<?php
/**
 * Class Media_Hotlinking_Controller
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

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Post_Type;
use Google\Web_Stories\Traits\Types;
use phpDocumentor\Reflection\Types\Integer;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * API endpoint to allow pinging url media assets.
 *
 * Class Media_Hotlinking_Controller
 */
class Media_Hotlinking_Controller extends REST_Controller {
	use Post_Type, Types;
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'url';
	}

	/**
	 * Registers routes for links.
	 *
	 * @since 1.11.0
	 *
	 * @see register_rest_route()
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'parse_url' ],
					'permission_callback' => [ $this, 'parse_url_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
	}

	/**
	 * Parses a URL to return some metadata for inserting external media.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function parse_url( $request ) {
		$url = untrailingslashit( $request['url'] );

		/**
		 * Filters the link data TTL value.
		 *
		 * @since 1.11.0
		 *
		 * @param int $time Time to live (in seconds). Default is 1 day.
		 * @param string $url The attempted URL.
		 */
		$cache_ttl = apply_filters( 'web_stories_url_data_cache_ttl', DAY_IN_SECONDS, $url );
		$cache_key = 'web_stories_url_data_' . md5( $url );

		$data = get_transient( $cache_key );
		if ( ! empty( $data ) ) {
			$response = $this->prepare_item_for_response( json_decode( $data, true ), $request );

			return rest_ensure_response( $response );
		}

		$response = wp_safe_remote_head( $url );
		if ( is_wp_error( $response ) && 'http_request_failed' === $response->get_error_code() ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		$headers = wp_remote_retrieve_headers( $response );

		$mime_type = $headers['content-type'];

		$path = wp_parse_url( $url, PHP_URL_PATH );
		$exts = $this->get_file_type_exts( [ $mime_type ] );
		$ext  = '';
		if ( $exts ) {
			$ext = end( $exts );
		}
		$file_size = (int) $headers['content-length'];

		$file_name = basename( $path );
		$data      = [
			'ext'       => $ext,
			'file_name' => $file_name,
			'file_size' => $file_size,
			'mime_type' => $mime_type,
		];

		set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );

		$response = $this->prepare_item_for_response( $data, $request );

		return rest_ensure_response( $response );
	}


	/**
	 * Prepares response asset response.
	 *
	 * @since 1.11.0
	 *
	 * @param array           $link URL data value, default to false is not set.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_item_for_response( $link, $request ) {
		$fields = $this->get_fields_for_response( $request );
		$schema = $this->get_item_schema();

		$data = [];

		$error = new WP_Error();
		foreach ( $schema['properties'] as $field => $args ) {
			if ( rest_is_field_included( $field, $fields ) ) {
				$check = rest_validate_value_from_schema( $link[ $field ], $args, $field );
				if ( is_wp_error( $check ) ) {
					$error->add( 'rest_invalid_' . $field, $check->get_error_message(), [ 'status' => 400 ] );
				}

				$data[ $field ] = rest_sanitize_value_from_schema( $link[ $field ], $args, $field );
			}
		}

		if ( $error->get_error_codes() ) {
			return $error;
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );

		return $response;
	}

	/**
	 * Retrieves the link's schema, conforming to JSON Schema.
	 *
	 * @since 1.11.0
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$allowed_mime_types = $this->get_allowed_mime_types();
		$allowed_mime_types = array_merge( ...array_values( $allowed_mime_types ) );
		$exts               = $this->get_file_type_exts( $allowed_mime_types );

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'link',
			'type'       => 'object',
			'properties' => [
				'ext'       => [
					'description' => __( 'File extension', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'enum'        => $exts,
				],
				'file_name' => [
					'description' => __( 'File name', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'file_size' => [
					'description' => __( 'File size', 'web-stories' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'mime_type' => [
					'description' => __( 'Mime Type', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'enum'        => $allowed_mime_types,
				],
			],
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Checks if current user can process links.
	 *
	 * @since 1.11.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function parse_url_permissions_check() {
		if ( ! $this->get_post_type_cap( Story_Post_Type::POST_TYPE_SLUG, 'edit_posts' ) ) {
			return new WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed to insert external media.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}

	/**
	 * Callback to validate urls.
	 *
	 * @since 1.11.0
	 *
	 * @param mixed $value Value to be validated.
	 *
	 * @return true|WP_Error
	 */
	public function validate_url( $value ) {
		$url = untrailingslashit( $value );

		if ( empty( $url ) ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 400 ] );
		}

		$parts = wp_parse_url( $url );

		if ( ! isset( $parts['host'] ) ) {
			return new WP_Error( 'rest_invalid_url_host', __( 'Invalid URL Host', 'web-stories' ), [ 'status' => 400 ] );
		}

		if ( ! isset( $parts['path'] ) || empty( $parts['path'] ) ) {
			return new WP_Error( 'rest_invalid_url_path', __( 'Invalid URL Path', 'web-stories' ), [ 'status' => 400 ] );
		}

		return true;
	}

	/**
	 * Retrieves the query params for the posts collection.
	 *
	 * @since 1.11.0
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		return [
			'context' => $this->get_context_param(),
			'url'     => [
				'description'       => __( 'The URL to process.', 'web-stories' ),
				'required'          => true,
				'type'              => 'string',
				'format'            => 'uri',
				'validate_callback' => [ $this, 'validate_url' ],
			],
		];
	}
}
