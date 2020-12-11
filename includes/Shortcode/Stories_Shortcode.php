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
	 * Shortcode attributes.
	 *
	 * @var array
	 */
	private $attributes;

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
	 * @param array $attributes Shortcode attributes.
	 *
	 * @return string Story markup.
	 */
	public function render_stories( array $attributes ) {
		$this->attributes = shortcode_atts(
			[
				'view'                      => 'circles',
				'columns'                   => 2,
				'title'                     => 'false',
				'author'                    => 'false',
				'date'                      => 'false',
				'story_poster'              => 'true',
				'archive_link'              => 'false',
				'archive_label'             => __( 'View all stories', 'web-stories' ),
				'list_view_image_alignment' => 'left',
				'class'                     => '',
				'number'                    => 10,
				'order'                     => 'DESC',
			],
			$attributes
		);

		$stories = new Stories( $this->prepare_story_attrs(), $this->prepare_story_args() );

		return $stories->render();
	}

	/**
	 * Prepare story attributes.
	 *
	 * @return array Attributes to pass to Story_Query class.
	 */
	private function prepare_story_attrs() {
		$attrs = [];

		$attrs['view_type']                 = (string) $this->attributes['view'];
		$attrs['number_of_columns']         = (int) $this->attributes['columns'];
		$attrs['show_title']                = (bool) 'true' === $this->attributes['title'];
		$attrs['show_author']               = (bool) 'true' === $this->attributes['author'];
		$attrs['show_date']                 = (bool) 'true' === $this->attributes['date'];
		$attrs['show_story_poster']         = (bool) 'true' === $this->attributes['story_poster'];
		$attrs['show_story_archive_link']   = (bool) 'true' === $this->attributes['archive_link'];
		$attrs['show_story_archive_label']  = (bool) 'true' === $this->attributes['archive_label'];
		$attrs['list_view_image_alignment'] = (string) $this->attributes['list_view_image_alignment'];
		$attrs['class']                     = (string) $this->attributes['class'];

		return $attrs;
	}

	/**
	 * Prepare story arguments.
	 *
	 * @return array Array of story arguments to pass to Story_Query.
	 */
	private function prepare_story_args() {
		$args = [];

		// Show 100 stories at most to avoid 500 errors.
		$args['posts_per_page'] = min( (int) $this->attributes['number'], 100 );
		$args['order']          = 'ASC' === $this->attributes['order'] ? 'ASC' : 'DESC';

		return $args;
	}
}
