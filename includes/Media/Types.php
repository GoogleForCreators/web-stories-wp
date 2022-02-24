<?php
/**
 * Class Types
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

namespace Google\Web_Stories\Media;

/**
 * Class Types
 */
class Types {
	/**
	 * Returns a list of allowed file types.
	 *
	 * @since 1.0.0
	 *
	 * @return array List of allowed file types.
	 */
	public function get_allowed_file_types(): array {
		$allowed_mime_types = $this->get_allowed_mime_types();
		$mime_types         = [];

		foreach ( $allowed_mime_types as $mimes ) {
			// Otherwise this throws a warning on PHP < 7.3.
			if ( ! empty( $mimes ) ) {
				array_push( $mime_types, ...$mimes );
			}
		}

		return $this->get_file_type_exts( $mime_types );
	}

	/**
	 * Returns a list of allowed file types.
	 *
	 * @since 1.5.0
	 *
	 * @param array $mime_types Array of mime types.
	 * @return array
	 */
	public function get_file_type_exts( array $mime_types = [] ): array {
		$allowed_file_types = [];
		$all_mime_types     = get_allowed_mime_types();

		foreach ( $all_mime_types as $ext => $mime ) {
			if ( \in_array( $mime, $mime_types, true ) ) {
				array_push( $allowed_file_types, ...explode( '|', $ext ) );
			}
		}
		sort( $allowed_file_types );

		return $allowed_file_types;
	}

	/**
	 * Returns a list of allowed mime types per media type (image, audio, video).
	 *
	 * @since 1.0.0
	 *
	 * @return array<string, array> List of allowed mime types.
	 */
	public function get_allowed_mime_types(): array {
		$default_allowed_mime_types = [
			'image' => [
				'image/webp',
				'image/png',
				'image/jpeg',
				'image/jpg',
				'image/gif',
			],
			// TODO: Update once audio elements are supported.
			'audio' => [],
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
		 * @since 1.0.0
		 *
		 * @param array $default_allowed_mime_types Associative array of allowed mime types per media type (image, audio, video).
		 */
		$allowed_mime_types = apply_filters( 'web_stories_allowed_mime_types', $default_allowed_mime_types );

		foreach ( array_keys( $default_allowed_mime_types ) as $media_type ) {
			if ( ! \is_array( $allowed_mime_types[ $media_type ] ) || empty( $allowed_mime_types[ $media_type ] ) ) {
				$allowed_mime_types[ $media_type ] = $default_allowed_mime_types[ $media_type ];
			}

			// Only add currently supported mime types.
			$allowed_mime_types[ $media_type ] = array_values( array_intersect( $allowed_mime_types[ $media_type ], get_allowed_mime_types() ) );
		}

		return $allowed_mime_types;
	}

	/**
	 * Returns a list of image mime types.
	 *
	 * @since 1.4.0
	 *
	 * @return array List of allowed mime types.
	 */
	public function get_allowed_image_mime_types(): array {
		$mime_type         = $this->get_allowed_mime_types();
		$allowed_mime_type = $mime_type['image'];
		$image_mime_type   = [
			'image/webp',
			'image/png',
			'image/jpeg',
			'image/jpg',
			'image/gif',
		];

		/**
		 * Filter list of allowed poster image mime types.
		 *
		 * @since 1.4.0
		 *
		 * @param array $image_mime_type   List of allowed mime types. Defaults to 'image/png', 'image/jpeg', 'image/jpg','image/gif'.
		 * @param array $allowed_mime_type Allowed mime types from get_allowed_mime_types.
		 */
		$image_mime_type = apply_filters( 'web_stories_allowed_image_mime_types', $image_mime_type, $allowed_mime_type );

		return array_values( array_intersect( $allowed_mime_type, $image_mime_type ) );
	}

	/**
	 * Returns a list of audio mime types.
	 *
	 * Used for the allowlist when adding background audio.
	 *
	 * @since 1.11.0
	 *
	 * @return array List of allowed mime types.
	 */
	public function get_allowed_audio_mime_types(): array {
		$allowed_mime_types = [
			'audio/mpeg',
			'audio/aac',
			'audio/wav',
			'audio/ogg',
		];

		return array_values( array_intersect( $allowed_mime_types, get_allowed_mime_types() ) );
	}
}
