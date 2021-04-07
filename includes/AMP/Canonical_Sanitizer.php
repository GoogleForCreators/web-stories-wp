<?php
/**
 * Class Canonical_Sanitizer.
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
use Google\Web_Stories_Dependencies\AmpProject\Attribute;
use Google\Web_Stories_Dependencies\AmpProject\Tag;
use DOMElement;

/**
 * Canonical sanitizer class.
 *
 * Ensures link[rel=canonical] exists on the page,
 * as some plugins might have removed it in the meantime.
 *
 * Only needed when the AMP plugin is not active, as the plugin
 * handles that already.
 *
 * @see \AMP_Theme_Support::ensure_required_markup()
 * @see https://github.com/google/web-stories-wp/issues/4193
 *
 * @since 1.1.0
 */
class Canonical_Sanitizer extends AMP_Base_Sanitizer {
	/**
	 * Sanitize the HTML contained in the DOMDocument received by the constructor.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	public function sanitize() {
		$links         = [];
		$link_elements = $this->dom->head->getElementsByTagName( Tag::LINK );

		/**
		 * Link element.
		 *
		 * @var DOMElement $link
		 */
		foreach ( $link_elements as $link ) {
			if ( $link->hasAttribute( Attribute::REL ) ) {
				$links[ $link->getAttribute( Attribute::REL ) ][] = $link;
			}
		}

		// Ensure rel=canonical link.
		if ( empty( $links['canonical'] ) ) {
			$rel_canonical = $this->dom->createElement( Tag::LINK );
			if ( $rel_canonical ) {
				$rel_canonical->setAttribute( Attribute::REL, Attribute::REL_CANONICAL );
				$rel_canonical->setAttribute( Attribute::HREF, (string) wp_get_canonical_url() );
				$this->dom->head->appendChild( $rel_canonical );
			}
		}
	}
}
