<?php
/**
 * Class Decoder
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
 * Decoder class.
 *
 * @since 1.1.0
 *
 * @package Google\Web_Stories
 */
class Decoder {
	/**
	 * Determines whether encoding and decoding of story markup is supported.
	 *
	 * @since 1.1.0
	 *
	 * @return bool Whether decoding is supported.
	 */
	public function supports_decoding() {
		/**
		 * Filter whether the encoding requests.
		 *
		 * @since 1.2.0
		 *
		 * @param bool $enable_decoding Enable disable encoding.
		 */
		return apply_filters( 'web_stories_enable_decoding', true );
	}

	/**
	 * Decodes string if encoded.
	 *
	 * @since 1.1.0
	 *
	 * @param string $string String to decode.
	 * @return string Decoded string.
	 */
	public function base64_decode( $string ) {
		if ( 0 === strpos( $string, '__WEB_STORIES_ENCODED__' ) ) {
			$string = str_replace( '__WEB_STORIES_ENCODED__', '', $string );

			return urldecode( base64_decode( $string ) );
		}

		return $string;
	}
}
