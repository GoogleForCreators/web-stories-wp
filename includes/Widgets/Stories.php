<?php
/**
 * Stories Widgets.
 *
 * @package Google\Web_Stories
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

use WP_Widget;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Traits\Assets;
use Google\Web_Stories\Traits\Stories_Script_Data;

/**
 * Class Stories
 *
 * @package Google\Web_Stories\Widgets
 */
class Stories extends WP_Widget {
	use Stories_Script_Data;
	use Assets;

	const SCRIPT_HANDLE = 'web-stories-widget';

	/**
	 * Widget args.
	 *
	 * @var array
	 */
	public $args = [
		'before_title'  => '<h4 class="widgettitle web-stories-widget-title">',
		'after_title'   => '</h4>',
		'before_widget' => '<div class="widget-wrap web-stories-widget-wrapper">',
		'after_widget'  => '</div>',
	];

	/**
	 * Stories constructor.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function __construct() {
		$id_base        = 'web_stories_widget';
		$name           = __( 'Web Stories', 'web-stories' );
		$widget_options = [
			'description' => __( 'Display Web Stories in Sidebar Section.', 'web-stories' ),
			'classname'   => 'google-stories-widget',
		];

		parent::__construct( $id_base, $name, $widget_options );
	}

	/**
	 * Output widget.
	 *
	 * phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	 *
	 * @since 1.5.0
	 *
	 * @param array $args Widget args.
	 * @param array $instance Widget instance.
	 *
	 * @return void
	 */
	public function widget( $args, $instance ) {
		echo $args['before_widget'];

		$title = $instance['widget_title'];

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		if ( ! empty( $title ) ) {
			echo $args['before_title'] . $title . $args['after_title'];
		}

		$story_attrs = [
			'view_type'          => $instance['view_type'],
			'show_title'         => (bool) $instance['show_title'],
			'show_excerpt'       => (bool) $instance['show_excerpt'],
			'show_author'        => (bool) $instance['show_author'],
			'show_date'          => (bool) $instance['show_date'],
			'show_archive_link'  => (bool) $instance['archive_link'],
			'archive_link_label' => (bool) $instance['archive_link_label'],
			'circle_size'        => (int) $instance['circle_size'],
			'sharp_corners'      => (bool) $instance['sharp_corners'],
			'image_alignment'    => (string) $instance['image_alignment'],
			'number_of_columns'  => ( (int) $instance['number_of_columns'] ),
			'class'              => 'web-stories-list--widget',
		];

		$story_args = [
			'posts_per_page' => $instance['number_of_stories'],
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
	 * @since 1.5.0
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @param array $instance Widget instance.
	 *
	 * @return string
	 */
	public function form( $instance ) {
		$this->enqueue_scripts();

		$title              = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( 'Web Stories', 'web-stories' );
		$view_types         = $this->get_layouts();
		$current_view_type  = ! empty( $instance['view_type'] ) ? (string) $instance['view_type'] : 'circles';
		$show_title         = ! empty( $instance['show_title'] ) ? (int) $instance['show_title'] : '';
		$show_author        = ! empty( $instance['show_author'] ) ? (int) $instance['show_author'] : '';
		$show_date          = ! empty( $instance['show_date'] ) ? (int) $instance['show_date'] : '';
		$show_excerpt       = ! empty( $instance['show_excerpt'] ) ? (int) $instance['show_excerpt'] : '';
		$show_archive_link  = ! empty( $instance['show_archive_link'] ) ? (int) $instance['show_archive_link'] : '';
		$archive_link_label = ! empty( $instance['archive_link_label'] ) ? $instance['archive_link_label'] : __( 'View all stories', 'web-stories' );
		$circle_size        = ! empty( $instance['circle_size'] ) ? (int) $instance['circle_size'] : 100;
		$sharp_corners      = ! empty( $instance['sharp_corners'] ) ? (int) $instance['sharp_corners'] : '';
		$image_alignment    = ! empty( $instance['image_alignment'] ) ? (string) $instance['image_alignment'] : 'left';
		$number_of_columns  = ! empty( $instance['number_of_columns'] ) ? (int) $instance['number_of_columns'] : 1;
		$number_of_stories  = ! empty( $instance['number_of_stories'] ) ? (int) $instance['number_of_stories'] : 5;
		$orderby            = ! empty( $instance['orderby'] ) ? (string) $instance['orderby'] : 'post_date';
		$order              = ! empty( $instance['order'] ) ? (string) $instance['order'] : 'DESC';

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
				'type'          => 'checkbox',
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

		$this->input(
			[
				'id'            => 'archive_link',
				'name'          => 'archive_link',
				'label'         => __( 'Display Archives Link', 'web-stories' ),
				'type'          => 'checkbox',
				'classname'     => 'widefat archive_link stories-widget-field',
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

		return '';
	}

	/**
	 * Update widget settings.
	 *
	 * @since 1.5.0
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @param array $new_instance New instance.
	 * @param array $old_instance Old instance.
	 *
	 * @return array
	 */
	public function update( $new_instance, $old_instance ) {
		$instance                       = [];
		$instance['title']              = ( ! empty( $new_instance['title'] ) ) ? wp_strip_all_tags( $new_instance['title'] ) : '';
		$instance['view_type']          = ( ! empty( $new_instance['view_type'] ) ) ? $new_instance['view_type'] : '';
		$instance['show_title']         = ( isset( $new_instance['show_title'] ) ) ? 1 : '';
		$instance['show_excerpt']       = ( isset( $new_instance['show_excerpt'] ) ) ? 1 : '';
		$instance['show_author']        = ( isset( $new_instance['show_author'] ) ) ? 1 : '';
		$instance['show_date']          = ( isset( $new_instance['show_date'] ) ) ? 1 : '';
		$instance['show_archive_link']  = ( isset( $new_instance['show_archive_link'] ) ) ? 1 : '';
		$instance['image_alignment']    = ( isset( $new_instance['image_alignment'] ) ) ? $new_instance['image_alignment'] : '';
		$instance['number_of_stories']  = min( absint( $new_instance['number_of_stories'] ), 20 );
		$instance['circle_size']        = min( absint( $new_instance['circle_size'] ), 150 );
		$instance['archive_link_label'] = isset( $new_instance['archive_link_label'] ) ? (string) $new_instance['archive_link_label'] : '';
		$instance['number_of_columns']  = isset( $new_instance['number_of_columns'] ) ? (int) $new_instance['number_of_columns'] : 1;
		$instance['sharp_corners']      = ( isset( $new_instance['sharp_corners'] ) ) ? 1 : '';

		return $instance;
	}

	/**
	 * Enqueue widget script.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		if ( wp_script_is( self::SCRIPT_HANDLE ) ) {
			return;
		}

		$this->enqueue_script( self::SCRIPT_HANDLE, [ 'jquery' ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesData',
			$this->get_script_data()
		);
	}

	/**
	 * Display dropdown.
	 *
	 * @since 1.5.0
	 *
	 * @param array $args Field args.
	 *
	 * @return void
	 */
	private function dropdown( array $args ) {
		$args = wp_parse_args(
			$args,
			[
				'options'       => [],
				'selected'      => '',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'stories-field-wrapper',
			]
		);
		?>
	<p class="<?php echo esc_attr( $args['wrapper_class'] ); ?>">

		<label for="<?php echo $this->get_field_id( $args['id'] ); ?>">
			<?php echo esc_attr( $args['label'] ); ?>
		</label>

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
	 * @param array $args Field args.
	 *
	 * @return void
	 */
	private function radio( array $args ) {
		$args = wp_parse_args(
			$args,
			[
				'options'       => [],
				'selected'      => '',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'stories-field-wrapper',
			]
		);
		?>
		<div class="<?php echo esc_attr( $args['wrapper_class'] ); ?>">
			<label>
				<?php echo esc_attr( $args['label'] ); ?>
			</label>
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
	 * @return void
	 */
	private function input( array $args ) {
		$args = wp_parse_args(
			$args,
			[
				'type'          => 'text',
				'id'            => wp_generate_uuid4(),
				'name'          => wp_generate_uuid4(),
				'label'         => '',
				'value'         => '',
				'classname'     => 'widefat',
				'wrapper_class' => 'stories-field-wrapper',
				'label_before'  => false,
			]
		);

		ob_start();
		?>
		<label for="<?php echo $this->get_field_id( $args['id'] ); ?>">
			<?php echo esc_attr( (string) $args['label'] ); ?>
		</label>
		<?php
		$label = ob_get_clean();
		?>
		<p class="<?php echo esc_attr( (string) $args['wrapper_class'] ); ?>">

			<?php
			if ( $args['label_before'] ) {
				echo $label;
			}

			$extra_attrs = '';

			if ( ! empty( $args['attributes'] ) && is_array( $args['attributes'] ) ) {
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
				value="<?php echo $args['value']; ?>"
				<?php
				if ( 'checkbox' === $args['type'] ) {
					checked( 1, $args['value'], true );
				}
				?>
				<?php echo $extra_attrs; ?>
			/>

			<?php
			if ( ! $args['label_before'] ) {
				echo $label;
			}
			?>

		</p>
		<?php
	}
}
