<?php
/**
 * Class Story
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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
	 * Publisher name.
	 *
	 * @var string
	 */
	protected $publisher_name = '';

	/**
	 * Publisher logo.
	 *
	 * @var string
	 */
	protected $publisher_logo;

	/**
	 * Poster source set sizes.
	 *
	 * @var string
	 */
	protected $poster_sizes = '';

	/**
	 * Poster source set.
	 *
	 * @var string
	 */
	protected $poster_srcset = '';

	/**
	 * Publisher logo size.
	 *
	 * @var int[]
	 * @phpstan-var array{0?: int, 1?: int}
	 */
	protected $publisher_logo_size = [];

	/**
	 * Poster portrait logo size.
	 *
	 * @var int[]
	 * @phpstan-var array{0?: int, 1?: int}
	 */
	protected $poster_portrait_size = [];

	/**
	 * Poster url - portrait.
	 *
	 * @var string
	 */
	protected $poster_portrait = '';

	/**
	 * Date for the story.
	 *
	 * @var string
	 */
	protected $date = '';

	/**
	 * Author of story.
	 *
	 * @var string
	 */
	protected $author = '';

	/**
	 * Story constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string,mixed> $story Array of attributes.
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
	 */
	public function load_from_post( $_post ): bool {
		/**
		 * Filters the publisher's name
		 *
		 * @since 1.7.0
		 *
		 * @param string $name Publisher Name.
		 */
		$this->publisher_name = apply_filters( 'web_stories_publisher_name', get_bloginfo( 'name' ) );

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
			$poster_src = wp_get_attachment_image_src( $thumbnail_id, Image_Sizes::POSTER_PORTRAIT_IMAGE_SIZE );

			if ( $poster_src ) {
				[ $poster_url, $width, $height ] = $poster_src;
				$this->poster_portrait           = $poster_url;
				$this->poster_portrait_size      = [ $width, $height ];

				$size_array = [ (int) $width, (int) $height ];
				$image_meta = wp_get_attachment_metadata( $thumbnail_id );
				if ( $image_meta ) {
					$this->poster_sizes  = (string) wp_calculate_image_sizes( $size_array, $poster_url, $image_meta, $thumbnail_id );
					$this->poster_srcset = (string) wp_calculate_image_srcset( $size_array, $poster_url, $image_meta, $thumbnail_id );
				}
			}
		}

		/**
		 * Poster.
		 *
		 * @var array{url:string, width: number, height: number} $poster
		 */
		$poster = get_post_meta( $post->ID, Story_Post_Type::POSTER_META_KEY, true );
		if ( $poster ) {
			$this->poster_portrait      = $poster['url'];
			$this->poster_portrait_size = [ $poster['width'], $poster['height'] ];
		}

		/**
		 * Publisher logo ID.
		 *
		 * @var string|int $publisher_logo_id
		 */
		$publisher_logo_id = get_post_meta( $this->id, Story_Post_Type::PUBLISHER_LOGO_META_KEY, true );

		if ( ! empty( $publisher_logo_id ) ) {
			$img_src = wp_get_attachment_image_src( (int) $publisher_logo_id, Image_Sizes::PUBLISHER_LOGO_IMAGE_SIZE );

			if ( $img_src ) {
				[ $src, $width, $height ]  = $img_src;
				$this->publisher_logo_size = [ $width, $height ];
				$this->publisher_logo      = $src;
			}
		}

		return true;
	}

	/**
	 * Setter for poster set sizes.
	 *
	 * @since 1.21.0
	 *
	 * @param string $poster_sizes Poster sizes.
	 */
	public function set_poster_sizes( string $poster_sizes ): void {
		$this->poster_sizes = $poster_sizes;
	}

	/**
	 * Setter for poster source set.
	 *
	 * @since 1.21.0
	 *
	 * @param string $poster_srcset Poster source set.
	 */
	public function set_poster_srcset( string $poster_srcset ): void {
		$this->poster_srcset = $poster_srcset;
	}

	/**
	 * Setter for title.
	 *
	 * @since 1.21.0
	 *
	 * @param string $title Title.
	 */
	public function set_title( string $title ): void {
		$this->title = $title;
	}

	/**
	 * Getter for poster source set sizes.
	 *
	 * @since 1.18.0
	 */
	public function get_poster_sizes(): string {
		return $this->poster_sizes;
	}

	/**
	 * Getter for poster source set.
	 *
	 * @since 1.18.0
	 */
	public function get_poster_srcset(): string {
		return $this->poster_srcset;
	}

	/**
	 * Getter for title attribute.
	 *
	 * @since 1.0.0
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Getter for excerpt attribute.
	 */
	public function get_excerpt(): string {
		return $this->excerpt;
	}

	/**
	 * Getter for url attribute.
	 *
	 * @since 1.0.0
	 */
	public function get_url(): string {
		return $this->url;
	}

	/**
	 * Getter for markup attribute.
	 *
	 * @since 1.0.0
	 */
	public function get_markup(): string {
		return $this->markup;
	}

	/**
	 * Getter for poster portrait attribute.
	 *
	 * @since 1.0.0
	 */
	public function get_poster_portrait(): string {
		return $this->poster_portrait;
	}

	/**
	 * Get the story ID.
	 */
	public function get_id(): int {
		return $this->id;
	}

	/**
	 * Get author of the story.
	 */
	public function get_author(): string {
		return $this->author;
	}

	/**
	 * Date for the story.
	 */
	public function get_date(): string {
		return $this->date;
	}

	/**
	 * Returns the publisher name.
	 *
	 * @since 1.12.0
	 *
	 * @return string Publisher Name.
	 */
	public function get_publisher_name(): string {
		return $this->publisher_name;
	}

	/**
	 * Returns the story's publisher logo URL.
	 *
	 * @since 1.12.0
	 *
	 * @return string|null Publisher logo URL or null if not set.
	 */
	public function get_publisher_logo_url(): ?string {
		/**
		 * Filters the publisher logo URL.
		 *
		 * @since 1.0.0
		 * @since 1.1.0 The second parameter was deprecated.
		 * @since 1.12.0 The second parameter was repurposed to provide the current story ID.
		 *
		 * @param string|null  $url  Publisher logo URL or null if not set.
		 * @param int|null     $id   Story ID if available.
		 */
		return apply_filters( 'web_stories_publisher_logo', $this->publisher_logo, $this->id );
	}

	/**
	 * Returns the story's publisher logo size.
	 *
	 * @since 1.12.0
	 *
	 * @return array {
	 *     Publisher logo size.
	 *
	 *     Array of image data, or empty array if no image is available.
	 *
	 *     @type int    $1 Image width in pixels.
	 *     @type int    $2 Image height in pixels.
	 * }
	 *
	 * @phpstan-return array{0?: int, 1?: int}
	 */
	public function get_publisher_logo_size(): array {
		/**
		 * Filters the publisher logo size.
		 *
		 * @since 1.12.0
		 *
		 * @param array   $size {
		 *     Publisher logo size.
		 *
		 *     Array of image data, or empty array if no image is available.
		 *
		 *     @type int    $1 Image width in pixels.
		 *     @type int    $2 Image height in pixels.
		 * }
		 * @param int|null $id   Story ID if available.
		 */
		return apply_filters( 'web_stories_publisher_logo_size', $this->publisher_logo_size, $this->id );
	}

	/**
	 * Get poster portrait size.
	 *
	 * @since 1.22.0
	 *
	 * @return array {
	 *     Poster protrait logo size.
	 *
	 *     Array of image data, or empty array if no image is available.
	 *
	 *     @type int    $1 Image width in pixels.
	 *     @type int    $2 Image height in pixels.
	 * }
	 */
	public function get_poster_portrait_size(): array {
		return $this->poster_portrait_size;
	}
}
