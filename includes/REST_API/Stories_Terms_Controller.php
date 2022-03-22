<?php
/**
 * Class Stories_Terms_Controller
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

use WP_REST_Terms_Controller;
use WP_Term;

/**
 * Stories_Terms_Controller class.
 */
class Stories_Terms_Controller extends WP_REST_Terms_Controller {
	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @since 1.12.0
	 *
	 * @param string $taxonomy Taxonomy key.
	 * @return void
	 */
	public function __construct( $taxonomy ) {
		parent::__construct( $taxonomy );
		$taxonomy_object = get_taxonomy( $taxonomy );
		$this->namespace = $taxonomy_object && \is_string( $taxonomy_object->rest_namespace ) ?
			$taxonomy_object->rest_namespace :
			'web-stories/v1';
	}

	/**
	 * Return namespace.
	 *
	 * @since 1.12.0
	 */
	public function get_namespace(): string {
		return $this->namespace;
	}


	/**
	 * Override the existing prepare_links to ensure that all links have the correct namespace.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_Term $term Term object.
	 * @return array Links for the given term.
	 */
	protected function prepare_links( $term ): array {
		$links          = parent::prepare_links( $term );
		$links['about'] = [
			'href' => rest_url( sprintf( '%s/taxonomies/%s', $this->namespace, $this->taxonomy ) ),
		];

		$taxonomy_obj = get_taxonomy( $term->taxonomy );

		if ( empty( $taxonomy_obj->object_type ) ) {
			return $links;
		}

		$post_type_links = [];

		foreach ( $taxonomy_obj->object_type as $type ) {
			$post_type_object = get_post_type_object( $type );

			if ( ! $post_type_object ) {
				continue;
			}

			if ( empty( $post_type_object->show_in_rest ) ) {
				continue;
			}
			$controller = $post_type_object->get_rest_controller();

			if ( ! $controller ) {
				continue;
			}

			$namespace = method_exists( $controller, 'get_namespace' ) ? $controller->get_namespace() : 'wp/v2';
			$rest_base = ! empty( $post_type_object->rest_base ) ? $post_type_object->rest_base : $post_type_object->name;

			$post_type_links[] = [
				'href' => add_query_arg( $this->rest_base, $term->term_id, rest_url( sprintf( '%s/%s', $namespace, $rest_base ) ) ),
			];
		}

		if ( ! empty( $post_type_links ) ) {
			$links['https://api.w.org/post_type'] = $post_type_links;
		}

		return $links;
	}
}
