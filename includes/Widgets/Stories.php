<?php
/**
 * Stories Widgets.
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

namespace Google\Web_Stories\Widgets;

use Google\Web_Stories\Assets;
use Google\Web_Stories\Stories_Script_Data;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Story_Query;
use WP_Widget;

/**
 * Class Stories
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 *
 * @phpstan-type InputArgs array{
 *   type?: string,
 *   id?: string,
 *   name?: string,
 *   label?: string,
 *   value?: string|bool|int,
 *   classname?: string,
 *   wrapper_class?: string,
 *   label_before?: bool,
 *   attributes?: array<string,string|int>
 * }
 */
class Stories extends WP_Widget {

	public const SCRIPT_HANDLE = 'web-stories-widget';

	/**
	 * Widget args.
	 *
	 * @var array<string,string>
	 */
	public $args = [
		'before_title'  => '<h4 class="widgettitle web-stories-widget-title">',
		'after_title'   => '</h4>',
		'before_widget' => '<div class="widget-wrap web-stories-widget-wrapper">',
		'after_widget'  => '</div>',
	];

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	protected $assets;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Stories_Script_Data instance.
	 *
	 * @var Stories_Script_Data Stories_Script_Data instance.
	 */
	protected $stories_script_data;

	/**
	 * Stories constructor.
	 *
	 * @since 1.5.0
	 *
	 * @param Assets              $assets Assets instance.
	 * @param Story_Post_Type     $story_post_type Story_Post_Type instance.
	 * @param Stories_Script_Data $stories_script_data Stories_Script_Data instance.
	 * @return void
	 */
	public function __construct( Assets $assets, Story_Post_Type $story_post_type, Stories_Script_Data $stories_script_data ) {
		$this->assets              = $assets;
		$this->story_post_type     = $story_post_type;
		$this->stories_script_data = $stories_script_data;
		$id_base                   = 'web_stories_widget';
		$name                      = __( 'Web Stories', 'web-stories' );
		$widget_options            = [
			'description'           => __( 'Display Web Stories in sidebar section.', 'web-stories' ),
			'classname'             => 'web-stories-widget',
			'show_instance_in_rest' => true,
		];

		parent::__construct( $id_base, $name, $widget_options );
	}

	/**
	 * Output widget.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,string>          $args Widget args.
	 * @param array<string,string|int|bool> $instance Widget instance.
	 *
     * phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	 */
	public function widget( $args, $instance ): void {
		echo $args['before_widget'];

		$instance = wp_parse_args( $instance, $this->default_values() );

		$title = $instance['title'];

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		if ( ! empty( $title ) ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}

		$instance['number_of_columns'] = (int) $instance['number_of_columns'];
		$instance['number_of_stories'] = (int) $instance['number_of_stories'];
		$instance['circle_size']       = (int) $instance['circle_size'];

		$story_attrs = [
			'view_type'          => $instance['view_type'],
			'show_title'         => (bool) $instance['show_title'],
			'show_excerpt'       => (bool) $instance['show_excerpt'],
			'show_author'        => (bool) $instance['show_author'],
			'show_date'          => (bool) $instance['show_date'],
			'show_archive_link'  => (bool) $instance['show_archive_link'],
			'archive_link_label' => (string) $instance['archive_link_label'],
			'circle_size'        => min( absint( $instance['circle_size'] ), 150 ),
			'sharp_corners'      => (bool) $instance['sharp_corners'],
			'image_alignment'    => (string) $instance['image_alignment'],
			'number_of_columns'  => min( absint( $instance['number_of_columns'] ), 4 ),
			'class'              => 'web-stories-list--widget',
		];

		$story_args = [
			'posts_per_page' => min( absint( $instance['number_of_stories'] ), 20 ), // phpcs:ignore WordPress.WP.PostsPerPage.posts_per_page_posts_per_page
			'orderby'        => $instance['orderby'],
			'order'          => $instance['order'],
		];

		$story_query = new Story_Query( $story_attrs, $story_args );
		echo $story_query->render();

		echo $args['after_widget'];
	}

	/**
	 * Display widget form.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,string|int|bool> $instance Widget instance.
	 */
	public function form( $instance ): string {
		$this->enqueue_scripts();

		$instance = wp_parse_args( $instance, $this->default_values() );

		$title              = (string) $instance['title'];
		$view_types         = $this->stories_script_data->get_layouts();
		$current_view_type  = (string) $instance['view_type'];
		$show_title         = ! empty( $instance['show_title'] );
		$show_author        = ! empty( $instance['show_author'] );
		$show_date          = ! empty( $instance['show_date'] );
		$show_excerpt       = ! empty( $instance['show_excerpt'] );
		$show_archive_link  = ! empty( $instance['show_archive_link'] );
		$archive_link_label = (string) $instance['archive_link_label'];
		$circle_size        = (int) $instance['circle_size'];
		$sharp_corners      = (int) $instance['sharp_corners'];
		$image_alignment    = (string) $instance['image_alignment'];
		$number_of_columns  = (int) $instance['number_of_columns'];
		$number_of_stories  = (int) $instance['number_of_stories'];
		$orderby            = (string) $instance['orderby'];
		$order              = (string) $instance['order'];

		$has_archive = $this->story_post_type->get_has_archive();

		$this->input(
			[
				'id'           => 'title',
				'name'         => 'title',
				'label'        => __( 'Widget Title', 'web-stories' ),
				'type'         => 'text',
				'value'        => $title,
				'label_before' => true,
			]
		);

		$this->dropdown(
			[
				'options'   => $view_types,
				'selected'  => $current_view_type,
				'name'      => 'view_type',
				'id'        => 'view_type',
				'label'     => __( 'Select Layout', 'web-stories' ),
				'classname' => 'widefat view_type stories-widget-field',
			]
		);

		$this->input(
			[
				'id'            => 'number_of_stories',
				'name'          => 'number_of_stories',
				'label'         => __( 'Number of Stories', 'web-stories' ),
				'type'          => 'number',
				'classname'     => 'widefat number_of_stories stories-widget-field',
				'wrapper_class' => 'number_of_stories_wrapper',
				'value'         => $number_of_stories,
				'label_before'  => true,
				'attributes'    => [
					'min' => 1,
					'max' => 20,
				],
			]
		);

		$this->dropdown(
			[
				'options'   => [
					'post_title' => __( 'Title', 'web-stories' ),
					'post_date'  => __( 'Date', 'web-stories' ),
				],
				'selected'  => $orderby,
				'name'      => 'orderby',
				'id'        => 'orderby',
				'label'     => __( 'Order By', 'web-stories' ),
				'classname' => 'widefat orderby stories-widget-field',
			]
		);

		$this->dropdown(
			[
				'options'   => [
					'ASC'  => __( 'Ascending', 'web-stories' ),
					'DESC' => __( 'Descending', 'web-stories' ),
				],
				'selected'  => $order,
				'name'      => 'order',
				'id'        => 'order',
				'label'     => __( 'Order', 'web-stories' ),
				'classname' => 'widefat order stories-widget-field',
			]
		);


		$this->input(
			[
				'id'            => 'circle-size',
				'name'          => 'circle_size',
				'label'         => __( 'Circle Size', 'web-stories' ),
				'type'          => 'number',
				'classname'     => 'widefat circle_size stories-widget-field',
				'wrapper_class' => 'circle_size_wrapper',
				'value'         => $circle_size,
				'label_before'  => true,
				'attributes'    => [
					'min'  => 80,
					'max'  => 200,
					'step' => 5,
				],
			]
		);

		$this->input(
			[
				'id'            => 'number_of_columns',
				'name'          => 'number_of_columns',
				'label'         => __( 'Number of Columns', 'web-stories' ),
				'type'          => 'number',
				'classname'     => 'widefat number_of_columns stories-widget-field',
				'wrapper_class' => 'number_of_columns_wrapper',
				'value'         => $number_of_columns,
				'label_before'  => true,
				'attributes'    => [
					'min' => 1,
					'max' => 4,
				],
			]
		);

		$this->input(
			[
				'id'            => 'show_title',
				'name'          => 'show_title',
				'label'         => __( 'Display Title', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat title stories-widget-field',
				'wrapper_class' => 'title_wrapper',
				'value'         => $show_title,
			]
		);

		$this->input(
			[
				'id'            => 'show_excerpt',
				'name'          => 'show_excerpt',
				'label'         => __( 'Display Excerpt', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat excerpt stories-widget-field',
				'wrapper_class' => 'excerpt_wrapper',
				'value'         => $show_excerpt,
			]
		);

		$this->input(
			[
				'id'            => 'show_author',
				'name'          => 'show_author',
				'label'         => __( 'Display Author', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat author stories-widget-field',
				'wrapper_class' => 'author_wrapper',
				'value'         => $show_author,
			]
		);

		$this->input(
			[
				'id'            => 'show_date',
				'name'          => 'show_date',
				'label'         => __( 'Display Date', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat date stories-widget-field',
				'wrapper_class' => 'date_wrapper',
				'value'         => $show_date,
			]
		);

		$this->radio(
			[
				'options'       => [
					'left'  => __( 'Left', 'web-stories' ),
					'right' => __( 'Right', 'web-stories' ),
				],
				'selected'      => $image_alignment,
				'id'            => 'image_alignment',
				'name'          => 'image_alignment',
				'label'         => __( 'Image Alignment', 'web-stories' ),
				'classname'     => 'widefat image_alignment stories-widget-field',
				'wrapper_class' => 'image_alignment_wrapper',
			]
		);

		$this->input(
			[
				'id'            => 'sharp_corners',
				'name'          => 'sharp_corners',
				'label'         => __( 'Use Sharp Corners', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat sharp_corners stories-widget-field',
				'wrapper_class' => 'sharp_corners_wrapper',
				'value'         => $sharp_corners,
			]
		);

		if ( $has_archive ) {
			$this->input(
				[
					'id'            => 'show_archive_link',
					'name'          => 'show_archive_link',
					'label'         => __( 'Display Archive Link', 'web-stories' ),
					'type'          => 'checkbox',
					'classname'     => 'widefat show_archive_link stories-widget-field',
					'wrapper_class' => 'archive_link_wrapper',
					'value'         => $show_archive_link,
				]
			);

			$this->input(
				[
					'id'            => 'archive_link_label',
					'name'          => 'archive_link_label',
					'label'         => __( 'Archive Link Label', 'web-stories' ),
					'type'          => 'text',
					'classname'     => 'widefat archive_link_label stories-widget-field',
					'wrapper_class' => 'archive_link_label_wrapper',
					'value'         => $archive_link_label,
					'label_before'  => true,
				]
			);
		}

		return '';
	}

	/**
	 * Update widget settings.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,string|int|bool> $new_instance New instance.
	 * @param array<string,string|int|bool> $old_instance Old instance.
	 * @return array<string,string|int|bool>
	 */
	public function update( $new_instance, $old_instance ): array {
		$instance = [];

		$new_instance = wp_parse_args( $new_instance, $this->default_values() );

		$instance['title']              = wp_strip_all_tags( $new_instance['title'] );
		$instance['view_type']          = $new_instance['view_type'];
		$instance['show_title']         = $new_instance['show_title'];
		$instance['show_excerpt']       = $new_instance['show_excerpt'];
		$instance['show_author']        = $new_instance['show_author'];
		$instance['show_date']          = $new_instance['show_date'];
		$instance['show_archive_link']  = $new_instance['show_archive_link'];
		$instance['image_alignment']    = $new_instance['image_alignment'];
		$instance['number_of_columns']  = min( absint( $new_instance['number_of_columns'] ), 4 );
		$instance['number_of_stories']  = min( absint( $new_instance['number_of_stories'] ), 20 );
		$instance['circle_size']        = min( absint( $new_instance['circle_size'] ), 150 );
		$instance['archive_link_label'] = $new_instance['archive_link_label'];
		$instance['sharp_corners']      = $new_instance['sharp_corners'];
		$instance['orderby']            = $new_instance['orderby'];
		$instance['order']              = $new_instance['order'];

		return $instance;
	}

	/**
	 * Default values of an instance.
	 *
	 * @since 1.5.0
	 *
	 * @return array<string,string|int> Default values.
	 */
	private function default_values(): array {
		return [
			'title'              => esc_html__( 'Web Stories', 'web-stories' ),
			'view_type'          => 'circles',
			'show_title'         => '',
			'show_excerpt'       => '',
			'show_author'        => '',
			'show_date'          => '',
			'show_archive_link'  => '',
			'image_alignment'    => 'left',
			'number_of_columns'  => 1,
			'number_of_stories'  => 5,
			'circle_size'        => 100,
			'archive_link_label' => __( 'View all stories', 'web-stories' ),
			'sharp_corners'      => '',
			'orderby'            => 'post_date',
			'order'              => 'DESC',
		];
	}

	/**
	 * Enqueue widget script.
	 *
	 * @since 1.5.0
	 */
	public function enqueue_scripts(): void {
		if ( wp_script_is( self::SCRIPT_HANDLE ) ) {
			return;
		}

		$this->assets->enqueue_style_asset( self::SCRIPT_HANDLE );
		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE, [ 'jquery' ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesData',
			$this->stories_script_data->get_script_data()
		);
	}

	/**
	 * Display dropdown.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,string|array<string,string>> $args Field args.
	 */
	private function dropdown( array $args ): void {
		$args = wp_parse_args(
			$args,
			[
				'options'       => [],
				'selected'      => '',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'web-stories-field-wrapper',
			]
		);
		?>
	<p class="<?php echo esc_attr( $args['wrapper_class'] ); ?>">
		<?php echo $this->label( $args ); ?>

		<select
			class="<?php echo esc_attr( (string) $args['classname'] ); ?>"
			id="<?php echo $this->get_field_id( $args['id'] ); ?>"
			name="<?php echo $this->get_field_name( $args['name'] ); ?>"
		>
			<?php

			foreach ( $args['options'] as $key => $type ) {
				?>
				<option value="<?php echo esc_attr( $key ); ?>"
					<?php selected( $key, $args['selected'], true ); ?>
				>
					<?php echo esc_attr( $type ); ?>
				</option>
				<?php
			}
			?>
		</select>
		</p>
		<?php
	}

	/**
	 * Display radio buttons.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,mixed> $args Field args.
	 */
	private function radio( array $args ): void {
		$args = wp_parse_args(
			$args,
			[
				'options'       => [],
				'selected'      => '',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'web-stories-field-wrapper',
			]
		);
		?>
		<div class="<?php echo esc_attr( $args['wrapper_class'] ); ?>">
			<?php echo $this->label( $args ); ?>
			<p>
				<?php
				foreach ( $args['options'] as $key => $type ) {
					?>
					<label>
						<input
							type="radio"
							class="<?php echo esc_attr( (string) $args['classname'] ); ?>"
							id="<?php echo $this->get_field_id( $args['id'] . '-' . $key ); ?>"
							name="<?php echo $this->get_field_name( $args['name'] ); ?>"
							value="<?php echo esc_attr( $key ); ?>"
							<?php checked( $key, $args['selected'], true ); ?>
						/>
						<?php echo esc_attr( $type ); ?>
					</label>
					<br>
					<?php
				}
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Display an input field.
	 *
	 * @since 1.5.0
	 *
	 * @param array $args Field args.
	 *
	 * @phpstan-param InputArgs $args
	 */
	private function input( array $args ): void {
		$args = wp_parse_args(
			$args,
			[
				'type'          => 'text',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'value'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'web-stories-field-wrapper',
				'label_before'  => false,
				'attributes'    => [],
			]
		);

		?>
		<p class="<?php echo esc_attr( (string) $args['wrapper_class'] ); ?>">

			<?php
			if ( $args['label_before'] ) {
				echo $this->label( $args );
			}

			$extra_attrs = '';

			if ( ! empty( $args['attributes'] ) && \is_array( $args['attributes'] ) ) {
				/**
				 * Value.
				 *
				 * @var string $attr_val
				 */
				foreach ( $args['attributes'] as $attr_key => $attr_val ) {
					$extra_attrs .= sprintf( ' %1s=%2s', $attr_key, esc_attr( $attr_val ) );
				}
			}
			?>

			<input
				class="<?php echo esc_attr( (string) $args['classname'] ); ?>"
				type="<?php echo esc_attr( (string) $args['type'] ); ?>"
				id="<?php echo $this->get_field_id( $args['id'] ); ?>"
				name="<?php echo $this->get_field_name( $args['name'] ); ?>"
				value="<?php echo ( 'checkbox' === $args['type'] ) ? 1 : $args['value']; ?>"
				<?php
				if ( 'checkbox' === $args['type'] ) {
					checked( 1, $args['value'], true );
				}
				?>
				<?php echo $extra_attrs; ?>
			/>

			<?php
			if ( ! $args['label_before'] ) {
				echo $this->label( $args );
			}
			?>

		</p>
		<?php
	}

	/**
	 * Display an label.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,mixed> $args Label args.
	 */
	private function label( array $args ): string {
		$args = wp_parse_args(
			$args,
			[
				'id'    => '',
				'label' => '',
			]
		);
		ob_start();
		?>
		<label for="<?php echo esc_attr( $this->get_field_id( $args['id'] ) ); ?>">
			<?php echo esc_html( (string) $args['label'] ); ?>
		</label>
		<?php

		return (string) ob_get_clean();
	}

}
