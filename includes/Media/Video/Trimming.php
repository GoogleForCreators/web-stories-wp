<?php
/**
 * Class Trimming
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

namespace Google\Web_Stories\Media\Video;

use Google\Web_Stories\Infrastructure\HasMeta;
use Google\Web_Stories\Service_Base;

/**
 * Class Trimming
 */
class Trimming extends Service_Base implements HasMeta {

	/**
	 * The trim video post meta key.
	 */
	public const TRIM_POST_META_KEY = 'web_stories_trim_data';

	/**
	 * Is trim.
	 */
	public const TRIM_DATA_KEY = 'trim_data';

	/**
	 * Register.
	 *
	 * @since 1.12.0
	 */
	public function register(): void {
		$this->register_meta();

		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ] );
	}

	/**
	 * Register meta for attachment post type.
	 *
	 * @since 1.12.0
	 */
	public function register_meta(): void {
		register_meta(
			'post',
			self::TRIM_POST_META_KEY,
			[
				'type'           => 'object',
				'description'    => __( 'Video trim data.', 'web-stories' ),
				'show_in_rest'   => [
					'schema' => [
						'properties' => [
							'original' => [
								'description' => __( 'Original attachment id', 'web-stories' ),
								'type'        => 'integer',
							],
							'start'    => [
								'description' => __( 'Start time.', 'web-stories' ),
								'type'        => 'string',
							],
							'end'      => [
								'description' => __( 'End time.', 'web-stories' ),
								'type'        => 'string',
							],
						],
					],
				],
				'default'        => [
					'original' => 0,
				],
				'single'         => true,
				'object_subtype' => 'attachment',
			]
		);
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @since 1.12.0
	 *
	 * @param array|mixed $response   Array of prepared attachment data.
	 * @return array|mixed $response;
	 */
	public function wp_prepare_attachment_for_js( $response ) {
		if ( ! \is_array( $response ) ) {
			return $response;
		}
		if ( 'video' === $response['type'] ) {
			$response[ self::TRIM_DATA_KEY ] = get_post_meta( $response['id'], self::TRIM_POST_META_KEY, true );
		}

		return $response;
	}
}
