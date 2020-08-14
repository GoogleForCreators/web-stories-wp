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
		$markup = $this->story->get_markup();
		$markup = $this->replace_html_head( $markup );

		$this->document = $this->string_to_doc( $markup );

		// Run all further transformations on the DOMDocument.

		$this->transform_html_start_tag();
		$this->insert_content_after_opening_body();
		$this->insert_content_before_closing_body();
		$this->insert_analytics_configuration();

		$this->add_poster_images();
		$this->add_publisher_logo();

		return trim( (string) $this->document->saveHTML() );
	}

	/**
	 * Returns a DOMDocument from a string.
	 *
	 * @param string $string Input string.
	 *
	 * @return DOMDocument DOMDocument instance.
	 */
	private function string_to_doc( $string ) {
		$doc = new DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $string, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
		libxml_clear_errors();

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
		ob_start();

		do_action( 'web_stories_insert_analytics_configuration' );

		$output = (string) ob_get_clean();

		if ( empty( $output ) ) {
			return;
		}

		$new_content = $this->string_to_doc( $output );

		if ( ! $new_content->documentElement ) {
			return;
		}

		/* @var DOMElement $story_element The <amp-story> element. */
		$story_element = $this->get_element_by_tag_name( 'amp-story' );

		if ( ! $story_element ) {
			return;
		}

		$story_element->appendChild( $this->document->importNode( $new_content->documentElement, true ) );

		$this->insert_amp_analytics_extension();
	}

	/**
	 * Replaces the body start tag to fire a custom action.
	 *
	 * @return void
	 */
	protected function insert_content_after_opening_body() {
		ob_start();

		/**
		 * Prints scripts or data after opening the <body>.
		 */
		do_action( 'web_stories_body_open' );

		$output = (string) ob_get_clean();

		if ( empty( $output ) ) {
			return;
		}

		$new_content = $this->string_to_doc( $output );

		if ( ! $new_content->documentElement ) {
			return;
		}

		/* @var DOMElement $story_element The <amp-story> element */
		$story_element = $this->get_element_by_tag_name( 'amp-story' );

		if ( ! $story_element || ! $story_element->parentNode ) {
			return;
		}

		$story_element->parentNode->insertBefore(
			$this->document->importNode( $new_content->documentElement, true ),
			$story_element
		);
	}

	/**
	 * Replaces the body end tag to fire a custom action.
	 *
	 * @return void
	 */
	protected function insert_content_before_closing_body() {
		ob_start();

		/**
		 * Prints scripts or data before closing the </body>.
		 */
		do_action( 'web_stories_footer' );

		$output = (string) ob_get_clean();

		if ( empty( $output ) ) {
			return;
		}

		$new_content = $this->string_to_doc( $output );

		if ( ! $new_content->documentElement ) {
			return;
		}

		/* @var DOMElement $body The <body> element. */
		$body = $this->get_element_by_tag_name( 'body' );

		if ( ! $body ) {
			return;
		}

		$body->appendChild( $this->document->importNode( $new_content->documentElement, true ) );
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
