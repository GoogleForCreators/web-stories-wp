<?php
/**
 * Class AMP_Story_Sanitizer.
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

namespace Google\Web_Stories\AMP\Integration;

use Google\Web_Stories\AMP\Traits\Sanitization_Utils;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;

/**
 * AMP Story sanitizer.
 *
 * Like Story_Sanitizer, but for use with the AMP WordPress plugin.
 *
 * @see Story_Sanitizer
 *
 * @since 1.1.0
 */
class AMP_Story_Sanitizer extends \AMP_Base_Sanitizer {
	use Sanitization_Utils;

	/**
	 * Sanitize the HTML contained in the DOMDocument received by the constructor.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	public function sanitize() {
		$this->transform_html_start_tag( $this->dom );
		$this->transform_a_tags( $this->dom );
		$this->add_publisher_logo( $this->dom, $this->args['publisher_logo'], $this->args['publisher_logo_placeholder'] );
		$this->add_poster_images( $this->dom, $this->args['poster_images'] );
	}
}
