<?php
/**
 * Class Embed
 *
 * @package   Google\Web_Stories\Story_Renderer
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


namespace Google\Web_Stories\Story_Renderer;

use Google\Web_Stories\Model\Story;

/**
 * Class Embed
 *
 * @package Google\Web_Stories\Story_Renderer
 */
class Embed {
	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected $story;

	/**
	 * Height of image
	 *
	 * @var Int Height of image.
	 */
	protected $height;

	/**
	 * Width of image
	 *
	 * @var Int Width of image.
	 */
	protected $width;

	/**
	 * Align class.
	 *
	 * @var string
	 */
	protected $align;

	/**
	 * Embed constructor.
	 *
	 * @param Story  $story   Story Object.
	 * @param int    $width   Width of image.
	 * @param int    $height  Height of image.
	 * @param string $align   Align Image. Default: none.
	 */
	public function __construct( $story, $width, $height, $align = 'none' ) {
		$this->story  = $story;
		$this->width  = $width;
		$this->height = $height;
		$this->align  = $align;
	}

	/**
	 * Renders the block output in default context.
	 *
	 * @return string Rendered block type output.
	 */
	public function render() {
		$url          = $this->story->get_url();
		$title        = $this->story->get_title();
		$poster       = ! empty( $this->story->get_poster_portrait() ) ? esc_url( $this->story->get_poster_portrait() ) : '';
		$align        = sprintf( 'align%s', $this->align );
		$margin       = ( 'center' === $this->align ) ? 'auto' : '0';
		$player_style = sprintf( 'width: %dpx; height: %dpx; margin: %s', absint( $this->width ), absint( $this->height ), esc_attr( $margin ) );
		$poster_style = ! empty( $poster ) ? sprintf( '--story-player-poster: url(%s)', $poster ) : '';

		if ( ! function_exists( 'is_amp_endpoint' ) || ! is_amp_endpoint() ) {
			wp_enqueue_style( 'standalone-amp-story-player' );
			wp_enqueue_script( 'standalone-amp-story-player' );
		}

		ob_start();
		?>
		<div class="wp-block-web-stories-embed <?php echo esc_attr( $align ); ?>">
			<amp-story-player style="<?php echo esc_attr( $player_style ); ?>" data-testid="amp-story-player">
				<a href="<?php echo esc_url( $url ); ?>" style="<?php echo esc_attr( $poster_style ); ?>"><?php echo esc_html( $title ); ?></a>
			</amp-story-player>
		</div>
		<?php

		return (string) ob_get_clean();
	}
}
