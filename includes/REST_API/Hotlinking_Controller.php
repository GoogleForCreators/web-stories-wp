<?php
/**
 * Class Hotlinking_Controller
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

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Post_Type;
use Google\Web_Stories\Traits\Types;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * API endpoint to allow pinging url media assets.
 *
 * Class Hotlinking_Controller
 */
class Hotlinking_Controller extends REST_Controller implements HasRequirements {
	use Post_Type, Types;

	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

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
	 * @param Experiments     $experiments Experiments instance.
	 *
	 * @return void
	 */
	public function __construct( Story_Post_Type $story_post_type, Experiments $experiments ) {
		$this->story_post_type = $story_post_type;
		$this->experiments     = $experiments;

		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'hotlink';
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
	 * Registers routes for urls.
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
			'/' . $this->rest_base . '/validate',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'parse_url' ],
					'permission_callback' => [ $this, 'parse_url_permissions_check' ],
					'args'                => [
						'url' => [
							'description'       => __( 'The URL to process.', 'web-stories' ),
							'required'          => true,
							'type'              => 'string',
							'format'            => 'uri',
							'validate_callback' => [ $this, 'validate_url' ],
						],
					],
				],
			]
		);

		if ( ! $this->experiments->is_experiment_enabled( 'enableCORSProxy' ) ) {
			return;
		}

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/proxy',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'proxy_url' ],
					'permission_callback' => [ $this, 'parse_url_permissions_check' ],
					'args'                => [
						'url' => [
							'description'       => __( 'The URL to process.', 'web-stories' ),
							'required'          => true,
							'type'              => 'string',
							'format'            => 'uri',
							'validate_callback' => [ $this, 'validate_url' ],
						],
					],
				],
			]
		);
	}

	/**
	 * Parses a URL to return some metadata for inserting external media.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
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
		 * Filters the hotlinking data TTL value.
		 *
		 * @since 1.11.0
		 *
		 * @param int $time Time to live (in seconds). Default is 1 day.
		 * @param string $url The attempted URL.
		 */
		$cache_ttl = apply_filters( 'web_stories_hotlinking_url_data_cache_ttl', DAY_IN_SECONDS, $url );
		$cache_key = 'web_stories_url_data_' . md5( $url );

		$data = get_transient( $cache_key );
		if ( ! empty( $data ) ) {
			$response = $this->prepare_item_for_response( json_decode( $data, true ), $request );

			return rest_ensure_response( $response );
		}

		$response = wp_safe_remote_head(
			$url,
			[
				/** This filter is documented in wp-includes/class-http.php */
				'redirection' => apply_filters( 'http_request_redirection_count', 5, $url ),
			]
		);
		if ( is_wp_error( $response ) && 'http_request_failed' === $response->get_error_code() ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		$headers   = wp_remote_retrieve_headers( $response );
		$mime_type = $headers['content-type'];
		$file_size = (int) $headers['content-length'];

		$path      = wp_parse_url( $url, PHP_URL_PATH );
		$file_name = basename( $path );

		$exts = $this->get_file_type_exts( [ $mime_type ] );
		$ext  = '';
		if ( $exts ) {
			$ext = end( $exts );
		}

		$allowed_mime_types = $this->get_allowed_mime_types();
		$type               = '';
		foreach ( $allowed_mime_types as $key => $mime_types ) {
			if ( in_array( $mime_type, $mime_types, true ) ) {
				$type = $key;
				break;
			}
		}

		$data = [
			'ext'       => $ext,
			'file_name' => $file_name,
			'file_size' => $file_size,
			'mime_type' => $mime_type,
			'type'      => $type,
		];

		set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );

		$response = $this->prepare_item_for_response( $data, $request );

		return rest_ensure_response( $response );
	}

	/**
	 * Parses a URL to return proxied file.
	 *
	 * @since 1.13.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function proxy_url( $request ) {
		$url = untrailingslashit( $request['url'] );

		$args          = [
			'limit_response_size' => 15728640, // 15MB. @todo Remove this, when streaming is implemented.
			'timeout'             => 10, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
		];
		$proxy_request = wp_safe_remote_get( $url, $args );
		if ( is_wp_error( $proxy_request ) ) {
			$proxy_request->add_data( [ 'status' => 404 ] );
			return $proxy_request;
		}

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $proxy_request ) ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		$headers            = wp_remote_retrieve_headers( $proxy_request );
		$mime_type          = $headers['content-type'];
		$allowed_mime_types = $this->get_allowed_mime_types();
		$allowed_mime_types = array_merge( ...array_values( $allowed_mime_types ) );
		if ( ! in_array( $mime_type, $allowed_mime_types, true ) ) {
			return new WP_Error( 'rest_invalid_mime_type', __( 'Invalid Mime Type', 'web-stories' ), [ 'status' => 400 ] );
		}

		$file_size = (int) $headers['content-length'];

		$body = wp_remote_retrieve_body( $proxy_request );

		header( 'Content-Type: ' . $mime_type );
		header( 'Content-Length: ' . $file_size );

		echo $body; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

		exit;
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
			if ( ! rest_is_field_included( $field, $fields ) || ! isset( $link[ $field ] ) ) {
				continue;
			}
			$check = rest_validate_value_from_schema( $link[ $field ], $args, $field );
			if ( is_wp_error( $check ) ) {
				$error->add( 'rest_invalid_' . $field, $check->get_error_message(), [ 'status' => 400 ] );
				continue;
			}

			$data[ $field ] = rest_sanitize_value_from_schema( $link[ $field ], $args, $field );
		}

		if ( $error->get_error_codes() ) {
			return $error;
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		return rest_ensure_response( $data );
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
		$types              = array_keys( $allowed_mime_types );
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
					'description' => __( 'Mime type', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'enum'        => $allowed_mime_types,
				],
				'type'      => [
					'description' => __( 'Type', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'enum'        => $types,
				],
			],
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Checks if current user can process urls.
	 *
	 * @since 1.11.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function parse_url_permissions_check() {
		if ( ! $this->get_post_type_cap( $this->story_post_type::POST_TYPE_SLUG, 'edit_posts' ) ) {
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

		if ( empty( $url ) || ! wp_http_validate_url( $url ) ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 400 ] );
		}

		$path = wp_parse_url( $url, PHP_URL_PATH );

		if ( ! $path ) {
			return new WP_Error( 'rest_invalid_url_path', __( 'Invalid URL Path', 'web-stories' ), [ 'status' => 400 ] );
		}

		return true;
	}
}
