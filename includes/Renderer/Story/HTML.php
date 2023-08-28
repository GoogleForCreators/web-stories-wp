<?php
/**
 * Class HTML
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

declare(strict_types = 1);

namespace Google\Web_Stories\Renderer\Story;

use Google\Web_Stories\Model\Story;

/**
 * Class HTML
 */
class HTML {
	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected Story $story;

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
	public function render(): string {
		$markup = $this->story->get_markup();
		$markup = $this->fix_incorrect_charset( $markup );
		$markup = $this->fix_malformed_script_link_tags( $markup );
		$markup = $this->replace_html_head( $markup );
		$markup = wp_replace_insecure_home_url( $markup );
		$markup = $this->print_analytics( $markup );
		$markup = $this->print_social_share( $markup );

		return $markup;
	}

	/**
	 * Fix incorrect <meta charset> tags.
	 *
	 * React/JSX outputs the charset attribute name as "charSet",
	 * but libdom and the AMP toolbox only recognize lowercase "charset"
	 *
	 * @since 1.28.0
	 *
	 * @param string $content Story markup.
	 * @return string Filtered content
	 */
	public function fix_incorrect_charset( string $content ): string {
		return (string) preg_replace( '/<meta charSet="utf-8"\s?\/>/i', '<meta charset="utf-8"/>', $content );
	}

	/**
	 * Fix malformed <a> tags in the <head>.
	 *
	 * On certain environments like WordPress.com VIP, there is additional KSES
	 * hardening that prevents saving `<script>` tags to the database, despite
	 * this plugin allowing them ({@see KSES}).
	 *
	 * There, script tags somehow get transformed to `<a>` tags before saving
	 * to the database.
	 * This of course breaks the markup completely as `<a>` is not allowed in the `<head>`,
	 * thus the  DOMDocument parser moves them to the `<body>`, breaking the DOM structure.
	 *
	 * Since we cannot prevent the broken `<a>`/`<script>` tags upon saving
	 * and not during sanitization, this method is an attempt to fix them
	 * *before* they're sanitized.
	 *
	 * Turns `<a href="https://cdn.ampproject.org/v0.js">https://cdn.ampproject.org/v0.js</a>`
	 * into `<script async src="https://cdn.ampproject.org/v0.js"></script>`
	 * and `<a href="https://cdn.ampproject.org/v0/amp-story-1.0.js">https://cdn.ampproject.org/v0/amp-story-1.0.js</a>`
	 * into `<script async src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>`.
	 *
	 * @since 1.13.0
	 *
	 * @param string $content Story markup.
	 * @return string Filtered content
	 */
	protected function fix_malformed_script_link_tags( string $content ): string {
		$replaced_content = preg_replace_callback(
			'/<a[^>]+href="(?P<href>[^"]+)"[^>]*>\1<\/a>/m',
			static function ( $matches ) {
				if ( str_starts_with( $matches['href'], 'https://cdn.ampproject.org/' ) ) {
					$script_url = $matches['href'];

					// Turns `<a href="https://cdn.ampproject.org/v0.js">https://cdn.ampproject.org/v0.js</a>`
					// into `<script async src="https://cdn.ampproject.org/v0.js"></script>`.
					if ( 'https://cdn.ampproject.org/v0.js' === $script_url ) {
						return "<script async src=\"$script_url\"></script>"; // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
					}

					// Extract 'amp-story' from 'https://cdn.ampproject.org/v0/amp-story-1.0.js'.
					$sub_matches = [];
					preg_match( '/v0\/(?P<custom_element>[\w-]+)-[\d.]+\.js/', $script_url, $sub_matches );
					$custom_element = $sub_matches['custom_element'];

					// Turns `<a href="https://cdn.ampproject.org/v0/amp-story-1.0.js">https://cdn.ampproject.org/v0/amp-story-1.0.js</a>`
					// into <script async src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>.
					return "<script async src=\"$script_url\" custom-element=\"$custom_element\"></script>"; // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
				}

				return $matches[0];
			},
			$content
		);

		// On errors the return value of preg_replace_callback() is null.
		return $replaced_content ?: $content;
	}

	/**
	 * Returns the full HTML <head> markup for a given story besides boilerplate.
	 *
	 * @since 1.0.0
	 *
	 * @return string Filtered content.
	 */
	protected function get_html_head_markup(): string {
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
	 * @return string Filtered content.
	 */
	protected function replace_html_head( string $content ): string {
		$start_tag = '<meta name="web-stories-replace-head-start"/>';
		$end_tag   = '<meta name="web-stories-replace-head-end"/>';

		// Replace malformed meta tags with correct tags.
		$content = (string) preg_replace( '/<meta name="web-stories-replace-head-start\s?"\s?\/?>/i', $start_tag, $content );
		$content = (string) preg_replace( '/<meta name="web-stories-replace-head-end\s?"\s?\/?>/i', $end_tag, $content );

		$start_tag_pos = strpos( $content, $start_tag );
		$end_tag_pos   = strpos( $content, $end_tag );

		if ( false !== $start_tag_pos && false !== $end_tag_pos ) {
			$end_tag_pos += \strlen( $end_tag );
			$content      = substr_replace( $content, $this->get_html_head_markup(), $start_tag_pos, $end_tag_pos - $start_tag_pos );
		}

		return $content;
	}

	/**
	 * Print analytics code before closing `</amp-story>`.
	 *
	 * @since 1.2.0
	 *
	 * @param string $content String to replace.
	 */
	protected function print_analytics( string $content ): string {
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
	 * Print amp-story-social-share before closing `</amp-story>`.
	 *
	 * @since 1.6.0
	 *
	 * @param string $content String to replace.
	 */
	protected function print_social_share( string $content ): string {
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
		 * @link https://amp.dev/documentation/components/amp-social-share/?format=stories#pre-configured-providers
		 *
		 * @param array[] $share_providers List of sharing providers.
		 */
		$share_providers = apply_filters( 'web_stories_share_providers', $share_providers );

		if ( empty( $share_providers ) ) {
			return $content;
		}

		$config       = [
			'shareProviders' => $share_providers,
		];
		$social_share = sprintf(
			'<amp-story-social-share layout="nodisplay"><script type="application/json">%s</script></amp-story-social-share>',
			wp_json_encode( $config )
		);


		return str_replace( '</amp-story>', $social_share . '</amp-story>', $content );
	}
}
