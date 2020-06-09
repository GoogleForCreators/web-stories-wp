<?php
/**
 * Class Stories_Autosaves_Controller
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

use Google\Web_Stories\KSES;
use WP_Error;
use WP_REST_Autosaves_Controller;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Stories_Autosaves_Controller class.
 *
 * Override the WP_REST_Autosaves_Controller class to modify KSES behavior.
 */
class Stories_Autosaves_Controller extends WP_REST_Autosaves_Controller {
	/**
	 * Parent post controller.
	 *
	 * @var WP_REST_Controller
	 */
	private $parent_controller;

	/**
	 * The base of the parent controller's route.
	 *
	 * @var string
	 */
	private $parent_base;

	/**
	 * Constructor.
	 *
	 * @param string $parent_post_type Post type of the parent.
	 */
	public function __construct( $parent_post_type ) {
		parent::__construct( $parent_post_type );

		$post_type_object  = get_post_type_object( $parent_post_type );
		$parent_controller = null;

		if ( $post_type_object instanceof \WP_Post_Type ) {
			$parent_controller = $post_type_object->get_rest_controller();
		}

		if ( ! $parent_controller ) {
			$parent_controller = new \WP_REST_Posts_Controller( $parent_post_type );
		}

		$this->parent_controller = $parent_controller;
		$this->parent_base       = ! empty( $post_type_object->rest_base ) ? $post_type_object->rest_base : $post_type_object->name;
	}

	/**
	 * Registers the routes for autosaves.
	 *
	 * Used to override the create_item() callback.
	 *
	 * @see register_rest_route()
	 *
	 * @return void
	 */
	public function register_routes() {
		parent::register_routes();

		register_rest_route(
			'wp/v2',
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
	 * Creates, updates or deletes an autosave revision.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		$kses = new KSES();
		$kses->init();
		$response = parent::create_item( $request );
		$kses->remove_filters();
		return $response;
	}
}
