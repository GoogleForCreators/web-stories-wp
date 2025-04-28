<?php
/**
 * Class Font_Controller
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

use stdClass;
use WP_Error;
use WP_Post;
use WP_Query;
use WP_REST_Posts_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Font_Controller class.
 *
 * @phpstan-type Font array{
 *   family: string,
 *   fallbacks?: string[],
 *   weights?: array<int, array{0: int, 1: int}>,
 *   styles?: string[],
 *   variants?: string[],
 *   service?: string,
 *   metrics?: mixed,
 *   id?: string,
 *   url?: string
 * }
 * @phpstan-type SchemaEntry array{
 *   description: string,
 *   type: string,
 *   context: string[],
 *   default?: mixed,
 * }
 * @phpstan-type Schema array{
 *   properties: array{
 *     family?: SchemaEntry,
 *     fallbacks?: SchemaEntry,
 *     weights?: SchemaEntry,
 *     styles?: SchemaEntry,
 *     variants?: SchemaEntry,
 *     service?: SchemaEntry,
 *     metrics?: SchemaEntry,
 *     id?: SchemaEntry,
 *     url?: SchemaEntry
 *   }
 * }
 */
class Font_Controller extends WP_REST_Posts_Controller {
	/**
	 * Registers the routes for posts.
	 *
	 * @since 1.16.0
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
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			[
				'args'   => [
					'id' => [
						'description' => __( 'Unique identifier for the font.', 'web-stories' ),
						'type'        => 'integer',
					],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);
	}

	/**
	 * Retrieves a collection of fonts.
	 *
	 * @since 1.16.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 * @phpstan-param WP_REST_Request<array{search?: string, service?: string, include?: string[]}> $request
	 */
	public function get_items( $request ) {
		/**
		 * Fonts list.
		 *
		 * @phpstan-var Font[] $fonts
		 */
		$fonts = [];

		// Retrieve the list of registered collection query parameters.
		$registered = $this->get_collection_params();

		if ( isset( $registered['service'], $request['service'] ) ) {
			if ( 'all' === $request['service'] || 'builtin' === $request['service'] ) {
				array_push( $fonts, ...$this->get_builtin_fonts() );

				// For custom fonts the searching will be done in WP_Query already.
				if ( isset( $registered['search'], $request['search'] ) && ! empty( $request['search'] ) ) {
					$fonts = array_values(
						array_filter(
							$fonts,
							/**
							 * Font data.
							 *
							 * @param array{family: string} $font
							 * @return bool
							 */
							static fn( array $font ) => false !== stripos( $font['family'], $request['search'] )
						)
					);
				}
			}

			if ( 'all' === $request['service'] || 'custom' === $request['service'] ) {
				array_push( $fonts, ...$this->get_custom_fonts( $request ) );
			}

			// Filter before doing any sorting.
			if ( isset( $registered['include'], $request['include'] ) && ! empty( $request['include'] ) ) {
				$include_list = array_map( 'strtolower', $request['include'] );

				$fonts = array_values(
					array_filter(
						$fonts,
						/**
						 * Font data.
						 *
						 * @param array{family: string} $font
						 * @return bool
						 */
						static fn( array $font ): bool => \in_array( strtolower( $font['family'] ), $include_list, true )
					)
				);
			}

			if ( 'all' === $request['service'] ) {
				// Since the built-in fonts and custom fonts both are already sorted,
				// we only need to sort when including both.
				usort(
					$fonts,
					/**
					 * Font A and Font B.
					 *
					 * @phpstan-param Font $a
					 * @phpstan-param Font $b
					 * @return int
					 */
					static fn( array $a, array $b ): int => strnatcasecmp( $a['family'], $b['family'] )
				);
			}
		}

		return rest_ensure_response( $fonts );
	}

	/**
	 * Checks if a given request has access to read posts.
	 *
	 * @since 1.16.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$post_type = get_post_type_object( $this->post_type );

		if (
			! $post_type ||
			! current_user_can( $post_type->cap->read_post ) // phpcs:ignore WordPress.WP.Capabilities.Undetermined
		) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'Sorry, you are not allowed to list fonts.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Force-deletes a single font.
	 *
	 * @since 1.16.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$request->set_param( 'force', true );

		return parent::delete_item( $request );
	}

	/**
	 * Prepares a single post output for response.
	 *
	 * @SuppressWarnings("PHPMD.NPathComplexity")
	 *
	 * @since 1.16.0
	 *
	 * @param WP_Post         $item    Post object.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 *
	 * @phpstan-param WP_REST_Request<array{context: string}> $request
	 */
	public function prepare_item_for_response( $item, $request ): WP_REST_Response {
		// Restores the more descriptive, specific name for use within this method.
		$post            = $item;
		$GLOBALS['post'] = $post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		setup_postdata( $post );

		$fields = $this->get_fields_for_response( $request );

		$data = [];

		if ( rest_is_field_included( 'id', $fields ) ) {
			$data['id'] = $post->ID;
		}

		if ( rest_is_field_included( 'family', $fields ) ) {
			$data['family'] = $post->post_title;
		}

		if ( rest_is_field_included( 'service', $fields ) ) {
			$data['service'] = 'custom';
		}

		/**
		 * Font data.
		 *
		 * @var array<string, mixed>|null $font_data
		 */
		$font_data = json_decode( $post->post_content, true );

		if ( $font_data ) {
			foreach ( $font_data as $key => $value ) {
				if ( rest_is_field_included( $key, $fields ) ) {
					$data[ $key ] = $value;
				}
			}
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		/**
		 * Response object.
		 *
		 * @var WP_REST_Response $response
		 */
		$response = rest_ensure_response( $data );

		if ( rest_is_field_included( '_links', $fields ) || rest_is_field_included( '_embedded', $fields ) ) {
			$links = $this->prepare_links( $post );
			$response->add_links( $links );

			if ( ! empty( $links['self']['href'] ) ) {
				$actions = $this->get_available_actions( $post, $request );

				$self = $links['self']['href'];

				foreach ( $actions as $rel ) {
					// @phpstan-ignore method.internal (false positive)
					$response->add_link( $rel, $self );
				}
			}
		}


		return $response;
	}

	/**
	 * Retrieves the query params for the fonts collection.
	 *
	 * @since 1.16.0
	 *
	 * @return array<string, array<string, mixed>> Collection parameters.
	 */
	public function get_collection_params(): array {
		$query_params = parent::get_collection_params();

		$query_params['context']['default'] = 'view';

		$query_params['search'] = [
			'description'       => __( 'Limit results to those matching a string.', 'web-stories' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'validate_callback' => 'rest_validate_request_arg',
		];

		$query_params['include'] = [
			'description' => __( 'Limit result set to specific fonts.', 'web-stories' ),
			'type'        => 'array',
			'items'       => [
				'type' => 'string',
			],
			'default'     => [],
		];

		$query_params['service'] = [
			'description'       => __( 'Filter fonts by service.', 'web-stories' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => 'all',
			'enum'              => [
				'all',
				'custom',
				'builtin', // system + fonts.google.com.
			],
		];

		/** This filter is documented in wp-includes/rest-api/endpoints/class-wp-rest-posts-controller.php */
		return apply_filters( "rest_{$this->post_type}_collection_params", $query_params, $this->post_type );
	}

	/**
	 * Retrieves the font's schema, conforming to JSON Schema.
	 *
	 * @SuppressWarnings("PHPMD.ExcessiveMethodLength")
	 *
	 * @since 1.16.0
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

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => $this->post_type,
			'type'       => 'object',
			// Base properties for every font.
			'properties' => [
				'family'    => [
					'description' => __( 'The font family', 'web-stories' ),
					'type'        => [ 'string', 'null' ],
					'context'     => [ 'view', 'edit', 'embed' ],
					'required'    => true,
				],
				'fallbacks' => [
					'description' => __( 'Fallback fonts', 'web-stories' ),
					'type'        => 'array',
					'items'       => [
						'type' => 'string',
					],
					'context'     => [ 'view', 'edit' ],
					'required'    => true,
				],
				'weights'   => [
					'description' => __( 'Font weights', 'web-stories' ),
					'type'        => 'array',
					'items'       => [
						'type'    => 'integer',
						'minimum' => 0,
						'maximum' => 900,
					],
					'minimum'     => 1,
					'context'     => [ 'view', 'edit' ],
					'required'    => true,
				],
				'styles'    => [
					'description' => __( 'Font styles', 'web-stories' ),
					'type'        => 'array',
					'items'       => [
						'type' => 'string',
					],
					'minimum'     => 1,
					'context'     => [ 'view', 'edit' ],
					'required'    => true,
				],
				'variants'  => [
					'description' => __( 'Font variants', 'web-stories' ),
					'type'        => 'array',
					'items'       => [
						'type'    => 'array',
						'items'   => [
							'type'    => 'integer',
							'minimum' => 0,
							'maximum' => 900,
						],
						'minimum' => 2,
						'maximum' => 2,
					],
					'context'     => [ 'view', 'edit' ],
					'required'    => true,
				],
				'service'   => [
					'description' => __( 'Font service', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit' ],
					'readonly'    => true,
				],
				'metrics'   => [
					'description' => __( 'Font metrics', 'web-stories' ),
					'type'        => 'object',
					'context'     => [ 'view', 'edit' ],
					'required'    => true,
				],
				'id'        => [
					'description' => __( 'Unique identifier for the font.', 'web-stories' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'url'       => [
					'description' => __( 'Font URL.', 'web-stories' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => [ 'view', 'edit', 'embed' ],
					'required'    => true,
				],
			],
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
	 * Returns a list of Google fonts.
	 *
	 * @since 1.16.0
	 *
	 * @return array<int, mixed> List of Google fonts.
	 *
	 * @phpstan-return Font[]
	 */
	protected function get_builtin_fonts(): array {
		$file = WEBSTORIES_PLUGIN_DIR_PATH . 'includes/data/fonts/fonts.json';

		if ( ! is_readable( $file ) ) {
			return [];
		}

		$content = file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents, WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown

		if ( ! $content ) {
			return [];
		}

		/**
		 * List of Google Fonts.
		 *
		 * @var array|null $fonts
		 * @phpstan-var Font[]|null $fonts
		 */
		$fonts = json_decode( $content, true );

		if ( ! $fonts ) {
			return [];
		}

		return $fonts;
	}

	/**
	 * Returns a list of custom fonts.
	 *
	 * @since 1.16.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return array<int, mixed> List of custom fonts.
	 *
	 * @phpstan-return Font[]
	 */
	protected function get_custom_fonts( $request ): array {
		// Retrieve the list of registered collection query parameters.
		$registered = $this->get_collection_params();
		$args       = [
			'orderby' => 'title',
			'order'   => 'ASC',
		];

		/*
		 * This array defines mappings between public API query parameters whose
		 * values are accepted as-passed, and their internal WP_Query parameter
		 * name equivalents (some are the same). Only values which are also
		 * present in $registered will be set.
		 */
		$parameter_mappings = [
			'search' => 's',
		];

		/*
		 * For each known parameter which is both registered and present in the request,
		 * set the parameter's value on the query $args.
		 */
		foreach ( $parameter_mappings as $api_param => $wp_param ) {
			if ( isset( $registered[ $api_param ], $request[ $api_param ] ) ) {
				$args[ $wp_param ] = $request[ $api_param ];
			}
		}

		// Ensure our per_page parameter overrides any provided posts_per_page filter.
		if ( isset( $registered['per_page'] ) ) {
			$args['posts_per_page'] = $request['per_page'];
		}

		// Force search to be case-insensitive.

		// Force the post_type argument, since it's not a user input variable.
		$args['post_type'] = $this->post_type;
		$query_args        = $this->prepare_items_query( $args, $request );

		$posts_query  = new WP_Query();
		$query_result = $posts_query->query( $query_args );

		/**
		 * List of custom fonts.
		 *
		 * @var array $posts
		 * @phpstan-var Font[] $posts
		 */
		$posts = [];

		/**
		 * We're expecting a post object.
		 *
		 * @var WP_Post $post
		 */
		foreach ( $query_result as $post ) {
			if ( ! $this->check_read_permission( $post ) ) {
				continue;
			}

			$data    = $this->prepare_item_for_response( $post, $request );
			$posts[] = $this->prepare_response_for_collection( $data );
		}

		// Reset filter.
		if ( 'edit' === $request['context'] ) {
			remove_filter( 'post_password_required', [ $this, 'check_password_required' ] );
		}

		return $posts;
	}

	/**
	 * Prepares a single post for create.
	 *
	 * @since 1.16.0
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return stdClass|WP_Error Post object or WP_Error.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_post              = new stdClass();
		$prepared_post->post_status = 'publish';

		$font_data = [];

		$fields = [
			'family',
			'fallbacks',
			'weights',
			'styles',
			'variants',
			'metrics',
			'url',
		];

		$schema = $this->get_item_schema();

		foreach ( $fields as $field ) {
			if ( ! empty( $schema['properties'][ $field ] ) && ! empty( $request[ $field ] ) ) {
				$font_data[ $field ] = $request[ $field ];

				if ( 'family' === $field ) {
					/**
					 * Request data.
					 *
					 * @var array{family: string} $request
					 */
					$font_family = trim( $request['family'] );

					$prepared_post->post_title = $font_family;

					if ( $this->font_exists( $font_family ) ) {
						return new \WP_Error(
							'rest_invalid_field',
							__( 'A font with this name already exists', 'web-stories' ),
							[ 'status' => 400 ]
						);
					}
				}
			}
		}

		$prepared_post->post_content = wp_json_encode( $font_data );

		return $prepared_post;
	}

	/**
	 * Determines whether a font with the same name already exists.
	 *
	 * Performs a case-insensitive comparison.
	 *
	 * @since 1.16.0
	 *
	 * @param string $font_family Font family.
	 * @return bool Whether a font with this exact name already exists.
	 */
	private function font_exists( string $font_family ): bool {
		/**
		 * A custom request to perform the lookup.
		 *
		 * @phpstan-var WP_REST_Request<array{search?: string, service?: string, include?: array<string>}> $request
		 */
		$request = new WP_REST_Request(
			WP_REST_Server::READABLE,
			$this->namespace .
			'/' . $this->rest_base
		);
		$request->set_param( 'include', [ $font_family ] );
		$request->set_param( 'service', 'all' );

		/**
		 * Response object.
		 *
		 * @var WP_REST_Response $response
		 */
		$response = $this->get_items( $request );

		return ! empty( $response->get_data() );
	}
}
