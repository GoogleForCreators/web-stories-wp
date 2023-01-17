<?php
/**
 * Plugin Name: Web Stories Test Plugin: Taxonomies
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Test plugin that adds some custom taxonomies.
 * Author:      Google
 * Author URI:  https://opensource.google.com/
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\E2E_Tests;

function add_taxonomies() {
	register_taxonomy(
		'story-color',
		'web-story',
		[
			'description'  => 'Story Colors',
			'show_in_rest' => true,
			'show_ui'      => true,
			'rest_base'    => 'story-colors',
			'labels'       => [
				'name'                       => 'Colors',
				'singular_name'              => 'Color',
				'search_items'               => 'Search Colors',
				'popular_items'              => 'Popular Colors',
				'all_items'                  => 'All Colors',
				'edit_item'                  => 'Edit Color',
				'view_item'                  => 'View Color',
				'update_item'                => 'Update Color',
				'add_new_item'               => 'Add New Color',
				'new_item_name'              => 'New Color Name',
				'separate_items_with_commas' => 'Separate colors with commas',
				'add_or_remove_items'        => 'Add or remove colors',
				'choose_from_most_used'      => 'Choose from the most used colors',
				'not_found'                  => 'No colors found.',
				'no_terms'                   => 'No colors',
				'items_list_navigation'      => 'Colors list navigation',
				'items_list'                 => 'Colors list',
				'most_used'                  => 'Most Used',
				'back_to_items'              => '&larr; Go to Colors',
				'item_link'                  => 'Color Color',
				'item_link_description'      => 'A link to a color.',
			],
		]
	);

	register_taxonomy(
		'story-vertical',
		'web-story',
		[
			'description'  => 'Story Verticals',
			'hierarchical' => true,
			'show_in_rest' => true,
			'show_ui'      => true,
			'rest_base'    => 'story-verticals',
			'labels'       => [
				'name'                  => 'Verticals',
				'singular_name'         => 'Vertical',
				'search_items'          => 'Search Verticals',
				'all_items'             => 'All Verticals',
				'parent_item'           => 'Parent Vertical',
				'parent_item_colon'     => 'Parent Vertical:',
				'edit_item'             => 'Edit Vertical',
				'view_item'             => 'View Vertical',
				'update_item'           => 'Update Vertical',
				'add_new_item'          => 'Add New Vertical',
				'new_item_name'         => 'New Vertical Name',
				'not_found'             => 'No verticals found.',
				'no_terms'              => 'No verticals',
				'filter_by_item'        => 'Filter by vertical',
				'items_list_navigation' => 'Verticals list navigation',
				'items_list'            => 'Verticals list',
				'most_used'             => 'Most Used',
				'back_to_items'         => '&larr; Go to Verticals',
				'item_link'             => 'Color Vertical',
				'item_link_description' => 'A link to a vertical.',
			],
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\add_taxonomies' );
