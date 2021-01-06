<?php
/**
 * Class Story
 *
 * @package   Google\Web_Stories\Model
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

namespace Google\Web_Stories\Model;

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Media;
use WP_Post;

/**
 * Class Story
 *
 * @package Google\Web_Stories\Model
 */
class Story {
	/**
	 * Story ID.
	 *
	 * @var int
	 */
	protected $id;

	/**
	 * Title.
	 *
	 * @var string
	 */
	protected $title = '';

	/**
	 * Excerpt.
	 *
	 * @var string
	 */
	protected $excerpt = '';

	/**
	 * URL.
	 *
	 * @var string
	 */
	protected $url = '';
	/**
	 * Markup.
	 *
	 * @var string
	 */
	protected $markup = '';
	/**
	 * Poster url - portrait.
	 *
	 * @var string
	 */
	protected $poster_portrait;
	/**
	 * Poster url - landscape.
	 *
	 * @var string
	 */
	protected $poster_landscape;
	/**
	 * Poster url - square.
	 *
	 * @var string
	 */
	protected $poster_square;

	/**
	 * Date for the story.
	 *
	 * @var string
	 */
	protected $date;

	/**
	 * Author of story.
	 *
	 * @var string
	 */
	protected $author;

	/**
	 * Story constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param array $story Array of attributes.
	 */
	public function __construct( array $story = [] ) {
		foreach ( $story as $key => $value ) {
			if ( property_exists( $this, $key ) ) {
				$this->$key = $value;
			}
		}
	}

	/**
	 * Load story from post.
	 *
	 * @since 1.0.0
	 *
	 * @param int|WP_Post $_post Post id or Post object.
	 *
	 * @return bool
	 */
	public function load_from_post( $_post ) {
		$post = get_post( $_post );

		if ( ! $post instanceof WP_Post || Story_Post_Type::POST_TYPE_SLUG !== $post->post_type ) {
			return false;
		}

		$this->title   = get_the_title( $post );
		$this->excerpt = get_the_excerpt( $post );
		$this->markup  = $post->post_content;
		$this->url     = (string) get_permalink( $post );

		$thumbnail_id = (int) get_post_thumbnail_id( $post );

		if ( 0 !== $thumbnail_id ) {
			$this->poster_portrait  = (string) wp_get_attachment_image_url( $thumbnail_id, Media::POSTER_PORTRAIT_IMAGE_SIZE );
			$this->poster_square    = (string) wp_get_attachment_image_url( $thumbnail_id, Media::POSTER_SQUARE_IMAGE_SIZE );
			$this->poster_landscape = (string) wp_get_attachment_image_url( $thumbnail_id, Media::POSTER_LANDSCAPE_IMAGE_SIZE );
		}

		return true;
	}

	/**
	 * Getter for title attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->title;
	}

	/**
	 * Getter for excerpt attribute.
	 *
	 * @return string
	 */
	public function get_excerpt() {
		return $this->excerpt;
	}

	/**
	 * Getter for url attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_url() {
		return $this->url;
	}

	/**
	 * Getter for markup attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_markup() {
		return $this->markup;
	}

	/**
	 * Getter for poster portrait attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_poster_portrait() {
		return $this->poster_portrait;
	}

	/**
	 * Getter for poster landscape attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_poster_landscape() {
		return $this->poster_landscape;
	}

	/**
	 * Getter for poster square attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_poster_square() {
		return $this->poster_square;
	}

	/**
	 * Get the story ID.
	 *
	 * @return int
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Get author of the story.
	 *
	 * @return string
	 */
	public function get_author() {
		return $this->author;
	}

	/**
	 * Date for the story.
	 *
	 * @return string
	 */
	public function get_date() {
		return $this->date;
	}

}
