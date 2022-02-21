<?php
/**
 * Class Stories_Autosaves_Controller
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

use Google\Web_Stories\Infrastructure\Delayed;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;
use WP_REST_Autosaves_Controller;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Stories_Autosaves_Controller class.
 */
class Stories_Autosaves_Controller extends WP_REST_Autosaves_Controller implements Service, Delayed, Registerable, HasRequirements {

	/**
	 * Parent post controller.
	 *
	 * @var WP_REST_Controller
	 */
	protected $parent_controller;

	/**
	 * The base of the parent controller's route.
	 *
	 * @var string
	 */
	protected $parent_base;

	/**
	 * The base namespace.
	 *
	 * @var string
	 */
	protected $rest_namespace;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		parent::__construct( $story_post_type->get_slug() );

		$parent_controller = $story_post_type->get_parent_controller();

		$this->parent_base       = $story_post_type->get_slug();
		$this->parent_controller = $parent_controller;
		$this->rest_namespace    = $story_post_type->get_rest_namespace();
	}

	/**
	 * Register the service.
	 *
	 * @since 1.7.0
	 */
	public function register(): void {
		$this->register_routes();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.7.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'rest_api_init';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.7.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		return 100;
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
	 * Registers the routes for autosaves.
	 *
	 * Used to override the create_item() callback.
	 *
	 * @since 1.0.0
	 *
	 * @see register_rest_route()
	 */
	public function register_routes(): void {
		parent::register_routes();

		register_rest_route(
			$this->rest_namespace,
			'/' . $this->parent_base . '/(?P<id>[\d]+)/autosaves',
			[
				'args'   => [
					'parent' => [
						'description' => __( 'The ID for the parent of the object.', 'web-stories' ),
						'type'        => 'integer',
					],
				],
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
					'args'                => $this->parent_controller->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			],
			true // required so that the existing route is overridden.
		);
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

		/** This filter is documented in wp-includes/rest-api/endpoints/class-wp-rest-autosaves-controller.php */
		return apply_filters( 'rest_prepare_autosave', $response, $post, $request );
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

		$autosaves_schema = parent::get_item_schema();
		$stories_schema   = $this->parent_controller->get_item_schema();

		$autosaves_schema['properties']['story_data'] = $stories_schema['properties']['story_data'];

		$this->schema = $autosaves_schema;

		return $this->add_additional_fields_schema( $this->schema );
	}
}
