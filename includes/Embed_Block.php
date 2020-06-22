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

use Google\Web_Stories\TRAITS\Assets;

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
	 * Style handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'web-stories-embed-block';

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @return void
	 */
	public function init() {
		wp_register_script( 'amp-story-player', 'https://cdn.ampproject.org/amp-story-player-v0.js', [], 'v0', false );
		wp_register_style( 'amp-story-player', 'https://cdn.ampproject.org/amp-story-player-v0.css', [], 'v0' );

		$this->load_asset( self::SCRIPT_HANDLE, [ 'amp-story-player' ], self::STYLE_HANDLE, [ 'amp-story-player' ] );

		// todo: use register_block_type_from_metadata() once generally available.

		// Note: does not use 'script' and 'style' args, and instead uses 'render_callback'
		// to enqueue these assets only when needed.
		register_block_type(
			'web-stories/embed',
			[
				'attributes'      => [
					'url'    => [
						'type' => 'url',
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
				'editor_style'    => self::STYLE_HANDLE,
			]
		);

		add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10, 2 );
	}

	/**
	 * Filter the allowed tags for KSES to allow for amp-story children.
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

		if ( is_feed() ) {
			return $this->render_block_feed( $attributes );
		}

		return $this->render_block_html( $attributes );
	}

	/**
	 * Renders the block type output in default context.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string Rendered block type output.
	 */
	protected function render_block_html( array $attributes ) {
		$url          = (string) $attributes['url'];
		$title        = (string) $attributes['title'];
		$poster       = ! empty( $attributes['poster'] ) ? esc_url( $attributes['poster'] ) : '';
		$align        = sprintf( 'align%s', $attributes['align'] );
		$margin       = ( 'center' === $attributes['align'] ) ? 'auto' : '0';
		$player_style = sprintf( 'width: %dpx; height: %dpx; margin: %s', absint( $attributes['width'] ), absint( $attributes['height'] ), esc_attr( $margin ) );
		$poster_style = ! empty( $poster ) ? sprintf( '--story-player-poster: url(%s)', $poster ) : '';

		wp_enqueue_style( 'amp-story-player' );
		wp_enqueue_script( 'amp-story-player' );

		ob_start();
		?>
		<div class="wp-block-web-stories-embed <?php echo esc_attr( $align ); ?>">
			<amp-story-player
				style="<?php echo esc_attr( $player_style ); ?>"
			>
				<a
					href="<?php echo esc_url( $url ); ?>"
					style="<?php echo esc_attr( $poster_style ); ?>"
				>
					<?php echo esc_html( $title ); ?>
				</a>
			</amp-story-player>
		</div>
		<?php

		return (string) ob_get_clean();
	}

	/**
	 * Renders the block type output in an RSS feed context.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string Rendered block type output.
	 */
	protected function render_block_feed( array $attributes ) {
		$url   = (string) $attributes['url'];
		$title = (string) $attributes['title'];

		ob_start();
		?>
		<div class="wp-block-web-stories-embed">
			<a href="<?php echo esc_url( $url ); ?>">
				<?php
				if ( ! empty( $attributes['poster'] ) ) {
					printf(
						'<img src="%1$s" width="%2$d" height="%3$d" alt="%4$s" />',
						esc_url( $attributes['poster'] ),
						absint( $attributes['width'] ),
						absint( $attributes['height'] ),
						esc_attr( $title )
					);
				} else {
					echo esc_html( $title );
				}
				?>
			</a>
		</div>
		<?php

		return (string) ob_get_clean();
	}
}
