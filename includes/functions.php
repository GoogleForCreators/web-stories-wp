<?php
/**
 * Miscellaneous functions.
 * These are mostly utility or wrapper functions.
 *
 * @package Google\Web_Stories
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
namespace Google\Web_Stories;

/**
 * Fetch stories based on customizer settings.
 *
 * @param array $args Arguments for fetching stories.
 *
 * @return string|void
 */
function stories( $args = [] ) {
	$story_query = new Story_Query( $args );
	//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $story_query->render();
}

/**
 * Wrapper function for fetching field states
 * based on the view types.
 *
 * Mainly uses FieldState and Fields classes.
 *
 * @SuppressWarnings(PHPMD.UnusedLocalVariable)
 *
 * @return array
 */
function fields_states() {
	$views = get_layouts();

	$fields = [
		'title',
		'author',
		'date',
		'image_align',
		'excerpt',
		'archive_link',
	];

	$field_states = [];

	foreach ( $views as $view_type => $view_label ) {
		$field_state = ( new Story_Query( [ 'view_type' => $view_type ] ) )->get_renderer()->field();
		foreach ( $fields as $field ) {
			$field_states[ $view_type ][ $field ] = [
				'show'     => $field_state->$field()->show(),
				'label'    => $field_state->$field()->label(),
				'readonly' => $field_state->$field()->readonly(),
			];
		}
	}

	return $field_states;
}

/**
 * Put some tinymce related data on the page.
 *
 * @return void
 */
function web_stories_script_data() {
	$order      = get_orderby();
	$views      = get_layouts();
	$order_list = [];
	$view_types = [];

	foreach ( $order as $order_key => $an_order ) {
		$order_list[] = [
			'label' => $an_order,
			'value' => $order_key,
		];
	}

	foreach ( $views as $view_key => $view_label ) {
		$view_types[] = [
			'label' => $view_label,
			'value' => $view_key,
		];
	}

	$field_states = fields_states();

	$data = [
		'orderlist' => $order_list,
		'icon'      => trailingslashit( WEBSTORIES_ASSETS_URL ) . 'images/widget/carousel-icon.png',
		'tag'       => 'stories',
		'views'     => $view_types,
		'fields'    => $field_states,
	];

	echo "<script type='text/javascript'>\n";
	echo 'var webStoriesData = ' . wp_json_encode( $data ) . ';';
	echo "\n</script>";
}
add_action( 'admin_print_scripts-widgets.php', __NAMESPACE__ . '\web_stories_script_data' );

/**
 * Get supported layouts for web stories.
 *
 * @return mixed|void
 */
function get_layouts() {
	/**
	 * Filter supported layouts.
	 *
	 * @since 1.3.0
	 *
	 * @param array $layouts Default supported layouts.
	 */
	return apply_filters(
		'web_stories_layouts',
		[
			'carousel' => __( 'Box Carousel', 'web-stories' ),
			'circles'  => __( 'Circle Carousel', 'web-stories' ),
			'grid'     => __( 'Grid', 'web-stories' ),
			'list'     => __( 'List', 'web-stories' ),
		]
	);
}

/**
 * Get supported order by options for web stories.
 *
 * @return array
 */
function get_orderby() {
	/**
	 * Filter supported order by options.
	 *
	 * @param array $orderby Default supported order by options.
	 *
	 * @since 1.3.0
	 */
	return apply_filters(
		'web_stories_orderby',
		[
			'latest'               => __( 'Latest', 'web-stories' ),
			'oldest'               => __( 'Oldest', 'web-stories' ),
			'alphabetical'         => __( 'A -> Z', 'web-stories' ),
			'reverse-alphabetical' => __( 'Z -> A', 'web-stories' ),
		]
	);
}
