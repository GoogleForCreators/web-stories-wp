<?php
/**
 * Trait Types
 *
 * @package   Google\Web_Stories\TRAITS
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

namespace Google\Web_Stories\TRAITS;

/**
 * Trait Types
 *
 * @package Google\Web_Stories\TRAITS
 */
trait Types {
	/**
	 * Returns a list of allowed file types.
	 *
	 * @return array List of allowed file types.
	 */
	public function get_allowed_file_types() {
		$allowed_mime_types = $this->get_allowed_mime_types();
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
