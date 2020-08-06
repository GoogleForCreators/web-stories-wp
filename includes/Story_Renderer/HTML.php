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

/**
 * Class Story_Renderer
 */
class HTML {
	use Publisher;

	/*
	 * Regular expressions to fetch the individual structural tags.
	 * These patterns were optimized to avoid extreme backtracking on large documents.
	 */
	const HTML_STRUCTURE_HTML_START_TAG = '/^(?<html_start>[^<]*(?:\s*<!--[^>]*>\s*)*<html(?:\s+[^>]*)?>)/i';

	/**
	 * Current post.
	 *
	 * @var Story Story object.
	 */
	protected $story;

	/**
	 * Story_Renderer constructor.
	 *
	 * @param Story $story Story object.
	 */
	public function __construct( $story ) {
		$this->story = $story;
	}

	/**
	 * Replaces the HTML start tag to make the language attributes dynamic.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_html_start_tag( $content ) {
		if ( preg_match( self::HTML_STRUCTURE_HTML_START_TAG, $content, $matches ) ) {
			$replacement = sprintf( '<html amp %s>', get_language_attributes( 'html' ) );
			$result      = preg_replace( self::HTML_STRUCTURE_HTML_START_TAG, $replacement, $content, 1 );

			if ( null !== $result ) {
				return $result;
			}
		}

		return $content;
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
	 * @param string $content Original markup.
	 * @return string Filtered markup.
	 */
	protected function add_publisher_logo( $content ) {
		return str_replace( $this->get_publisher_logo_placeholder(), $this->get_publisher_logo(), $content );
	}

	/**
	 * Adds square, and landscape poster images to the <amp-story>.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function add_poster_images( $content ) {
		$storyer_images = $this->get_story_meta_images();

		foreach ( $storyer_images as $attr => $url ) {
			$attr_markup = sprintf( '%1$s-src="%2$s"', $attr, $url );
			$content     = str_replace( 'poster-portrait-src=', $attr_markup . ' poster-portrait-src=', $content );
		}

		return $content;
	}

	/**
	 * Print amp-analytics script.
	 *
	 * @return void
	 */
	public function print_analytics_script() {
		?>
		<script async="async" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" custom-element="amp-analytics"></script>
		<?php
	}

	/**
	 * Replaces the amp-story end tag to include amp-analytics tag if set up.
	 *
	 * @param string $content Story markup.
	 * @return string Updated story markup.
	 */
	protected function maybe_add_analytics( $content ) {
		ob_start();

		do_action( 'web_stories_print_analytics' );

		$output = (string) ob_get_clean();

		if ( ! empty( $output ) ) {
			add_action( 'web_stories_story_head', [ $this, 'print_analytics_script' ] );
		}

		return str_replace( '</amp-story>', $output . '</amp-story>', $content );
	}

	/**
	 * Replaces the body start tag to fire a custom action.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_body_start_tag( $content ) {
		ob_start();

		/**
		 * Prints scripts or data after opening the <body>.
		 */
		do_action( 'web_stories_body_open' );

		$output = (string) ob_get_clean();

		return str_replace( '<body>', '<body>' . $output, $content );
	}

	/**
	 * Replaces the body end tag to fire a custom action.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function replace_body_end_tag( $content ) {
		ob_start();

		/**
		 * Prints scripts or data before closing the </body>.
		 */
		do_action( 'web_stories_footer' );

		$output = (string) ob_get_clean();

		return str_replace( '</body>', $output . '</body>', $content );
	}

	/**
	 * Renders the story.
	 *
	 * @return string The complete HTML markup for the story.
	 */
	public function render() {
		$markup = $this->story->markup;
		$markup = $this->replace_html_start_tag( $markup );
		// Add before replace_html_head to leverage the `web_stories_story_head` action.
		$markup = $this->maybe_add_analytics( $markup );
		$markup = $this->replace_html_head( $markup );
		$markup = $this->add_poster_images( $markup );
		$markup = $this->add_publisher_logo( $markup );
		$markup = $this->replace_body_start_tag( $markup );
		$markup = $this->replace_body_end_tag( $markup );
		return $markup;
	}

	/**
	 * Get story meta images.
	 *
	 * There is a fallback poster-portrait image added via a filter, in case there's no featured image.
	 *
	 * @return string[] Images.
	 */
	protected function get_story_meta_images() {
		$images = [
			'poster-square'    => $this->story->poster_square,
			'poster-landscape' => $this->story->poster_landscape,
		];

		return array_filter( $images );
	}
}
