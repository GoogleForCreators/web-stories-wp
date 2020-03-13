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
	 * Init.
	 *
	 * @return void
	 */
	public static function init() {
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

		// Used for amp-story[poster-portrait-src]: The story poster in portrait format (3x4 aspect ratio).
		add_image_size( self::STORY_POSTER_IMAGE_SIZE, self::STORY_SMALL_IMAGE_DIMENSION, self::STORY_LARGE_IMAGE_DIMENSION, true );

		// Used for amp-story[poster-square-src]: The story poster in square format (1x1 aspect ratio).
		add_image_size( self::STORY_SQUARE_IMAGE_SIZE, self::STORY_LARGE_IMAGE_DIMENSION, self::STORY_LARGE_IMAGE_DIMENSION, true );

		// Used for amp-story[poster-landscape-src]: The story poster in square format (1x1 aspect ratio).
		add_image_size( self::STORY_LANDSCAPE_IMAGE_SIZE, self::STORY_LARGE_IMAGE_DIMENSION, self::STORY_SMALL_IMAGE_DIMENSION, true );

		add_action( 'pre_get_posts', [ __CLASS__, 'filter_poster_attachments' ] );

		add_action( 'rest_api_init', [ __CLASS__, 'rest_api_init' ] );

		add_filter( 'wp_prepare_attachment_for_js', [ __CLASS__, 'wp_prepare_attachment_for_js' ], 10, 2 );

		add_filter( 'upload_mimes', [ __CLASS__, 'upload_mimes' ] ); // phpcs:ignore WordPressVIPMinimum.Hooks.RestrictedHooks.upload_mimes
	}

	/**
	 * Get story meta images.
	 *
	 * There is a fallback poster-portrait image added via a filter, in case there's no featured image.
	 *
	 * @since 1.2.1
	 *
	 * @param int|\WP_Post|null $post Post.
	 * @return string[] Images.
	 */
	public static function get_story_meta_images( $post = null ) {
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
	public static function filter_poster_attachments( &$query ) {
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
	public static function rest_api_init() {
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

		register_rest_field(
			'attachment',
			'featured_media_src',
			[
				'get_callback' => static function ( $prepared, $field_name, $request ) {

					$id    = $prepared['featured_media'];
					$image = '';
					if ( $id ) {
						$image = wp_get_attachment_image_url( $id, 'medium' );
					}

					return $image;
				},
				'schema'       => [
					'description' => __( 'URL', 'web-stories' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			]
		);
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @param array    $response   Array of prepared attachment data.
	 * @param \WP_Post $attachment Attachment object.
	 *
	 * @return array $response;
	 */
	public static function wp_prepare_attachment_for_js( $response, $attachment ) {

		if ( 'video' === $response['type'] ) {
			$thumbnail_id = (int) get_post_thumbnail_id( $attachment );
			$image        = '';
			if ( 0 === $thumbnail_id ) {
				$image = wp_get_attachment_image_url( $thumbnail_id, 'medium' );
			}
			$response['featured_media']     = $thumbnail_id;
			$response['featured_media_src'] = $image;
		}

		return $response;
	}

	/**
	 * Filters the list of mime types and file extensions.
	 *
	 * @param string[] $mime_types Mime types keyed by the file extension regex
	 *                             corresponding to those types.
	 *
	 * @return string[]
	 */
	public static function upload_mimes( array $mime_types ) {
		$mime_types['svg'] = 'image/svg+xml';
		return $mime_types;
	}
}
