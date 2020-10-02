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

use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use DOMElement;
use Google\Web_Stories\AMP\Optimization;
use Google\Web_Stories\AMP\Sanitization;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Traits\Publisher;

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
	 * Document instance.
	 *
	 * @var Document Document instance.
	 */
	protected $document;

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
		$markup = $this->story->get_markup();
		$markup = $this->replace_html_head( $markup );

		// TODO: What if transformation failed?
		$document = Document::fromHtml( $markup, get_bloginfo( 'charset' ) );

		// This  should never actually happen.
		if ( ! $document ) {
			wp_die(
				esc_html__( 'There was an error generating the web story, probably because of a server misconfiguration. Try contacting your hosting provider or open a new support request.', 'web-stories' ),
				esc_html__( 'Web Stories', 'web-stories' ),
				[
					'response'  => 500,
					'link_url'  => esc_url( __( 'https://wordpress.org/support/plugin/web-stories/', 'web-stories' ) ),
					'link_text' => esc_html__( 'Visit Support Forums', 'web-stories' ),
				]
			);
		}

		/**
		 * Document instance.
		 *
		 * @var Document $document
		 */
		$this->document = $document;

		// Run all further transformations on the Document instance.
		// These need to run before sanitization so it works even when
		// sanitization is done by the AMP plugin.

		$this->transform_html_start_tag();
		$this->transform_a_tags();
		$this->insert_analytics_configuration();
		$this->add_publisher_logo();
		$this->add_poster_images();

		// If the AMP plugin is installed and available in a version >= than ours,
		// all sanitization and optimization should be delegated to the AMP plugin.
		if ( ! defined( '\AMP__VERSION' ) || version_compare( AMP__VERSION, WEBSTORIES_AMP_VERSION, '<' ) ) {
			$this->sanitize_markup();
			$this->optimize_markup();
		}

		return trim( (string) $this->document->saveHTML() );
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
		$this->document->html->setAttribute( 'amp', '' );

		// See get_language_attributes().
		if ( is_rtl() ) {
			$this->document->html->setAttribute( 'dir', 'rtl' );
		}

		$lang = get_bloginfo( 'language' );
		if ( $lang ) {
			$this->document->html->setAttribute( 'lang', esc_attr( $lang ) );
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

		// Add a publisher logo if missing or just a placeholder.
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

	/**
	 * Sanitizes markup to be valid AMP.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	protected function sanitize_markup() {
		$sanitization = new Sanitization();
		$sanitization->sanitize_document( $this->document );
	}

	/**
	 * Optimizes AMP markup.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	protected function optimize_markup() {
		$optimization = new Optimization();
		$optimization->optimize_document( $this->document );
	}
}
