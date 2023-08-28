<?php
/**
 * Carousel_Renderer class.
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

namespace Google\Web_Stories\Renderer\Stories;

/**
 * Carousel_Renderer class.
 *
 * Note: This class is useful to render stories in carousel view type.
 * Do not instantiate this class directly, pass `view_type` argument
 * to `Story_Query` which will handle the instantiation of the class.
 */
class Carousel_Renderer extends Renderer {

	/**
	 * Script handle.
	 */
	public const SCRIPT_HANDLE = 'web-stories-carousel';

	/**
	 * Perform initial setup for object.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function init(): void {

		parent::init();

		$this->load_assets();
	}

	/**
	 * Enqueue assets.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function load_assets(): void {
		parent::load_assets();

		$this->assets->register_script_asset( self::SCRIPT_HANDLE );
		$this->assets->register_style_asset( self::SCRIPT_HANDLE );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesCarouselSettings',
			$this->get_carousel_settings()
		);
	}

	/**
	 * Renders the stories output for given attributes.
	 *
	 * @SuppressWarnings(PHPMD.UnusedLocalVariable)
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,mixed> $args Array of rendering arguments.
	 * @return string Rendered stories output.
	 */
	public function render( array $args = [] ): string {
		if ( ! $this->valid() ) {
			return '';
		}

		parent::render( $args );
		$container_classes = $this->get_container_classes();
		$container_styles  = $this->get_container_styles();

		ob_start();
		?>
		<div class="<?php echo esc_attr( $container_classes ); ?>" data-id="<?php echo esc_attr( (string) $this->instance_id ); ?>">
			<div class="web-stories-list__inner-wrapper <?php echo esc_attr( 'carousel-' . $this->instance_id ); ?>" style="<?php echo esc_attr( $container_styles ); ?>">
				<?php
				if ( ! $this->context->is_amp() ) {
					$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE );
					$this->assets->enqueue_style_asset( self::SCRIPT_HANDLE );
					?>
					<div class="web-stories-list__carousel <?php echo esc_attr( $this->get_view_type() ); ?>" data-id="<?php echo esc_attr( 'carousel-' . $this->instance_id ); ?>">
						<?php
						array_map(
							function () {
								$this->render_single_story_content();
								$this->next();
							},
							$this->stories
						);
						?>
					</div>
					<div tabindex="0" aria-label="<?php esc_attr_e( 'Previous', 'web-stories' ); ?>" class="glider-prev"></div>
					<div tabindex="0" aria-label="<?php esc_attr_e( 'Next', 'web-stories' ); ?>" class="glider-next"></div>
					<?php
				} else {
					?>
					<amp-carousel
						width="1"
						height="1"
						layout="intrinsic"
						type="carousel"
						role="region"
						aria-label="<?php esc_attr_e( 'Web Stories', 'web-stories' ); ?>"
					>
						<?php
						array_map(
							function () {
								$this->render_single_story_content();
								$this->next();
							},
							$this->stories
						);
						?>
					</amp-carousel>
					<?php
				}
				$this->maybe_render_archive_link();
				?>
			</div>
		</div>
		<?php
		$content = (string) ob_get_clean();

		/**
		 * Filters the Carousel renderer stories content.
		 *
		 * @since 1.5.0
		 *
		 * @param string $content Stories content.
		 */
		return apply_filters( 'web_stories_carousel_renderer_stories_content', $content );
	}

	/**
	 * Get Carousel settings.
	 *
	 * @since 1.5.0
	 *
	 * @return array<string,array<string,bool>> Carousel settings.
	 */
	protected function get_carousel_settings(): array {
		return [
			'config' => [
				'isRTL' => is_rtl(),
			],
		];
	}
}
