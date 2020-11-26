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

use Google\Web_Stories\Embed_Base;

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
	 * Enqueue assets.
	 *
	 * @return void
	 */
	public function assets() {

		parent::assets();

		if ( $this->is_view_type( 'grid' ) && ! $this->is_amp_request() && true !== $this->attributes['show_story_poster'] ) {
			$this->enqueue_style( Embed_Base::STORY_PLAYER_HANDLE );
			$this->enqueue_script( Embed_Base::STORY_PLAYER_HANDLE );
		}
	}

	/**
	 * Renders the stories output for given attributes.
	 *
	 * @SuppressWarnings(PHPMD.UnusedLocalVariable)
	 *
	 * @return string Rendered stories output.
	 */
	public function render() {

		if ( ! $this->valid() ) {
			return '';
		}

		$container_classes = $this->get_container_classes();
		$container_style   = $this->get_container_styles();

		ob_start();
		?>
		<div>
			<div
				class="<?php echo esc_attr( $container_classes ); ?>"
				style="<?php echo esc_attr( $container_style ); ?>"
			>
				<?php
				foreach ( $this->story_posts as $story ) {
					$this->render_single_story_content();
					$this->next();
				}
				?>

			</div>
			<?php $this->maybe_render_archive_link(); ?>
		</div>
		<?php
		$view_type = $this->get_view_type();

		/**
		 * Filters the Generic renderer stories content.
		 *
		 * The dynamic portion of the hook `$this->get_view_type()` refers to the story view type.
		 *
		 * @param string $content Stories content.
		 */
		return apply_filters( "web_stories_{$view_type}_renderer_stories_content", (string) ob_get_clean() );
	}

}
