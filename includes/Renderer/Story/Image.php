<?php
/**
 * Class Image
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

declare(strict_types = 1);

namespace Google\Web_Stories\Renderer\Story;

use Google\Web_Stories\Model\Story;

/**
 * Class Image
 */
class Image {
	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected Story $story;


	/**
	 * Image constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Story $story   Story Object.
	 */
	public function __construct( Story $story ) {
		$this->story = $story;
	}

	/**
	 * Renders the block as an image.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string,string|int> $args Array of Argument to render.
	 * @return string Rendered block type output.
	 */
	public function render( array $args = [] ): string {
		$defaults = [
			'align'  => 'none',
			'class'  => 'wp-block-web-stories-embed',
			'height' => 600,
			'width'  => 360,
		];
		$args     = wp_parse_args( $args, $defaults );
		$align    = \sprintf( 'align%s', $args['align'] );
		$class    = $args['class'];

		$url           = $this->story->get_url();
		$title         = $this->story->get_title();
		$poster        = $this->story->get_poster_portrait();
		$poster_srcset = $this->story->get_poster_srcset();
		$poster_sizes  = $this->story->get_poster_sizes();

		ob_start();
		?>
		<div class="<?php echo esc_attr( $class ); ?> <?php echo esc_attr( $align ); ?>">
			<a href="<?php echo esc_url( $url ); ?>">
				<?php if ( ! empty( $poster ) ) { ?>
					<img
						src="<?php echo esc_url( $poster ); ?>"
						width="<?php echo esc_attr( $args['width'] ); ?>"
						height="<?php echo esc_attr( $args['height'] ); ?>"
						alt="<?php echo esc_attr( $title ); ?>"
						<?php if ( ! empty( $poster_srcset ) ) { ?>
							srcset="<?php echo esc_attr( $poster_srcset ); ?>"
						<?php } ?>
						<?php if ( ! empty( $poster_sizes ) ) { ?>
							sizes="<?php echo esc_attr( $poster_sizes ); ?>"
						<?php } ?>
						loading="lazy"
						decoding="async"
					/>
					<?php
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
