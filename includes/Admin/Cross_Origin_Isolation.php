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

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Traits\Screen;
use Google\Web_Stories\User\Preferences;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;


/**
 * Class Cross_Origin_Isolation
 *
 * @package Google\Web_Stories
 */
class Cross_Origin_Isolation extends Service_Base {
	use Screen;

	/**
	 * Init
	 *
	 * @return void
	 */
	public function register() {
		if ( ! $this->is_needed() || ! $this->is_edit_screen() ) {
			return;
		}

		add_action( 'admin_footer-post.php', [ $this, 'admin_footer' ] );
		add_action( 'admin_footer-post-new.php', [ $this, 'admin_footer' ] );
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
	public static function get_registration_action() {
		return 'current_screen';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority() {
		return 11;
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

		ob_start();
	}

	/**
	 * Do string replacement and output.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function admin_footer() {
		$html = (string) ob_get_clean();

		echo $this->replace_in_dom( $html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Process a html string and add attribute attributes to required tags.
	 *
	 * @since 1.6.0
	 *
	 * @param string $html HTML document as string.
	 *
	 * @return string
	 */
	protected function replace_in_dom( string $html ) {
		$document = Document::fromHtml( $html );

		if ( ! $document ) {
			return $html;
		}

		$map = [
			'link'   => 'href',
			'img'    => 'src',
			'iframe' => 'src',
			'script' => 'src',
		];

		$processed = [];

		foreach ( $map as $tag => $attribute ) {
			$tags = $document->getElementsByTagName( $tag );
			foreach ( $tags as $node ) {
				$value = $node->getAttribute( $attribute );
				if ( ! $value ) {
					continue;
				}

				// If already processed tag, attribute and value before, skip.
				if ( isset( $processed[ $attribute ] ) && in_array( $value, $processed[ $attribute ], true ) ) {
					continue;
				}

				// Check to see if tag already has attirbute.
				$cross_origin = $node->getAttribute( 'crossorigin' );
				if ( $cross_origin ) {
					continue;
				}

				$processed[ $attribute ][] = $value;

				$html = $this->add_attribute( $html, $attribute, $value );
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
	 * @return string
	 */
	public function style_loader_tag( string $tag, string $handle, string $href ) {
		return $this->add_attribute( $tag, 'href', $href );
	}

	/**
	 * Filters the HTML script tag of an enqueued script.
	 *
	 * @since 1.6.0
	 *
	 * @param string $tag    The `<script>` tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 * @param string $src    The script's source URL.
	 *
	 * @return string
	 */
	public function script_loader_tag( string $tag, string $handle, string $src ) {
		return $this->add_attribute( $tag, 'src', $src );
	}

	/**
	 * Filter the avatar tag.
	 *
	 * @since 1.6.0
	 *
	 * @param string $avatar      HTML for the user's avatar.
	 * @param mixed  $id_or_email The avatar to retrieve. Accepts a user_id, Gravatar MD5 hash,
	 *                            user email, WP_User object, WP_Post object, or WP_Comment object.
	 * @param int    $size        Square avatar width and height in pixels to retrieve.
	 * @param string $default     URL for the default image or a default type. Accepts '404', 'retro', 'monsterid',
	 *                            'wavatar', 'indenticon', 'mystery', 'mm', 'mysteryman', 'blank', or
	 *                            'gravatar_default'. Default is the value of the 'avatar_default' option, with a
	 *                            fallback of 'mystery'.
	 * @param string $alt         Alternative text to use in the avatar image tag. Default empty.
	 * @param array  $args        Arguments passed to get_avatar_data(), after processing.
	 *
	 * @return string
	 */
	public function get_avatar( $avatar, $id_or_email, $size, $default, $alt, array $args ) {
		return $this->add_attribute( $avatar, 'src', $args['url'] );
	}

	/**
	 * Do replacement to add crossorigin attribute.
	 *
	 * @since 1.6.0
	 *
	 * @param string $html HTML string.
	 * @param string $attribute Attribute to check for.
	 * @param string $url URL.
	 *
	 * @return string
	 */
	protected function add_attribute( string $html, string $attribute, string $url ) {
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
	private function starts_with( string $string, string $start_string ) {
		$len = strlen( $start_string );

		return ( substr( $string, 0, $len ) === $start_string );
	}

	/**
	 * Check to see if class is needed.
	 *
	 * @since 1.6.0
	 *
	 * @return bool
	 */
	protected function is_needed() {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return false;
		}

		// Cross-origin isolation is not needed if users can't upload files anyway.
		if ( ! user_can( $user_id, 'upload_files' ) ) {
			return false;
		}

		$check = get_user_meta( $user_id, Preferences::MEDIA_OPTIMIZATION_META_KEY, true );

		return rest_sanitize_boolean( $check );
	}
}
