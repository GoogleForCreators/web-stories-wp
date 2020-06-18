<?php
/**
 * Class Media
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

/**
 * Class Media
 */
class Media {
	/**
	 * The image size for the poster-portrait-src.
	 *
	 * @var string
	 */
	const STORY_POSTER_IMAGE_SIZE = 'web-stories-poster-portrait';

	/**
	 * The image size for the poster-landscape-src.
	 *
	 * @var string
	 */
	const STORY_LANDSCAPE_IMAGE_SIZE = 'web-stories-poster-landscape';

	/**
	 * The image size for the poster-square-src.
	 *
	 * @var string
	 */
	const STORY_SQUARE_IMAGE_SIZE = 'web-stories-poster-square';

	/**
	 * Name of size used in media library.
	 *
	 * @var string
	 */
	const STORY_THUMBNAIL_IMAGE_SIZE = 'web_stories_thumbnail';

	/**
	 * The large dimension of the AMP Story poster images.
	 *
	 * @var int
	 */
	const STORY_LARGE_IMAGE_DIMENSION = 928;

	/**
	 * The small dimension of the AMP Story poster images.
	 *
	 * @var int
	 */
	const STORY_SMALL_IMAGE_DIMENSION = 696;

	/**
	 * The poster post meta key.
	 *
	 * @var string
	 */
	const POSTER_POST_META_KEY = 'web_stories_is_poster';

	/**
	 * The poster id post meta key.
	 *
	 * @var string
	 */
	const POSTER_ID_POST_META_KEY = 'web_stories_poster_id';

	/**
	 * Key for media post type.
	 *
	 * @var string
	 */
	const STORY_MEDIA_TAXONOMY = 'web_story_media_source';

	/**
	 * Init.
	 *
	 * @return void
	 */
	public function init() {

		register_taxonomy(
			self::STORY_MEDIA_TAXONOMY,
			'attachment',
			[
				'label'        => __( 'Source', 'web-stories' ),
				'public'       => false,
				'rewrite'      => false,
				'hierarchical' => false,
				'show_in_rest' => true,
			]
		);

		register_meta(
			'post',
			self::POSTER_POST_META_KEY,
			[
				'sanitize_callback' => 'rest_sanitize_boolean',
				'type'              => 'boolean',
				'description'       => __( 'Whether the attachment is a poster image.', 'web-stories' ),
				'show_in_rest'      => true,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);

		register_meta(
			'post',
			self::POSTER_ID_POST_META_KEY,
			[
				'sanitize_callback' => 'absint',
				'type'              => 'integer',
				'description'       => __( 'Attachment id of generated poster image.', 'web-stories' ),
				'show_in_rest'      => true,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);

		// Used for amp-story[poster-portrait-src]: The story poster in portrait format (3x4 aspect ratio).
		add_image_size( self::STORY_POSTER_IMAGE_SIZE, self::STORY_SMALL_IMAGE_DIMENSION, self::STORY_LARGE_IMAGE_DIMENSION, true );

		// Used for amp-story[poster-square-src]: The story poster in square format (1x1 aspect ratio).
		add_image_size( self::STORY_SQUARE_IMAGE_SIZE, self::STORY_LARGE_IMAGE_DIMENSION, self::STORY_LARGE_IMAGE_DIMENSION, true );

		// Used for amp-story[poster-landscape-src]: The story poster in square format (1x1 aspect ratio).
		add_image_size( self::STORY_LANDSCAPE_IMAGE_SIZE, self::STORY_LARGE_IMAGE_DIMENSION, self::STORY_SMALL_IMAGE_DIMENSION, true );

		add_image_size( self::STORY_THUMBNAIL_IMAGE_SIZE, 150, 9999, false );

		add_action( 'pre_get_posts', [ $this, 'filter_poster_attachments' ] );

		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );

		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ], 10, 2 );

		add_filter( 'upload_mimes', [ $this, 'upload_mimes' ] ); // phpcs:ignore WordPressVIPMinimum.Hooks.RestrictedHooks.upload_mimes

		add_action( 'delete_attachment', [ $this, 'delete_video_poster' ] );
	}

	/**
	 * Get story meta images.
	 *
	 * There is a fallback poster-portrait image added via a filter, in case there's no featured image.
	 *
	 * @param int|\WP_Post|null $post Post.
	 * @return string[] Images.
	 */
	public function get_story_meta_images( $post = null ) {
		$thumbnail_id = (int) get_post_thumbnail_id( $post );

		if ( 0 === $thumbnail_id ) {
			return [];
		}

		$images = [
			'poster-portrait'  => wp_get_attachment_image_url( $thumbnail_id, self::STORY_POSTER_IMAGE_SIZE ),
			'poster-square'    => wp_get_attachment_image_url( $thumbnail_id, self::STORY_SQUARE_IMAGE_SIZE ),
			'poster-landscape' => wp_get_attachment_image_url( $thumbnail_id, self::STORY_LANDSCAPE_IMAGE_SIZE ),
		];

		return array_filter( $images );
	}

	/**
	 * Filters the current query to hide all automatically extracted poster image attachments.
	 *
	 * Reduces unnecessary noise in the media library.
	 *
	 * @param \WP_Query $query WP_Query instance, passed by reference.
	 * @return void
	 */
	public function filter_poster_attachments( &$query ) {
		$post_type = (array) $query->get( 'post_type' );

		if ( ! in_array( 'any', $post_type, true ) && ! in_array( 'attachment', $post_type, true ) ) {
			return;
		}

		$meta_query = (array) $query->get( 'meta_query' );

		$meta_query[] = [
			'key'     => self::POSTER_POST_META_KEY,
			'compare' => 'NOT EXISTS',
		];

		$query->set( 'meta_query', $meta_query );
	}

	/**
	 * Registers additional REST API fields upon API initialization.
	 *
	 * @return void
	 */
	public function rest_api_init() {
		register_rest_field(
			'attachment',
			'featured_media',
			[
				'schema' => [
					'description' => __( 'The ID of the featured media for the object.', 'web-stories' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			]
		);

		// Custom field, as built in term update require term id and not slug.
		register_rest_field(
			'attachment',
			'media_source',
			[

				'get_callback'    => [ $this, 'get_callback_media_source' ],
				'schema'          => [
					'description' => __( 'Media source. ', 'web-stories' ),
					'type'        => 'string',
					'enum'        => [ 'editor' ],
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'update_callback' => [ $this, 'update_callback_media_source' ],
			]
		);

		register_rest_field(
			'attachment',
			'featured_media_src',
			[
				'get_callback' => [ $this, 'get_callback_featured_media_src' ],
				'schema'       => [
					'description' => __( 'URL, width and height.', 'web-stories' ),
					'type'        => 'object',
					'properties'  => [
						'src'       => [
							'type'   => 'string',
							'format' => 'uri',
						],
						'width'     => [
							'type' => 'integer',
						],
						'height'    => [
							'type' => 'integer',
						],
						'generated' => [
							'type' => 'boolean',
						],
					],
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			]
		);
	}

	/**
	 * Force media attachment as string instead of the default array.
	 *
	 * @param array $prepared Prepared data before response.
	 *
	 * @return string
	 */
	public function get_callback_media_source( $prepared ) {
		$id = $prepared['id'];

		$terms = wp_get_object_terms( $id, self::STORY_MEDIA_TAXONOMY );
		if ( is_array( $terms ) && $terms ) {
			$term = array_shift( $terms );

			return $term->slug;
		}

		return '';
	}

	/**
	 * Update rest field callback.
	 *
	 * @param mixed    $value Value to update.
	 * @param \WP_Post $object Object to update on.
	 *
	 * @return true|\WP_Error
	 */
	public function update_callback_media_source( $value, $object ) {
		$check = wp_set_object_terms( $object->ID, $value, self::STORY_MEDIA_TAXONOMY );
		if ( is_wp_error( $check ) ) {
			return $check;
		}

		return true;
	}

	/**
	 * Get attachment source for featured media.
	 *
	 * @param array $prepared Prepared data before response.
	 *
	 * @return array
	 */
	public function get_callback_featured_media_src( $prepared ) {
		$id    = $prepared['featured_media'];
		$image = [];
		if ( $id ) {
			$image = self::get_thumbnail_data( $id );
		}

		return $image;
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @param array    $response   Array of prepared attachment data.
	 * @param \WP_Post $attachment Attachment object.
	 *
	 * @return array $response;
	 */
	public function wp_prepare_attachment_for_js( $response, $attachment ) {
		if ( 'video' === $response['type'] ) {
			$thumbnail_id = (int) get_post_thumbnail_id( $attachment );
			$image        = '';
			if ( 0 !== $thumbnail_id ) {
				$image = self::get_thumbnail_data( $thumbnail_id );
			}
			$response['featured_media']     = $thumbnail_id;
			$response['featured_media_src'] = $image;
		}

		return $response;
	}

	/**
	 * Get poster image data.
	 *
	 * @param int $thumbnail_id Attachment ID.
	 *
	 * @return array
	 */
	public function get_thumbnail_data( $thumbnail_id ) {
		$img_src                       = wp_get_attachment_image_src( $thumbnail_id, 'full' );
		list ( $src, $width, $height ) = $img_src;
		$generated                     = (bool) get_post_meta( $thumbnail_id, self::POSTER_POST_META_KEY, true );
		return compact( 'src', 'width', 'height', 'generated' );
	}
	/**
	 * Filters the list of mime types and file extensions.
	 *
	 * @param string[] $mime_types Mime types keyed by the file extension regex
	 *                             corresponding to those types.
	 *
	 * @return string[]
	 */
	public function upload_mimes( array $mime_types ) {
		$mime_types['svg'] = 'image/svg+xml';
		return $mime_types;
	}

	/**
	 * Deletes associated poster image when a video is deleted.
	 *
	 * This prevents the poster image from becoming an orphan because it is not
	 * displayed anywhere in WordPress or the story editor.
	 *
	 * @param int $attachment_id ID of the attachment to be deleted.
	 *
	 * @return void
	 */
	public function delete_video_poster( $attachment_id ) {
		$post_id = get_post_meta( $attachment_id, self::POSTER_ID_POST_META_KEY, true );

		if ( empty( $post_id ) ) {
			return;
		}

		// Used in favor of slow meta queries.
		$is_poster = (bool) get_post_meta( $post_id, self::POSTER_POST_META_KEY, true );

		if ( $is_poster ) {
			wp_delete_attachment( $post_id, true );
		}
	}

	/**
	 * Returns a list of allowed file types.
	 *
	 * @return array List of allowed file types.
	 */
	public function get_allowed_file_types() {
		$allowed_mime_types = self::get_allowed_mime_types();
		$mime_types         = [];

		foreach ( $allowed_mime_types as $mimes ) {
			// Otherwise this throws a warning on PHP < 7.3.
			if ( ! empty( $mimes ) ) {
				array_push( $mime_types, ...$mimes );
			}
		}

		$allowed_file_types = [];
		$all_mime_types     = wp_get_mime_types();

		foreach ( $all_mime_types as $ext => $mime ) {
			if ( in_array( $mime, $mime_types, true ) ) {
				array_push( $allowed_file_types, ...explode( '|', $ext ) );
			}
		}
		sort( $allowed_file_types );

		return $allowed_file_types;
	}

	/**
	 * Returns a list of allowed mime types per media type (image, audio, video).
	 *
	 * @return array List of allowed mime types.
	 */
	public function get_allowed_mime_types() {
		$default_allowed_mime_types = [
			'image' => [
				'image/png',
				'image/jpeg',
				'image/jpg',
				'image/gif',
			],
			'audio' => [], // todo: support audio uploads.
			'video' => [
				'video/mp4',
				'video/webm',
			],
		];

		/**
		 * Filter list of allowed mime types.
		 *
		 * This can be used to add additionally supported formats, for example by plugins
		 * that do video transcoding.
		 *
		 * @param array $default_allowed_mime_types Associative array of allowed mime types per media type (image, audio, video).
		 */
		$allowed_mime_types = apply_filters( 'web_stories_allowed_mime_types', $default_allowed_mime_types );

		foreach ( array_keys( $default_allowed_mime_types ) as $media_type ) {
			if ( ! is_array( $allowed_mime_types[ $media_type ] ) || empty( $allowed_mime_types[ $media_type ] ) ) {
				$allowed_mime_types[ $media_type ] = $default_allowed_mime_types[ $media_type ];
			}

			// Only add currently supported mime types.
			$allowed_mime_types[ $media_type ] = array_values( array_intersect( $allowed_mime_types[ $media_type ], wp_get_mime_types() ) );
		}

		return $allowed_mime_types;
	}
}
