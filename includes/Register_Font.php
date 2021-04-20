<?php
/**
 * Class Register_Font.
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
 * Class Register_Font
 *
 * @package Google\Web_Stories
 */
class Register_Font {
	/**
	 * Font Style handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'google-fonts';

	/**
	 * Prefix handle.
	 *
	 * @param string $handle Style handle used to prefix.
	 *
	 * @return string
	 */
	public function get_handle( $handle ) {
		return $handle . '-' . self::STYLE_HANDLE;
	}

	/**
	 * Register style with prefix.
	 *
	 * @param string $handle Style handle used to prefix.
	 *
	 * @return void
	 */
	public function register( $handle ) {
		$style_handle = $this->get_handle( $handle );
		wp_register_style(
			$style_handle,
			'https://fonts.googleapis.com/css?family=Google+Sans|Google+Sans:b|Google+Sans:500&display=swap',
			[],
			WEBSTORIES_VERSION
		);
	}
}
