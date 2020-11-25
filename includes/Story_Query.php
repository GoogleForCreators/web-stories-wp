<?php
/**
 * Stories class.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Stories_Renderer\Carousel_Renderer;
use Google\Web_Stories\Stories_Renderer\Generic_Renderer;
use Google\Web_Stories\Stories_Renderer\Renderer;
use WP_Query;

/**
 * Stories class.
 */
class Story_Query {

	/**
	 * Story attributes
	 *
	 * @var array An array of story attributes.
	 */
	protected $story_attributes = [];

	/**
	 * Story query arguments.
	 *
	 * @var array An array of query arguments.
	 */
	protected $query_arguments = [];

	/**
	 * Renderer object.
	 *
	 * @var Renderer
	 */
	public $renderer;

	/**
	 * Class constructor
	 *
	 * @param array $story_attributes          {
	 *                                         An array of story attributes.
	 *
	 *     @type string $view_type                 Stories View type. Default circles.
	 *     @type int    $number_of_columns         Number of columns to show in grid view. Default 2.
	 *     @type bool   $show_title                Whether to show story title or not. Default false.
	 *     @type bool   $show_author               Whether to show story author or not. Default false.
	 *     @type bool   $show_date                 Whether to show story date or not. Default false.
	 *     @type bool   $show_story_poster         Whether to show story story poster or show story player. Default true.
	 *     @type bool   $show_stories_archive_link Whether to show view all link or not. Default false.
	 *     @type string $stories_archive_label     The label for view all link. Default 'View all stories'.
	 *     @type string $list_view_image_alignment The list mode image alignment. Default 'left'.
	 *     @type string $class                     Additional CSS classes for the container. Default empty string.
	 * }
	 * @param array $query_arguments           An array of query arguments for story. @see WP_Query::parse_query() for
	 *                                         all available arguments.
	 */
	public function __construct( array $story_attributes = [], array $query_arguments = [] ) {

		$this->story_attributes = $story_attributes;
		$this->query_arguments  = $query_arguments;
	}

	/**
	 * Retrieves an array of the latest stories, or Stories matching the given criteria.
	 *
	 * @return array An array of Story posts.
	 */
	public function get_stories() {

		$query_args    = $this->get_query_args();
		$stories_query = new WP_Query( $query_args );
		$posts         = ( ! empty( $stories_query->posts ) && is_array( $stories_query->posts ) ) ? $stories_query->posts : [];

		/**
		 * Filter the stories posts.
		 *
		 * @param array $posts Array of stories' posts.
		 */
		return apply_filters( 'ws_get_stories_posts', $posts );
	}

	/**
	 * Instantiates the renderer classes based on the view type.
	 *
	 * @return Renderer Renderer Instance.
	 */
	private function get_renderer() {

		$story_attributes = $this->get_story_attributes();
		$view_type        = ( ! empty( $story_attributes['view_type'] ) ) ? $story_attributes['view_type'] : '';

		switch ( $view_type ) {
			case 'carousel':
				$renderer = new Carousel_Renderer( $this );
				break;

			case 'circles':
			case 'list':
			case 'grid':
			default:
				$renderer = new Generic_Renderer( $this );
		}

		$renderer->init();

		return $renderer;
	}

	/**
	 * Renders the stories output.
	 *
	 * @return string
	 */
	public function render() {

		$this->renderer = $this->get_renderer();

		return $this->renderer->render();
	}

	/**
	 * Gets an array of story attributes.
	 *
	 * @return array An array of story attributes.
	 */
	public function get_story_attributes() {

		$default_attributes = [
			'view_type'                 => 'circles',
			'number_of_columns'         => 2,
			'show_title'                => false,
			'show_author'               => false,
			'show_date'                 => false,
			'show_story_poster'         => true,
			'show_stories_archive_link' => false,
			'stories_archive_label'     => __( 'View all stories', 'web-stories' ),
			'list_view_image_alignment' => 'left',
			'class'                     => '',
		];

		return wp_parse_args( $this->story_attributes, $default_attributes );
	}

	/**
	 * Returns arguments to be passed to the WP_Query object initialization.
	 *
	 * @return array An array of query arguments.
	 */
	protected function get_query_args() {

		$default_query_args = [
			'post_type'        => Story_Post_Type::POST_TYPE_SLUG,
			'posts_per_page'   => 10,
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
		];

		return wp_parse_args( $this->query_arguments, $default_query_args );
	}

}
