<?php
/**
 * Trait Document_Parser
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

use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use DOMXpath;
use DOMNodeList;
use DOMElement;

/**
 * Trait Document_Parser
 *
 * @package Google\Web_Stories\Traits
 */
trait Document_Parser {
	/**
	 * Retrieve content of a given DOM node attribute.
	 *
	 * @since 1.0.0
	 *
	 * @param DOMNodeList<DOMElement>|false $query XPath query result.
	 * @param string                        $attribute Attribute name.
	 *
	 * @return string|false Attribute content on success, false otherwise.
	 */
	protected function get_dom_attribute_content( $query, $attribute ) {
		if ( ! $query instanceof DOMNodeList || 0 === $query->length ) {
			return false;
		}

		/**
		 * DOMElement
		 *
		 * @var DOMElement $node
		 */
		$node = $query->item( 0 );

		if ( ! $node instanceof DOMElement ) {
			return false;
		}

		return $node->getAttribute( $attribute );
	}

	/**
	 * Take html blob and return DOMXpath object.
	 *
	 * @since 1.0.0
	 *
	 * @param string $html HTML Blob.
	 *
	 * @return DOMXPath|false
	 */
	protected function html_to_xpath( string $html ) {
		$document = Document::fromHtml( $html );
		if ( ! $document ) {
			return false;
		}
		return $document->xpath;
	}
}
