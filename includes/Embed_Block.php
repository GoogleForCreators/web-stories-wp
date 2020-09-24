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
class Embed_Block {
	use Assets;

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-embed-block';

	/**
	 * Script handle for frontend assets.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE_FRONTEND = 'web-stories-embed-block-fe';

	/**
	 * Block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'web-stories/embed';

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		$this->init_assets();

		// todo: use register_block_type_from_metadata() once generally available.

		// Note: does not use 'script' and 'style' args, and instead uses 'render_callback'
		// to enqueue these assets only when needed.
		register_block_type(
			self::BLOCK_NAME,
			[
				'attributes'      => [
					'url'    => [
						'type' => 'string',
					],
					'title'  => [
						'type'    => 'string',
						'default' => __( 'Web Story', 'web-stories' ),
					],
					'poster' => [
						'type' => 'string',
					],
					'width'  => [
						'type'    => 'number',
						'default' => 360,
					],
					'height' => [
						'type'    => 'number',
						'default' => 600,
					],
					'align'  => [
						'type'    => 'string',
						'default' => 'none',
					],
				],
				'render_callback' => [ $this, 'render_block' ],
				'editor_script'   => self::SCRIPT_HANDLE,
				'editor_style'    => self::SCRIPT_HANDLE,
			]
		);

		add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10, 2 );
	}

	/**
	 * Initializes assets needed for the block.
	 *
	 * Registers scripts and styles for the block itself used in the editor,
	 * as well as the external assets used by the <amp-story-player> web component (non-AMP version).
	 * Also registers an inline stylesheet used on the frontend to ensure correct
	 * styling and responsiveness for the block, which is used for both the regular and the AMP version.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	private function init_assets() {
		wp_register_script( 'standalone-amp-story-player', 'https://cdn.ampproject.org/amp-story-player-v0.js', [], 'v0', false );
		wp_register_style( 'standalone-amp-story-player', 'https://cdn.ampproject.org/amp-story-player-v0.css', [], 'v0' );

		$this->register_script( self::SCRIPT_HANDLE, [ 'standalone-amp-story-player', Tracking::SCRIPT_HANDLE ] );
		$this->register_style( self::SCRIPT_HANDLE, [ 'standalone-amp-story-player' ] );

		// Registering a style without a `src` allows us to just use the inline style below
		// without needing an external stylesheet.
		wp_register_style(
			self::SCRIPT_HANDLE_FRONTEND,
			'',
			[],
			WEBSTORIES_VERSION
		);

		$css = <<<CSS
.wp-block-web-stories-embed.alignleft,
.wp-block-web-stories-embed.alignright {
	width: 100%;
}

.wp-block-web-stories-embed .wp-block-embed__wrapper {
	position: relative;
	max-width: var(--width);
}

.wp-block-web-stories-embed.aligncenter .wp-block-embed__wrapper {
	margin-left: auto;
	margin-right: auto;
}

.wp-block-web-stories-embed:not(.wp-block-web-stories-embed-amp) .wp-block-embed__wrapper {
	max-width: var(--width);
}

.wp-block-web-stories-embed:not(.wp-block-web-stories-embed-amp) .wp-block-embed__wrapper::before {
	content:"";
	display: block;
	padding-bottom: calc(var(--aspect-ratio) * 100%);
}

.wp-block-web-stories-embed:not(.wp-block-web-stories-embed-amp) .wp-block-embed__wrapper amp-story-player {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
CSS;

		wp_add_inline_style( self::SCRIPT_HANDLE_FRONTEND, $css );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesEmbedBlockSettings',
			$this->get_script_settings()
		);
	}

	/**
	 * Returns script settings.
	 *
	 * @since 1.0.0
	 *
	 * @return array Script settings.
	 */
	private function get_script_settings() {
		return [
			'publicPath' => WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/',
		];
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
	 * Renders the block type output for given attributes.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Block content.
	 *
	 * @return string Rendered block type output.
	 */
	public function render_block( array $attributes, $content ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		// The only mandatory attribute.
		if ( empty( $attributes['url'] ) ) {
			return '';
		}

		if ( empty( $attributes['title'] ) ) {
			$attributes['title'] = __( 'Web Story', 'web-stories' );
		}

		$defaults = [
			'align'  => 'none',
			'height' => 0,
			'poster' => '',
			'width'  => 0,
		];

		$attributes = wp_parse_args( $attributes, $defaults );

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
