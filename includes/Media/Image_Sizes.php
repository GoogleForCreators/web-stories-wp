<?php
/**
 * Class Image_Size
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

namespace Google\Web_Stories\Media;

use Google\Web_Stories\Service_Base;
use WP_Post;

/**
 * Class Image_Sizes
 */
class Image_Sizes extends Service_Base {
	/**
	 * The image size for the poster-portrait-src.
	 */
	public const POSTER_PORTRAIT_IMAGE_SIZE = 'web-stories-poster-portrait';

	/**
	 * The image dimensions for the poster-portrait-src.
	 */
	public const POSTER_PORTRAIT_IMAGE_DIMENSIONS = [ 640, 853 ];

	/**
	 * Name of size used in media library.
	 */
	public const STORY_THUMBNAIL_IMAGE_SIZE = 'web-stories-thumbnail';

	/**
	 * The image dimensions for media library thumbnails.
	 */
	public const STORY_THUMBNAIL_IMAGE_DIMENSIONS = [ 150, 9999 ];

	/**
	 * The image size for the publisher logo.
	 */
	public const PUBLISHER_LOGO_IMAGE_SIZE = 'web-stories-publisher-logo';

	/**
	 * The image dimensions for the publisher logo.
	 */
	public const PUBLISHER_LOGO_IMAGE_DIMENSIONS = [ 96, 96 ];

	/**
	 * Init.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		$this->add_image_sizes();
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ], 10, 2 );
	}

	/**
	 * Add image sizes.
	 *
	 * @since 1.10.0
	 *
	 * @link https://amp.dev/documentation/components/amp-story/#poster-guidelines-for-poster-portrait-src-poster-landscape-src-and-poster-square-src.
	 */
	protected function add_image_sizes(): void {
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
	}


	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @since 1.0.0
	 *
	 * @param array|mixed $response   Array of prepared attachment data.
	 * @param WP_Post     $attachment Attachment object.
	 * @return array|mixed $response;
	 */
	public function wp_prepare_attachment_for_js( $response, $attachment ) {
		if ( ! \is_array( $response ) ) {
			return $response;
		}
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

				[ $image_src ]           = $image;
				$size_data['source_url'] = $image_src;
			}

			$img_src = wp_get_attachment_image_src( $attachment->ID, 'full' );

			if ( $img_src ) {
				[ $src, $width, $height ] = $img_src;

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
}
