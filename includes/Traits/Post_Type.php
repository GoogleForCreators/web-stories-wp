<?php
/**
 * Trait Post_Type
 *
 * @package   Google\Web_Stories\Traits
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

namespace Google\Web_Stories\Traits;

use WP_Post_Type;
use WP_REST_Controller;
use WP_REST_Posts_Controller;

/**
 * Trait Post_Type
 *
 * @package Google\Web_Stories\Traits
 */
trait Post_Type {
	/**
	 * Get rest base name based on the post type slug.
	 *
	 * @since 1.7.0
	 *
	 * @param string $slug The post type slug.
	 *
	 * @return string Rest base.
	 */
	protected function get_post_type_rest_base( $slug ) {
		$post_type_obj = get_post_type_object( $slug );
		$rest_base     = $slug;
		if ( $post_type_obj instanceof WP_Post_Type ) {
			$rest_base = ( ! empty( $post_type_obj->rest_base ) && is_string( $post_type_obj->rest_base ) ) ? $post_type_obj->rest_base : $post_type_obj->name;
		}

		return $rest_base;
	}

	/**
	 * Get post type capability on the post type slug and name.
	 *
	 * @since 1.7.0
	 *
	 * @param string $slug The post type slug.
	 * @param string $cap Capability name.
	 *
	 * @return bool
	 */
	protected function get_post_type_cap( $slug, $cap ) {
		$capability_name = $this->get_post_type_cap_name( $slug, $cap );
		$capability      = false;
		if ( $capability_name ) {
			$capability = current_user_can( $capability_name );
		}

		return $capability;
	}

	/**
	 * Get post type capability name on the post type slug and name.
	 *
	 * @since 1.7.0
	 *
	 * @param string $slug The post type slug.
	 * @param string $cap Capability name.
	 *
	 * @return string|false
	 */
	protected function get_post_type_cap_name( $slug, $cap ) {
		$post_type_obj   = get_post_type_object( $slug );
		$capability_name = false;

		if ( ! $post_type_obj instanceof WP_Post_Type ) {
			return $capability_name;
		}

		if ( property_exists( $post_type_obj->cap, $cap ) ) {
			$capability_name = $post_type_obj->cap->$cap;
		}

		return $capability_name;
	}

	/**
	 * Get Label on the post type slug and name.
	 *
	 * @since 1.7.0
	 *
	 * @param string $slug The post type slug.
	 * @param string $label Label name.
	 *
	 * @return string
	 */
	protected function get_post_type_label( $slug, $label ) {
		$post_type_obj = get_post_type_object( $slug );
		$name          = '';

		if ( ! $post_type_obj instanceof WP_Post_Type ) {
			return $name;
		}

		if ( property_exists( $post_type_obj->labels, $label ) ) {
			$name = $post_type_obj->labels->$label;
		}

		return $name;
	}

	/**
	 * Get rest controller on the post type slug.
	 *
	 * @since 1.7.0
	 *
	 * @param string $slug The post type slug.
	 *
	 * @return WP_REST_Posts_Controller|WP_REST_Controller
	 */
	protected function get_post_type_parent_controller( $slug ) {
		$post_type_obj     = get_post_type_object( $slug );
		$parent_controller = null;

		if ( $post_type_obj instanceof WP_Post_Type ) {
			$parent_controller = $post_type_obj->get_rest_controller();
		}

		if ( ! $parent_controller ) {
			$parent_controller = new WP_REST_Posts_Controller( $slug );
		}

		return $parent_controller;
	}
}
