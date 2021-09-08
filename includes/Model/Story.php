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

use Google\Web_Stories\Media\Image_Sizes;
use Google\Web_Stories\Story_Post_Type;
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
	protected $id = 0;

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
	 * @param int|null|WP_Post $_post Post id or Post object.
	 *
	 * @return bool
	 */
	public function load_from_post( $_post ): bool {
		$post = get_post( $_post );

		if ( ! $post instanceof WP_Post || Story_Post_Type::POST_TYPE_SLUG !== $post->post_type ) {
			return false;
		}

		$this->id      = $post->ID;
		$this->title   = get_the_title( $post );
		$this->excerpt = $post->post_excerpt;
		$this->markup  = $post->post_content;
		$this->url     = (string) get_permalink( $post );

		$thumbnail_id = (int) get_post_thumbnail_id( $post );

		if ( 0 !== $thumbnail_id ) {
			$this->poster_portrait = (string) wp_get_attachment_image_url( $thumbnail_id, Image_Sizes::POSTER_PORTRAIT_IMAGE_SIZE );
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
	public function get_title(): string {
		return (string) $this->title;
	}

	/**
	 * Getter for excerpt attribute.
	 *
	 * @return string
	 */
	public function get_excerpt(): string {
		return (string) $this->excerpt;
	}

	/**
	 * Getter for url attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_url(): string {
		return (string) $this->url;
	}

	/**
	 * Getter for markup attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_markup(): string {
		return (string) $this->markup;
	}

	/**
	 * Getter for poster portrait attribute.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_poster_portrait(): string {
		return (string) $this->poster_portrait;
	}

	/**
	 * Get the story ID.
	 *
	 * @return int
	 */
	public function get_id(): int {
		return (int) $this->id;
	}

	/**
	 * Get author of the story.
	 *
	 * @return string
	 */
	public function get_author(): string {
		return (string) $this->author;
	}

	/**
	 * Date for the story.
	 *
	 * @return string
	 */
	public function get_date(): string {
		return (string) $this->date;
	}

	/**
	 * Returns the story's publisher logo ID.
	 *
	 * @since 1.12.0
	 *
	 * @return int Publisher logo ID.
	 */
	private function get_publisher_logo_id(): int {
		return (int) get_post_meta( $this->get_id(), Story_Post_Type::PUBLISHER_LOGO_META_KEY, true );
	}

	/**
	 * Get the publisher name.
	 *
	 * @since 1.12.0
	 *
	 * @return string Publisher Name.
	 */
	public function get_publisher_name(): string {
		$name = get_bloginfo( 'name' );
		/**
		 * Filters the publisher's name
		 *
		 * @since 1.7.0
		 *
		 * @param string $name Publisher Name.
		 */
		$name = apply_filters( 'web_stories_publisher_name', $name );

		return esc_attr( $name );
	}

	/**
	 * Returns the story's publisher logo URL.
	 *
	 * @since 1.12.0
	 *
	 * @return string Publisher logo URL.
	 */
	public function get_publisher_logo_url(): string {
		$publisher_logo_id = $this->get_publisher_logo_id();

		$url  = $publisher_logo_id ? wp_get_attachment_image_url( $publisher_logo_id, Image_Sizes::PUBLISHER_LOGO_IMAGE_SIZE ) : null;
		$url  = false === $url ? null : $url;
		$post = $this->get_id() ? get_post( $this->get_id() ) : null;

		/**
		 * Filters the publisher logo URL.
		 *
		 * @since 1.0.0
		 * @since 1.1.0 The second parameter was deprecated.
		 * @since 1.11.0 The second parameter was repurposed to provide the current post object.
		 *
		 * @param string|null  $url  Publisher logo URL.
		 * @param WP_Post|null $post Story post object if set.
		 */
		return (string) apply_filters( 'web_stories_publisher_logo', $url, $post );
	}

	/**
	 * Returns the story's publisher logo URL.
	 *
	 * @since 1.12.0
	 *
	 * @return array {
	 *     Array of image data, or empty array if no image is available.
	 *
	 *     @type string $0 Image source URL.
	 *     @type int    $1 Image width in pixels.
	 *     @type int    $2 Image height in pixels.
	 *     @type bool   $3 Whether the image is a resized image.
	 * }
	 */
	public function get_publisher_logo_src(): array {
		$publisher_logo_id = $this->get_publisher_logo_id();

		$src  = $publisher_logo_id ? wp_get_attachment_image_src( $publisher_logo_id, Image_Sizes::PUBLISHER_LOGO_IMAGE_SIZE ) : null;
		$src  = false === $src ? [] : $src;
		$post = $this->get_id() ? get_post( $this->get_id() ) : null;

		/**
		 * Filters the publisher logo URL.
		 *
		 * @since 1.12.0
		 *
		 * @param array        $src  Publisher logo src.
		 * @param WP_Post|null $post Story post object if set.
		 */
		return (array) apply_filters( 'web_stories_publisher_logo_src', $src, $post );
	}
}
