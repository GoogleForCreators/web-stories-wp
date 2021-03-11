<?php
/**
 * Class Embed_Block.
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

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Renderer\Image;
use Google\Web_Stories\Story_Renderer\Embed;
use Google\Web_Stories\Traits\Assets;

/**
 * Embed block class.
 */
class Embed_Base {
	use Assets;

	/**
	 * Player script handle.
	 *
	 * @var string
	 */
	const STORY_PLAYER_HANDLE = 'standalone-amp-story-player';

	/**
	 * Script handle for frontend assets.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-embed';

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	public function init() {
		wp_register_script( self::STORY_PLAYER_HANDLE, 'https://cdn.ampproject.org/amp-story-player-v0.js', [], 'v0', false );
		wp_register_style( self::STORY_PLAYER_HANDLE, 'https://cdn.ampproject.org/amp-story-player-v0.css', [], 'v0' );

		$this->register_style( self::SCRIPT_HANDLE );
		// Set a style without a `src` allows us to just use the inline style below
		// without needing an external stylesheet.
		wp_styles()->registered[ self::SCRIPT_HANDLE ]->src = false;

		$path = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/css/' . self::SCRIPT_HANDLE . '.css';
		if ( is_rtl() ) {
			$path = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/css/' . self::SCRIPT_HANDLE . '-rtl.css';
		}

		if ( is_readable( $path ) ) {
			$css = file_get_contents( $path );

			if ( $css ) {
				wp_add_inline_style( self::SCRIPT_HANDLE, $css );
			}
		}

		add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10, 2 );
	}

	/**
	 * Filter the allowed tags for KSES to allow for amp-story children.
	 *
	 * @since 1.0.0
	 *
	 * @param array|string $allowed_tags Allowed tags.
	 *
	 * @return array|string Allowed tags.
	 */
	public function filter_kses_allowed_html( $allowed_tags ) {
		if ( ! is_array( $allowed_tags ) ) {
			return $allowed_tags;
		}

		$story_player_components = [
			'amp-story-player' => [],
		];

		$allowed_tags = array_merge( $allowed_tags, $story_player_components );

		return $allowed_tags;
	}

	/**
	 * Return an array of default attributes.
	 *
	 * @since 1.1.0
	 *
	 * @return array
	 */
	protected function default_attrs() {
		$attrs = [
			'align'  => 'none',
			'height' => 600,
			'poster' => '',
			'url'    => '',
			'title'  => '',
			'width'  => 360,
		];

		/**
		 * Filters settings passed to the web stories embed.
		 *
		 * @since 1.1.0
		 *
		 * @param array $attrs Array of settings passed to web stories embed.
		 */
		return apply_filters( 'web_stories_embed_default_attributes', $attrs );
	}

	/**
	 * Renders an embed with given attributes.
	 *
	 * @since 1.1.0
	 *
	 * @param array $attributes Embed render attributes.
	 *
	 * @return string Rendered embed output.
	 */
	public function render( array $attributes ) {
		// The only mandatory attribute.
		if ( empty( $attributes['url'] ) ) {
			return '';
		}

		if ( empty( $attributes['title'] ) ) {
			$attributes['title'] = __( 'Web Story', 'web-stories' );
		}

		$data = [
			'title'           => $attributes['title'],
			'url'             => $attributes['url'],
			'poster_portrait' => $attributes['poster'],
		];

		$story = new Story( $data );

		if ( is_feed() ) {
			$renderer = new Image( $story );
		} else {
			$renderer = new Embed( $story );
		}

		return $renderer->render( $attributes );
	}

}
