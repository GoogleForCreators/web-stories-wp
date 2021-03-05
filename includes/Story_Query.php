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
use WP_Post;
use WP_Query;

/**
 * Stories class.
 */
class Story_Query {
	/**
	 * Story attributes
	 *
	 * @since 1.5.0
	 *
	 * @var array An array of story attributes.
	 */
	protected $story_attributes = [];

	/**
	 * Story query arguments.
	 *
	 * @since 1.5.0
	 *
	 * @var array An array of query arguments.
	 */
	protected $query_args = [];

	/**
	 * Renderer object.
	 *
	 * @since 1.5.0
	 *
	 * @var Renderer
	 */
	public $renderer;

	/**
	 * Class constructor
	 *
	 * @since 1.5.0
	 *
	 * @param array $story_attributes          {
	 *                                         An array of story attributes.
	 *
	 *     @type string $view_type                 Stories View type. Default circles.
	 *     @type int    $number_of_columns         Number of columns to show in grid view. Default 2.
	 *     @type bool   $show_title                Whether to show story title or not. Default false.
	 *     @type bool   $show_author               Whether to show story author or not. Default false.
	 *     @type bool   $show_date                 Whether to show story date or not. Default false.
	 *     @type bool   $show_archive_link Whether to show view all link or not. Default false.
	 *     @type string $archive_link_label     The label for view all link. Default 'View all stories'.
	 *     @type string $image_alignment The list mode image alignment. Default 'left'.
	 *     @type string $class                     Additional CSS classes for the container. Default empty string.
	 * }
	 * @param array $query_args           An array of query arguments for story. @see WP_Query::parse_query() for
	 *                                         all available arguments.
	 */
	public function __construct( array $story_attributes = [], array $query_args = [] ) {
		$this->story_attributes = $story_attributes;

		$default_query_args = [
			'post_type'        => Story_Post_Type::POST_TYPE_SLUG,
			'posts_per_page'   => 10,
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
		];

		$this->query_args = wp_parse_args( $query_args, $default_query_args );
	}

	/**
	 * Retrieves an array of the latest stories, or Stories matching the given criteria.
	 *
	 * @since 1.5.0
	 *
	 * @return WP_Post[] List of Story posts.
	 */
	public function get_stories() {
		$stories_query = new WP_Query();

		/**
		 * List of story posts.
		 *
		 * @var WP_Post[] $result
		 */
		$result = $stories_query->query( $this->query_args );

		return $result;
	}

	/**
	 * Instantiates the renderer classes based on the view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Renderer Renderer Instance.
	 */
	public function get_renderer() {
		$story_attributes = $this->get_story_attributes();
		$view_type        = ( ! empty( $story_attributes['view_type'] ) ) ? $story_attributes['view_type'] : '';

		switch ( $view_type ) {
			case 'carousel':
			case 'circles':
				$renderer = new Carousel_Renderer( $this );
				break;
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
	 * @since 1.5.0
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
	 * @since 1.5.0
	 *
	 * @return array An array of story attributes.
	 */
	public function get_story_attributes() {
		$default_attributes = [
			'view_type'          => 'circles',
			'number_of_columns'  => 2,
			'show_title'         => false,
			'show_author'        => false,
			'show_date'          => false,
			'show_excerpt'       => false,
			'show_archive_link'  => false,
			'sharp_corners'      => false,
			'archive_link_label' => __( 'View all stories', 'web-stories' ),
			'image_alignment'    => 'left',
			'class'              => '',
			'circle_size'        => 150,
		];

		return wp_parse_args( $this->story_attributes, $default_attributes );
	}
}
