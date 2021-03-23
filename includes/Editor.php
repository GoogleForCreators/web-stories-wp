<?php
/**
 * Class editor.
 *
 * Editor class, with output buffer.
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


namespace Google\Web_Stories;

use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;

/**
 * Class Editor
 *
 * @package Google\Web_Stories
 */
class Editor {
	/**
	 * Init
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_footer-post.php', [ $this, 'admin_footer' ] );
		add_action( 'admin_footer-post-new.php', [ $this, 'admin_footer' ] );
		add_action( 'load-post.php', [ $this, 'admin_header' ] );
		add_action( 'load-post-new.php', [ $this, 'admin_header' ] );
		add_filter( 'style_loader_tag', [ $this, 'style_loader_tag' ], 10, 3 );
		add_filter( 'script_loader_tag', [ $this, 'script_loader_tag' ], 10, 3 );
		add_filter( 'get_avatar', [ $this, 'get_avatar' ], 10, 6 );
	}

	/**
	 * Start output buffer and add headers.
	 *
	 * @return void
	 */
	public function admin_header() {
		$screen = $this->get_current_screen();
		if ( ! $screen ) {
			return;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return;
		}

		header( 'Cross-Origin-Opener-Policy: same-origin' );
		header( 'Cross-Origin-Embedder-Policy: require-corp' );

		ob_start();
	}

	/**
	 * Do string replacement and output.
	 *
	 * @return void
	 */
	public function admin_footer() {
		$screen = $this->get_current_screen();
		if ( ! $screen ) {
			return;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return;
		}

		$html = (string) ob_get_clean();

		$document = Document::fromHtml( $html );

		if ( ! $document ) {
			return;
		}

		$map = [
			'link'   => 'href',
			'img'    => 'src',
			'script' => 'src',
		];

		$site_url = site_url();

		foreach ( $map as $tag => $attribute ) {
			$tags = $document->getElementsByTagName( $tag );
			foreach ( $tags as $node ) {
				$value = $node->getAttribute( $attribute );
				if ( ! $value ) {
					continue;
				}

				$cross_origin = $node->getAttribute( 'crossorigin' );

				if ( $cross_origin ) {
					continue;
				}

				if ( $this->starts_with( $value, $site_url ) ) {
					continue;
				}

				if ( $this->starts_with( $value, '/' ) ) {
					continue;
				}

				$url  = esc_url( $value );
				$html = str_replace( "{$attribute}='{$url}'", "crossorigin='anonymous' {$attribute}='{$url}'", $html );
			}
		}

		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Filters the HTML link tag of an enqueued style.
	 *
	 * @param string $tag    The link tag for the enqueued style.
	 * @param string $handle The style's registered handle.
	 * @param string $href   The stylesheet's source URL.
	 *
	 * @return string
	 */
	public function style_loader_tag( $tag, $handle, $href ) {
		$screen = $this->get_current_screen();
		if ( ! $screen ) {
			return $tag;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return $tag;
		}

		$site_url = site_url();

		if ( $this->starts_with( $href, $site_url ) ) {
			return $tag;
		}

		if ( $this->starts_with( $href, '/' ) ) {
			return $tag;
		}

		$tag = str_replace( "href='{$href}'", "crossorigin='anonymous' href='{$href}'", $tag );

		return $tag;
	}

	/**
	 * Filters the HTML script tag of an enqueued script.
	 *
	 * @param string $tag    The `<script>` tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 * @param string $src    The script's source URL.
	 *
	 * @return string
	 */
	public function script_loader_tag( $tag, $handle, $src ) {
		$screen = $this->get_current_screen();
		if ( ! $screen ) {
			return $tag;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return $tag;
		}

		$site_url = site_url();

		if ( $this->starts_with( $src, $site_url ) ) {
			return $tag;
		}

		if ( $this->starts_with( $src, '/' ) ) {
			return $tag;
		}

		$tag = str_replace( "src='{$src}'", "crossorigin='anonymous' src='{$src}'", $tag );

		return $tag;
	}

	/**
	 * Filter the avatar tag.
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
	public function get_avatar( $avatar, $id_or_email, $size, $default, $alt, $args ) {
		$screen = $this->get_current_screen();
		if ( ! $screen ) {
			return $avatar;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return $avatar;
		}
		
		$site_url = site_url();
		$src      = esc_url( $args['url'] );

		if ( $this->starts_with( $src, $site_url ) ) {
			return $avatar;
		}

		if ( $this->starts_with( $src, '/' ) ) {
			return $avatar;
		}

		$avatar = str_replace( "src='{$src}'", "crossorigin='anonymous' src='{$src}'", $avatar );

		return $avatar;
	}

	/**
	 * Does string start with.
	 *
	 * @param string $string       String to search.
	 * @param string $start_string String to search with.
	 *
	 * @return bool
	 */
	private function starts_with( $string, $start_string ) {
		$len = strlen( $start_string );

		return ( substr( $string, 0, $len ) === $start_string );
	}

	/**
	 * Helper to get current screen.
	 *
	 * @return false|\WP_Screen
	 */
	private function get_current_screen() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( ( $screen instanceof \WP_Screen ) ) {
			return $screen;
		}

		return false;
	}
}
