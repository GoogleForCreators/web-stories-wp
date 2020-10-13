<?php
/**
 * Trait Decoder
 *
 * @package   Google\Web_Stories\Traits
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

namespace Google\Web_Stories\Traits;

/**
 * Trait Decoder
 *
 * @package Google\Web_Stories\Traits
 */
trait Decoder {
	/**
	 * Decodes string if encoded.
	 *
	 * @param string $string String to decode.
	 * @return string Decoded string.
	 */
	protected function base64_decode( $string ) {
		if ( 0 === strpos( $string, '__WEB_STORIES_ENCODED__' ) ) {
			$string = str_replace( '__WEB_STORIES_ENCODED__', '', $string );

			if ( function_exists( 'mb_convert_encoding' ) ) {
				return mb_convert_encoding( base64_decode( $string ), 'UTF-8', 'UTF-16LE' );
			}

			if ( function_exists( 'iconv' ) ) {
				return iconv( 'UTF-16LE', 'UTF-8', base64_decode( $string ) );
			}
		}

		return $string;
	}
}
