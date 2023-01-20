<?php
/**
 * Class Poster
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2021 Google LLC
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

declare(strict_types = 1);

namespace Google\Web_Stories\Media\Video;

use Google\Web_Stories\Infrastructure\HasMeta;
use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Media\Media_Source_Taxonomy;
use Google\Web_Stories\Service_Base;
use WP_Post;

/**
 * Class Poster
 */
class Poster extends Service_Base implements HasMeta, PluginUninstallAware {
	/**
	 * The poster post meta key.
	 */
	public const POSTER_POST_META_KEY = 'web_stories_is_poster';

	/**
	 * The poster id post meta key.
	 */
	public const POSTER_ID_POST_META_KEY = 'web_stories_poster_id';

	/**
	 * Media_Source_Taxonomy instance.
	 *
	 * @var Media_Source_Taxonomy Experiments instance.
	 */
	protected Media_Source_Taxonomy $media_source_taxonomy;

	/**
	 * Poster constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Media_Source_Taxonomy $media_source_taxonomy Media_Source_Taxonomy instance.
	 */
	public function __construct( Media_Source_Taxonomy $media_source_taxonomy ) {
		$this->media_source_taxonomy = $media_source_taxonomy;
	}

	/**
	 * Init.
	 *
	 * @since 1.10.0
	 */
	public function register(): void {
		$this->register_meta();
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
		add_action( 'delete_attachment', [ $this, 'delete_video_poster' ] );
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ], 10, 2 );
	}

	/**
	 * Register meta for attachment post type.
	 *
	 * @since 1.10.0
	 */
	public function register_meta(): void {
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
	}

	/**
	 * Registers additional REST API fields upon API initialization.
	 *
	 * @since 1.0.0
	 */
	public function rest_api_init(): void {
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
	 * Get attachment source for featured media.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $prepared Prepared data before response.
	 * @return array<string, mixed>
	 */
	public function get_callback_featured_media_src( array $prepared ): array {
		/**
		 * Featured media ID.
		 *
		 * @var int|null $id
		 */
		$id    = $prepared['featured_media'] ?? null;
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
	 * @param array<string, mixed>|mixed $response   Array of prepared attachment data.
	 * @param WP_Post                    $attachment Attachment object.
	 * @return array<string, mixed>|mixed $response
	 *
	 * @template T
	 *
	 * @phpstan-return ($response is array<T> ? array<T> : mixed)
	 */
	public function wp_prepare_attachment_for_js( $response, WP_Post $attachment ) {
		if ( ! \is_array( $response ) ) {
			return $response;
		}
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
	 * @since 1.0.0
	 *
	 * @param int $thumbnail_id Attachment ID.
	 * @return array{src?: string, width?: int, height?: int, generated?: bool}
	 */
	public function get_thumbnail_data( int $thumbnail_id ): array {
		$img_src = wp_get_attachment_image_src( $thumbnail_id, 'full' );

		if ( ! $img_src ) {
			return [];
		}

		[ $src, $width, $height ] = $img_src;
		$generated                = $this->is_poster( $thumbnail_id );
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
	 */
	public function delete_video_poster( int $attachment_id ): void {
		/**
		 * Post ID.
		 *
		 * @var int|string $post_id
		 */
		$post_id = get_post_meta( $attachment_id, self::POSTER_ID_POST_META_KEY, true );

		if ( empty( $post_id ) ) {
			return;
		}

		// Used in favor of slow meta queries.
		$is_poster = $this->is_poster( (int) $post_id );
		if ( $is_poster ) {
			wp_delete_attachment( (int) $post_id, true );
		}
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		delete_post_meta_by_key( self::POSTER_ID_POST_META_KEY );
		delete_post_meta_by_key( self::POSTER_POST_META_KEY );
	}

	/**
	 * Helper util to check if attachment is a poster.
	 *
	 * @since 1.2.1
	 *
	 * @param int $post_id Attachment ID.
	 */
	protected function is_poster( int $post_id ): bool {
		$terms = get_the_terms( $post_id, $this->media_source_taxonomy->get_taxonomy_slug() );
		if ( \is_array( $terms ) && ! empty( $terms ) ) {
			$slugs = wp_list_pluck( $terms, 'slug' );

			return \in_array( $this->media_source_taxonomy::TERM_POSTER_GENERATION, $slugs, true );
		}

		return false;
	}
}
