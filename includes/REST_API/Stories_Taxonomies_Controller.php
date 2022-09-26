<?php
/**
 * Class Stories_Taxonomies_Controller
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
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Taxonomies_Controller;
use WP_Taxonomy;

/**
 * Stories_Taxonomies_Controller class.
 */
class Stories_Taxonomies_Controller extends WP_REST_Taxonomies_Controller implements Service, Delayed, Registerable {
	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @since 1.12.0
	 */
	public function __construct() {
		parent::__construct();
		$this->namespace = 'web-stories/v1';
	}

	/**
	 * Override the existing prepare_item_for_response to ensure that all links have the correct namespace.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_Taxonomy     $taxonomy Taxonomy data.
	 * @param WP_REST_Request $request  Full details about the request.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $taxonomy, $request ): WP_REST_Response {
		$response   = parent::prepare_item_for_response( $taxonomy, $request );
		$base       = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
		$controller = $taxonomy->get_rest_controller();

		if ( ! $controller ) {
			return $response;
		}

		$namespace = method_exists( $controller, 'get_namespace' ) ? $controller->get_namespace() : 'wp/v2';

		$response->remove_link( 'https://api.w.org/items' );
		$response->add_links(
			[
				'https://api.w.org/items' => [
					'href' => rest_url( sprintf( '%s/%s', $namespace, $base ) ),
				],
			]
		);

		/** This filter is documented in wp-includes/rest-api/endpoints/class-wp-rest-taxonomies-controller.php */
		return apply_filters( 'rest_prepare_taxonomy', $response, $taxonomy, $request );
	}

	/**
	 * Retrieves all public taxonomies.
	 *
	 * Adds support for filtering by the hierarchical attribute.
	 *
	 * @since 1.22.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		// Retrieve the list of registered collection query parameters.
		$registered = $this->get_collection_params();

		if ( isset( $registered['type'] ) && ! empty( $request['type'] ) ) {
			/**
			 * Object type.
			 *
			 * @var string Object type.
			 */
			$type = $request['type'];

			$taxonomies = get_object_taxonomies( $type, 'objects' );
		} else {
			$taxonomies = get_taxonomies( [], 'objects' );
		}

		$filters = [ 'hierarchical', 'show_ui' ];
		foreach ( $filters as $filter ) {
			if ( isset( $registered[ $filter ], $request[ $filter ] ) ) {
				$taxonomies = wp_filter_object_list( $taxonomies, [ $filter => (bool) $request[ $filter ] ] );
			}
		}
		$data = [];

		/**
		 * Taxonomy.
		 *
		 * @var WP_Taxonomy $value
		 */
		foreach ( $taxonomies as $tax_type => $value ) {
			if ( empty( $value->show_in_rest ) || ( 'edit' === $request['context'] && ! current_user_can( $value->cap->assign_terms ) ) ) {
				continue;
			}

			$tax               = $this->prepare_item_for_response( $value, $request );
			$tax               = $this->prepare_response_for_collection( $tax );
			$data[ $tax_type ] = $tax;
		}

		if ( empty( $data ) ) {
			// Response should still be returned as a JSON object when it is empty.
			$data = (object) $data;
		}

		return rest_ensure_response( $data );
	}

	/**
	 * Retrieves the query params for collections.
	 *
	 * Adds support for filtering by the hierarchical attribute.
	 *
	 * @since 1.22.0
	 *
	 * @return array<string, array<string, mixed>> Collection parameters.
	 */
	public function get_collection_params(): array {
		$query_params = parent::get_collection_params();

		$query_params['per_page']['default'] = 100;

		$query_params['hierarchical'] = [
			'description' => __( 'Whether to show only hierarchical taxonomies.', 'web-stories' ),
			'type'        => 'boolean',
		];

		$query_params['show_ui'] = [
			'description' => __( 'Whether to show only show taxonomies that allow a UI in the admin.', 'web-stories' ),
			'type'        => 'boolean',
		];

		return $query_params;
	}

	/**
	 * Register the service.
	 *
	 * @since 1.12.0
	 */
	public function register(): void {
		$this->register_routes();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.12.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'rest_api_init';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.12.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		return 100;
	}
}
