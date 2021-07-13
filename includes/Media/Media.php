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

namespace Google\Web_Stories\Media;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Traits\Screen;
use WP_Post;
use WP_Query;
use WP_REST_Request;

/**
 * Class Media
 */
class Media extends Service_Base {
	use Screen;
	/**
	 * The image size for the poster-portrait-src.
	 *
	 * @var string
	 */
	const POSTER_PORTRAIT_IMAGE_SIZE = 'web-stories-poster-portrait';

	/**
	 * The image dimensions for the poster-portrait-src.
	 *
	 * @var string
	 */
	const POSTER_PORTRAIT_IMAGE_DIMENSIONS = [ 640, 853 ];

	/**
	 * Name of size used in media library.
	 *
	 * @var string
	 */
	const STORY_THUMBNAIL_IMAGE_SIZE = 'web-stories-thumbnail';

	/**
	 * The image dimensions for media library thumbnails.
	 *
	 * @var string
	 */
	const STORY_THUMBNAIL_IMAGE_DIMENSIONS = [ 150, 9999 ];

	/**
	 * The image size for the publisher logo.
	 *
	 * @var string
	 */
	const PUBLISHER_LOGO_IMAGE_SIZE = 'web-stories-publisher-logo';

	/**
	 * The image dimensions for the publisher logo.
	 *
	 * @var string
	 */
	const PUBLISHER_LOGO_IMAGE_DIMENSIONS = [ 96, 96 ];

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
	 * The optimized video id post meta key.
	 *
	 * @var string
	 */
	const OPTIMIZED_ID_POST_META_KEY = 'web_stories_optimized_id';

	/**
	 * Key for media post type.
	 *
	 * @var string
	 */
	const STORY_MEDIA_TAXONOMY = 'web_story_media_source';

	/**
	 * Init.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register() {
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
			self::POSTER_ID_POST_META_KEY,
			[
				'sanitize_callback' => 'absint',
				'type'              => 'integer',
				'description'       => __( 'Attachment id of generated poster image.', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => 0,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);

		register_meta(
			'post',
			self::OPTIMIZED_ID_POST_META_KEY,
			[
				'sanitize_callback' => 'absint',
				'type'              => 'integer',
				'description'       => __( 'ID of optimized video.', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => 0,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);

		// Image sizes as per https://amp.dev/documentation/components/amp-story/#poster-guidelines-for-poster-portrait-src-poster-landscape-src-and-poster-square-src.

		// Used for amp-story[poster-portrait-src]: The story poster in portrait format (3x4 aspect ratio).
		add_image_size(
			self::POSTER_PORTRAIT_IMAGE_SIZE,
			self::POSTER_PORTRAIT_IMAGE_DIMENSIONS[0],
			self::POSTER_PORTRAIT_IMAGE_DIMENSIONS[1],
			true
		);

		// As per https://amp.dev/documentation/components/amp-story/#publisher-logo-src-guidelines.
		add_image_size(
			self::PUBLISHER_LOGO_IMAGE_SIZE,
			self::PUBLISHER_LOGO_IMAGE_DIMENSIONS[0],
			self::PUBLISHER_LOGO_IMAGE_DIMENSIONS[1],
			true
		);

		// Used in the editor.
		add_image_size(
			self::STORY_THUMBNAIL_IMAGE_SIZE,
			self::STORY_THUMBNAIL_IMAGE_DIMENSIONS[0],
			self::STORY_THUMBNAIL_IMAGE_DIMENSIONS[1],
			false
		);

		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );

		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ], 10, 2 );

		add_action( 'delete_attachment', [ $this, 'delete_video_poster' ] );

		// Hide video posters from Media grid view.
		add_filter( 'ajax_query_attachments_args', [ $this, 'filter_ajax_query_attachments_args' ] );
		// Hide video posters from Media list view.
		add_filter( 'pre_get_posts', [ $this, 'filter_generated_media_attachments' ] );
		// Hide video posters from web-stories/v1/media REST API requests.
		add_filter( 'rest_attachment_query', [ $this, 'filter_rest_generated_media_attachments' ], 10, 2 );
	}

	/**
	 * Returns the tax query needed to exclude generated video poster images and source videos.
	 *
	 * @param array $args Existing WP_Query args.
	 *
	 * @return array  Tax query arg.
	 */
	private function get_exclude_tax_query( array $args ): array {
		$tax_query = [
			[
				'taxonomy' => self::STORY_MEDIA_TAXONOMY,
				'field'    => 'slug',
				'terms'    => [ 'poster-generation', 'source-video', 'source-image' ],
				'operator' => 'NOT IN',
			],
		];

		/**
		 *  Merge with existing tax query if needed,
		 * in a nested way so WordPress will run them
		 * with an 'AND' relation. Example:
		 *
		 * [
		 *   'relation' => 'AND', // implicit.
		 *   [ this query ],
		 *   [ [ any ], [ existing ], [ tax queries] ]
		 * ]
		 */
		if ( ! empty( $args['tax_query'] ) ) {
			$tax_query[] = $args['tax_query'];
		}

		return $tax_query;
	}

	/**
	 * Filters the attachment query args to hide generated video poster images.
	 *
	 * Reduces unnecessary noise in the Media grid view.
	 *
	 * @since 1.3.0
	 *
	 * @param array $args Query args.
	 *
	 * @return array Filtered query args.
	 */
	public function filter_ajax_query_attachments_args( array $args ): array {
		$args['tax_query'] = $this->get_exclude_tax_query( $args ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		return $args;
	}

	/**
	 * Filters the current query to hide generated video poster images and source video.
	 *
	 * Reduces unnecessary noise in the Media list view.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Query $query WP_Query instance, passed by reference.
	 *
	 * @return void
	 */
	public function filter_generated_media_attachments( &$query ) {
		$current_screen = $this->get_current_screen();

		if ( ! $current_screen ) {
			return;
		}

		if ( is_admin() && $query->is_main_query() && 'upload' === $current_screen->id ) {
			$tax_query = $query->get( 'tax_query' );

			$query->set( 'tax_query', $this->get_exclude_tax_query( [ 'tax_query' => $tax_query ] ) ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		}
	}

	/**
	 * Filters the current query to hide generated video poster images.
	 *
	 * Reduces unnecessary noise in media REST API requests.
	 *
	 * @since 1.3.0
	 *
	 * @param array           $args Query args.
	 * @param WP_REST_Request $request The current REST request.
	 *
	 * @return array Filtered query args.
	 */
	public function filter_rest_generated_media_attachments( array $args, WP_REST_Request $request ): array {
		if ( '/web-stories/v1/media' !== $request->get_route() ) {
			return $args;
		}

		$args['tax_query'] = $this->get_exclude_tax_query( $args ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		return $args;
	}

	/**
	 * Registers additional REST API fields upon API initialization.
	 *
	 * @since 1.0.0
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
					'enum'        => [
						'editor',
						'poster-generation',
						'video-optimization',
						'source-video',
						'source-image',
						'gif-conversion',
					],
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
	 * @since 1.0.0
	 *
	 * @param array $prepared Prepared data before response.
	 *
	 * @return string
	 */
	public function get_callback_media_source( $prepared ) {
		$id = $prepared['id'];

		$terms = wp_get_object_terms( $id, self::STORY_MEDIA_TAXONOMY );
		if ( is_array( $terms ) && ! empty( $terms ) ) {
			$term = array_shift( $terms );

			return $term->slug;
		}

		return '';
	}

	/**
	 * Update rest field callback.
	 *
	 * @since 1.0.0
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
	 * @since 1.0.0
	 *
	 * @param array $prepared Prepared data before response.
	 *
	 * @return array
	 */
	public function get_callback_featured_media_src( $prepared ): array {
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
	 * @since 1.0.0
	 *
	 * @param array   $response   Array of prepared attachment data.
	 * @param WP_Post $attachment Attachment object.
	 *
	 * @return array $response;
	 */
	public function wp_prepare_attachment_for_js( $response, $attachment ): array {
		if ( 'video' === $response['type'] ) {
			$thumbnail_id = (int) get_post_thumbnail_id( $attachment );
			$image        = '';
			if ( 0 !== $thumbnail_id ) {
				$image = $this->get_thumbnail_data( $thumbnail_id );
			}
			$response['featured_media']     = $thumbnail_id;
			$response['featured_media_src'] = $image;
		}

		$response['media_source'] = $this->get_callback_media_source( $response );

		// See https://github.com/WordPress/wordpress-develop/blob/d28766f8f2ecf2be02c2520cdf0cc3b51deb9e1b/src/wp-includes/rest-api/endpoints/class-wp-rest-attachments-controller.php#L753-L791 .
		$response['media_details'] = wp_get_attachment_metadata( $attachment->ID );

		// Ensure empty details is an empty object.
		if ( empty( $response['media_details'] ) ) {
			$response['media_details'] = [];
		} elseif ( ! empty( $response['media_details']['sizes'] ) ) {
			foreach ( $response['media_details']['sizes'] as $size => &$size_data ) {

				if ( isset( $size_data['mime-type'] ) ) {
					$size_data['mime_type'] = $size_data['mime-type'];
					unset( $size_data['mime-type'] );
				}

				// Use the same method image_downsize() does.
				$image = wp_get_attachment_image_src( $attachment->ID, $size );
				if ( ! $image ) {
					continue;
				}

				list ( $image_src )      = $image;
				$size_data['source_url'] = $image_src;
			}

			$full_src                      = wp_get_attachment_image_src( $attachment->ID, 'full' );
			list ( $src, $width, $height ) = $full_src;

			if ( ! empty( $full_src ) ) {
				$response['media_details']['sizes']['full'] = [
					'file'       => wp_basename( $src ),
					'width'      => $width,
					'height'     => $height,
					'mime_type'  => $attachment->post_mime_type,
					'source_url' => $src,
				];
			}
		} else {
			$response['media_details']['sizes'] = [];
		}


		return $response;
	}

	/**
	 * Get poster image data.
	 *
	 * @since 1.0.0
	 *
	 * @param int $thumbnail_id Attachment ID.
	 *
	 * @return array
	 */
	public function get_thumbnail_data( $thumbnail_id ): array {
		$img_src                       = wp_get_attachment_image_src( $thumbnail_id, 'full' );
		list ( $src, $width, $height ) = $img_src;
		$generated                     = $this->is_poster( $thumbnail_id );
		return compact( 'src', 'width', 'height', 'generated' );
	}

	/**
	 * Deletes associated poster image when a video is deleted.
	 *
	 * This prevents the poster image from becoming an orphan because it is not
	 * displayed anywhere in WordPress or the story editor.
	 *
	 * @since 1.0.0
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
		$is_poster = $this->is_poster( $post_id );
		if ( $is_poster ) {
			wp_delete_attachment( $post_id, true );
		}
	}

	/**
	 * Helper util to check if attachment is a poster.
	 *
	 * @since 1.2.1
	 *
	 * @param int $post_id Attachment ID.
	 *
	 * @return bool
	 */
	protected function is_poster( $post_id ): bool {
		$terms = wp_get_object_terms( $post_id, self::STORY_MEDIA_TAXONOMY );
		if ( is_array( $terms ) && ! empty( $terms ) ) {
			$slugs = wp_list_pluck( $terms, 'slug' );

			return in_array( 'poster-generation', $slugs, true );
		}

		return false;
	}
}
