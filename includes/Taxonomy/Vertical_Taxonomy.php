<?php
/**
 * Class Vertical_Taxonomy.
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

namespace Google\Web_Stories\Taxonomy;

use Google\Web_Stories\REST_API\Stories_Terms_Controller;
use Google\Web_Stories\Story_Post_Type;

/**
 * Vertical_Taxonomy class.
 */
class Vertical_Taxonomy extends Taxonomy_Base {
	/**
	 * Taxonomy key.
	 *
	 * @var string
	 */
	protected $taxonomy_slug = 'web_story_vertical';

	/**
	 * Post type.
	 *
	 * @var string
	 */
	protected $taxonomy_post_type = Story_Post_Type::POST_TYPE_SLUG;

	/**
	 * Vertical args.
	 *
	 * @since 1.12.0
	 *
	 * @return array
	 */
	protected function taxonomy_args(): array {
		$labels = [
			'name'                  => _x( 'Verticals', 'taxonomy general name', 'web-stories' ),
			'singular_name'         => _x( 'Vertical', 'taxonomy singular name', 'web-stories' ),
			'search_items'          => __( 'Search Verticals', 'web-stories' ),
			'all_items'             => __( 'All Verticals', 'web-stories' ),
			'parent_item'           => __( 'Parent Vertical', 'web-stories' ),
			'parent_item_colon'     => __( 'Parent Vertical:', 'web-stories' ),
			'edit_item'             => __( 'Edit Vertical', 'web-stories' ),
			'view_item'             => __( 'View Vertical', 'web-stories' ),
			'update_item'           => __( 'Update Vertical', 'web-stories' ),
			'add_new_item'          => __( 'Add New Vertical', 'web-stories' ),
			'new_item_name'         => __( 'New Vertical Name', 'web-stories' ),
			'not_found'             => __( 'No verticals found.', 'web-stories' ),
			'no_terms'              => __( 'No verticals', 'web-stories' ),
			'filter_by_item'        => __( 'Filter by vertical', 'web-stories' ),
			'items_list_navigation' => __( 'Verticals list navigation', 'web-stories' ),
			'items_list'            => __( 'Verticals list', 'web-stories' ),
			/* translators: Tab heading when selecting from the most used terms. */
			'most_used'             => _x( 'Most Used', 'Verticals', 'web-stories' ),
			'back_to_items'         => __( '&larr; Go to Verticals', 'web-stories' ),
			'item_link'             => _x( 'Vertical Link', 'navigation link block title', 'web-stories' ),
			'item_link_description' => _x( 'A link to a vertical.', 'navigation link block description', 'web-stories' ),
		];
		$args   = [
			'labels'                => $labels,
			'hierarchical'          => true,
			'public'                => false,
			'show_ui'               => false,
			'show_admin_column'     => true,
			'rewrite'               => true,
			'show_in_rest'          => true,
			'capabilities'          => self::DEFAULT_CAPABILITIES,
			'rest_controller_class' => Stories_Terms_Controller::class,
		];

		return $args;
	}
}
