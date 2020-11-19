<?php
/**
 * Stories Renderer Base class.
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

use Google\Web_Stories\Media;
use Google\Web_Stories\Interfaces\Renderer as RenderingInterface;
use Google\Web_Stories\Stories;
use Google\Web_Stories\Story_Post_Type;

/**
 * Renderer class.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 */
abstract class Renderer implements RenderingInterface {

	/**
	 * Web Stories stylesheet handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'web-stories-list-styles';

	/**
	 * Stories object
	 *
	 * @var Stories Stories object
	 */
	protected $stories;

	/**
	 * Story attributes
	 *
	 * @var array An array of story attributes.
	 */
	protected $attributes = [];

	/**
	 * Story posts.
	 *
	 * @var array An array of story posts.
	 */
	protected $story_posts = [];

	/**
	 * Constructor
	 *
	 * @param Stories $stories Stories instance.
	 */
	public function __construct( Stories $stories ) {

		$this->stories    = $stories;
		$this->attributes = $this->stories->get_story_attributes();
	}

	/**
	 * Output markup for amp stories.
	 *
	 * @return string
	 */
	abstract public function render();

	/**
	 * Perform initial setup for object.
	 *
	 * @return void
	 */
	public function init() {

		$this->story_posts = $this->stories->get_stories();
	}

	/**
	 * Initializes renderer functionality.
	 *
	 * @return void
	 */
	public function assets() {

		wp_enqueue_style(
			self::STYLE_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'includes/assets/stories.css',
			[],
			'v0'
		);
	}

	/**
	 * Determine whether the current request is for an AMP page.
	 *
	 * @return boolean
	 */
	public function is_amp_request() {

		$amp_is_request  = ( function_exists( 'amp_is_request' ) && amp_is_request() );
		$is_amp_endpoint = ( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() );

		return ( $amp_is_request || $is_amp_endpoint );
	}

	/**
	 * Returns story item data.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @param int    $story_id             Story's id for which the story attributes are requested.
	 * @param string $single_story_classes Single story's classes.
	 *
	 * @return array Returns single story item data.
	 */
	protected function get_story_item_data( $story_id, $single_story_classes = '' ) {

		$story_data = [];

		if ( empty( $story_id ) || 0 >= intval( $story_id ) ) {
			return $story_data;
		}

		$author_id       = absint( get_post_field( 'post_author', $story_id ) );
		$is_circles_view = $this->is_view_type( 'circles' );
		$image_size      = $is_circles_view ? Media::POSTER_SQUARE_IMAGE_SIZE : Media::POSTER_PORTRAIT_IMAGE_SIZE;
		$story_title     = '';
		$author_name     = '';
		$story_date      = '';

		if ( ! empty( $this->attributes['show_title'] ) && true === $this->attributes['show_title'] ) {
			$story_title = get_the_title( $story_id );
		}

		if ( ! $is_circles_view && ! empty( $this->attributes['show_author'] ) && true === $this->attributes['show_author'] ) {
			$author_name = get_the_author_meta( 'display_name', $author_id );
		}

		if ( ! $is_circles_view && ! empty( $this->attributes['show_date'] ) && true === $this->attributes['show_date'] ) {
			$story_date = get_the_date( 'M j, Y', $story_id );
		}

		$story_data['ID']                   = $story_id;
		$story_data['url']                  = get_post_permalink( $story_id );
		$story_data['title']                = $story_title;
		$story_data['height']               = '430';
		$story_data['width']                = '285';
		$story_data['poster']               = get_the_post_thumbnail_url( $story_id, $image_size );
		$story_data['author']               = $author_name;
		$story_data['date']                 = $story_date;
		$story_data['class']                = $single_story_classes;
		$story_data['show_content_overlay'] = ( ! empty( $story_title ) || ! empty( $author_name ) || ! empty( $story_date ) );

		return $story_data;
	}

	/**
	 * Verifies the current view type.
	 *
	 * @param string $view_type View type to check.
	 *
	 * @return bool Whether or not current view type matches the one passed.
	 */
	protected function is_view_type( $view_type ) {

		return ( ! empty( $this->attributes['view_type'] ) && $view_type === $this->attributes['view_type'] );
	}

	/**
	 * Get view type for stories.
	 *
	 * @return string
	 */
	protected function get_view_type() {

		return ( ! empty( $this->attributes['view_type'] ) ) ? $this->attributes['view_type'] : 'circles';
	}

	/**
	 * Renders stories archive link if the 'show_stories_archive_link' attribute is set to true.
	 *
	 * @return void
	 */
	protected function maybe_render_archive_link() {

		if ( empty( $this->attributes['show_stories_archive_link'] ) || true !== $this->attributes['show_stories_archive_link'] ) {
			return;
		}

		$web_stories_archive = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );

		if ( empty( $web_stories_archive ) || ! is_string( $web_stories_archive ) ) {
			return;
		}

		?>
		<div class="web-stories-list__archive-link">
			<a href="<?php echo esc_url( $web_stories_archive ); ?>">
				<?php echo esc_html( $this->attributes['stories_archive_label'] ); ?>
			</a>
		</div>
		<?php

	}

	/**
	 * Gets the classes for renderer container.
	 *
	 * @return string
	 */
	protected function get_container_classes() {

		$container_classes   = [];
		$container_classes[] = 'web-stories-list';
		$container_classes[] = ( ! empty( $this->attributes['view_type'] ) ) ? sprintf( 'is-view-type-%1$s', $this->attributes['view_type'] ) : 'is-view-type-circles';
		$container_classes[] = ( ! empty( $this->attributes['align'] ) ) ? sprintf( 'align%1$s', $this->attributes['align'] ) : 'alignnone';
		$container_classes[] = ( ! empty( $this->attributes['class'] ) ) ? $this->attributes['class'] : '';

		$container_classes = array_filter( $container_classes );

		return implode( ' ', $container_classes );
	}

	/**
	 * Gets the single story container classes.
	 *
	 * @return string
	 */
	protected function get_single_story_classes() {

		$single_story_classes   = [];
		$single_story_classes[] = 'web-stories-list__story-wrapper';

		if ( ! $this->is_view_type( 'grid' ) ) {
			$single_story_classes[] = 'has-poster';
		}

		if ( ! empty( $this->attributes['show_story_poster'] ) &&
			$this->is_view_type( 'grid' ) &&
			true === $this->attributes['show_story_poster']
		) {
			$single_story_classes[] = 'has-poster';
		}

		$single_story_classes = array_filter( $single_story_classes );

		/**
		 * Filters the web stories renderer single story classes.
		 *
		 * @param string $class Single story classes.
		 */
		return apply_filters( 'web_stories_renderer_single_story_classes', implode( ' ', $single_story_classes ) );
	}

	/**
	 * Gets the container style attributes.
	 *
	 * @return string
	 */
	protected function get_container_styles() {

		$container_style = '';

		if ( true === $this->is_view_type( 'grid' ) ) {
			$container_style = sprintf( 'grid-template-columns:repeat(%1$s, 1fr);', $this->attributes['number_of_columns'] );
		}

		/**
		 * Filters the web stories renderer container style.
		 *
		 * @param string $class Container style.
		 */
		return apply_filters( 'web_stories_renderer_container_style', $container_style );
	}

	/**
	 * Render story markup.
	 *
	 * @param int $story_id Story ID.
	 *
	 * @return void
	 */
	protected function render_single_story_content( $story_id ) {

		$story_data           = $this->get_story_item_data( $story_id );
		$single_story_classes = $this->get_single_story_classes();
		$show_story_player    = ( true !== $this->attributes['show_story_poster'] && $this->is_view_type( 'grid' ) );

		?>

		<div class="<?php echo esc_attr( $single_story_classes ); ?>">
			<?php

			if ( true === $show_story_player ) {
				$this->render_story_with_story_player( $story_data );
			} else {
				$this->render_story_with_poster( $story_data );
			}
			?>
		</div>
		<?php

	}

	/**
	 * Renders a story with story's poster image.
	 *
	 * @param array $story_data Story item data. Contains information like url, height, width, etc of the story.
	 *
	 * @return void
	 */
	protected function render_story_with_poster( array $story_data ) {

		$height                    = ( ! empty( $story_data['height'] ) ) ? absint( $story_data['height'] ) : 600;
		$width                     = ( ! empty( $story_data['width'] ) ) ? absint( $story_data['width'] ) : 360;
		$poster_style              = sprintf( 'background-image: url(%1$s);', esc_url_raw( $story_data['poster'] ) );
		$list_view_image_alignment = '';

		if ( true === $this->is_view_type( 'carousel' ) ) {
			$poster_style = sprintf( '%1$s width: %2$spx; height: %3$spx', $poster_style, $width, $height );
		}

		if ( ! empty( $this->attributes['list_view_image_alignment'] ) ) {
			$list_view_image_alignment = sprintf( 'image-align-%1$s', $this->attributes['list_view_image_alignment'] );
		}

		?>
		<a class="<?php echo esc_attr( $list_view_image_alignment ); ?>"
			href="<?php echo esc_url( $story_data['url'] ); ?>"
		>
			<div
				class="web-stories-list__story-placeholder"
				style="<?php echo esc_attr( $poster_style ); ?>"
			></div>
			<?php $this->get_content_overlay( $story_data ); ?>
		</a>
		<?php

	}

	/**
	 * Renders a story with amp-story-player.
	 *
	 * @param array $story_data Story attributes. Contains information like url, height, width, etc of the story.
	 *
	 * @return void
	 */
	protected function render_story_with_story_player( array $story_data ) {

		$height                  = ( ! empty( $story_data['height'] ) ) ? absint( $story_data['height'] ) : 600;
		$width                   = ( ! empty( $story_data['width'] ) ) ? absint( $story_data['width'] ) : 360;
		$player_style            = sprintf( 'width: %1$spx;height: %2$spx', $width, $height );
		$story_player_attributes = '';
		$poster_style            = '';

		if ( $this->is_amp_request() ) {
			$story_player_attributes = sprintf( 'height=%d width=%d', $height, $width );
		}

		if ( ! empty( $story_data['poster'] ) ) {
			$poster_style = sprintf( '--story-player-poster: url(%s)', $story_data['poster'] );
		}

		?>
		<amp-story-player style="<?php echo esc_attr( $player_style ); ?>"
			<?php echo( esc_attr( $story_player_attributes ) ); ?>>
			<a href="<?php echo esc_url( $story_data['url'] ); ?>" style="<?php echo esc_attr( $poster_style ); ?>">
				<?php echo esc_html( $story_data['title'] ); ?>
			</a>
		</amp-story-player>

		<?php

		$this->get_content_overlay( $story_data );
	}

	/**
	 * Renders the content overlay markup.
	 *
	 * @param array $story_data Story item data. Contains information like url, height, width, etc of the story.
	 *
	 * @return void
	 */
	protected function get_content_overlay( array $story_data ) {

		if ( empty( $story_data['show_content_overlay'] ) || true !== $story_data['show_content_overlay'] ) {
			return;
		}

		?>
		<div class="story-content-overlay web-stories-list__story-content-overlay">
			<?php if ( ! empty( $story_data['title'] ) ) { ?>
				<div class="story-content-overlay__title">
					<?php
					echo esc_html( $story_data['title'] );
					?>
				</div>
			<?php } ?>

			<div class="story-content-overlay__author-date">
				<?php if ( ! empty( $story_data['author'] ) ) { ?>
					<div>
						<?php

						/* translators: %s: author name. */
						echo esc_html( sprintf( __( 'By %s', 'web-stories' ), $story_data['author'] ) );
						?>
					</div>
				<?php } ?>

				<?php if ( ! empty( $story_data['date'] ) ) { ?>
					<time class="story-content-overlay__date">
						<?php

						/* translators: %s: publish date. */
						echo esc_html( sprintf( __( 'On %s', 'web-stories' ), $story_data['date'] ) );
						?>
					</time>
				<?php } ?>
			</div>
		</div>
		<?php

	}

}
