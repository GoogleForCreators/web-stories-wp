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
