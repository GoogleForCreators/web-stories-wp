<?php
/**
 * Class Stories_Shortcode.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

namespace Google\Web_Stories\Shortcode;

use Google\Web_Stories\Story_Query as Stories;

/**
 * Class Stories_Shortcode
 *
 * @package Google\Web_Stories\Shortcode
 */
class Stories_Shortcode {

	/**
	 * Shortcode name.
	 *
	 * @var string
	 */
	const SHORTCODE_NAME = 'stories';

	/**
	 * Initializes the Stories shortcode.
	 *
	 * @return void
	 */
	public function init() {
		add_shortcode( self::SHORTCODE_NAME, [ $this, 'render_stories' ] );
	}

	/**
	 * Callback for the shortcode.
	 *
	 * This will render the stories according to given
	 * shortcode attributes.
	 *
	 * @param array $attrs Shortcode attributes.
	 *
	 * @return string Story markup.
	 */
	public function render_stories( array $attrs ) {
		$attributes = shortcode_atts(
			[
				'view'                      => 'circles',
				'columns'                   => 1,
				'title'                     => 'false',
				'author'                    => 'false',
				'date'                      => 'false',
				'archive_link'              => 'false',
				'archive_label'             => __( 'View all stories', 'web-stories' ),
				'list_view_image_alignment' => 'left',
				'class'                     => '',
				'circle_size'               => 150,
				'number'                    => 10,
				'order'                     => 'DESC',
			],
			$attrs,
			self::SHORTCODE_NAME
		);

		$stories = new Stories( $this->prepare_story_attrs( $attributes ), $this->prepare_story_args( $attributes ) );

		return $stories->render();
	}

	/**
	 * Prepare story attributes.
	 *
	 * @param array $attributes Shortcode attributes.
	 *
	 * @return array Attributes to pass to Story_Query class.
	 */
	private function prepare_story_attrs( array $attributes ) {

		return [
			'view_type'                 => (string) $attributes['view'],
			'number_of_columns'         => (int) $attributes['columns'],
			'show_title'                => ( 'true' === $attributes['title'] ),
			'show_author'               => ( 'true' === $attributes['author'] ),
			'show_date'                 => ( 'true' === $attributes['date'] ),
			'show_story_archive_link'   => ( 'true' === $attributes['archive_link'] ),
			'show_story_archive_label'  => ( 'true' === $attributes['archive_label'] ),
			'list_view_image_alignment' => (string) $attributes['list_view_image_alignment'],
			'class'                     => (string) $attributes['class'],
			'circle_size'               => (int) $attributes['circle_size'],
		];
	}

	/**
	 * Prepare story arguments.
	 *
	 * @param array $attributes Array of arguments for Story Query.
	 *
	 * @return array Array of story arguments to pass to Story_Query.
	 */
	private function prepare_story_args( array $attributes ) {

		return [
			// Show 100 stories at most to avoid 500 errors.
			'posts_per_page' => min( (int) $attributes['number'], 100 ),
			'order'          => 'ASC' === $attributes['order'] ? 'ASC' : 'DESC',
		];
	}
}
