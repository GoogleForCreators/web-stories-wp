<?php
/**
 * Class Cross_Origin_Isolation.
 *
 * Check if editor screen, add cross origin header and add crossorigin attribute to tags.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Context;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\User\Preferences;

/**
 * Class Cross_Origin_Isolation
 */
class Cross_Origin_Isolation extends Service_Base implements HasRequirements {
	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Preferences instance.
	 *
	 * @var Preferences Preferences instance.
	 */
	private $preferences;

	/**
	 * Constructor.
	 *
	 * @since 1.14.0
	 *
	 * @param Preferences $preferences Preferences instance.
	 * @param Context     $context     Context instance.
	 */
	public function __construct( Preferences $preferences, Context $context ) {
		$this->preferences = $preferences;
		$this->context     = $context;
	}

	/**
	 * Init
	 */
	public function register(): void {
		if ( ! $this->context->is_story_editor() ) {
			return;
		}

		add_action( 'load-post.php', [ $this, 'admin_header' ] );
		add_action( 'load-post-new.php', [ $this, 'admin_header' ] );
		add_filter( 'style_loader_tag', [ $this, 'style_loader_tag' ], 10, 3 );
		add_filter( 'script_loader_tag', [ $this, 'script_loader_tag' ], 10, 3 );
		add_filter( 'get_avatar', [ $this, 'get_avatar' ], 10, 6 );
		add_action( 'wp_enqueue_media', [ $this, 'override_media_templates' ] );
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'current_screen';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		return 11;
	}

	/**
	 * Determines whether "full" cross-origin isolation is needed.
	 *
	 * By default, `crossorigin="anonymous"` attributes are added to all external
	 * resources to make sure they can be accessed programmatically (e.g. by html-to-image).
	 *
	 * However, actual cross-origin isolation by sending COOP and COEP headers is only
	 * needed when video optimization is enabled
	 *
	 * @since 1.14.0
	 *
	 * @link https://github.com/googleforcreators/web-stories-wp/issues/9327
	 * @link https://web.dev/coop-coep/
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	private function needs_isolation(): bool {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return false;
		}

		// Cross-origin isolation is not needed if users can't upload files anyway.
		if ( ! user_can( $user_id, 'upload_files' ) ) {
			return false;
		}

		/**
		 * Whether the user has opted in to video optimization.
		 *
		 * @var string|bool $preference
		 */
		$preference = $this->preferences->get_preference( $user_id, $this->preferences::MEDIA_OPTIMIZATION_META_KEY );

		return rest_sanitize_boolean( $preference );
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * @since 1.12.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'user_preferences' ];
	}

	/**
	 * Start output buffer to add headers and `crossorigin` attribute everywhere.
	 *
	 * @since 1.6.0
	 */
	public function admin_header(): void {
		if ( $this->needs_isolation() ) {
			header( 'Cross-Origin-Opener-Policy: same-origin' );
			header( 'Cross-Origin-Embedder-Policy: require-corp' );
		}

		ob_start( [ $this, 'replace_in_dom' ] );
	}

	/**
	 * Process a html string and add attribute attributes to required tags.
	 *
	 * @since 1.6.0
	 *
	 * @param string $html HTML document as string.
	 * @return string Processed HTML document.
	 */
	protected function replace_in_dom( string $html ): string {
		$site_url = site_url();

		// See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin.
		$tags = [
			'audio',
			'img',
			'link',
			'script',
			'video',
		];

		$tags      = implode( '|', $tags );
		$matches   = [];
		$processed = [];

		if ( preg_match_all( '#<(?P<tag>' . $tags . ')[^<]*?(?:>[\s\S]*?</(?P=tag)>|\s*/>)#', $html, $matches ) ) {

			/**
			 * Single match.
			 *
			 * @var string $match
			 */
			foreach ( $matches[0] as $index => $match ) {
				$tag = $matches['tag'][ $index ];

				if ( false !== strpos( $match, ' crossorigin=' ) ) {
					continue;
				}

				$match_value = [];
				if ( ! preg_match( '/(src|href)=("([^"]+)"|\'([^\']+)\')/', $match, $match_value ) ) {
					continue;
				}

				$attribute = $match_value[1];
				$value     = $match_value[4] ?? $match_value[3];
				$cache_key = ( 'video' === $tag || 'audio' === $tag ) ? $tag : $attribute;

				// If already processed tag/attribute and value before, skip.
				if ( isset( $processed[ $cache_key ] ) && \in_array( $value, $processed[ $cache_key ], true ) ) {
					continue;
				}

				$processed[ $cache_key ][] = $value;

				// The only tags that can have <source> children.
				if ( 'video' === $tag || 'audio' === $tag ) {
					if ( ! $this->starts_with( $value, $site_url ) && ! $this->starts_with( $value, '/' ) ) {
						$html = str_replace( $match, str_replace( '<' . $tag, '<' . $tag . ' crossorigin="anonymous"', $match ), $html );
					}
				} else {
					/**
					 * Modified HTML.
					 *
					 * @var string $html
					 */
					$html = $this->add_attribute( $html, $attribute, $value );
				}
			}
		}

		return $html;
	}

	/**
	 * Filters the HTML link tag of an enqueued style.
	 *
	 * @since 1.6.0
	 *
	 * @param string $tag    The link tag for the enqueued style.
	 * @param string $handle The style's registered handle.
	 * @param string $href   The stylesheet's source URL.
	 * @return string|mixed
	 */
	public function style_loader_tag( $tag, $handle, $href ) {
		return $this->add_attribute( $tag, 'href', $href );
	}

	/**
	 * Filters the HTML script tag of an enqueued script.
	 *
	 * @since 1.6.0
	 *
	 * @param string|mixed $tag The `<script>` tag for the enqueued script.
	 * @param string       $handle    The script's registered handle.
	 * @param string       $src       The script's source URL.
	 * @return string|mixed The filtered script tag.
	 */
	public function script_loader_tag( $tag, $handle, $src ) {
		return $this->add_attribute( $tag, 'src', $src );
	}

	/**
	 * Filter the avatar tag.
	 *
	 * @since 1.6.0
	 *
	 * @param string|mixed        $avatar      HTML for the user's avatar.
	 * @param mixed               $id_or_email The avatar to retrieve. Accepts a user_id, Gravatar MD5 hash,
	 *                                         user email, WP_User object, WP_Post object, or WP_Comment object.
	 * @param int                 $size        Square avatar width and height in pixels to retrieve.
	 * @param string              $default     URL for the default image or a default type. Accepts '404', 'retro', 'monsterid',
	 *                                         'wavatar', 'indenticon', 'mystery', 'mm', 'mysteryman', 'blank', or
	 *                                         'gravatar_default'. Default is the value of the 'avatar_default' option, with a
	 *                                         fallback of 'mystery'.
	 * @param string              $alt         Alternative text to use in the avatar image tag. Default empty.
	 * @param array<string,mixed> $args        Arguments passed to get_avatar_data(), after processing.
	 * @return string|mixed Filtered avatar tag.
	 */
	public function get_avatar( $avatar, $id_or_email, $size, $default, $alt, array $args ) {
		return $this->add_attribute( $avatar, 'src', $args['url'] );
	}

	/**
	 * Do replacement to add crossorigin attribute.
	 *
	 * @since 1.6.0
	 *
	 * @param string|mixed      $html HTML string.
	 * @param string            $attribute Attribute to check for.
	 * @param string|null|mixed $url URL.
	 * @return string|mixed Filtered HTML string.
	 */
	protected function add_attribute( $html, string $attribute, $url ) {
		/**
		 * URL.
		 *
		 * @var string $url
		 */
		if ( ! $url || ! \is_string( $html ) ) {
			return $html;
		}

		$site_url = site_url();
		$url      = esc_url( $url );

		if ( $this->starts_with( $url, $site_url ) ) {
			return $html;
		}

		if ( $this->starts_with( $url, '/' ) ) {
			return $html;
		}

		$new_html = str_replace(
			[
				$attribute . '="' . $url . '"',
				"{$attribute}='{$url}'",
			],
			[
				'crossorigin="anonymous" ' . $attribute . '="' . $url . '"',
				"crossorigin='anonymous' {$attribute}='{$url}'",
			],
			$html
		);

		return $new_html;
	}

	/**
	 * Unhook wp_print_media_templates and replace with custom media templates.
	 *
	 * @since 1.8.0
	 */
	public function override_media_templates(): void {
		remove_action( 'admin_footer', 'wp_print_media_templates' );
		add_action( 'admin_footer', [ $this, 'custom_print_media_templates' ] );
	}

	/**
	 * Add crossorigin attribute to all tags that could have assets loaded from a different domain.
	 *
	 * @since 1.8.0
	 */
	public function custom_print_media_templates(): void {
		ob_start();
		wp_print_media_templates();
		$html = (string) ob_get_clean();

		$tags = [
			'audio',
			'img',
			'video',
		];
		foreach ( $tags as $tag ) {
			$html = (string) str_replace( '<' . $tag, '<' . $tag . ' crossorigin="anonymous"', $html );
		}

		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Does string start with.
	 *
	 * @since 1.6.0
	 *
	 * @param string $string       String to search.
	 * @param string $start_string String to search with.
	 */
	private function starts_with( string $string, string $start_string ): bool {
		return 0 === strpos( $string, $start_string );
	}
}
