<?php
/**
 * Stories Renderer Base class.
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

namespace Google\Web_Stories\Renderer\Stories;

use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Interfaces\Renderer as RenderingInterface;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Services;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Story_Query;
use Iterator;
use WP_Post;

/**
 * Renderer class.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 *
 * @implements Iterator<int, Story>
 */
abstract class Renderer implements RenderingInterface, Iterator {
	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	protected $assets;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	protected $context;

	/**
	 * Web Stories stylesheet handle.
	 */
	public const STYLE_HANDLE = 'web-stories-list-styles';

	/**
	 * Web Stories stylesheet handle.
	 */
	public const LIGHTBOX_SCRIPT_HANDLE = 'lightbox';

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

		// TODO, find a way to inject this a cleaner way.
		$injector = Services::get_injector();
		if ( ! method_exists( $injector, 'make' ) ) {
			return;
		}

		$this->assets  = $injector->make( Assets::class );
		$this->context = $injector->make( Context::class );
	}

	/**
	 * Output markup for amp stories.
	 *
	 * @since 1.5.0
	 *
	 * @param array $args Array of rendering arguments.
	 * @return string
	 */
	public function render( array $args = [] ): string {
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
	 * @return Story|null
	 */
	public function current(): ?Story {
		return $this->stories[ $this->position ] ?? null;
	}

	/**
	 * Retrieve next story.
	 *
	 * @since 1.5.0
	 *
	 * @retrun void
	 */
	public function next(): void {
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
	 * @return bool
	 */
	public function valid(): bool {
		return isset( $this->stories[ $this->position ] );
	}

	/**
	 * Reset pointer to start of the list.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function rewind(): void {
		$this->position = 0;
	}

	/**
	 * Perform initial setup for object.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function init(): void {
		$this->stories = array_filter( array_map( [ $this, 'prepare_stories' ], $this->query->get_stories() ) );

		add_action( 'wp_footer', [ $this, 'render_stories_lightbox' ] );
		add_action( 'amp_post_template_footer', [ $this, 'render_stories_lightbox' ] );
	}

	/**
	 * Initializes renderer functionality.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function load_assets(): void {
		if ( wp_style_is( self::STYLE_HANDLE, 'registered' ) ) {
			return;
		}

		// Web Stories styles for AMP and non-AMP pages.
		$this->assets->register_style_asset( self::STYLE_HANDLE );

		// Web Stories lightbox script.
		$this->assets->register_script_asset( self::LIGHTBOX_SCRIPT_HANDLE, [ AMP_Story_Player_Assets::SCRIPT_HANDLE ] );

		if ( \defined( 'AMPFORWP_VERSION' ) ) {
			add_action( 'amp_post_template_css', [ $this, 'add_amp_post_template_css' ] );
		}
	}

	/**
	 * Prints required inline CSS when using the AMP for WP plugin.
	 *
	 * @since 1.13.0
	 *
	 * @return void
	 */
	public function add_amp_post_template_css(): void {
		$path = $this->assets->get_base_path( sprintf( 'assets/css/%s%s.css', self::STYLE_HANDLE, is_rtl() ? '-rtl' : '' ) );

		if ( is_readable( $path ) ) {
			$css = file_get_contents( $path ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
			echo $css; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	/**
	 * Returns story item data.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @since 1.5.0
	 *
	 * @param object $post Array of post objects.
	 * @return Story|null Story object or null if given post
	 */
	public function prepare_stories( $post ): ?Story {
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
				/* translators: Date format, see https://www.php.net/manual/en/datetime.format.php */
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
	 * @return bool Whether or not current view type matches the one passed.
	 */
	protected function is_view_type( $view_type ): bool {
		return ( ! empty( $this->attributes['view_type'] ) && $view_type === $this->attributes['view_type'] );
	}

	/**
	 * Get view type for stories.
	 *
	 * @since 1.5.0
	 *
	 * @return string
	 */
	protected function get_view_type(): string {
		return ( ! empty( $this->attributes['view_type'] ) ) ? $this->attributes['view_type'] : 'circles';
	}

	/**
	 * Renders stories archive link if the 'show_archive_link' attribute is set to true.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	protected function maybe_render_archive_link(): void {

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
	protected function get_view_classes(): string {
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
	protected function get_container_classes(): string {
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
	protected function get_single_story_classes(): string {
		$single_story_classes   = [];
		$single_story_classes[] = 'web-stories-list__story';

		if ( $this->context->is_amp() ) {
			$single_story_classes[] = 'web-stories-list__story--amp';
		}

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
	protected function get_container_styles(): string {
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
	public function render_single_story_content(): void {
		/**
		 * Story object.
		 *
		 * @var Story $story
		 */
		$story = $this->current();

		$single_story_classes = $this->get_single_story_classes();
		$lightbox_state       = 'lightbox' . $story->get_id() . $this->instance_id;
		// No need to load these styles on admin as editor styles are being loaded by the block.
		if ( ! is_admin() || ( \defined( 'IFRAME_REQUEST' ) && IFRAME_REQUEST ) ) {
			// Web Stories Styles for AMP and non-AMP pages.
			$this->assets->enqueue_style_asset( self::STYLE_HANDLE );
		}

		if ( $this->context->is_amp() ) {
			?>
			<div
				class="<?php echo esc_attr( $single_story_classes ); ?>"
				on="<?php echo esc_attr( sprintf( 'tap:AMP.setState({%1$s: ! %1$s})', $lightbox_state ) ); ?>"
				tabindex="0"
				role="button"
			>
				<?php $this->render_story_with_poster(); ?>
			</div>
			<?php
		} else {
			$this->assets->enqueue_style( AMP_Story_Player_Assets::SCRIPT_HANDLE );
			$this->assets->enqueue_script( AMP_Story_Player_Assets::SCRIPT_HANDLE );
			$this->assets->enqueue_script_asset( self::LIGHTBOX_SCRIPT_HANDLE );
			?>
			<div class="<?php echo esc_attr( $single_story_classes ); ?>">
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
	protected function render_story_with_poster(): void {
		/**
		 * Story object.
		 *
		 * @var Story $story
		 */
		$story = $this->current();

		$poster_url    = $story->get_poster_portrait();
		$poster_srcset = $story->get_poster_srcset();
		$poster_sizes  = $story->get_poster_sizes();

		if ( ! $poster_url ) {
			?>
			<div class="web-stories-list__story-poster">
				<div class="web-stories-list__story-poster-placeholder">
					<a href="<?php echo esc_url( $story->get_url() ); ?>" <?php $this->render_link_attributes(); ?>>
						<?php echo esc_html( $story->get_title() ); ?>
					</a>
				</div>
			</div>
			<?php
		} else {
			?>
			<div class="web-stories-list__story-poster">
				<a href="<?php echo esc_url( $story->get_url() ); ?>" <?php $this->render_link_attributes(); ?>>
					<img
						src="<?php echo esc_url( $poster_url ); ?>"
						alt="<?php echo esc_attr( $story->get_title() ); ?>"
						width="<?php echo absint( $this->width ); ?>"
						height="<?php echo absint( $this->height ); ?>"
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
		$this->get_content_overlay();

		if ( ! $this->context->is_amp() ) {
			$this->generate_lightbox_html( $story );
		} else {
			$this->generate_amp_lightbox_html_amp( $story );
		}
	}

	/**
	 * Render additional link attributes.
	 *
	 * Allows customization of html attributes in the web stories widget anchor tag loop
	 * Converts array into escaped inline html attributes.
	 *
	 * @since 1.17.0
	 *
	 * @return void
	 */
	protected function render_link_attributes(): void {
		/**
		 * The current story.
		 *
		 * @var Story $story
		 */
		$story = $this->current();

		/**
		 * Filters the link attributes added to a story's <a> tag.
		 *
		 * @since 1.17.0
		 *
		 * @param array  $attributes Key value array of attribute name to attribute value.
		 * @param Story  $story      The current story instance.
		 * @param int    $position   The current story's position within the list.
		 * @param string $view_type  The current view type.
		 */
		$attributes = apply_filters( 'web_stories_renderer_link_attributes', [], $story, $this->position, $this->get_view_type() );

		$attrs = [];

		if ( ! empty( $attributes ) ) {
			foreach ( $attributes as $attribute => $value ) {
				$attrs[] = wp_kses_one_attr( $attribute . '="' . esc_attr( $value ) . '"', 'a' );
			}
		}

		$attrs = array_filter( $attrs ); // Filter out empty values rejected by KSES.

		//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
		echo implode( ' ', $attrs );
	}

	/**
	 * Renders the content overlay markup.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	protected function get_content_overlay(): void {
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
						/* translators: byline. %s: author name. */
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
	 * @since 1.5.0
	 *
	 * @param Story $story Current Story.
	 * @return void
	 */
	protected function generate_lightbox_html( $story ): void {
		// Start collecting markup for the lightbox stories. This way we don't have to re-run the loop.
		ob_start();

		// Collect story links to fill-in non-AMP lightbox 'amp-story-player'.
		?>
			<a href="<?php echo esc_url( $story->get_url() ); ?>" <?php $this->render_link_attributes(); ?>><?php echo esc_html( $story->get_title() ); ?></a>
		<?php

		$this->lightbox_html .= ob_get_clean();
	}

	/**
	 * Markup for the lightbox used on AMP pages.
	 *
	 * @since 1.5.0
	 *
	 * @param Story $story Current Story.
	 * @return void
	 */
	protected function generate_amp_lightbox_html_amp( $story ): void {
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
			role="button"
			tabindex="0"
		>
			<div class="web-stories-list__lightbox show">
				<button type="button"
					class="story-lightbox__close-button"
					on="tap:<?php echo esc_attr( $lightbox_id ); ?>.close"
					aria-label="<?php esc_attr_e( 'Close', 'web-stories' ); ?>"
				>
					<span class="story-lightbox__close-button--stick"></span>
					<span class="story-lightbox__close-button--stick"></span>
				</button>
				<amp-story-player
					width="3.6"
					height="6"
					layout="responsive"
				>
					<a href="<?php echo( esc_url( $story->get_url() ) ); ?>" <?php $this->render_link_attributes(); ?>><?php echo esc_html( $story->get_title() ); ?></a>
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
	public function render_stories_with_lightbox(): void {
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
	public function render_stories_with_lightbox_amp(): void {
		// Have to ignore this as the escaping functions are stripping off 'amp-bind' custom attribute '[class]'.
		echo $this->lightbox_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Generated with properly escaped data.

	}

	/**
	 * Renders stories lightbox on 'wp_footer'.
	 *
	 * @return void
	 */
	public function render_stories_lightbox(): void {
		// Return if we don't have anything to render.
		if ( empty( $this->lightbox_html ) ) {
			return;
		}
		?>
		<div class="web-stories-list__lightbox-wrapper <?php echo esc_attr( 'ws-lightbox-' . $this->instance_id ); ?>">
			<?php
			if ( $this->context->is_amp() ) {
				$this->render_stories_with_lightbox_amp();
			} else {
				$this->render_stories_with_lightbox();
			}
			?>
		</div>
		<?php
	}
}
