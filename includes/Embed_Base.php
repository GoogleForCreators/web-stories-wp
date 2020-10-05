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
	 * Initializes the Web Stories embed block.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	public function init() {
		wp_register_script( self::STORY_PLAYER_HANDLE, 'https://cdn.ampproject.org/amp-story-player-v0.js', [], 'v0', false );
		wp_register_style( self::STORY_PLAYER_HANDLE, 'https://cdn.ampproject.org/amp-story-player-v0.css', [], 'v0' );

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
	 * Renders an embed with given attributes.
	 *
	 * @since 1.1.0
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Block content.
	 *
	 * @return string Rendered embed output.
	 */
	public function render( array $attributes, $content ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
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
