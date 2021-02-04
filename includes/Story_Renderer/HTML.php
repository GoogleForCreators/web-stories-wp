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

use AmpProject\Dom\Document as AMP_Document;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories\Traits\Publisher;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\AMP\Integration\AMP_Story_Sanitizer;
use Google\Web_Stories\AMP\Story_Sanitizer;
use Google\Web_Stories\AMP\Optimization;
use Google\Web_Stories\AMP\Sanitization;

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
	 * HTML constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Story $story Story object.
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
		$markup = $this->display_admin_bar( $markup );
		$markup = $this->replace_html_head( $markup );
		$markup = $this->replace_url_scheme( $markup );
		$markup = $this->print_analytics( $markup );
		$markup = $this->print_bookend( $markup );

		// If the AMP plugin is installed and available in a version >= than ours,
		// all sanitization and optimization should be delegated to the AMP plugin.
		if ( defined( '\AMP__VERSION' ) && version_compare( AMP__VERSION, WEBSTORIES_AMP_VERSION, '>=' ) ) {
			return $markup;
		}

		$document = Document::fromHtml( $markup );

		// This  should never actually happen.
		if ( ! $document ) {
			ob_start();
			wp_die(
				esc_html__( 'There was an error generating the web story, probably because of a server misconfiguration. Try contacting your hosting provider or open a new support request.', 'web-stories' ),
				esc_html__( 'Web Stories', 'web-stories' ),
				[
					'response'  => 500,
					'link_url'  => esc_url( __( 'https://wordpress.org/support/plugin/web-stories/', 'web-stories' ) ),
					'link_text' => esc_html__( 'Visit Support Forums', 'web-stories' ),
					'exit'      => false,
				]
			);

			return (string) ob_get_clean();
		}

		add_filter( 'web_stories_amp_sanitizers', [ $this, 'add_web_stories_amp_content_sanitizers' ] );

		/**
		 * Document instance.
		 *
		 * @var Document $document
		 */
		$this->document = $document;

		$this->sanitize_markup();
		$this->optimize_markup();

		return trim( (string) $this->document->saveHTML() );
	}

	/**
	 * Filters the Web Stories AMP sanitizers.
	 *
	 * @since 1.1.0
	 *
	 * @param array $sanitizers Sanitizers.
	 * @return array Sanitizers.
	 */
	public function add_web_stories_amp_content_sanitizers( $sanitizers ) {
		$sanitizers[ Story_Sanitizer::class ] = [
			'publisher_logo'             => $this->get_publisher_logo(),
			'publisher_logo_placeholder' => $this->get_publisher_logo_placeholder(),
			'poster_images'              => $this->get_poster_images(),
		];

		return $sanitizers;
	}

	/**
	 * Filters the AMP plugin's sanitizers.
	 *
	 * @since 1.1.0
	 *
	 * @param array $sanitizers Sanitizers.
	 * @return array Sanitizers.
	 */
	public function add_amp_content_sanitizers( $sanitizers ) {
		$sanitizers[ AMP_Story_Sanitizer::class ] = [
			'publisher_logo'             => $this->get_publisher_logo(),
			'publisher_logo_placeholder' => $this->get_publisher_logo_placeholder(),
			'poster_images'              => $this->get_poster_images(),
		];

		return $sanitizers;
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

		if ( is_admin_bar_showing() && is_user_logged_in() ) {
			// Printing scripts here is done primarily for the benefit of the admin bar.
			// Note that wp_enqueue_scripts() is not called.
			wp_styles()->do_items();
			wp_print_head_scripts();
			wp_print_footer_scripts();
			?>
			<style media="screen" id="admin-bar-inline-css">
				amp-story {
					top: 32px !important;
				}

				@media screen and ( max-width: 782px ) {
					amp-story {
						top: 46px !important;
					}
				}
			</style>
			<?php
		}

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

		// Replace malformed meta tags with correct tags.
		$content = (string) preg_replace( '/<meta name="web-stories-replace-head-start\s?"\s?\/>/i', $start_tag, $content );
		$content = (string) preg_replace( '/<meta name="web-stories-replace-head-end\s?"\s?\/>/i', $end_tag, $content );

		$start_tag_pos = strpos( $content, $start_tag );
		$end_tag_pos   = strpos( $content, $end_tag );

		if ( false !== $start_tag_pos && false !== $end_tag_pos ) {
			$end_tag_pos += strlen( $end_tag );
			$content      = substr_replace( $content, $this->get_html_head_markup(), $start_tag_pos, $end_tag_pos - $start_tag_pos );
		}

		return $content;
	}

	/**
	 * Displays the WordPress admin bar on the frontend.
	 *
	 * @since 1.2.0
	 *
	 * @param string $content Story markup.
	 *
	 * @return string Filtered content.
	 */
	protected function display_admin_bar( $content ) {
		ob_start();

		wp_admin_bar_render();

		$output = (string) ob_get_clean();

		return str_replace( '<body>', '<body>' . $output, $content );
	}

	/**
	 * Prints the admin bar styles.
	 *
	 * Does not rely on theme support for the admin bar
	 * or the default admin bar styling callback
	 * since Web Stories are theme-independent and require
	 * specific styling.
	 *
	 * @since 1.2.0
	 *
	 * @see _admin_bar_bump_cb
	 *
	 * @param Document|AMP_Document $document Document instance.
	 * @return void
	 */
	protected function add_admin_bar_styles( &$document ) {
		ob_start();

		wp_styles()->do_items();

		?>
		<style media="screen" id="admin-bar-inline-css">
			amp-story { top: 32px !important; }
			@media screen and ( max-width: 782px ) {
				amp-story { top: 46px !important; }
			}
		</style>
		<?php

		$output = (string) ob_get_clean();

		if ( empty( $output ) ) {
			return;
		}

		$fragment          = $document->createDocumentFragment();
		$fragment_document = Document::fromHtmlFragment( $output );

		if ( $fragment_document ) {
			while ( $fragment_document->body->firstChild ) {
				$node = $fragment_document->body->removeChild( $fragment_document->body->firstChild );
				$node = $document->importNode( $node, true );
				$fragment->appendChild( $node );
			}
		}

		$document->head->appendChild( $fragment );
	}

	/**
	 * Force home urls to http / https based on context.
	 *
	 * @since 1.1.0
	 *
	 * @param string $content String to replace.
	 *
	 * @return string
	 */
	protected function replace_url_scheme( $content ) {
		if ( is_ssl() ) {
			$search  = home_url( '', 'http' );
			$replace = home_url( '', 'https' );
			$content = str_replace( $search, $replace, $content );
		}

		return $content;
	}

	/**
	 * Print analytics code before closing `</amp-story>`.
	 *
	 * @since 1.2.0
	 *
	 * @param string $content String to replace.
	 *
	 * @return string
	 */
	protected function print_analytics( $content ) {
		ob_start();

		/**
		 * Fires before the closing <amp-story> tag.
		 *
		 * Can be used to print <amp-analytics> configuration.
		 *
		 * @since 1.1.0
		 */
		do_action( 'web_stories_print_analytics' );

		$output = (string) ob_get_clean();

		return str_replace( '</amp-story>', $output . '</amp-story>', $content );
	}

	/**
	 * Print amp-story-bookend before closing `</amp-story>`.
	 *
	 * @since 1.3.0
	 *
	 * @param string $content String to replace.
	 *
	 * @return string
	 */
	protected function print_bookend( $content ) {
		$share_providers = [
			[
				'provider' => 'twitter',
			],
			[
				'provider' => 'linkedin',
			],
			[
				'provider' => 'email',
			],
			[
				'provider' => 'system',
			],
		];

		/**
		 * Filters the list of sharing providers in the Web Stories sharing dialog.
		 *
		 * @since 1.3.0
		 *
		 * @link https://amp.dev/documentation/components/amp-story-bookend/#social-sharing
		 * @link https://amp.dev/documentation/components/amp-social-share/?format=stories#pre-configured-providers
		 *
		 * @param array[] $share_providers List of sharing providers.
		 */
		$share_providers = (array) apply_filters( 'web_stories_share_providers', $share_providers );

		if ( empty( $share_providers ) ) {
			return $content;
		}

		$config  = [
			'bookendVersion' => 'v1.0',
			'shareProviders' => $share_providers,
		];
		$bookend = sprintf(
			'<amp-story-bookend layout="nodisplay"><script type="application/json">%s</script></amp-story-bookend>',
			wp_json_encode( $config )
		);

		return str_replace( '</amp-story>', $bookend . '</amp-story>', $content );
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
