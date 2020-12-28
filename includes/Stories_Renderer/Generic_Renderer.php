<?php
/**
 * Generic_Renderer class.
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
 * Generic_Renderer class.
 *
 * This is named as `Generic` as this renderer class
 * will be used to output multiple view types, like:
 *
 * 1. Circle
 * 2. Grid
 * 3. List
 *
 * Since, markup for all these views type is similar, Generic Renderer
 * can be used to render the stories.
 */
class Generic_Renderer extends Renderer {

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
			<?php
			foreach ( $this->story_posts as $story ) {
				$this->render_single_story_content();
				$this->next();
			}

			if ( ! $this->is_amp_request() ) {
				$this->render_stories_with_lightbox_noamp();
			} else {
				$this->render_stories_with_lightbox_amp();
			}

			$this->maybe_render_archive_link();
			?>
		</div>
		<?php
		$view_type = $this->get_view_type();
		$content   = (string) ob_get_clean();

		/**
		 * Filters the Generic renderer stories content.
		 *
		 * The dynamic portion of the hook `$this->get_view_type()` refers to the story view type.
		 *
		 * @param string $content Stories content.
		 */
		return apply_filters( "web_stories_{$view_type}_renderer_stories_content", $content );
	}

}
