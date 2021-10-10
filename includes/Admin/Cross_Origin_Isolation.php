<?php
/**
 * Class Cross_Origin_Isolation.
 *
 * Check if editor screen, add cross origin header and add crossorigin attribute to tags.
 *
 * @package   Google\Web_Stories\Traits
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

use Google\Web_Stories\Infrastructure\Conditional;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Services;
use Google\Web_Stories\Traits\Screen;
use Google\Web_Stories\User\Preferences;

/**
 * Class Cross_Origin_Isolation
 *
 * @package Google\Web_Stories
 */
class Cross_Origin_Isolation extends Service_Base implements Conditional, HasRequirements {
	use Screen;

	/**
	 * Init
	 *
	 * @return void
	 */
	public function register() {
		if ( ! $this->is_edit_screen() ) {
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
	 * Check whether the conditional object is currently needed.
	 *
	 * @since 1.6.0
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	public static function is_needed(): bool {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return false;
		}

		// Cross-origin isolation is not needed if users can't upload files anyway.
		if ( ! user_can( $user_id, 'upload_files' ) ) {
			return false;
		}

		$user_preferences = Services::get( 'user_preferences' );

		return rest_sanitize_boolean(
			$user_preferences->get_preference( $user_id, $user_preferences::MEDIA_OPTIMIZATION_META_KEY )
		);
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the service is used in the static `is_needed()` method.
	 *
	 * @since 1.12.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'user_preferences' ];
	}

	/**
	 * Start output buffer and add headers.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function admin_header() {
		header( 'Cross-Origin-Opener-Policy: same-origin' );
		header( 'Cross-Origin-Embedder-Policy: require-corp' );

		ob_start( [ $this, 'replace_in_dom' ] );
	}

	/**
	 * Process a html string and add attribute attributes to required tags.
	 *
	 * @since 1.6.0
	 *
	 * @param string $html HTML document as string.
	 *
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
				if ( isset( $processed[ $cache_key ] ) && in_array( $value, $processed[ $cache_key ], true ) ) {
					continue;
				}

				$processed[ $cache_key ][] = $value;

				// The only tags that can have <source> children.
				if ( 'video' === $tag || 'audio' === $tag ) {
					if ( ! $this->starts_with( $value, $site_url ) && ! $this->starts_with( $value, '/' ) ) {
						$html = str_replace( $match, str_replace( '<' . $tag, '<' . $tag . ' crossorigin="anonymous"', $match ), $html );
					}
				} else {
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
	 *
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
	 *
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
	 * @param string|mixed $avatar      HTML for the user's avatar.
	 * @param mixed        $id_or_email The avatar to retrieve. Accepts a user_id, Gravatar MD5 hash,
	 *                                  user email, WP_User object, WP_Post object, or WP_Comment object.
	 * @param int          $size        Square avatar width and height in pixels to retrieve.
	 * @param string       $default     URL for the default image or a default type. Accepts '404', 'retro', 'monsterid',
	 *                                  'wavatar', 'indenticon', 'mystery', 'mm', 'mysteryman', 'blank', or
	 *                                  'gravatar_default'. Default is the value of the 'avatar_default' option, with a
	 *                                  fallback of 'mystery'.
	 * @param string       $alt         Alternative text to use in the avatar image tag. Default empty.
	 * @param array        $args        Arguments passed to get_avatar_data(), after processing.
	 *
	 * @return string|mixed
	 */
	public function get_avatar( $avatar, $id_or_email, $size, $default, $alt, array $args ) {
		return $this->add_attribute( $avatar, 'src', $args['url'] );
	}

	/**
	 * Do replacement to add crossorigin attribute.
	 *
	 * @since 1.6.0
	 *
	 * @param string|mixed $html HTML string.
	 * @param string       $attribute Attribute to check for.
	 * @param string|null  $url URL.
	 *
	 * @return string|mixed
	 */
	protected function add_attribute( $html, string $attribute, $url ) {
		if ( ! $url ) {
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

		$new_html = (string) str_replace( $attribute . '="' . $url . '"', 'crossorigin="anonymous" ' . $attribute . '="' . $url . '"', $html );
		$new_html = (string) str_replace( "{$attribute}='{$url}'", "crossorigin='anonymous' {$attribute}='{$url}'", $new_html );

		return $new_html;
	}

	/**
	 * Unhook wp_print_media_templates and replace with custom media templates.
	 *
	 * @since 1.8.0
	 *
	 * @return void
	 */
	public function override_media_templates() {
		remove_action( 'admin_footer', 'wp_print_media_templates' );
		add_action( 'admin_footer', [ $this, 'custom_print_media_templates' ] );
	}

	/**
	 * Add crossorigin attribute to all tags that could have assets loaded from a different domain.
	 *
	 * @since 1.8.0
	 *
	 * @return void
	 */
	public function custom_print_media_templates() {
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
	 *
	 * @return bool
	 */
	private function starts_with( string $string, string $start_string ): bool {
		return 0 === strpos( $string, $start_string );
	}
}
