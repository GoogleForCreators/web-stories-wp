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

/**
 * Embed block class.
 */
class Embed_Block {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-embed-block';

	/**
	 * Style handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'web-stories-embed-block';

	/**
	 * Initializes the Web Stories embed block.
	 */
	public function init() {
		wp_register_script( 'amp-story-player', 'https://cdn.ampproject.org/amp-story-player-v0.js', [], 'v0', false );
		wp_register_style( 'amp-story-player', 'https://cdn.ampproject.org/amp-story-player-v0.css', [], 'v0' );

		$asset_file   = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/js/' . self::SCRIPT_HANDLE . '.asset.php';
		$asset        = is_readable( $asset_file ) ? require $asset_file : [];
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$version      = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;

		wp_register_script(
			self::SCRIPT_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/' . self::SCRIPT_HANDLE . '.js',
			$dependencies,
			$version,
			false
		);

		wp_register_style(
			self::STYLE_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/css/' . self::STYLE_HANDLE . '.css',
			[],
			$version,
			false
		);

		register_block_type(
			'web-stories/embed',
			[
				'render_callback' => [ $this, 'render_block' ],
				'editor_script'   => 'web-stories-embed-block',
				'editor_style'    => 'web-stories-embed-block',
				'script'          => 'amp-story-player',
				'style'           => 'amp-story-player',
			]
		);
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Block content.
	 * @return string Rendered block type output.
	 */
	public function render_block( array $attributes, $content ) {
		return $content;
	}
}
