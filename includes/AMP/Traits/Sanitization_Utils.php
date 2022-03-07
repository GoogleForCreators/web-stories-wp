<?php
/**
 * Trait Sanitization_Utils.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

use AmpProject\Dom\Document as AMP_Document;
use DOMElement;
use DOMNodeList;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;

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
	 */
	private function transform_html_start_tag( &$document ): void {
		$document->html->setAttribute( 'amp', '' );

		// See get_language_attributes().
		if ( is_rtl() ) {
			$document->html->setAttribute( 'dir', 'rtl' );
		}

		$lang = get_bloginfo( 'language' );
		if ( $lang ) {
			$document->html->setAttribute( 'lang', $lang );
		}
	}

	/**
	 * Transform all hyperlinks to ensure they're always valid.
	 *
	 * Adds target="_blank" and rel="noreferrer" attributes.
	 * Does not add rel="noreferrer" for same-origin links.
	 *
	 * Removes empty data-tooltip-icon and data-tooltip-text attributes
	 * to prevent validation issues.
	 *
	 * @since 1.1.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 */
	private function transform_a_tags( &$document ): void {
		$links = $document->getElementsByTagName( 'a' );

		/**
		 * The <a> element
		 *
		 * @var DOMElement $link The <a> element
		 */
		foreach ( $links as $link ) {
			if ( ! $link->getAttribute( 'target' ) ) {
				$link->setAttribute( 'target', '_blank' );
			}

			$is_link_to_same_origin = 0 === strpos( $link->getAttribute( 'href' ), home_url() );

			$rel = $link->getAttribute( 'rel' );

			// Links to the same site should not have "noreferrer".
			// Other rel values should not be modified.
			// See https://github.com/googleforcreators/web-stories-wp/issues/9494.
			$rel = str_replace( 'noreferrer', '', $rel );
			if ( ! $is_link_to_same_origin ) {
				$rel .= ' noreferrer';
			}

			if ( empty( $rel ) ) {
				$link->removeAttribute( 'rel' );
			} else {
				$link->setAttribute( 'rel', trim( $rel ) );
			}

			if ( ! $link->getAttribute( 'data-tooltip-icon' ) ) {
				$link->removeAttribute( 'data-tooltip-icon' );
			}

			if ( ! $link->getAttribute( 'data-tooltip-text' ) ) {
				$link->removeAttribute( 'data-tooltip-text' );
			}
		}
	}

	/**
	 * Transforms all paragraphs in a story to use semantic heading tags if needed.
	 *
	 * This logic here mirrors the getTextElementTagNames() function in the editor
	 * in order to change simple <p> tags into <h1>, <h2> or <h3>, depending on font size.
	 *
	 * Only relevant for older stories that haven't been updated in a while.
	 *
	 * @since 1.18.0
	 *
	 * @param Document|AMP_Document $document   Document instance.
	 */
	private function use_semantic_heading_tags( &$document ): void {
		$pages = $document->getElementsByTagName( 'amp-story-page' );

		/**
		 * The <amp-story-page> element
		 *
		 * @var DOMElement $page The <amp-story-page> element
		 */
		foreach ( $pages as $page ) {
			$h1 = $page->getElementsByTagName( 'h1' );
			$h2 = $page->getElementsByTagName( 'h2' );
			$h3 = $page->getElementsByTagName( 'h3' );

			// When a page already contains any headings, we don't need to do anything further.
			if ( $h1->count() || $h2->count() || $h3->count() ) {
				continue;
			}

			$text_elements = $document->xpath->query( './/p[ contains( @class, "text-wrapper" ) ]', $page );

			if ( ! $text_elements ) {
				return;
			}

			$this->use_semantic_heading_tags_for_elements( $text_elements );
		}
	}

	/**
	 * Transforms a list of elements to use semantic heading tags if needed.
	 *
	 * @since 1.18.0
	 *
	 * @param DOMNodeList $text_elements List of text elements.
	 */
	private function use_semantic_heading_tags_for_elements( $text_elements ): void {
		// Matches PAGE_HEIGHT in the editor, as also seen in amp-story-grid-layer[aspect-ratio].
		$page_height = 618;

		$has_h1 = false;

		/**
		 * The individual text element.
		 *
		 * @var DOMElement $text_el The text element.
		 */
		foreach ( $text_elements as $text_el ) {
			$style   = $text_el->getAttribute( 'style' );
			$matches = [];

			// See https://github.com/GoogleForCreators/web-stories-wp/issues/10726.
			if ( \strlen( trim( $text_el->textContent ) ) <= 3 ) {
				continue;
			}

			if ( ! preg_match( '/font-size:([^em]+)em/', $style, $matches ) ) {
				continue;
			}

			// Contains the font-size in em.
			// This is basically reversing the dataToFontSizeY() logic. Example:
			// 0.582524em roughly equals 36 editor pixels: 0.582524 * 618 / 10 = 35.9999px.
			$font_size_in_em = $matches[1];
			$font_size_in_px = round( $font_size_in_em * $page_height / 10, 0 );

			if ( $font_size_in_px >= 36 && ! $has_h1 ) {
				$this->change_tag_name( $text_el, 'h1' );
				$has_h1 = true;
				continue;
			}

			if ( $font_size_in_px >= 27 ) {
				$this->change_tag_name( $text_el, 'h2' );
			} elseif ( $font_size_in_px >= 21 ) {
				$this->change_tag_name( $text_el, 'h3' );
			}
		}
	}

	/**
	 * Changes an element's tag name.
	 *
	 * @since 1.18.0
	 *
	 * @param DOMElement $node     Element whose tag name should be changed.
	 * @param string     $tag_name Desired new tag name, e.g. h1 or h2.
	 */
	private function change_tag_name( DOMElement $node, string $tag_name ): void {
		/**
		 * Owner document.
		 *
		 * @var Document|AMP_Document Owner document.
		 */
		$document = $node->ownerDocument;

		$new_node = $document->createElement( $tag_name );

		if ( ! $new_node instanceof DOMElement ) {
			return;
		}

		// Copy over all children first.
		foreach ( $node->childNodes as $child ) {
			$new_node->appendChild( $document->importNode( $child, true ) );
		}

		// Then, copy over all attributes.
		if ( $node->attributes ) {
			foreach ( $node->attributes as $attr ) {
				$new_node->setAttribute( $attr->nodeName, $attr->nodeValue );
			}
		}

		if ( $node->parentNode ) {
			$node->parentNode->replaceChild( $new_node, $node );
		}
	}

	/**
	 * Sanitizes <amp-story-page-outlink> elements to ensure they're always valid.
	 *
	 * Removes empty `cta-image` attributes.
	 * Ensures the element is always the last child of <amp-story-page>.
	 *
	 * @since 1.13.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 */
	private function sanitize_amp_story_page_outlink( &$document ): void {
		$outlink_elements = $document->getElementsByTagName( 'amp-story-page-outlink' );

		/**
		 * The <amp-story-page-outlink> element
		 *
		 * @var DOMElement $element The <amp-story-page-outlink> element
		 */
		foreach ( $outlink_elements as $element ) {
			if ( ! $element->getAttribute( 'cta-image' ) ) {
				$element->removeAttribute( 'cta-image' );
			}

			$amp_story_page = $element->parentNode;

			if ( $amp_story_page && $element !== $amp_story_page->lastChild ) {
				$amp_story_page->removeChild( $element );
				$amp_story_page->appendChild( $element );
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
	 */
	private function add_publisher_logo( &$document, $publisher_logo ): void {
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

		// Backward compatibility for when fallback-wordpress-publisher-logo.png was provided by the plugin.
		if ( ! $existing_publisher_logo || false !== strpos( $existing_publisher_logo, 'fallback-wordpress-publisher-logo.png' ) ) {
			$story_element->setAttribute( 'publisher-logo-src', $publisher_logo );
		}

		if ( ! $story_element->getAttribute( 'publisher-logo-src' ) ) {
			$story_element->setAttribute( 'publisher-logo-src', $publisher_logo );
		}
	}

	/**
	 * Replaces the placeholder of publisher in the content.
	 *
	 * Ensures the `publisher` attribute exists if missing.
	 *
	 * @since 1.7.0
	 *
	 * @param Document|AMP_Document $document       Document instance.
	 * @param string                $publisher Publisher logo.
	 */
	private function add_publisher( &$document, $publisher ): void {
		/**
		 * The <amp-story> element.
		 *
		 * @var DOMElement $story_element The <amp-story> element.
		 */
		$story_element = $document->body->getElementsByTagName( 'amp-story' )->item( 0 );

		if ( ! $story_element instanceof DOMElement ) {
			return;
		}

		if ( $publisher || ! $story_element->hasAttribute( 'publisher' ) ) {
			$story_element->setAttribute( 'publisher', $publisher );
		}
	}

	/**
	 * Adds square, and landscape poster images to the <amp-story>.
	 *
	 * @since 1.1.0
	 *
	 * @param Document|AMP_Document $document      Document instance.
	 * @param string[]              $poster_images List of poster images, keyed by type.
	 */
	private function add_poster_images( &$document, $poster_images ): void {
		/**
		 * The <amp-story> element.
		 *
		 * @var DOMElement $story_element The <amp-story> element.
		 */
		$story_element = $document->body->getElementsByTagName( 'amp-story' )->item( 0 );

		if ( ! $story_element instanceof DOMElement ) {
			return;
		}

		// The story sanitizer only passes valid, non-empty URLs that are already escaped.
		// That means we don't need to do any additional checks here or worry about accidentally overriding
		// an existing poster-portrait-src attribute value with an empty one.
		foreach ( $poster_images as $attr => $url ) {
			$story_element->setAttribute( $attr, $url );
		}

		if ( ! $story_element->getAttribute( 'poster-portrait-src' ) ) {
			$story_element->setAttribute( 'poster-portrait-src', '' );
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
	 */
	private function deduplicate_inline_styles( $document ): void {
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

	/**
	 * Enables using video cache by adding the necessary attribute to `<amp-video>`
	 *
	 * @since 1.10.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 * @param bool                  $video_cache_enabled Whether video cache is enabled.
	 */
	private function add_video_cache( &$document, $video_cache_enabled ): void {
		if ( ! $video_cache_enabled ) {
			return;
		}

		$videos = $document->body->getElementsByTagName( 'amp-video' );

		/**
		 * The <amp-video> element
		 *
		 * @var DOMElement $video The <amp-video> element
		 */
		foreach ( $videos as $video ) {
			$video->setAttribute( 'cache', 'google' );
		}
	}

	/**
	 * Determines whether a URL is a `blob:` URL.
	 *
	 * @since 1.9.0
	 *
	 * @param string $url URL.
	 * @return bool Whether it's a blob URL.
	 */
	private function is_blob_url( string $url ): bool {
		return 0 === strpos( $url, 'blob:' );
	}

	/**
	 * Remove `blob:` URLs from videos and images that might have slipped through.
	 *
	 * @since 1.9.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 */
	private function remove_blob_urls( &$document ): void {
		/**
		 * List of <amp-video> elements.
		 *
		 * @var DOMElement[] $videos Video elements.
		 */
		$videos = $document->body->getElementsByTagName( 'amp-video' );

		foreach ( $videos as $video ) {
			if ( $this->is_blob_url( $video->getAttribute( 'poster' ) ) ) {
				$video->setAttribute( 'poster', '' );
			}

			if ( $this->is_blob_url( $video->getAttribute( 'artwork' ) ) ) {
				$video->setAttribute( 'artwork', '' );
			}

			/**
			 * List of <source> child elements.
			 *
			 * @var DOMElement[] $video_sources Video source elements.
			 */
			$video_sources = $video->getElementsByTagName( 'source' );

			foreach ( $video_sources as $source ) {
				if ( $this->is_blob_url( $source->getAttribute( 'src' ) ) ) {
					$source->setAttribute( 'src', '' );
				}
			}
		}

		/**
		 * List of <amp-img> elements.
		 *
		 * @var DOMElement[] $images Image elements.
		 */
		$images = $document->body->getElementsByTagName( 'amp-img' );

		foreach ( $images as $image ) {
			if ( $this->is_blob_url( $image->getAttribute( 'src' ) ) ) {
				$image->setAttribute( 'src', '' );
			}
		}
	}

	/**
	 * Sanitize amp-img[srcset] attributes to remove duplicates.
	 *
	 * @since 1.10.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 */
	private function sanitize_srcset( &$document ): void {
		/**
		 * List of <amp-img> elements.
		 *
		 * @var DOMElement[] $images Image elements.
		 */
		$images = $document->body->getElementsByTagName( 'amp-img' );

		foreach ( $images as $image ) {
			$srcset = $image->getAttribute( 'srcset' );
			if ( ! $srcset ) {
				continue;
			}

			$matches = [];

			// Matches every srcset entry (consisting of a URL and a width descriptor) within `srcset=""`.
			// Not using explode(',') to not break with URLs containing commas.
			// Given "foo1,2/image.png 123w, foo2,3/image.png 456w", the named capture group "entry"
			// will contain "foo1,2/image.png 123w" and "foo2,3/image.png 456w", without the trailing commas.
			preg_match_all( '/((?<entry>[^ ]+ [\d]+w),?)/', $srcset, $matches );

			$entries           = $matches['entry'] ?? [];
			$entries_by_widths = [];

			foreach ( $entries as $entry ) {
				$entry_data = explode( ' ', $entry );
				if ( ! isset( $entries_by_widths[ $entry_data[1] ] ) ) {
					$entries_by_widths[ $entry_data[1] ] = $entry;
				}
			}

			$image->setAttribute( 'srcset', implode( ', ', $entries_by_widths ) );
		}
	}

	/**
	 * Remove images referencing the grid-placeholder.png file which has since been removed.
	 *
	 * Prevents 404 errors for non-existent image files when creators forget to replace/remove
	 * the placeholder image.
	 *
	 * The placeholder functionality was removed in v1.14.0, nevertheless older stories could still
	 * reference the files.
	 *
	 * @since 1.14.0
	 *
	 * @link https://github.com/googleforcreators/web-stories-wp/issues/9530
	 *
	 * @param Document|AMP_Document $document Document instance.
	 */
	private function remove_page_template_placeholder_images( &$document ): void {
		// Catches "assets/images/editor/grid-placeholder.png" as well as
		// "web-stories/assets/images/adde98ae406d6b5c95d111a934487252.png" (v1.14.0)
		// and potentially other variants.
		$placeholder_img = 'plugins/web-stories/assets/images';

		/**
		 * List of <amp-img> elements.
		 *
		 * @var DOMElement[] $images Image elements.
		 */
		$images = $document->body->getElementsByTagName( 'amp-img' );

		foreach ( $images as $image ) {
			$src = $image->getAttribute( 'src' );

			if ( $image->parentNode && false !== strpos( $src, $placeholder_img ) ) {
				$image->parentNode->removeChild( $image );
			}
		}
	}
}
