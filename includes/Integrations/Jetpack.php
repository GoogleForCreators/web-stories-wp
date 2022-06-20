<?php
/**
 * Class Jetpack
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Context;
use Google\Web_Stories\Media\Media_Source_Taxonomy;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;
use WP_REST_Response;

/**
 * Class Jetpack.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 *
 * @phpstan-type AttachmentData array{
 *   media_details?: array{
 *     length?: int,
 *     length_formatted?: string
 *   },
 *   url?: string,
 *   featured_media_src?: string
 * }
 *
 * @phpstan-type EnhancedAttachmentMetadata array{
 *   width: int,
 *   height: int,
 *   file: string,
 *   sizes: mixed,
 *   image_meta: mixed,
 *   videopress?: array{
 *     duration: int,
 *     poster: string,
 *     width: int,
 *     height: int,
 *     file_url_base?: array{
 *       https: string
 *     },
 *     files?: array{
 *       hd?: array{
 *         mp4?: string
 *       }
 *     }
 *   }
 * }
 */
class Jetpack extends Service_Base {

	/**
	 * VideoPress Mime type.
	 *
	 * @since 1.7.2
	 */
	public const VIDEOPRESS_MIME_TYPE = 'video/videopress';

	/**
	 * VideoPress poster meta key.
	 *
	 * @since 1.7.2
	 */
	public const VIDEOPRESS_POSTER_META_KEY = 'videopress_poster_image';

	/**
	 * Media_Source_Taxonomy instance.
	 *
	 * @var Media_Source_Taxonomy Experiments instance.
	 */
	protected $media_source_taxonomy;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Jetpack constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Media_Source_Taxonomy $media_source_taxonomy Media_Source_Taxonomy instance.
	 * @param Context               $context               Context instance.
	 */
	public function __construct( Media_Source_Taxonomy $media_source_taxonomy, Context $context ) {
		$this->media_source_taxonomy = $media_source_taxonomy;
		$this->context               = $context;
	}

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 */
	public function register(): void {
		// See https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80.
		if ( \defined( 'IS_WPCOM' ) && IS_WPCOM ) {
			add_filter( 'wpcom_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		} else {
			add_filter( 'jetpack_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		}

		add_filter( 'jetpack_is_amp_request', [ $this, 'force_amp_request' ] );
		add_filter( 'web_stories_allowed_mime_types', [ $this, 'add_videopress' ] );
		add_filter( 'web_stories_rest_prepare_attachment', [ $this, 'filter_rest_api_response' ], 10, 2 );
		add_filter( 'ajax_query_attachments_args', [ $this, 'filter_ajax_query_attachments_args' ] );
		add_action( 'added_post_meta', [ $this, 'add_term' ], 10, 3 );
	}

	/**
	 * Adds the web-story post type to Jetpack / WordPress.com sitemaps.
	 *
	 * @since 1.2.0
	 *
	 * @see https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80
	 *
	 * @param array|mixed $post_types Array of post types.
	 * @return array|mixed Modified list of post types.
	 */
	public function add_to_jetpack_sitemap( $post_types ) {
		if ( ! \is_array( $post_types ) ) {
			return $post_types;
		}
		$post_types[] = Story_Post_Type::POST_TYPE_SLUG;

		return $post_types;
	}

	/**
	 * Add VideoPress to allowed mime types.
	 *
	 * If the site does not support VideoPress, this will be filtered out.
	 *
	 * @since 1.7.2
	 *
	 * @param array{video?: string[]}|mixed $mime_types Associative array of allowed mime types per media type (image, audio, video).
	 * @return array{video?: string[]}|mixed
	 */
	public function add_videopress( $mime_types ) {
		if ( ! \is_array( $mime_types ) ) {
			return $mime_types;
		}

		/**
		 * Mime types config.
		 *
		 * @var array{video?: string[]} $mime_types
		 */
		$mime_types['video'][] = self::VIDEOPRESS_MIME_TYPE;

		return $mime_types;
	}


	/**
	 * Filter ajax query attachments args when accessed from the Web Stories editor.
	 *
	 * Only filters the response if the mime type matches exactly what Web Stories is looking for.
	 *
	 * @since 1.7.2
	 *
	 * @param array|mixed $args Query args.
	 * @return array|mixed Filtered query args.
	 */
	public function filter_ajax_query_attachments_args( $args ) {
		if ( ! \is_array( $args ) || ! isset( $args['post_mime_type'] ) || ! \is_array( $args['post_mime_type'] ) ) {
			return $args;
		}

		if ( \in_array( self::VIDEOPRESS_MIME_TYPE, $args['post_mime_type'], true ) ) {
			add_filter( 'wp_prepare_attachment_for_js', [ $this, 'filter_admin_ajax_response' ], 15, 2 );
		}

		return $args;
	}

	/**
	 * Filter admin ajax responses for VideoPress videos.
	 *
	 * Changes the video/videopress type back to mp4
	 * and ensures MP4 source URLs are returned.
	 *
	 * @since 1.7.2
	 *
	 * @param array|mixed $data   Array of prepared attachment data. @see wp_prepare_attachment_for_js().
	 * @param WP_Post     $attachment Attachment object.
	 * @return array|mixed
	 *
	 * @phpstan-param AttachmentData $data
	 * @phpstan-return AttachmentData|mixed
	 */
	public function filter_admin_ajax_response( $data, $attachment ) {
		if ( self::VIDEOPRESS_MIME_TYPE !== $attachment->post_mime_type ) {
			return $data;
		}

		if ( ! \is_array( $data ) ) {
			return $data;
		}

		// Reset mime type back to mp4, as this is the correct value.
		$data['mime']    = 'video/mp4';
		$data['subtype'] = 'mp4';

		// Mark video as optimized.
		$data[ $this->media_source_taxonomy::MEDIA_SOURCE_KEY ] = 'video-optimization';

		/**
		 * Jetpack adds an additional field to regular attachment metadata.
		 *
		 * @var array $metadata
		 * @phpstan-var EnhancedAttachmentMetadata|false $metadata
		 */
		$metadata = wp_get_attachment_metadata( $attachment->ID );

		if ( $metadata && isset( $metadata['videopress']['duration'], $data['media_details'] ) && \is_array( $data['media_details'] ) ) {
			$data['media_details']['length_formatted'] = $this->format_milliseconds( $metadata['videopress']['duration'] );
			$data['media_details']['length']           = (int) floor( $metadata['videopress']['duration'] / 1000 );
		}

		if ( $metadata && isset( $data['url'], $metadata['videopress']['file_url_base']['https'], $metadata['videopress']['files']['hd']['mp4'] ) ) {
			$data['url'] = $metadata['videopress']['file_url_base']['https'] . $metadata['videopress']['files']['hd']['mp4'];
		}

		// Get the correct poster with matching dimensions from VideoPress.
		if ( $metadata && isset( $data['featured_media_src'], $metadata['videopress']['poster'], $metadata['videopress']['width'], $metadata['videopress']['height'] ) ) {
			$data['featured_media_src'] = [
				'src'       => $metadata['videopress']['poster'],
				'width'     => $metadata['videopress']['width'],
				'height'    => $metadata['videopress']['height'],
				'generated' => true,
			];
		}

		return $data;
	}

	/**
	 * Filter REST API responses for VideoPress videos.
	 *
	 * Changes the video/videopress type back to mp4
	 * and ensures MP4 source URLs are returned.
	 *
	 * @since 1.7.2
	 *
	 * @param WP_REST_Response $response The response object.
	 * @param WP_Post          $post     The original attachment post.
	 */
	public function filter_rest_api_response( WP_REST_Response $response, WP_Post $post ): WP_REST_Response {
		if ( self::VIDEOPRESS_MIME_TYPE !== $post->post_mime_type ) {
			return $response;
		}

		/**
		 * Response data.
		 *
		 * @var array<string, string|array<string, int|string>|bool> $data
		 */
		$data = $response->get_data();

		// Reset mime type back to mp4, as this is the correct value.
		$data['mime_type'] = 'video/mp4';

		// Mark video as optimized.
		$data[ $this->media_source_taxonomy::MEDIA_SOURCE_KEY ] = 'video-optimization';

		/**
		 * Jetpack adds an additional field to regular attachment metadata.
		 *
		 * @var EnhancedAttachmentMetadata|false $metadata
		 */
		$metadata = wp_get_attachment_metadata( $post->ID );

		if ( $metadata && isset( $metadata['videopress']['duration'], $data['media_details'] ) && \is_array( $data['media_details'] ) ) {
			$data['media_details']['length_formatted'] = $this->format_milliseconds( $metadata['videopress']['duration'] );
			$data['media_details']['length']           = (int) floor( $metadata['videopress']['duration'] / 1000 );
		}

		if ( $metadata && isset( $data['source_url'], $metadata['videopress']['file_url_base']['https'], $metadata['videopress']['files']['hd']['mp4'] ) ) {
			$data['source_url'] = $metadata['videopress']['file_url_base']['https'] . $metadata['videopress']['files']['hd']['mp4'];
		}

		// Get the correct poster with matching dimensions from VideoPress.
		if ( $metadata && isset( $data['featured_media_src'], $metadata['videopress']['poster'], $metadata['videopress']['width'], $metadata['videopress']['height'] ) ) {
			$data['featured_media_src'] = [
				'src'       => $metadata['videopress']['poster'],
				'width'     => $metadata['videopress']['width'],
				'height'    => $metadata['videopress']['height'],
				'generated' => true,
			];
		}

		$response->set_data( $data );

		return $response;
	}

	/**
	 * Format milliseconds into seconds.
	 *
	 * @since 1.7.2
	 *
	 * @param int $milliseconds Milliseconds to converted to minutes and seconds.
	 */
	protected function format_milliseconds( $milliseconds ): string {
		$seconds = floor( $milliseconds / 1000 );

		if ( $seconds >= 1 ) {
			$minutes  = floor( $seconds / 60 );
			$seconds %= 60;
		} else {
			$seconds = 0;
			$minutes = 0;
		}

		return sprintf( '%d:%02u', $minutes, $seconds );
	}

	/**
	 * Hook into added_post_meta.
	 *
	 * @since 1.7.2
	 *
	 * @param int    $mid         The meta ID after successful update.
	 * @param int    $object_id   ID of the object metadata is for.
	 * @param string $meta_key    Metadata key.
	 */
	public function add_term( $mid, $object_id, $meta_key ): void {
		if ( self::VIDEOPRESS_POSTER_META_KEY !== $meta_key ) {
			return;
		}
		if ( 'attachment' !== get_post_type( $object_id ) ) {
			return;
		}

		wp_set_object_terms( (int) $object_id, 'poster-generation', $this->media_source_taxonomy->get_taxonomy_slug() );
	}

	/**
	 * Force Jetpack to see Web Stories as AMP.
	 *
	 * @since 1.2.0
	 *
	 * @param bool $is_amp_request Is the request supposed to return valid AMP content.
	 * @return bool Whether the current request is an AMP request.
	 */
	public function force_amp_request( $is_amp_request ): bool {
		if ( ! $this->context->is_web_story() ) {
			return (bool) $is_amp_request;
		}
		return true;
	}
}
