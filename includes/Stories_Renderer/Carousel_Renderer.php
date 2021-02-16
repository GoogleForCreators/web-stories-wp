<?php
/**
 * Carousel_Renderer class.
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

namespace Google\Web_Stories\Stories_Renderer;

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
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'carousel-view';

	/**
	 * Perform initial setup for object.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function init() {

		parent::init();

		$this->assets();
	}

	/**
	 * Enqueue assets.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function assets() {

		parent::assets();

		$this->register_script( self::SCRIPT_HANDLE );
		$this->register_style( self::SCRIPT_HANDLE );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesCarouselSettings',
			$this->get_carousel_settings()
		);

	}

	/**
	 * Get Carousel Settings.
	 *
	 * @since 1.3.0
	 *
	 * @return array
	 */
	protected function get_carousel_settings() {
		return [
			'config' => [
				'isRTL' => is_rtl(),
			],
		];
	}

	/**
	 * Renders the stories output for given attributes.
	 *
	 * @since 1.3.0
	 *
	 * @SuppressWarnings(PHPMD.UnusedLocalVariable)
	 *
	 * @param array $args Array of rendering arguments.
	 *
	 * @return string Rendered stories output.
	 */
	public function render( array $args = [] ) {

		if ( ! $this->valid() ) {
			return '';
		}

		parent::render( $args );
		$container_classes = $this->get_container_classes();
		$container_styles  = $this->get_container_styles();

		ob_start();
		?>
		<div class="<?php echo esc_attr( $container_classes ); ?>" data-id="<?php echo esc_attr( (string) parent::get_instance_id() ); ?>">
			<div class="web-stories-list__inner-wrapper <?php echo esc_attr( 'carousel-' . parent::get_instance_id() ); ?>" style="<?php echo esc_attr( $container_styles ); ?>">
				<?php
				if ( ! $this->is_amp_request() ) {
					wp_enqueue_script( self::SCRIPT_HANDLE );
					wp_enqueue_style( self::SCRIPT_HANDLE );
					?>
					<div class="web-stories-list__carousel <?php echo esc_attr( $this->get_view_type() ); ?>" data-id="<?php echo esc_attr( 'carousel-' . parent::get_instance_id() ); ?>">
						<?php
						foreach ( $this->story_posts as $story ) {
							$this->render_single_story_content();
							$this->next();
						}
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
						foreach ( $this->story_posts as $story ) {
							$this->render_single_story_content();
							$this->next();
						}
						?>
					</amp-carousel>
					<?php
				}
				?>
			</div>
			<?php $this->maybe_render_archive_link(); ?>
		</div>
		<?php
		$content = (string) ob_get_clean();

		/**
		 * Filters the Carousel renderer stories content.
		 *
		 * @since 1.3.0
		 *
		 * @param string $content Stories content.
		 */
		return apply_filters( 'web_stories_carousel_renderer_stories_content', $content );
	}

}
