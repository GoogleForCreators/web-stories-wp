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
	 * Story_Renderer constructor.
	 *
	 * @param Story $story Post object.
	 */
	public function __construct( Story $story ) {
		$this->story = $story;
	}

	/**
	 * Renders the story.
	 *
	 * @return string The complete HTML markup for the story.
	 */
	public function render() {
		$markup = '<!DOCTYPE html>' . $this->story->get_markup();
		$markup = $this->replace_html_head( $markup );

		$this->document = $this->load_html( $markup );

		// Run all further transformations on the DOMDocument.

		$this->transform_html_start_tag();
		$this->insert_analytics_configuration();

		$this->add_poster_images();
		$this->add_publisher_logo();

		return trim( (string) $this->document->saveHTML() );
	}

	/**
	 * Loads a full HTML document and returns a DOMDocument instance.
	 *
	 * @param string $string Input string.
	 * @param int    $options Optional. Specify additional Libxml parameters.
	 *
	 * @return DOMDocument DOMDocument instance.
	 */
	private function load_html( $string, $options = 0 ) {
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

		$doc = new DOMDocument();
		$doc->loadHTML( $string, $options );

		libxml_clear_errors();
		libxml_use_internal_errors( $libxml_previous_state );

		return $doc;
	}

	/**
	 * Returns the first found element with a given tag name.
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
	 * Returns the full HTML <head> markup for a given story besides boilerplate.
	 *
	 * @return string Filtered content.
	 */
	protected function get_html_head_markup() {
		ob_start();
		?>
		<meta name="generator" content="<?php printf( 'Web Stories %s', esc_attr( WEBSTORIES_VERSION ) ); ?>" />
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
	 * Replaces the placeholder of publisher logo in the content.
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
	}

	/**
	 * Print amp-analytics script.
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

		if ( ! $head ) {
			return;
		}

		$head->appendChild( $this->document->importNode( $script, true ) );
	}

	/**
	 * Replaces the amp-story end tag to include amp-analytics tag if set up.
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

		do_action( 'web_stories_insert_analytics_configuration' );

		$output = (string) ob_get_clean();

		if ( empty( $output ) ) {
			return;
		}

		$fragment = $this->document->createDocumentFragment();
		$fragment->appendXml( $output );

		$story_element->appendChild( $this->document->importNode( $fragment, true ) );

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
	 * @return string[] Images.
	 */
	protected function get_poster_images() {
		$images = [
			'poster-portrait-src'  => $this->story->get_poster_portrait(),
			'poster-square-src'    => $this->story->get_poster_square(),
			'poster-landscape-src' => $this->story->get_poster_landscape(),
		];

		if ( ! $images['poster-portrait-src'] ) {
			$images['poster-portrait-src'] = plugins_url( 'assets/images/fallback-poster.png', WEBSTORIES_PLUGIN_FILE );
		}

		return array_filter( $images );
	}
}
