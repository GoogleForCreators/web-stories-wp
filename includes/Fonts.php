<?php
/**
 * Class Fonts
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
 * Class Fonts
 */
class Fonts {
	/**
	 * Get list of fonts used in AMP Stories.
	 *
	 * @return array Fonts.
	 */
	public function get_fonts() {
		static $fonts = null;

		if ( isset( $fonts ) ) {
			return $fonts;
		}

		$file  = __DIR__ . '/data/fonts.json';
		$fonts = $this->get_google_fonts( $file );

		return $fonts;
	}

	/**
	 * Get list of Google Fonts from a given JSON file.
	 *
	 * @param string $file Path to file containing Google Fonts definitions.
	 *
	 * @return array $fonts Fonts list.
	 */
	public function get_google_fonts( $file ) {
		if ( ! is_readable( $file ) ) {
			return [];
		}
		$file_content = file_get_contents( $file );  // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents, WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown

		if ( ! $file_content ) {
			return [];
		}

		$google_fonts = json_decode( $file_content, true );

		if ( empty( $google_fonts ) ) {
			return [];
		}

		return $google_fonts;
	}
}
