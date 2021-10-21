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
	 * Sanitizes <amp-story-page-outlink> elements to ensure they're always valid.
	 *
	 * Removes empty `cta-image` attributes.
	 *
	 * @since 1.13.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 * @return void
	 */
	private function sanitize_amp_story_page_outlink( &$document ) {
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
		}
	}

	/**
	 * Replaces the placeholder of publisher logo in the content.
	 *
	 * @since 1.1.0
	 *
	 * @param Document|AMP_Document $document       Document instance.
	 * @param string                $publisher_logo Publisher logo.
	 * @return void
	 */
	private function add_publisher_logo( &$document, $publisher_logo ) {
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

	/**
	 * Enables using video cache by adding the necessary attribute to `<amp-video>`
	 *
	 * @since 1.10.0
	 *
	 * @param Document|AMP_Document $document Document instance.
	 * @param bool                  $video_cache_enabled Whether video cache is enabled.
	 * @return void
	 */
	private function add_video_cache( &$document, $video_cache_enabled ) {
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
	 * @return void
	 */
	private function remove_blob_urls( &$document ) {
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
	 * @return void
	 */
	private function sanitize_srcset( &$document ) {
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
}
