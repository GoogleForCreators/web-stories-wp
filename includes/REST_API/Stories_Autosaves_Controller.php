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

use Google\Web_Stories\Story_Post_Type;

/**
 * Stories_Autosaves_Controller class.
 *
 * Override the WP_REST_Autosaves_Controller class.
 */
class Stories_Autosaves_Controller extends Autosaves_Controller {
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
	 *
	 * @return WP_REST_Response Response object.
	 */
	public function __construct() {
		parent::__construct( Story_Post_Type::POST_TYPE_SLUG );
	}
}
