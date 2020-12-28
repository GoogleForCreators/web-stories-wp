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
	 * Perform initial setup for object.
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
	 * @return void
	 */
	public function assets() {

		parent::assets();

		if ( ! $this->is_amp_request() ) {
			// Enqueue amp runtime script and amp-carousel script to show amp-carousel on non AMP pages.
			wp_register_script( 'amp-runtime-script', 'https://cdn.ampproject.org/v0.js', [], 'v0', true );
			wp_register_script( 'amp-carousel-script', 'https://cdn.ampproject.org/v0/amp-carousel-0.2.js', [ 'amp-runtime-script' ], 'v0', true );
			wp_enqueue_script( 'amp-carousel-script' );
		}
	}

	/**
	 * Renders the stories output for given attributes.
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

		ob_start();
		?>
		<div class="<?php echo esc_attr( $container_classes ); ?>">
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
			<?php $this->maybe_render_archive_link(); ?>
			<?php
			if ( ! $this->is_amp_request() ) {
				$this->render_stories_with_lightbox_noamp();
			} else {
				$this->render_stories_with_lightbox_amp();
			}
			?>
		</div>
		<?php
		$content = (string) ob_get_clean();

		/**
		 * Filters the Carousel renderer stories content.
		 *
		 * @param string $content Stories content.
		 */
		return apply_filters( 'web_stories_carousel_renderer_stories_content', $content );
	}

}
