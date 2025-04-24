<?php
/**
 * Class Singleton
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2023 Google LLC
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

use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Stories\Renderer;

/**
 * Class Singleton
 */
class Singleton {
	/**
	 * Number of instances invoked. Kept it static to keep track.
	 */
	protected static int $instances = 0;

	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected Story $story;

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private Assets $assets;

	/**
	 * Object ID for the Renderer class.
	 * To enable support for multiple carousels and lightboxes
	 * on the same page, we needed to identify each Renderer instance.
	 *
	 * This variable is used to add appropriate class to the Web Stories
	 * wrapper.
	 */
	protected int $instance_id = 0;

	/**
	 * Singleton constructor.
	 *
	 * @since 1.30.0
	 *
	 * @param Story  $story   Story instance.
	 * @param Assets $assets  Assets instance.
	 */
	public function __construct( Story $story, Assets $assets ) {
		$this->assets = $assets;
		$this->story  = $story;
	}

	/**
	 * Renders the block output in default context.
	 *
	 * @SuppressWarnings("PHPMD.ExcessiveMethodLength")
	 *
	 * @since 1.30.0
	 *
	 * @param array<string,string|int> $args Array of Argument to render.
	 * @return string Rendered block type output.
	 */
	public function render( array $args = [] ): string {
		++self::$instances;
		$this->instance_id = self::$instances;

		$defaults = [
			'align'  => 'none',
			'class'  => 'wp-block-web-stories-embed',
			'height' => 600,
			'width'  => 360,
		];

		$args = wp_parse_args( $args, $defaults );

		$args['align'] = ! empty( $args['align'] ) ? $args['align'] : 'none';
		$align         = \sprintf( 'align%s', $args['align'] );
		$class         = $args['class'];
		$wrapper_style = \sprintf(
			'--aspect-ratio: %F; --width: %dpx; --height: %dpx',
			0 !== $args['height'] ? $args['width'] / $args['height'] : 1,
			(int) $args['width'],
			(int) $args['height']
		);

		$this->assets->enqueue_style_asset( Renderer::STYLE_HANDLE ); // For the lightbox styles.
		$this->assets->enqueue_style( AMP_Story_Player_Assets::SCRIPT_HANDLE );
		$this->assets->enqueue_script( AMP_Story_Player_Assets::SCRIPT_HANDLE );
		$this->assets->enqueue_style_asset( Embed_Base::SCRIPT_HANDLE );

		$this->assets->enqueue_script_module(
			'web-stories-block-view',
			$this->assets->get_base_url( 'assets/js/web-stories-block-view.js' )
		);

		ob_start();
		?>
		<div
		class="<?php echo esc_attr( "$class web-stories-singleton $align" ); ?>"
		data-id="<?php echo esc_attr( 'singleton-' . $this->instance_id ); ?>"
		data-wp-interactive="web-stories-block"
		<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo wp_interactivity_data_wp_context(
				[
					'instanceId' => $this->instance_id,
				]
			);
		?>
		>
			<div
			class="wp-block-embed__wrapper"
			style="<?php echo esc_attr( $wrapper_style ); ?>"
			data-wp-on--click="actions.open"
			>
			<?php $this->render_story_with_poster( $args ); ?>
			</div>
			<?php

			$data = [
				'controls' => [
					[
						'name'     => 'close',
						'position' => 'start',
					],
					[
						'name' => 'skip-next',
					],
				],
				'behavior' => [
					'autoplay' => false,
				],
			];

			?>
			<div class="web-stories-singleton__lightbox-wrapper <?php echo esc_attr( 'ws-lightbox-singleton-' . $this->instance_id ); ?>">
				<div
				class="web-stories-singleton__lightbox"
				id="<?php echo esc_attr( 'ws-lightbox-singleton-' . $this->instance_id ); ?>"
				>
					<amp-story-player
						width="3.6"
						height="6"
						layout="responsive"
						data-wp-on--amp-story-player-close="actions.close"
						data-wp-on--navigation="actions.navigation"
					>
						<script type="application/json">
							<?php echo wp_json_encode( $data ); ?>
						</script>
						<a href="<?php echo esc_url( $this->story->get_url() ); ?>"><?php echo esc_html( $this->story->get_title() ); ?></a>
					</amp-story-player>
				</div>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Renders a story with story's poster image.
	 *
	 * @since 1.30.0
	 *
	 * @param array<string,string|int> $args Array of Argument to render.
	 */
	protected function render_story_with_poster( array $args ): void {
		$poster_url    = $this->story->get_poster_portrait();
		$poster_srcset = $this->story->get_poster_srcset();
		$poster_sizes  = $this->story->get_poster_sizes();

		if ( ! $poster_url ) {
			?>
			<div class="web-stories-singleton-poster">
				<div class="web-stories-singleton-poster-placeholder">
					<a href="<?php echo esc_url( $this->story->get_url() ); ?>">
						<?php echo esc_html( $this->story->get_title() ); ?>
					</a>
				</div>
			</div>
			<?php
		} else {
			?>
			<div class="web-stories-singleton-poster">
				<a href="<?php echo esc_url( $this->story->get_url() ); ?>">
					<img
						src="<?php echo esc_url( $poster_url ); ?>"
						alt="<?php echo esc_attr( $this->story->get_title() ); ?>"
						width="<?php echo absint( $args['width'] ); ?>"
						height="<?php echo absint( $args['height'] ); ?>"
						<?php if ( ! empty( $poster_srcset ) ) { ?>
							srcset="<?php echo esc_attr( $poster_srcset ); ?>"
						<?php } ?>
						<?php if ( ! empty( $poster_sizes ) ) { ?>
							sizes="<?php echo esc_attr( $poster_sizes ); ?>"
						<?php } ?>
						loading="lazy"
						decoding="async"
					>
				</a>
			</div>
			<?php
		}
		$this->render_content_overlay();
	}

	/**
	 * Renders the content overlay markup.
	 *
	 * @since 1.30.0
	 */
	protected function render_content_overlay(): void {
		?>
		<div class="web-stories-singleton-overlay">
			<div class="web-stories-singleton-overlay__title">
					<?php echo esc_html( $this->story->get_title() ); ?>
				</div>
		</div>
		<?php
	}
}
