<?php
/**
 * Class Tag_Taxonomy.
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
 * Tag_Taxonomy class.
 */
class Tag_Taxonomy extends Taxonomy_Base {
	/**
	 * Taxonomy slug
	 *
	 * @since 1.12.0
	 *
	 * @return string
	 */
	protected function taxonomy_slug() : string {
		return 'web-story-tag';
	}

	/**
	 * Taxonomy post type.
	 *
	 * @since 1.12.0
	 *
	 * @return string
	 */
	protected function taxonomy_post_type() : string {
		return Story_Post_Type::POST_TYPE_SLUG;
	}

	/**
	 * Taxonomy args.
	 *
	 * @since 1.12.0
	 *
	 * @return array
	 */
	protected function taxonomy_args() : array {
		$labels = [
			'name'                       => _x( 'Tags', 'taxonomy general name', 'web-stories' ),
			'singular_name'              => _x( 'Tag', 'taxonomy singular name', 'web-stories' ),
			'search_items'               => __( 'Search Tags', 'web-stories' ),
			'popular_items'              => __( 'Popular Tags', 'web-stories' ),
			'all_items'                  => __( 'All Tags', 'web-stories' ),
			'parent_item'                => __( 'Parent Tag', 'web-stories' ),
			'parent_item_colon'          => __( 'Parent Tag:', 'web-stories' ),
			'edit_item'                  => __( 'Edit Tag', 'web-stories' ),
			'view_item'                  => __( 'View Tag', 'web-stories' ),
			'update_item'                => __( 'Update Tag', 'web-stories' ),
			'add_new_item'               => __( 'Add New Tag', 'web-stories' ),
			'new_item_name'              => __( 'New Tag Name', 'web-stories' ),
			'separate_items_with_commas' => __( 'Separate Tags with commas', 'web-stories' ),
			'add_or_remove_items'        => __( 'Add or remove Tags', 'web-stories' ),
			'choose_from_most_used'      => __( 'Choose from the most used Tags', 'web-stories' ),
			'not_found'                  => __( 'No Tags found.', 'web-stories' ),
			'no_terms'                   => __( 'No Tags', 'web-stories' ),
			'filter_by_item'             => __( 'Filter by Tag', 'web-stories' ),
			'items_list_navigation'      => __( 'Tags list navigation', 'web-stories' ),
			'items_list'                 => __( 'Tags list', 'web-stories' ),
			/* translators: Tab heading when selecting from the most used terms. */
			'most_used'                  => _x( 'Most Used', 'Tags', 'web-stories' ),
			'back_to_items'              => __( '&larr; Go to Tags', 'web-stories' ),
			'item_link'                  => _x( 'Tag Link', 'navigation link block title', 'web-stories' ),
			'item_link_description'      => _x( 'A link to a Tag.', 'navigation link block description', 'web-stories' ),
		];
		$args   = [
			'labels'                => $labels,
			'hierarchical'          => false,
			'public'                => false,
			'show_ui'               => true,
			'show_admin_column'     => true,
			'rewrite'               => true,
			'show_in_rest'          => true,
			'capabilities'          => [
				'manage_terms' => 'delete_private_web-stories',
				'edit_terms'   => 'delete_private_web-stories',
				'delete_terms' => 'delete_private_web-stories',
				'assign_terms' => 'edit_web-stories',
			],
			'rest_controller_class' => Stories_Terms_Controller::class,
		];

		return $args;
	}
}
