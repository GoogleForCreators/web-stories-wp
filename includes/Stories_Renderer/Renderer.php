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

use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Interfaces\Renderer as RenderingInterface;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Amp;
use Google\Web_Stories\Traits\Assets;
use Iterator;
use WP_Post;

/**
 * Renderer class.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 * @implements Iterator<int, \WP_Post>
 */
abstract class Renderer implements RenderingInterface, Iterator {

	use Assets;
	use Amp;

	/**
	 * Web Stories stylesheet handle.
	 *
	 * @var string
	 */
	const STYLE_HANDLE = 'web-stories-list-styles';

	/**
	 * Web Stories stylesheet handle.
	 *
	 * @var string
	 */
	const LIGHTBOX_SCRIPT_HANDLE = 'lightbox';

	/**
	 * Number of instances invoked. Kept it static to keep track.
	 *
	 * @var int
	 */
	protected static $instances = 0;

	/**
	 * Object ID for the Renderer class.
	 * To enable support for multiple carousels and lightboxes
	 * on the same page, we needed to identify each Renderer instance.
	 *
	 * This variable is used to add appropriate class to the Web Stories
	 * wrapper.
	 *
	 * @var int
	 */
	protected $instance_id = 0;

	/**
	 * Story_Query instance.
	 *
	 * @var Story_Query Story_Query instance.
	 */
	protected $query;

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
	protected $stories = [];

	/**
	 * Holds required html for the lightbox.
	 *
	 * @var string A string of lightbox markup.
	 */
	protected $lightbox_html = '';

	/**
	 * Pointer to iterate over stories.
	 *
	 * @var int
	 */
	private $position = 0;

	/**
	 * Height for displaying story.
	 *
	 * @var int
	 */
	protected $height = 308;

	/**
	 * Width for displaying story.
	 *
	 * @var int
	 */
	protected $width = 185;

	/**
	 * Whether content overlay is enabled for story.
	 *
	 * @var bool
	 */
	protected $content_overlay;

	/**
	 * Constructor
	 *
	 * @since 1.5.0
	 *
	 * @param Story_Query $query Story_Query instance.
	 */
	public function __construct( Story_Query $query ) {
		$this->query           = $query;
		$this->attributes      = $this->query->get_story_attributes();
		$this->content_overlay = $this->attributes['show_title'] || $this->attributes['show_date'] || $this->attributes['show_author'] || $this->attributes['show_excerpt'];
	}

	/**
	 * Output markup for amp stories.
	 *
	 * @since 1.5.0
	 *
	 * @param array $args Array of rendering arguments.
	 *
	 * @return string
	 */
	public function render( array $args = [] ) {
		++self::$instances;
		$this->instance_id = self::$instances;

		foreach ( $args as $key => $val ) {
			if ( property_exists( $this, $key ) ) {
				$this->{$key} = $val;
			}
		}

		return '';
	}

	/**
	 * Retrieve current story.
	 *
	 * @since 1.5.0
	 *
	 * @return mixed|void
	 */
	public function current() {
		return $this->stories[ $this->position ];
	}

	/**
	 * Retrieve next story.
	 *
	 * @since 1.5.0
	 *
	 * @retrun void
	 */
	public function next() {
		++ $this->position;
	}

	/**
	 * Retrieve the key for current node in list.
	 *
	 * @since 1.5.0
	 *
	 * @return bool|float|int|string|void|null
	 */
	public function key() {
		return $this->position;
	}

	/**
	 * Check if current position is valid.
	 *
	 * @since 1.5.0
	 *
	 * @return bool|void
	 */
	public function valid() {
		return isset( $this->stories[ $this->position ] );
	}

	/**
	 * Reset pointer to start of the list.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function rewind() {
		$this->position = 0;
	}

	/**
	 * Perform initial setup for object.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function init() {
		$this->stories = array_filter( array_map( [ $this, 'prepare_stories' ], $this->query->get_stories() ) );

		add_action( 'wp_footer', [ $this, 'render_stories_lightbox' ] );
	}

	/**
	 * Initializes renderer functionality.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function assets() {
		// Web Stories styles for AMP and non-AMP pages.
		$this->register_style( self::STYLE_HANDLE );

		// Web Stories lightbox script.
		$this->register_script( self::LIGHTBOX_SCRIPT_HANDLE, [ Embed_Base::STORY_PLAYER_HANDLE ] );
	}

	/**
	 * Returns story item data.
	 *
	 * @since 1.5.0
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @param object $post Array of post objects.
	 *
	 * @return Story|null Story object or null if given post
	 */
	public function prepare_stories( $post ) {
		if ( ! $post instanceof WP_Post ) {
			return null;
		}

		$story_data = [];

		// TODO: get from field state instead.
		if ( ! $this->is_view_type( 'circles' ) ) {
			if ( isset( $this->attributes['show_author'] ) && true === $this->attributes['show_author'] ) {
				$author_id = absint( get_post_field( 'post_author', $post->ID ) );

				$story_data['author'] = get_the_author_meta( 'display_name', $author_id );
			}

			if ( isset( $this->attributes['show_date'] ) && true === $this->attributes['show_date'] ) {
				$story_data['date'] = get_the_date( __( 'M j, Y', 'web-stories' ), $post->ID );
			}
		}

		$story_data['classes'] = $this->get_single_story_classes();

		$story = new Story( $story_data );
		$story->load_from_post( $post );

		return $story;
	}

	/**
	 * Verifies the current view type.
	 *
	 * @since 1.5.0
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
	 * @since 1.5.0
	 *
	 * @return string
	 */
	protected function get_view_type() {

		return ( ! empty( $this->attributes['view_type'] ) ) ? $this->attributes['view_type'] : 'circles';
	}

	/**
	 * Renders stories archive link if the 'show_archive_link' attribute is set to true.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	protected function maybe_render_archive_link() {

		if ( empty( $this->attributes['show_archive_link'] ) || true !== $this->attributes['show_archive_link'] ) {
			return;
		}

		$web_stories_archive = get_post_type_archive_link( Story_Post_Type::POST_TYPE_SLUG );

		if ( empty( $web_stories_archive ) ) {
			return;
		}

		?>
		<div class="web-stories-list__archive-link">
			<a href="<?php echo esc_url( $web_stories_archive ); ?>">
				<?php echo esc_html( $this->attributes['archive_link_label'] ); ?>
			</a>
		</div>
		<?php

	}

	/**
	 * Gets the classes for renderer container.
	 *
	 * @since 1.5.0
	 *
	 * @return string
	 */
	protected function get_view_classes() {
		$view_classes   = [];
		$view_classes[] = ( ! empty( $this->attributes['view_type'] ) ) ? sprintf( 'is-view-type-%1$s', $this->attributes['view_type'] ) : 'is-view-type-circles';

		if ( $this->is_view_type( 'grid' ) && ! empty( $this->attributes['number_of_columns'] ) ) {
			$view_classes[] = sprintf( 'columns-%1$d', $this->attributes['number_of_columns'] );
		}

		if ( ! $this->is_view_type( 'circles' ) && ! empty( $this->attributes['sharp_corners'] ) ) {
			$view_classes[] = 'is-style-squared';
		} else {
			$view_classes[] = 'is-style-default';
		}

		if ( $this->is_view_type( 'circles' ) && ! empty( $this->attributes['show_title'] ) ) {
			$view_classes[] = 'has-title';
		}

		if ( $this->is_view_type( 'circles' ) || $this->is_view_type( 'carousel' ) ) {
			$view_classes[] = 'is-carousel';
		}

		return implode( ' ', $view_classes );
	}

	/**
	 * Gets the classes for renderer container.
	 *
	 * @since 1.5.0
	 *
	 * @return string
	 */
	protected function get_container_classes() {

		$container_classes   = [];
		$container_classes[] = 'web-stories-list';
		$container_classes[] = ( ! empty( $this->attributes['align'] ) ) ? sprintf( 'align%1$s', $this->attributes['align'] ) : 'alignnone';
		$container_classes[] = ( ! empty( $this->attributes['class'] ) ) ? $this->attributes['class'] : '';

		if ( ! empty( $this->attributes['show_archive_link'] ) ) {
			$container_classes[] = 'has-archive-link';
		}

		$container_classes = array_filter( $container_classes );

		$view_type_classes = $this->get_view_classes();

		return sprintf( '%1$s %2$s', implode( ' ', $container_classes ), $view_type_classes );
	}

	/**
	 * Gets the single story container classes.
	 *
	 * @since 1.5.0
	 *
	 * @return string
	 */
	protected function get_single_story_classes() {

		$single_story_classes   = [];
		$single_story_classes[] = 'web-stories-list__story';

		if ( ! empty( $this->attributes['image_alignment'] ) && ( 'right' === $this->attributes['image_alignment'] ) ) {
			$single_story_classes[] = sprintf( 'image-align-right' );
		}

		$single_story_classes = array_filter( $single_story_classes );
		$classes              = implode( ' ', $single_story_classes );

		/**
		 * Filters the web stories renderer single story classes.
		 *
		 * @since 1.5.0
		 *
		 * @param string $class Single story classes.
		 */
		return apply_filters( 'web_stories_renderer_single_story_classes', $classes );
	}

	/**
	 * Gets the single story container styles.
	 *
	 * @since 1.5.0
	 *
	 * @return string Style string.
	 */
	protected function get_container_styles() {
		$story_styles  = $this->is_view_type( 'circles' ) ? sprintf( '--ws-circle-size:%1$dpx', $this->attributes['circle_size'] ) : '';
		$story_styles .= $this->is_view_type( 'carousel' ) ? sprintf( '--ws-story-max-width:%1$dpx', $this->width ) : '';

		/**
		 * Filters the web stories renderer single story classes.
		 *
		 * @since 1.5.0
		 *
		 * @param string $class Single story classes.
		 */
		return apply_filters( 'web_stories_renderer_container_styles', $story_styles );
	}

	/**
	 * Render story markup.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function render_single_story_content() {
		/**
		 * Story object.
		 *
		 * @var Story $story
		 */
		$story = $this->current();

		$single_story_classes = $this->get_single_story_classes();
		$lightbox_state       = 'lightbox' . $story->get_id() . $this->instance_id;

		// No need to load these styles on admin as editor styles are being loaded by the block.
		if ( ! is_admin() ) {
			// Web Stories Styles for AMP and non-AMP pages.
			wp_enqueue_style( self::STYLE_HANDLE );
		}

		if ( $this->is_amp() ) {
			?>
			<div
				class="<?php echo esc_attr( $single_story_classes ); ?>"
				on="<?php echo esc_attr( sprintf( 'tap:AMP.setState({%1$s: ! %1$s})', $lightbox_state ) ); ?>"
			>
				<?php $this->render_story_with_poster(); ?>
			</div>
			<?php
		} else {
			wp_enqueue_style( Embed_Base::STORY_PLAYER_HANDLE );
			wp_enqueue_script( Embed_Base::STORY_PLAYER_HANDLE );
			wp_enqueue_script( self::LIGHTBOX_SCRIPT_HANDLE );
			?>
			<div class="<?php echo esc_attr( $single_story_classes ); ?>" data-story-url="<?php echo esc_url( $story->get_url() ); ?>">
				<?php $this->render_story_with_poster(); ?>
			</div>
			<?php
		}
	}

	/**
	 * Renders a story with story's poster image.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	protected function render_story_with_poster() {
		/**
		 * Story object.
		 *
		 * @var Story $story
		 */
		$story = $this->current();

		// TODO: Only rely on portrait poster image going forward.
		$poster_url = ( 'circles' === $this->get_view_type() ) ? $story->get_poster_square() : $story->get_poster_portrait();

		if ( ! $poster_url ) {

			?>
			<div class="web-stories-list__story-poster">
				<div class="web-stories-list__story-poster-placeholder">
					<span>
						<?php echo esc_html( $story->get_title() ); ?>
					</span>
				</div>
			</div>
			<?php
		} else {
			?>
			<div class="web-stories-list__story-poster">
				<?php
				if ( $this->is_amp() ) {
					// Set the dimensions to '0' so that we can handle image ratio/size by CSS per view type.
					?>
					<amp-img
						src="<?php echo esc_url( $poster_url ); ?>"
						layout="responsive"
						width="0"
						height="0"
						alt="<?php echo esc_attr( $story->get_title() ); ?>"
					>
					</amp-img>
				<?php } else { ?>
					<img
						src="<?php echo esc_url( $poster_url ); ?>"
						alt="<?php echo esc_attr( $story->get_title() ); ?>"
						width="<?php echo absint( $this->width ); ?>"
						height="<?php echo absint( $this->height ); ?>"
					>
				<?php } ?>
			</div>
			<?php
		}
		$this->get_content_overlay();

		if ( ! $this->is_amp() ) {
			$this->generate_lightbox_html( $story );
		} else {
			$this->generate_amp_lightbox_html_amp( $story );
		}
	}

	/**
	 * Renders the content overlay markup.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	protected function get_content_overlay() {
		/**
		 * Story object.
		 *
		 * @var Story $story
		 */
		$story = $this->current();

		if ( empty( $this->content_overlay ) ) {
			return;
		}

		?>
		<div class="web-stories-list__story-content-overlay">
			<?php if ( $this->attributes['show_title'] ) { ?>
				<div class="story-content-overlay__title">
					<?php echo esc_html( $story->get_title() ); ?>
				</div>
			<?php } ?>

			<?php if ( $this->attributes['show_excerpt'] ) { ?>
				<div class="story-content-overlay__excerpt">
					<?php echo esc_html( $story->get_excerpt() ); ?>
				</div>
			<?php } ?>

			<?php if ( ! empty( $story->get_author() ) ) { ?>
				<div class="story-content-overlay__author">
					<?php
						/* translators: %s: author name. */
						echo esc_html( sprintf( __( 'By %s', 'web-stories' ), $story->get_author() ) );
					?>
				</div>
			<?php } ?>

			<?php if ( ! empty( $story->get_date() ) ) { ?>
				<time class="story-content-overlay__date">
					<?php
						/* translators: %s: publish date. */
						echo esc_html( sprintf( __( 'On %s', 'web-stories' ), $story->get_date() ) );
					?>
				</time>
			<?php } ?>
		</div>
		<?php
	}

	/**
	 * Generate HTML for the non-AMP page request.
	 *
	 * @param Story $story Current Story.
	 *
	 * @return void
	 * @since 1.5.0
	 */
	protected function generate_lightbox_html( $story ) {
		// Start collecting markup for the lightbox stories. This way we don't have to re-run the loop.
		ob_start();

		// Collect story links to fill-in non-AMP lightbox 'amp-story-player'.
		?>
			<a href="<?php echo esc_url( $story->get_url() ); ?>"><?php echo esc_html( $story->get_title() ); ?></a>
		<?php

		$this->lightbox_html .= ob_get_clean();
	}

	/**
	 * Markup for the lightbox used on AMP pages.
	 *
	 * @param Story $story Current Story.
	 *
	 * @return void
	 * @since 1.5.0
	 */
	protected function generate_amp_lightbox_html_amp( $story ) {
		// Start collecting markup for the lightbox stories. This way we don't have to re-run the loop.
		ob_start();
		$lightbox_state = 'lightbox' . $story->get_id() . $this->instance_id;
		$lightbox_id    = 'lightbox-' . $story->get_id() . $this->instance_id;
		?>
		<amp-lightbox
			id="<?php echo esc_attr( $lightbox_id ); ?>"
			[open]="<?php echo esc_attr( $lightbox_state ); ?>"
			layout="nodisplay"
			on="lightboxClose:AMP.setState({<?php echo esc_attr( $lightbox_state ); ?>: false})"
		>
			<div class="web-stories-list__lightbox show">
				<div
					class="story-lightbox__close-button"
					on="tap:<?php echo esc_attr( $lightbox_id ); ?>.close"
				>
					<span class="story-lightbox__close-button--stick"></span>
					<span class="story-lightbox__close-button--stick"></span>
				</div>
				<amp-story-player
					width="3.6"
					height="6"
					layout="responsive"
				>
					<a href="<?php echo( esc_url( $story->get_url() ) ); ?>"><?php echo esc_html( $story->get_title() ); ?></a>
				</amp-story-player>
			</div>
		</amp-lightbox>
		<?php
		$this->lightbox_html .= ob_get_clean();
	}

	/**
	 * Renders the lightbox markup for non-amp pages.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function render_stories_with_lightbox() {
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
		<div class="web-stories-list__lightbox">
			<amp-story-player width="3.6" height="6" layout="responsive">
				<script type="application/json">
					<?php echo wp_json_encode( $data ); ?>
				</script>
				<?php echo wp_kses_post( $this->lightbox_html ); ?>
			</amp-story-player>
		</div>
		<?php
	}

	/**
	 * Renders the lightbox markup for non-amp pages.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function render_stories_with_lightbox_amp() {

		// Have to ignore this as the escaping functions are stripping off 'amp-bind' custom attribute '[class]'.
		echo $this->lightbox_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Generated with properly escaped data.

	}

	/**
	 * Renders stories lightbox on 'wp_footer'.
	 *
	 * @return void
	 */
	public function render_stories_lightbox() {
		// Return if we don't have anything to render.
		if ( empty( $this->lightbox_html ) ) {
			return;
		}
		?>
		<div class="web-stories-list__lightbox-wrapper <?php echo esc_attr( 'ws-lightbox-' . $this->instance_id ); ?>">
			<?php
			if ( $this->is_amp() ) {
				$this->render_stories_with_lightbox_amp();
			} else {
				$this->render_stories_with_lightbox();
			}
			?>
		</div>
		<?php
	}
}
