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

namespace Google\Web_Stories;

/**
 * Class Story_Renderer
 */
class Story_Renderer {
	/*
	 * Regular expressions to fetch the individual structural tags.
	 * These patterns were optimized to avoid extreme backtracking on large documents.
	 */
	const HTML_STRUCTURE_HTML_START_TAG = '/^(?<html_start>[^<]*(?:\s*<!--[^>]*>\s*)*<html(?:\s+[^>]*)?>)/i';

	/**
	 * Current post.
	 *
	 * @var \WP_Post Post object.
	 */
	protected $post;

	/**
	 * Story_Renderer constructor.
	 *
	 * @param \WP_Post $post Post object.
	 */
	public function __construct( $post ) {
		$this->post = $post;
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
		<style amp-custom>
			.page-background-area, .page-safe-area {
				position: absolute;
				overflow: hidden;
				margin: auto;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
			}

			.page-background-area img, .page-background-area video {
				object-fit: cover;
			}

			.wrapper {
				position: absolute;
				overflow: hidden;
			}

			.fill {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				margin: 0;
			}
		</style>
		<meta name="generator" content="<?php printf( 'Web Stories %s', esc_attr( WEBSTORIES_VERSION ) ); ?>" />
		<?php

		/**
		 * Prints scripts or data in the head tag on the front end.
		 *
		 * @since 1.3
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
	 * Adds square, and landscape poster images to the <amp-story>.
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function add_poster_images( $content ) {
		$poster_images = Media::get_story_meta_images( $this->post );
		unset( $poster_images['poster-portrait'] ); // Already exists.
		foreach ( $poster_images as $attr => $url ) {
			$attr_markup = sprintf( '%1$s-src="%2$s"', $attr, $url );
			$content     = str_replace( 'poster-portrait-src=', $attr_markup . ' poster-portrait-src=', $content );
		}

		return $content;
	}

	/**
	 * Renders the story.
	 *
	 * @return string The complete HTML markup for the story.
	 */
	public function render() {
		$markup = $this->post->post_content;
		$markup = $this->replace_html_start_tag( $markup );
		$markup = $this->replace_html_head( $markup );
		$markup = $this->add_poster_images( $markup );

		return $markup;
	}
}
