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
	 * Title.
	 *
	 * @var string
	 */
	public $title = '';
	/**
	 * URL.
	 *
	 * @var string
	 */
	public $url = '';
	/**
	 * Markup.
	 *
	 * @var string
	 */
	public $markup = '';
	/**
	 * Poster url - portrait.
	 *
	 * @var string
	 */
	public $poster_portrait;
	/**
	 * Poster url - landscape.
	 *
	 * @var string
	 */
	public $poster_landscape;
	/**
	 * Poster url - square.
	 *
	 * @var string
	 */
	public $poster_square;

	/**
	 * Story constructor.
	 *
	 * @param Object $story Story object. Default to null.
	 */
	public function __construct( $story = null ) {
		if ( is_object( $story ) ) {
			foreach ( get_object_vars( $story ) as $key => $value ) {
				$this->$key = $value;
			}
		}
	}

	/**
	 * Load story from post.
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

		$this->title  = $post->post_title;
		$this->markup = $post->post_content;
		$this->url    = get_permalink( $post );

		$thumbnail_id = (int) get_post_thumbnail_id( $post );

		if ( 0 !== $thumbnail_id ) {
			$this->poster_square    = wp_get_attachment_image_url( $thumbnail_id, Media::STORY_SQUARE_IMAGE_SIZE );
			$this->poster_landscape = wp_get_attachment_image_url( $thumbnail_id, Media::STORY_LANDSCAPE_IMAGE_SIZE );
		}

		return true;
	}
}
