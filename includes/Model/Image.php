<?php
/**
 * Class Image
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\Model;

/**
 * Class Image
 */
class Image {

	/**
	 * URL of image.
	 *
	 * @var string
	 */
	protected $url = '';

	/**
	 * Alt of image.
	 *
	 * @var string
	 */
	protected $alt = '';

	/**
	 * Image constructor.
	 *
	 * @since 1.20.0
	 *
	 * @param array $image Array of attributes.
	 */
	public function __construct( array $image = [] ) {
		foreach ( $image as $key => $value ) {
			if ( property_exists( $this, $key ) ) {
				$this->$key = $value;
			}
		}
	}

	/**
	 * Get URL.
	 */
	public function get_url(): string {
		return $this->url;
	}

	/**
	 * Get Alt.
	 */
	public function get_alt(): string {
		return $this->alt;
	}
}
