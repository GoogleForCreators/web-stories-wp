<?php
/**
 * Class Captions
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

declare(strict_types = 1);

namespace Google\Web_Stories\Media\Video;

use Google\Web_Stories\Service_Base;

/**
 * Class Captions
 */
class Captions extends Service_Base {
	/**
	 * Initializes the File_Type logic.
	 *
	 * @since 1.7.0
	 */
	public function register(): void {
		add_filter( 'site_option_upload_filetypes', [ $this, 'filter_list_of_allowed_filetypes' ] );
	}

	/**
	 * Add VTT file type to allow file in multisite.
	 *
	 * @param string|mixed $value List of allowed file types.
	 * @return string|mixed List of allowed file types.
	 */
	public function filter_list_of_allowed_filetypes( $value ) {
		if ( ! \is_string( $value ) ) {
			return $value;
		}

		$filetypes = explode( ' ', $value );
		if ( ! \in_array( 'vtt', $filetypes, true ) ) {
			$filetypes[] = 'vtt';
			$value       = implode( ' ', $filetypes );
		}

		return $value;
	}
}
