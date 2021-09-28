<?php
/**
 * Plugin Name: Web Stories Taxonomy Example
 * Description: Example plugin adding custom taxonomies to web stories.
 * Plugin URI: https://wp.stories.google/
 * Author: Pascal Birchler, Google
 * Author URI: https://opensource.google.com/
 * Version: 0.0.1
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 */

add_action(
	'init',
	static function () {
		register_taxonomy(
			'story-tag',
			'web-story',
			[
				'description'  => 'Story Tags',
				'show_in_rest' => true,
				'rest_base'    => 'story-tags',
			]
		);

		register_taxonomy(
			'story-color',
			'web-story',
			[
				'description'  => 'Story Colors',
				'show_in_rest' => true,
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
			'story-category',
			'web-story',
			[
				'description'  => 'Story Categories',
				'hierarchical' => true,
				'show_in_rest' => true,
				'rest_base'    => 'story-categories',
			]
		);

		register_taxonomy(
			'story-vertical',
			'web-story',
			[
				'description'  => 'Story Verticals',
				'hierarchical' => true,
				'show_in_rest' => true,
				'rest_base'    => 'story-verticals',
				'labels'       => [
					'name'                       => 'Verticals',
					'singular_name'              => 'Vertical',
					'search_items'               => 'Search Verticals',
					'all_items'                  => 'All Verticals',
					'parent_item'                => 'Parent Vertical',
					'parent_item_colon'          => 'Parent Vertical:',
					'edit_item'                  => 'Edit Vertical',
					'view_item'                  => 'View Vertical',
					'update_item'                => 'Update Vertical',
					'add_new_item'               => 'Add New Vertical',
					'new_item_name'              => 'New Vertical Name',
					'not_found'                  => 'No verticals found.',
					'no_terms'                   => 'No verticals',
					'filter_by_item'             => 'Filter by vertical',
					'items_list_navigation'      => 'Verticals list navigation',
					'items_list'                 => 'Verticals list',
					'most_used'                  => 'Most Used',
					'back_to_items'              => '&larr; Go to Verticals',
					'item_link'                  => 'Color Vertical',
					'item_link_description'      => 'A link to a vertical.',
				],
			]
		);
	}
);
