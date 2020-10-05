<?php
/**
 * Class Story_Renderer
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

namespace Google\Web_Stories\Story_Renderer;

use Google\Web_Stories\Traits\Publisher;
use Google\Web_Stories\Model\Story;
use DOMDocument;
use DOMElement;

/**
 * Class Story_Renderer
 */
class HTML {
	use Publisher;

	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected $story;

	/**
	 * DOMDocument instance.
	 *
	 * @var DOMDocument DOMDocument instance.
	 */
	protected $document;

	/**
	 * AMP requires the HTML markup to be encoded in UTF-8.
	 *
	 * @var string
	 */
	const AMP_ENCODING = 'utf-8';

	/**
	 * Encoding identifier to use for an unknown encoding.
	 *
	 * "auto" is recognized by mb_convert_encoding() as a special value.
	 *
	 * @var string
	 */
	const UNKNOWN_ENCODING = 'auto';

	/**
	 * Default document type to use.
	 *
	 * @var string
	 */
	const DEFAULT_DOCTYPE = '<!DOCTYPE html>';

	/**
	 * Encoding detection order in case we have to guess.
	 *
	 * This list of encoding detection order is just a wild guess and might need fine-tuning over time.
	 * If the charset was not provided explicitly, we can really only guess, as the detection can
	 * never be 100% accurate and reliable.
	 *
	 * @var string
	 */
	const ENCODING_DETECTION_ORDER = 'UTF-8, EUC-JP, eucJP-win, JIS, ISO-2022-JP, ISO-8859-15, ISO-8859-1, ASCII';

	/**
	 * AMP boilerplate <noscript> fallback.
	 *
	 * @var string
	 */
	const AMP_NOSCRIPT_BOILERPLATE = '<noscript><style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>';

	/**
	 * Story_Renderer constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Story $story Post object.
	 */
	public function __construct( Story $story ) {
		$this->story = $story;
	}

	/**
	 * Renders the story.
	 *
	 * @since 1.0.0
	 *
	 * @return string The complete HTML markup for the story.
	 */
	public function render() {
		$markup = self::DEFAULT_DOCTYPE . $this->story->get_markup();
		$markup = $this->adapt_encoding( $markup );
		$markup = $this->replace_html_head( $markup );
		$markup = $this->remove_noscript_amp_boilerplate( $markup );

		$this->document = $this->load_html( $markup );

		// Run all further transformations on the DOMDocument.

		$this->add_noscript_amp_boilerplate();
		$this->transform_html_start_tag();
		$this->transform_a_tags();
		$this->insert_analytics_configuration();

		$this->add_poster_images();
		$this->add_publisher_logo();

		return trim( (string) $this->document->saveHTML() );
	}

	/**
	 * Adapt the encoding of the content.
	 *
	 * @link https://github.com/ampproject/amp-wp/blob/a393acf701e8e44d80225affed99d528ee751cb9/lib/common/src/Dom/Document.php
	 *
	 * @since 1.0.0
	 *
	 * @param string $markup Source content to adapt the encoding of.
	 *
	 * @return string Adapted content.
	 */
	protected function adapt_encoding( $markup ) {
		$encoding = self::UNKNOWN_ENCODING;

		if ( function_exists( 'mb_detect_encoding' ) ) {
			$encoding = mb_detect_encoding( $markup, self::ENCODING_DETECTION_ORDER, true );
		}

		if ( function_exists( 'mb_convert_encoding' ) ) {
			$markup = mb_convert_encoding( $markup, 'HTML-ENTITIES', $encoding );
		}

		return $markup;
	}

	/**
	 * Loads a full HTML document and returns a DOMDocument instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $string Input string.
	 * @param int    $options Optional. Specify additional Libxml parameters.
	 *
	 * @return DOMDocument DOMDocument instance.
	 */
	protected function load_html( $string, $options = 0 ) {
		$options |= LIBXML_COMPACT;

		/*
		 * LIBXML_HTML_NODEFDTD is only available for libxml 2.7.8+.
		 * This should be the case for PHP 5.4+, but some systems seem to compile against a custom libxml version that
		 * is lower than expected.
		 */
		if ( defined( 'LIBXML_HTML_NODEFDTD' ) ) {
			$options |= constant( 'LIBXML_HTML_NODEFDTD' );
		}

		$libxml_previous_state = libxml_use_internal_errors( true );

		$doc = new DOMDocument( '1.0', self::AMP_ENCODING );
		$doc->loadHTML( $string, $options );

		libxml_clear_errors();
		libxml_use_internal_errors( $libxml_previous_state );

		return $doc;
	}

	/**
	 * Returns the first found element with a given tag name.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name Tag name.
	 *
	 * @return DOMElement|null
	 */
	protected function get_element_by_tag_name( $name ) {
		return $this->document->getElementsByTagName( $name )->item( 0 );
	}

	/**
	 * Replaces the HTML start tag to make the language attributes dynamic.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function transform_html_start_tag() {
		/* @var DOMElement $html The <html> element */
		$html = $this->get_element_by_tag_name( 'html' );

		if ( ! $html ) {
			return;
		}

		$html->setAttribute( 'amp', '' );

		// See get_language_attributes().
		if ( is_rtl() ) {
			$html->setAttribute( 'dir', 'rtl' );
		}

		$lang = get_bloginfo( 'language' );
		if ( $lang ) {
			$html->setAttribute( 'lang', esc_attr( $lang ) );
		}
	}

	/**
	 * Transform all a tags to add target and rel attributes.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	protected function transform_a_tags() {
		$hyperlinks = $this->document->getElementsByTagName( 'a' );
		/* @var DOMElement $hyperlink The <a> element */
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
	 * Returns the full HTML <head> markup for a given story besides boilerplate.
	 *
	 * @since 1.0.0
	 *
	 * @return string Filtered content.
	 */
	protected function get_html_head_markup() {
		ob_start();
		?>
		<meta name="amp-story-generator-name" content="Web Stories for WordPress" />
		<meta name="amp-story-generator-version" content="<?php echo esc_attr( WEBSTORIES_VERSION ); ?>" />
		<?php

		/**
		 * Prints scripts or data in the head tag on the front end.
		 */
		do_action( 'web_stories_story_head' );

		return (string) ob_get_clean();
	}

	/**
	 * Replaces markers in HTML <head> with dynamic content.
	 *
	 * @since 1.0.0
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_html_head( $content ) {
		$start_tag = '<meta name="web-stories-replace-head-start"/>';
		$end_tag   = '<meta name="web-stories-replace-head-end"/>';

		$start_tag_pos = strpos( $content, $start_tag );
		$end_tag_pos   = strpos( $content, $end_tag );

		if ( false !== $start_tag_pos && false !== $end_tag_pos ) {
			$end_tag_pos += strlen( $end_tag );
			$content      = substr_replace( $content, $this->get_html_head_markup(), $start_tag_pos, $end_tag_pos - $start_tag_pos );
		}

		return $content;
	}

	/**
	 * Remove <noscript> AMP boilerplate fragment from the existing markup.
	 *
	 * The libxml extension prior to version 2.8.0 has issues parsing <noscript> tags in the <head>.
	 * That's why we temporarily remove this fragment and re-add it later.
	 *
	 * @see https://github.com/ampproject/amp-wp/pull/5097
	 * @see http://xmlsoft.org/news.html
	 *
	 * @since 1.0.0
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function remove_noscript_amp_boilerplate( $content ) {
		return str_replace( self::AMP_NOSCRIPT_BOILERPLATE, '', $content );
	}

	/**
	 * Re-add <noscript> AMP boilerplate using DOMDocument.
	 *
	 * The libxml extension prior to version 2.8.0 has issues parsing <noscript> tags in the <head>.
	 * That's why we temporarily remove this fragment and re-add it later.
	 *
	 * @see https://github.com/ampproject/amp-wp/pull/5097
	 * @see http://xmlsoft.org/news.html
	 *
	 * @return void
	 */
	protected function add_noscript_amp_boilerplate() {
		$fragment = $this->document->createDocumentFragment();
		$fragment->appendXml( self::AMP_NOSCRIPT_BOILERPLATE );

		$head = $this->get_element_by_tag_name( 'head' );

		if ( $head ) {
			$head->appendChild( $fragment );
		}
	}

	/**
	 * Replaces the placeholder of publisher logo in the content.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function add_publisher_logo() {
		/* @var DOMElement $story_element The <amp-story> element. */
		$story_element = $this->get_element_by_tag_name( 'amp-story' );

		if ( ! $story_element ) {
			return;
		}

		$publisher_logo = $story_element->getAttribute( 'publisher-logo-src' );

		if ( empty( $publisher_logo ) || $publisher_logo === $this->get_publisher_logo_placeholder() ) {
			$story_element->setAttribute( 'publisher-logo-src', $this->get_publisher_logo() );
		}
	}

	/**
	 * Adds square, and landscape poster images to the <amp-story>.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function add_poster_images() {
		/* @var DOMElement $story_element The <amp-story> element. */
		$story_element = $this->get_element_by_tag_name( 'amp-story' );

		if ( ! $story_element ) {
			return;
		}

		$poster_images = $this->get_poster_images();

		foreach ( $poster_images as $attr => $url ) {
			$story_element->setAttribute( $attr, esc_url( $url ) );
		}

		// Without a poster, a story becomes invalid AMP.
		// Remove the 'amp' attribute to not mark it as an AMP document anymore,
		// preventing errors from showing up in GSC and other tools.
		if ( ! $story_element->getAttribute( 'poster-portrait-src' ) ) {
			/* @var DOMElement $html The <html> element */
			$html = $this->get_element_by_tag_name( 'html' );

			if ( $html ) {
				$html->removeAttribute( 'amp' );
			}
		}
	}

	/**
	 * Print amp-analytics script.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function insert_amp_analytics_extension() {
		$script = $this->document->createElement( 'script' );
		$script->setAttribute( 'src', 'https://cdn.ampproject.org/v0/amp-analytics-0.1.js' );
		$script->setAttribute( 'async', 'async' );
		$script->setAttribute( 'custom-element', 'amp-analytics' );

		/* @var DOMElement $head The <head> element. */
		$head = $this->get_element_by_tag_name( 'head' );

		if ( $head ) {
			$head->appendChild( $script );
		}
	}

	/**
	 * Replaces the amp-story end tag to include amp-analytics tag if set up.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	protected function insert_analytics_configuration() {
		/* @var DOMElement $story_element The <amp-story> element. */
		$story_element = $this->get_element_by_tag_name( 'amp-story' );

		if ( ! $story_element ) {
			return;
		}

		ob_start();

		do_action( 'web_stories_print_analytics' );

		$output = (string) ob_get_clean();

		if ( empty( $output ) ) {
			return;
		}

		$fragment = $this->document->createDocumentFragment();
		$fragment->appendXml( $output );

		$story_element->appendChild( $fragment );

		/*
		 * $fragment could contain anything (amp-analytics, amp-pixel, etc.).
		 *
		 * @todo Only insert extension when it actually contains amp-analytics.
		 */
		$this->insert_amp_analytics_extension();
	}

	/**
	 * Get story meta images.
	 *
	 * @since 1.0.0
	 *
	 * @return string[] Images.
	 */
	protected function get_poster_images() {
		return [
			'poster-portrait-src'  => $this->story->get_poster_portrait(),
			'poster-square-src'    => $this->story->get_poster_square(),
			'poster-landscape-src' => $this->story->get_poster_landscape(),
		];
	}
}
