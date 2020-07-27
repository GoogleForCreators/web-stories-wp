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

use WP_Post;

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
	const STORY_THUMBNAIL_IMAGE_SIZE = 'web-stories-thumbnail';

	/**
	 * The image size for the publisher logo.
	 *
	 * @var string
	 */
	const PUBLISHER_LOGO_IMAGE_SIZE = 'web-stories-publisher-logo';

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

		// Image sizes as per https://amp.dev/documentation/components/amp-story/#poster-guidelines-for-poster-portrait-src-poster-landscape-src-and-poster-square-src.

		// Used for amp-story[poster-portrait-src]: The story poster in portrait format (3x4 aspect ratio).
		add_image_size( self::STORY_POSTER_IMAGE_SIZE, 640, 853, true );

		// Used for amp-story[poster-square-src]: The story poster in square format (1x1 aspect ratio).
		add_image_size( self::STORY_SQUARE_IMAGE_SIZE, 640, 640, true );

		// Used for amp-story[poster-landscape-src]: The story poster in square format (1x1 aspect ratio).
		add_image_size( self::STORY_LANDSCAPE_IMAGE_SIZE, 853, 640, true );

		// As per https://amp.dev/documentation/components/amp-story/#publisher-logo-src-guidelines.

		add_image_size( self::PUBLISHER_LOGO_IMAGE_SIZE, 96, 96, true );

		// Used in the editor.
		add_image_size( self::STORY_THUMBNAIL_IMAGE_SIZE, 150, 9999, false );

		add_action( 'pre_get_posts', [ $this, 'filter_poster_attachments' ] );

		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );

		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ], 10, 2 );

		add_action( 'delete_attachment', [ $this, 'delete_video_poster' ] );
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
		if ( is_array( $terms ) && ! empty( $terms ) ) {
			return array_shift( $terms )->slug;
		}

		return '';
	}

	/**
	 * Update rest field callback.
	 *
	 * @param mixed   $value Value to update.
	 * @param WP_Post $object Object to update on.
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
			$image = $this->get_thumbnail_data( $id );
		}

		return $image;
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @param array   $response   Array of prepared attachment data.
	 * @param WP_Post $attachment Attachment object.
	 *
	 * @return array $response;
	 */
	public function wp_prepare_attachment_for_js( $response, $attachment ) {
		if ( 'video' === $response['type'] ) {
			$thumbnail_id = (int) get_post_thumbnail_id( $attachment );
			$image        = '';
			if ( 0 !== $thumbnail_id ) {
				$image = $this->get_thumbnail_data( $thumbnail_id );
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
}
