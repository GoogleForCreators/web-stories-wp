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
use Google\Web_Stories\Stories_Renderer\FieldState\GridView;
use Google\Web_Stories\Stories_Renderer\FieldState\CarouselView;
use Google\Web_Stories\Stories_Renderer\FieldState\CircleView;
use Google\Web_Stories\Stories_Renderer\FieldState\ListView;

/**
 * Render stories based on the passed arguments.
 *
 * @since 1.5.0
 *
 * @param array $attrs Arguments for displaying stories.
 * @param array $query_args Query arguments for stories.
 *
 * @return void
 */
function render_stories( array $attrs = [], array $query_args = [] ) {
	$stories_obj = new Story_Query( $attrs, $query_args );
	//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $stories_obj->render();
}

/**
 * Returns list of stories based on the arguments passed to it.
 *
 * @since 1.5.0
 *
 * @param array $attrs Arguments for displaying stories.
 * @param array $query_args Query arguments for stories.
 *
 * @return array
 */
function get_stories( array $attrs = [], array $query_args = [] ) {
	$stories_obj = new Story_Query( $attrs, $query_args );

	return $stories_obj->get_stories();
}

/**
 * Render stories based on customizer settings.
 *
 * @since 1.5.0
 *
 * @return void
 */
function render_theme_stories() {
	//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	echo get_plugin_instance()->customizer->render_stories();
}

/**
 * Returns field state for the provided view type.
 *
 * @since 1.5.0
 * @access private
 * @todo Move out of this file
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
 * @since 1.5.0
 * @access private
 * @todo Move out of this file
 *
 * @return array
 */
function fields_states() {
	$views = get_layouts();

	$fields = [
		'title',
		'author',
		'date',
		'image_alignment',
		'excerpt',
		'sharp_corners',
		'archive_link',
		'circle_size',
		'number_of_columns',
	];

	$field_states = [];

	foreach ( array_keys( $views ) as $view_type ) {
		$field_state = get_field( (string) $view_type );
		foreach ( $fields as $field ) {
			$field_states[ $view_type ][ $field ] = [
				'show'   => $field_state->$field()->show(),
				'label'  => $field_state->$field()->label(),
				'hidden' => $field_state->$field()->hidden(),
			];
		}
	}

	return $field_states;
}

/**
 * Get supported layouts for web stories.
 *
 * @since 1.5.0
 * @access private
 * @todo Move out of this file
 *
 * @return mixed|void
 */
function get_layouts() {
	/**
	 * Filter supported layouts.
	 *
	 * @since 1.5.0
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
