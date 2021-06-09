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
use DOMNodeList;
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
	 * Transform all hyperlinks to ensure they're always valid.
	 *
	 * Adds target and rel attributes.
	 * Removes empty data-tooltip-icon and data-tooltip-text attributes.
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

			if ( ! $hyperlink->getAttribute( 'data-tooltip-icon' ) ) {
				$hyperlink->removeAttribute( 'data-tooltip-icon' );
			}

			if ( ! $hyperlink->getAttribute( 'data-tooltip-text' ) ) {
				$hyperlink->removeAttribute( 'data-tooltip-text' );
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
	 * Replaces the placeholder of publisher logo in the content.
	 *
	 * @since 1.7.0
	 *
	 * @param Document|AMP_Document $document       Document instance.
	 * @param string                $publisher Publisher logo.
	 * @return void
	 */
	private function add_publisher( &$document, $publisher ) {
		/**
		 * The <amp-story> element.
		 *
		 * @var DOMElement $story_element The <amp-story> element.
		 */
		$story_element = $document->body->getElementsByTagName( 'amp-story' )->item( 0 );

		if ( ! $story_element instanceof DOMElement ) {
			return;
		}

		if ( $publisher ) {
			$story_element->setAttribute( 'publisher', $publisher );
		}

		// Without a publisher, a story becomes invalid AMP.
		// Remove the 'amp' attribute to not mark it as an AMP document anymore,
		// preventing errors from showing up in GSC and other tools.
		if ( ! $story_element->getAttribute( 'publisher' ) ) {
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

	/**
	 * De-duplicate inline styles in the story.
	 *
	 * Greatly reduce the amount of `style[amp-custom]` CSS for stories by de-duplicating inline styles
	 * and moving to simple class selector style rules, avoiding the specificity hack
	 * that the AMP plugin's style sanitizer employs.
	 *
	 * @since 1.8.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 * @return void
	 */
	private function deduplicate_inline_styles( $document ) {
		$elements_by_inline_style = [];

		// Gather all elements based on their common inline styles.
		$elements_with_style = $document->xpath->query( '//*[ @style ]' );

		if ( $elements_with_style instanceof DOMNodeList && $elements_with_style->length > 0 ) {
			/**
			 * The element with inline styles.
			 *
			 * @var DOMElement $styled_element The element.
			 */
			foreach ( $elements_with_style as $styled_element ) {
				$value = $styled_element->getAttribute( 'style' );
				$styled_element->removeAttribute( 'style' );
				$elements_by_inline_style[ $value ][] = $styled_element;
			}
		}

		if ( empty( $elements_by_inline_style ) ) {
			return;
		}

		$style_element = $document->createElement( 'style' );

		if ( ! $style_element ) {
			return;
		}

		$document->head->appendChild( $style_element );

		// Create style rule for each inline style and add class name to each element.
		foreach ( $elements_by_inline_style as $inline_style => $styled_elements ) {
			$inline_style_class_name = '_' . substr( md5( (string) $inline_style ), 0, 7 );

			$style_rule = $document->createTextNode( sprintf( '.%s{%s}', $inline_style_class_name, $inline_style ) );
			$style_element->appendChild( $style_rule );

			/**
			 * The element with inline styles.
			 *
			 * @var DOMElement $styled_element The element.
			 */
			foreach ( $styled_elements as $styled_element ) {
				$class_name = $inline_style_class_name;
				if ( $styled_element->hasAttribute( 'class' ) ) {
					$class_name .= ' ' . $styled_element->getAttribute( 'class' );
				}
				$styled_element->setAttribute( 'class', $class_name );
			}
		}
	}
}
