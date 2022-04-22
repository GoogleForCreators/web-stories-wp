<?php
/**
 * Class Rating
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
 * Class Rating
 */
class Rating {
	/**
	 * URL to rating.
	 *
	 * @var string
	 */
	protected $url = '';
	/**
	 * Value of rating.
	 *
	 * @var string
	 */
	protected $value = '';
	/**
	 * Count of rating.
	 *
	 * @var string
	 */
	protected $count = '';

	/**
	 * Rating constructor.
	 *
	 * @since 1.20.0
	 *
	 * @param array $rating Array of attributes.
	 */
	public function __construct( array $rating = [] ) {
		foreach ( $rating as $key => $value ) {
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
	 * Get value.
	 */
	public function get_value(): string {
		return $this->value;
	}

	/**
	 * Get count.
	 */
	public function get_count(): string {
		return $this->count;
	}
}
