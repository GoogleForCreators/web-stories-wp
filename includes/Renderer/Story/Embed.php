<?php
/**
 * Class Embed
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

namespace Google\Web_Stories\Renderer\Story;

use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Model\Story;

/**
 * Class Embed
 */
class Embed {
	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected $story;

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private $assets;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Embed constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Story   $story   Story instance.
	 * @param Assets  $assets  Assets instance.
	 * @param Context $context Context instance.
	 */
	public function __construct( Story $story, Assets $assets, Context $context ) {
		$this->assets  = $assets;
		$this->story   = $story;
		$this->context = $context;
	}

	/**
	 * Renders the block output in default context.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @since 1.0.0
	 *
	 * @param array $args Array of Argument to render.
	 * @return string Rendered block type output.
	 */
	public function render( array $args = [] ): string {
		$defaults = [
			'align'  => 'none',
			'class'  => 'wp-block-web-stories-embed',
			'height' => 600,
			'width'  => 360,
		];

		$args          = wp_parse_args( $args, $defaults );
		$align         = sprintf( 'align%s', $args['align'] );
		$class         = $args['class'];
		$url           = $this->story->get_url();
		$title         = $this->story->get_title();
		$poster        = $this->story->get_poster_portrait();
		$poster_srcset = $this->story->get_poster_srcset();
		$poster_sizes  = $this->story->get_poster_sizes();

		$wrapper_style = sprintf(
			'--aspect-ratio: %F; --width: %dpx; --height: %dpx',
			0 !== $args['width'] ? $args['height'] / $args['width'] : 1,
			(int) $args['width'],
			(int) $args['height']
		);

		// This CSS is used for AMP and non-AMP.
		$this->assets->enqueue_style_asset( Embed_Base::SCRIPT_HANDLE );

		if ( $this->context->is_amp() ) {
			ob_start();
			?>
			<div class="<?php echo esc_attr( "$class web-stories-embed web-stories-embed-amp $align" ); ?>">
				<div class="wp-block-embed__wrapper" style="<?php echo esc_attr( $wrapper_style ); ?>">
					<amp-story-player
						width="<?php echo esc_attr( $args['width'] ); ?>"
						height="<?php echo esc_attr( $args['height'] ); ?>"
						layout="intrinsic">
						<a href="<?php echo esc_url( $url ); ?>">
							<?php if ( $poster ) { ?>
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
									data-amp-story-player-poster-img
								/>
								<?php
							} else {
								echo esc_html( $title );
							}
							?>
						</a>
					</amp-story-player>
				</div>
			</div>
			<?php

			return (string) ob_get_clean();
		}
		$this->assets->enqueue_style( AMP_Story_Player_Assets::SCRIPT_HANDLE );
		$this->assets->enqueue_script( AMP_Story_Player_Assets::SCRIPT_HANDLE );

		ob_start();
		?>
		<div class="<?php echo esc_attr( "$class web-stories-embed $align" ); ?>">
			<div class="wp-block-embed__wrapper" style="<?php echo esc_attr( $wrapper_style ); ?>">
				<amp-story-player>
					<a href="<?php echo esc_url( $url ); ?>">
						<?php if ( $poster ) { ?>
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
								data-amp-story-player-poster-img
							/>
							<?php
						} else {
							echo esc_html( $title );
						}
						?>
					</a>
				</amp-story-player>
			</div>
		</div>
		<?php

		return (string) ob_get_clean();
	}
}
