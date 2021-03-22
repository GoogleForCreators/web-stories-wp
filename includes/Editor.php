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

		if( ! $document ){
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
				$html = str_replace( "{$attribute}='{$url}'", "crossorigin {$attribute}='{$url}'", $html );
			}
		}

		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Does string start with.
	 *
	 * @param string $string String to search.
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
