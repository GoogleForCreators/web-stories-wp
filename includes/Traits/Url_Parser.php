<?php
/**
 * Trait Url_Parser
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

use DOMDocument;
use DOMXpath;
use DOMNodeList;
use DOMElement;

/**
 * Trait Url_Parser
 *
 * @package Google\Web_Stories\Traits
 */
trait Url_Parser {
	/**
	 * Retrieve content of a given DOM node attribute.
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
	 * @param string $html HTML Blob.
	 *
	 * @return DOMXpath
	 */
	protected function html_to_xpath( $html ) {
		$doc                      = new DOMDocument();
		$doc->strictErrorChecking = false; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

		// Suppress warnings generated by loadHTML.
		$errors = libxml_use_internal_errors( true );
		$doc->loadHTML( $html );
		libxml_use_internal_errors( $errors );
		$xpath = new DOMXpath( $doc );

		return $xpath;
	}
}
