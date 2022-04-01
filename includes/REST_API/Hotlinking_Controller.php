<?php
/**
 * Class Hotlinking_Controller
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

namespace Google\Web_Stories\REST_API;

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Media\Types;
use Google\Web_Stories\Story_Post_Type;
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
	public const PROXY_HEADERS_ALLOWLIST = [
		'Content-Type',
		'Cache-Control',
		'Etag',
		'Last-Modified',
	];

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Types instance.
	 *
	 * @var Types Types instance.
	 */
	private $types;

	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

	/**
	 * File pointer resource.
	 *
	 * @var resource
	 */
	protected $stream_handle;

	/**
	 * Constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 * @param Types           $types Types instance.
	 * @param Experiments     $experiments Experiments instance.
	 * @return void
	 */
	public function __construct( Story_Post_Type $story_post_type, Types $types, Experiments $experiments ) {
		$this->story_post_type = $story_post_type;
		$this->types           = $types;

		$this->namespace   = 'web-stories/v1';
		$this->rest_base   = 'hotlink';
		$this->experiments = $experiments;
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
	 */
	public function register_routes(): void {
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
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function parse_url( $request ) {
		/**
		 * Requested URL.
		 *
		 * @var string $url
		 */
		$url = $request['url'];
		$url = untrailingslashit( $url );

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
		if ( \is_string( $data ) && ! empty( $data ) ) {
			/**
			 * Decoded cached link data.
			 *
			 * @var array|null $link
			 */
			$link = json_decode( $data, true );

			if ( $link ) {
				$response = $this->prepare_item_for_response( $link, $request );
				return rest_ensure_response( $response );
			}
		}

		$response = wp_safe_remote_head(
			$url,
			[
				/** This filter is documented in wp-includes/class-http.php */
				'redirection' => apply_filters( 'http_request_redirection_count', 5, $url ),
			]
		);
		if ( is_wp_error( $response ) && 'http_request_failed' === $response->get_error_code() ) {
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		$headers   = wp_remote_retrieve_headers( $response );
		$mime_type = $headers['content-type'];
		if ( $mime_type && false !== strpos( $mime_type, ';' ) ) {
			$pieces    = explode( ';', $mime_type );
			$mime_type = array_shift( $pieces );
		}
		$file_size = (int) $headers['content-length'];

		/**
		 * The URL's path.
		 *
		 * @var string|false|null $path
		 */
		$path = wp_parse_url( $url, PHP_URL_PATH );

		if ( ! \is_string( $path ) ) {
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		$file_name = basename( $path );

		$exts = $this->types->get_file_type_exts( [ $mime_type ] );
		$ext  = '';
		if ( $exts ) {
			$ext = end( $exts );
		}

		$allowed_mime_types = $this->get_allowed_mime_types();
		$type               = '';
		foreach ( $allowed_mime_types as $key => $mime_types ) {
			if ( \in_array( $mime_type, $mime_types, true ) ) {
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
	 * @SuppressWarnings(PHPMD.ErrorControlOperator)
	 *
	 * @since 1.13.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @todo Forward the Range request header.
	 */
	public function proxy_url( $request ): void {
		/**
		 * Requested URL.
		 *
		 * @var string $url
		 */
		$url = $request['url'];
		$url = untrailingslashit( $url );

		// Remove any relevant headers already set by WP_REST_Server::serve_request() // wp_get_nocache_headers().
		if ( ! headers_sent() ) {
			header_remove( 'Cache-Control' );
			header_remove( 'Content-Type' );
			header_remove( 'Expires' );
			header_remove( 'Last Modified' );
		}

		header( 'Cache-Control: max-age=3600' );

		$args = [
			'timeout'  => 60, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			'blocking' => false,
		];

		$http      = _wp_http_get_object();
		$transport = $http->_get_first_available_transport( $args, $url );

		// When cURL is available, we might be able to use it together with fopen().
		if ( 'WP_Http_Curl' === $transport ) {
			// php://temp is a read-write streams that allows temporary data to be stored in a file-like wrapper.
			// Other than php://memory, php://temp will use a temporary file once the amount of data stored hits a predefined limit (the default is 2 MB).
			// The location of this temporary file is determined in the same way as the {@see sys_get_temp_dir()} function.
			if ( WP_DEBUG ) {
				$stream_handle = fopen( 'php://memory', 'wb' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_fopen
			} else {
				$stream_handle = @fopen( 'php://memory', 'wb' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_fopen, WordPress.PHP.NoSilencedErrors.Discouraged, Generic.PHP.NoSilencedErrors.Forbidden
			}

			if ( $stream_handle ) {
				$this->stream_handle = $stream_handle;
				$this->proxy_url_curl( $url, $args );
			}
			exit;
		}

		// If either cURL is not available or fopen() did not succeed, use whatever WP gives us,
		// using good old wp_remote
		// Fall back to using whatever else is set up on the site, presumably WP_Http_Streams
		// or just cURL but without .
		unset( $args['blocking'] );
		$this->proxy_url_fallback( $url, $args );

		exit;
	}

	/**
	 * Proxy a given URL via a PHP read-write stream.
	 *
	 * @since 1.15.0
	 *
	 * @param string $url  Request URL.
	 * @param array  $args Request args.
	 */
	private function proxy_url_curl( $url, $args ): void {
		add_action( 'http_api_curl', [ $this, 'modify_curl_configuration' ] );
		wp_safe_remote_get( $url, $args );
		remove_action( 'http_api_curl', [ $this, 'modify_curl_configuration' ] );

		rewind( $this->stream_handle );
		while ( ! feof( $this->stream_handle ) ) {
			echo fread( $this->stream_handle, 1024 * 1024 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped, WordPress.WP.AlternativeFunctions.file_system_read_fread
		}

		fclose( $this->stream_handle );
	}

	/**
	 * Proxy a given URL by storing in memory.
	 *
	 * @since 1.15.0
	 *
	 * @param string $url  Request URL.
	 * @param array  $args Request args.
	 */
	private function proxy_url_fallback( $url, $args ): void {
		$response = wp_safe_remote_get( $url, $args );
		$status   = wp_remote_retrieve_response_code( $response );

		if ( ! $status ) {
			http_response_code( 404 );
			return;
		}

		http_response_code( (int) $status );

		$headers = wp_remote_retrieve_headers( $response );

		foreach ( self::PROXY_HEADERS_ALLOWLIST as $_header ) {
			if ( isset( $headers[ $_header ] ) ) {
				header( $_header . ': ' . $headers[ $_header ] );
			}
		}

		echo wp_remote_retrieve_body( $response ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Prepares response asset response.
	 *
	 * @since 1.11.0
	 *
	 * @param array           $link URL data value, default to false is not set.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_item_for_response( $link, $request ) {
		$fields = $this->get_fields_for_response( $request );
		$schema = $this->get_item_schema();

		$data = [];

		$error = new \WP_Error();
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

		/**
		 * Request context.
		 *
		 * @var string $context
		 */
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
		$exts               = $this->types->get_file_type_exts( $allowed_mime_types );

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
		if ( ! $this->story_post_type->has_cap( 'edit_posts' ) ) {
			return new \WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed to insert external media.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}

	/**
	 * Callback to validate urls.
	 *
	 * @since 1.11.0
	 *
	 * @param string $value Value to be validated.
	 * @return true|WP_Error
	 */
	public function validate_url( $value ) {
		$url = untrailingslashit( $value );

		if ( empty( $url ) || ! wp_http_validate_url( $url ) ) {
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 400 ] );
		}

		$path = wp_parse_url( $url, PHP_URL_PATH );

		if ( ! $path ) {
			return new \WP_Error( 'rest_invalid_url_path', __( 'Invalid URL Path', 'web-stories' ), [ 'status' => 400 ] );
		}

		return true;
	}

	/**
	 * Modifies the cURL configuration before the request is executed.
	 *
	 * @since 1.15.0
	 *
	 * @param resource $handle      The cURL handle returned by curl_init() (passed by reference).
	 */
	public function modify_curl_configuration( &$handle ): void {
		// Just some safeguard in case cURL is not really available,
		// despite this method being run in the context of WP_Http_Curl.
		if ( ! function_exists( 'curl_setopt' ) ) {
			return;
		}

		// phpcs:disable WordPress.WP.AlternativeFunctions.curl_curl_setopt

		curl_setopt(
			$handle,
			CURLOPT_FILE,
			$this->stream_handle
		);

		curl_setopt( $handle, CURLOPT_HEADERFUNCTION, [ $this, 'stream_headers' ] );

		// phpcs:enable WordPress.WP.AlternativeFunctions.curl_curl_setopt
	}

	/**
	 * Grabs the headers of the cURL request.
	 *
	 * Each header is sent individually to this callback,
	 * so we take a look at each one to see if we should "forward" it.
	 *
	 * @since 1.15.0
	 *
	 * @param resource $handle  cURL handle.
	 * @param string   $header cURL header.
	 * @return int Header length.
	 */
	public function stream_headers( $handle, $header ): int {
		// Parse Status-Line, the first component in the HTTP response, e.g. HTTP/1.1 200 OK.
		// Extract the status code to re-send that here.
		if ( 0 === strpos( $header, 'HTTP/' ) ) {
			$status = explode( ' ', $header );
			http_response_code( (int) $status[1] );
			return \strlen( $header );
		}

		foreach ( self::PROXY_HEADERS_ALLOWLIST as $_header ) {
			if ( 0 === stripos( $header, strtolower( $_header ) . ': ' ) ) {
				header( $header, true );
			}
		}

		return \strlen( $header );
	}

	/**
	 * Returns a list of allowed mime types per media type (image, audio, video).
	 *
	 * @since 1.19.0
	 *
	 * @return array<string, array> List of allowed mime types.
	 */
	protected function get_allowed_mime_types(): array {
		$mime_type = $this->types->get_allowed_mime_types();
		// TODO: Update once audio elements are supported.
		$mime_type['audio'] = [];
		if ( ! $this->experiments->is_experiment_enabled( 'captionHotlinking' ) ) {
			unset( $mime_type['caption'] );
		}
		// Do not support hotlinking SVGs for security reasons.
		unset( $mime_type['vector'] );

		return $mime_type;
	}
}
