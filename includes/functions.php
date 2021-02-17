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

use Google\Web_Stories\Interfaces\FieldState;
use Google\Web_Stories\Stories_Renderer\Renderer;
use Google\Web_Stories\Stories_Renderer\FieldState\BaseFieldState as GridView;
use Google\Web_Stories\Stories_Renderer\FieldState\CarouselView;
use Google\Web_Stories\Stories_Renderer\FieldState\CircleView;
use Google\Web_Stories\Stories_Renderer\FieldState\ListView;

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
 * Returns field state for the provided view type.
 *
 * @param string $view View Type.
 *
 * @return GridView|ListView|CircleView|CarouselView
 */
function get_field( $view = 'grid' ) {

	switch ( $view ) {
		case 'grid':
			$field_state = new GridView();
			break;
		case 'list':
			$field_state = new ListView();
			break;
		case 'circles':
			$field_state = new CircleView();
			break;
		case 'carousel':
			$field_state = new CarouselView();
			break;
		default:
			$default_field_state = new CircleView();
			/**
			 * Filters the fieldstate object.
			 *
			 * This depicts
			 *
			 * @since 1.3.0
			 *
			 * @param FieldState $default_field_state Field states for circle view.
			 */
			$field_state = apply_filters( 'web_stories_default_fieldstate', $default_field_state );
	}

	return $field_state;
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
		'sharp_corners',
		'archive_link',
	];

	$field_states = [];

	foreach ( $views as $view_type => $view_label ) {
		$field_state = get_field( $view_type );
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
function get_stories_order() {
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
