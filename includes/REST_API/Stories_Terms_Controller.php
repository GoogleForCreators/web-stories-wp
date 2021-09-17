<?php
/**
 * Class Stories_Terms_Controller
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

namespace Google\Web_Stories\REST_API;

use WP_REST_Terms_Controller;

/**
 * Stories_Terms_Controller class.
 */
class Stories_Terms_Controller extends WP_REST_Terms_Controller {
	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @since 1.12.0
	 *
	 * @param string $taxonomy Taxonomy key.
	 *
	 * @return void
	 */
	public function __construct( $taxonomy ) {
		parent::__construct( $taxonomy );
		$this->namespace = 'web-stories/v1';
	}

	/**
	 * Return namespace.
	 *
	 * @since 1.12.0
	 *
	 * @return string
	 */
	public function get_namespace() : string {
		return $this->namespace;
	}
}
