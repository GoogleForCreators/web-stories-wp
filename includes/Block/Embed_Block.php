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

namespace Google\Web_Stories\Block;

use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Tracking;

/**
 * Embed block class.
 */
class Embed_Block extends Embed_Base {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-embed-block';

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
		$this->register_script( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE, Tracking::SCRIPT_HANDLE ] );
		$this->register_style( self::SCRIPT_HANDLE, [ self::STORY_PLAYER_HANDLE, Embed_Base::SCRIPT_HANDLE ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesEmbedBlockSettings',
			$this->get_script_settings()
		);

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
	 * Renders the block type output for given attributes.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Block content.
	 *
	 * @return string Rendered block type output.*
	 */
	public function render_block( array $attributes, $content ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		$attributes = wp_parse_args( $attributes, $this->default_attrs() );

		$attributes['class'] = 'wp-block-web-stories-embed';

		return $this->render( $attributes );
	}
}
