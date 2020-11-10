<?php
/**
 * Trait Sanitization_Utils.
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

namespace Google\Web_Stories\AMP\Traits;

use DOMElement;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use \AmpProject\Dom\Document as AMP_Document;

/**
 * Trait Sanitization_Utils
 *
 * @since 1.1.0
 */
trait Sanitization_Utils {
	/**
	 * Replaces the HTML start tag to make the language attributes dynamic.
	 *
	 * @since 1.1.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 * @return void
	 */
	private function transform_html_start_tag( &$document ) {
		$document->html->setAttribute( 'amp', '' );

		// See get_language_attributes().
		if ( is_rtl() ) {
			$document->html->setAttribute( 'dir', 'rtl' );
		}

		$lang = get_bloginfo( 'language' );
		if ( $lang ) {
			$document->html->setAttribute( 'lang', esc_attr( $lang ) );
		}
	}

	/**
	 * Transform all a tags to add target and rel attributes.
	 *
	 * @since 1.1.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 * @return void
	 */
	private function transform_a_tags( &$document ) {
		$hyperlinks = $document->getElementsByTagName( 'a' );
		/**
		 * The <a> element
		 *
		 * @var DOMElement $hyperlink The <a> element
		 */
		foreach ( $hyperlinks as $hyperlink ) {
			if ( ! $hyperlink->getAttribute( 'target' ) ) {
				$hyperlink->setAttribute( 'target', '_blank' );
			}
			if ( ! $hyperlink->getAttribute( 'rel' ) ) {
				$hyperlink->setAttribute( 'rel', 'noreferrer' );
			}
		}
	}

	/**
	 * Replaces the placeholder of publisher logo in the content.
	 *
	 * @since 1.1.0
	 *
	 * @param Document|AMP_Document $document       Document instance.
	 * @param string                $publisher_logo Publisher logo.
	 * @param string                $placeholder    Placeholder publisher logo.
	 * @return void
	 */
	private function add_publisher_logo( &$document, $publisher_logo, $placeholder ) {
		/**
		 * The <amp-story> element.
		 *
		 * @var DOMElement $story_element The <amp-story> element.
		 */
		$story_element = $document->body->getElementsByTagName( 'amp-story' )->item( 0 );

		if ( ! $story_element instanceof DOMElement ) {
			return;
		}

		// Add a publisher logo if missing or just a placeholder.
		$existing_publisher_logo = $story_element->getAttribute( 'publisher-logo-src' );

		if ( ! $existing_publisher_logo || $existing_publisher_logo === $placeholder ) {
			$story_element->setAttribute( 'publisher-logo-src', $publisher_logo );
		}

		// Without a publisher logo, a story becomes invalid AMP.
		// Remove the 'amp' attribute to not mark it as an AMP document anymore,
		// preventing errors from showing up in GSC and other tools.
		if ( ! $story_element->getAttribute( 'publisher-logo-src' ) ) {
			$document->html->removeAttribute( 'amp' );
		}
	}

	/**
	 * Adds square, and landscape poster images to the <amp-story>.
	 *
	 * @since 1.1.0
	 *
	 * @param Document|AMP_Document $document      Document instance.
	 * @param string[]              $poster_images List of poster images, keyed by type.
	 * @return void
	 */
	private function add_poster_images( &$document, $poster_images ) {
		/**
		 * The <amp-story> element.
		 *
		 * @var DOMElement $story_element The <amp-story> element.
		 */
		$story_element = $document->body->getElementsByTagName( 'amp-story' )->item( 0 );

		if ( ! $story_element instanceof DOMElement ) {
			return;
		}

		foreach ( $poster_images as $attr => $url ) {
			$story_element->setAttribute( $attr, esc_url_raw( $url ) );
		}

		// Without a poster, a story becomes invalid AMP.
		// Remove the 'amp' attribute to not mark it as an AMP document anymore,
		// preventing errors from showing up in GSC and other tools.
		if ( ! $story_element->getAttribute( 'poster-portrait-src' ) ) {
			$document->html->removeAttribute( 'amp' );
		}
	}
}
