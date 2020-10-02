<?php
/**
 * Class Story_Sanitizer.
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

namespace Google\Web_Stories\AMP;

use Google\Web_Stories_Dependencies\AMP_Base_Sanitizer;

/**
 * Story sanitizer.
 *
 * Sanitizer for Web Stories related features.
 *
 * @see AMP_Story_Sanitizer
 *
 * @since 1.1.0
 */
class Story_Sanitizer extends AMP_Base_Sanitizer {
	/**
	 * Sanitize the HTML contained in the DOMDocument received by the constructor.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	public function sanitize() {
		$story_element = $this->dom->body->getElementsByTagName( 'amp-story' )->item( 0 );

		if ( $story_element ) {
			// Without a poster or a publisher logo, a story becomes invalid AMP.
			// Remove the 'amp' attribute to not mark it as an AMP document anymore,
			// preventing errors from showing up in GSC and other tools.
			if (
				! $story_element->getAttribute( 'poster-portrait-src' ) ||
				! $story_element->getAttribute( 'publisher-logo-src' )
			) {
				$this->dom->html->removeAttribute( 'amp' );
			}
		}
	}
}
