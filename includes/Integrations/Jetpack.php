<?php
/**
 * Class Jetpack
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Media\Media;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Types;
use WP_Post;
use WP_REST_Response;

/**
 * Class Jetpack.
 */
class Jetpack extends Service_Base {
	use Types;
	/**
	 * VideoPress Mime type.
	 *
	 * @since 1.7.2
	 *
	 * @var string
	 */
	const VIDEOPRESS_MIME_TYPE = 'video/videopress';

	/**
	 * VideoPress poster meta key.
	 *
	 * @since 1.7.2
	 *
	 * @var string
	 */
	const VIDEOPRESS_POSTER_META_KEY = 'videopress_poster_image';

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function register() {
		// See https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80.
		if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
			add_filter( 'wpcom_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		} else {
			add_filter( 'jetpack_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		}

		add_filter( 'jetpack_is_amp_request', [ $this, 'force_amp_request' ] );
		add_filter( 'web_stories_allowed_mime_types', [ $this, 'add_videopress' ] );
		add_filter( 'web_stories_rest_prepare_attachment', [ $this, 'filter_api_response' ], 10, 2 );
		add_filter( 'ajax_query_attachments_args', [ $this, 'filter_ajax_query_attachments_args' ] );
		add_action( 'added_post_meta', [ $this, 'add_term' ], 10, 3 );
	}

	/**
	 * Adds the web story post type to Jetpack / WordPress.com sitemaps.
	 *
	 * @see https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80
	 *
	 * @since 1.2.0
	 *
	 * @param array $post_types Array of post types.
	 *
	 * @return array Modified list of post types.
	 */
	public function add_to_jetpack_sitemap( $post_types ) {
		$post_types[] = Story_Post_Type::POST_TYPE_SLUG;

		return $post_types;
	}

	/**
	 * Add VideoPress to allowed mime types. If the site does not support videopress, this allow will be filtered out.
	 *
	 * @since 1.7.2
	 *
	 * @param array $mime_types Associative array of allowed mime types per media type (image, audio, video).
	 *
	 * @return array
	 */
	public function add_videopress( array $mime_types ) {
		$mime_types['video'][] = self::VIDEOPRESS_MIME_TYPE;

		return $mime_types;
	}


	/**
	 * Only change out of admin ajax is the mime type match exactly what web stories is looking for.
	 *
	 * @since 1.7.2
	 *
	 * @param array $args Query args.
	 *
	 * @return array Filtered query args.
	 */
	public function filter_ajax_query_attachments_args( array $args ) {
		if ( ! isset( $args['post_mime_type'] ) ) {
			return $args;
		}
		if ( ! is_array( $args['post_mime_type'] ) ) {
			return $args;
		}

		$allowed_mime_types = $this->get_allowed_mime_types();
		$allowed_mime_types = array_merge( ...array_values( $allowed_mime_types ) );
		if ( in_array( self::VIDEOPRESS_MIME_TYPE, $args['post_mime_type'], true ) && ! array_diff( $allowed_mime_types, $args['post_mime_type'] ) ) {
			add_filter( 'wp_prepare_attachment_for_js', [ $this, 'filter_admin_ajax_response' ], 10, 2 );
		}

		return $args;
	}

	/**
	 * Filter admin ajax responses to change video/videopress back to mp4.
	 *
	 * @since 1.7.2
	 *
	 * @param array    $response   Array of prepared attachment data. @see wp_prepare_attachment_for_js().
	 * @param \WP_Post $attachment Attachment object.
	 *
	 * @return array
	 */
	public function filter_admin_ajax_response( array $response, WP_Post $attachment ) {
		if ( self::VIDEOPRESS_MIME_TYPE !== $attachment->post_mime_type ) {
			return $response;
		}

		// Reset mime type back to mp4, as this is the correct value.
		$response['mime']    = 'video/mp4';
		$response['subtype'] = 'mp4';
		// Make video as optimized.
		$response['media_source'] = 'video-optimization';

		$media_details = wp_get_attachment_metadata( $attachment->ID );
		if ( is_array( $media_details ) && isset( $media_details['videopress'] ) ) {
			$videopress = $media_details['videopress'];
			// If videopress has finished processing, use the duration in millions to get formatted seconds and minutes.
			if ( isset( $videopress['duration'] ) && $videopress['duration'] ) {
				$response['fileLength'] = $this->format_milliseconds( $videopress['duration'] );

			}
			// If video has not finished processing, reset request to original url.
			if ( isset( $videopress['finished'], $videopress['original'] ) && ! $videopress['finished'] ) {
				$response['url'] = $videopress['original'];
			}
		}

		return $response;
	}

	/**
	 * Filter REST API responses to change video/videopress back to mp4.
	 *
	 * @since 1.7.2
	 *
	 * @param \WP_REST_Response $response The response object.
	 * @param \WP_Post          $post     The original attachment post.
	 *
	 * @return WP_REST_Response
	 */
	public function filter_api_response( WP_REST_Response $response, WP_Post $post ) {
		if ( self::VIDEOPRESS_MIME_TYPE !== $post->post_mime_type ) {
			return $response;
		}

		$data = $response->get_data();

		// Reset mime type back to mp4, as this is the correct value.
		$data['mime_type'] = 'video/mp4';
		// Make video as optimized.
		$data['media_source'] = 'video-optimization';

		if ( isset( $data['media_details']['videopress'] ) ) {
			$videopress = $data['media_details']['videopress'];
			// If videopress has finished processing, use the duration in millions to get formatted seconds and minutes.
			if ( isset( $videopress['duration'] ) && $videopress['duration'] ) {
				$data['media_details']['length_formatted'] = $this->format_milliseconds( $videopress['duration'] );
			}
			// If video has not finished processing, reset request to original url.
			if ( isset( $videopress['finished'], $videopress['original'] ) && ! $videopress['finished'] ) {
				$data['source_url'] = $videopress['original'];
			}
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
	 *
	 * @return string
	 */
	protected function format_milliseconds( $milliseconds ) {
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
	 *
	 * @return void
	 */
	public function add_term( $mid, $object_id, $meta_key ) {
		if ( self::VIDEOPRESS_POSTER_META_KEY !== $meta_key ) {
			return;
		}
		if ( 'attachment' !== get_post_type( $object_id ) ) {
			return;
		}

		wp_set_object_terms( (int) $object_id, 'poster-generation', Media::STORY_MEDIA_TAXONOMY );
	}

	/**
	 * Force jetpack to see web stories as AMP.
	 *
	 * @since 1.2.0
	 *
	 * @param boolean $is_amp_request Is the request supposed to return valid AMP content.
	 *
	 * @return bool Whether the current request is an AMP request.
	 */
	public function force_amp_request( $is_amp_request ) {
		if ( ! is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return $is_amp_request;
		}
		return true;
	}
}
