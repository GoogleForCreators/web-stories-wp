<?php
/**
 * Class Customizer
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

namespace Google\Web_Stories;

/**
 * Class customizer settings.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 *
 * @package Google\Web_Stories
 */
class Customizer {

	/**
	 * Customizer section slug.
	 *
	 * @var string
	 */
	const SECTION_SLUG = 'web_story_options';

	/**
	 * Experiments instance.
	 *
	 * @var \WP_Customize_Manager $wp_customize WP_Customize_Manager instance.
	 */
	private $wp_customize;

	/**
	 * Initializes the customizer logic.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'customize_register', [ $this, 'register_customizer_settings' ] );
	}

	/**
	 * Registers customizer settings for web stories.
	 *
	 * @param \WP_Customize_Manager $wp_customize WP_Customize_Manager instance.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 * @SuppressWarnings(PHPMD.CyclomaticComplexity)
	 *
	 * @return void
	 */
	public function register_customizer_settings( \WP_Customize_Manager $wp_customize ) {

		$this->wp_customize = $wp_customize;

		$options = get_theme_support( 'web-story-options' );

		$view_type         = ( ! empty( $options[0]['view-type'] ) && is_array( $options[0]['view-type'] ) ) ? $options[0]['view-type'] : [];
		$view_type_default = ( ! empty( $options[0]['view-type-default'] ) ) ? $options[0]['view-type-default'] : 'circles';

		$show_title         = ( ! empty( $options[0]['title'] ) ) ? $options[0]['title'] : false;
		$show_title_default = ( ! empty( $options[0]['title-default'] ) ) ? $options[0]['title-default'] : false;

		$show_author         = ( ! empty( $options[0]['author'] ) ) ? $options[0]['author'] : false;
		$show_author_default = ( ! empty( $options[0]['author-default'] ) ) ? $options[0]['author-default'] : false;

		$show_date         = ( ! empty( $options[0]['date'] ) ) ? $options[0]['date'] : false;
		$show_date_default = ( ! empty( $options[0]['date-default'] ) ) ? $options[0]['date-default'] : false;

		$show_stories_archive_link = ( ! empty( $options[0]['stories-archive-link'] ) ) ? $options[0]['stories-archive-link'] : false;
		$stories_archive_label     = ( ! empty( $options[0]['stories-archive-label'] ) ) ? $options[0]['stories-archive-label'] : 'View all stories';

		$number_of_stories = ( ! empty( $options[0]['number-of-stories'] ) && is_numeric( $options[0]['number-of-stories'] ) ) ? $options[0]['number-of-stories'] : 5;

		$order         = ( ! empty( $options[0]['order'] ) && is_array( $options[0]['order'] ) ) ? $options[0]['order'] : [];
		$order_default = ( ! empty( $options[0]['order-default'] ) ) ? $options[0]['order-default'] : 'latest';

		$show_story_poster_default = ( ! empty( $options[0]['show-story-poster-default'] ) ) ? $options[0]['show-story-poster-default'] : true;

		$number_of_columns_default = ( ! empty( $options[0]['grid-columns-default'] ) && is_numeric( $options[0]['grid-columns-default'] ) ) ? $options[0]['grid-columns-default'] : 2;

		// Add Content section.
		$wp_customize->add_section(
			self::SECTION_SLUG,
			[
				'title'          => esc_html__( 'Web Story Options', 'web-stories' ),
				'theme_supports' => 'web-story-options',
			]
		);

		$wp_customize->add_setting(
			'story-options[show_stories]',
			[
				'default' => false,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[show_stories]',
			[
				'type'    => 'checkbox',
				'section' => self::SECTION_SLUG,
				'label'   => __( 'Show stories', 'web-stories' ),
			]
		);

		$wp_customize->add_setting(
			'story-options[view_type]',
			[
				'default' => $view_type_default,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[view_type]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Story view type', 'web-stories' ),
				'type'            => 'select',
				'choices'         => $this->get_view_type_choices( $view_type ),
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);

		$wp_customize->add_setting(
			'story-options[number_of_stories]',
			[
				'default'           => $number_of_stories,
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_stories' ],
			]
		);

		$wp_customize->add_control(
			'story-options[number_of_stories]',
			[
				'type'            => 'number',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Number of stories', 'web-stories' ),
				'input_attrs'     => [
					'min' => 1,
					'max' => 20,
				],
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);

		$wp_customize->add_setting(
			'story-options[number_of_columns]',
			[
				'default'           => $number_of_columns_default,
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_columns' ],
			]
		);

		$wp_customize->add_control(
			'story-options[number_of_columns]',
			[
				'type'            => 'number',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Number of columns', 'web-stories' ),
				'input_attrs'     => [
					'min' => 1,
					'max' => 4,
				],
				'active_callback' => function() {
					return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'grid' ) );
				},
			]
		);

		$wp_customize->add_setting(
			'story-options[order]',
			[
				'default' => $order_default,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[order]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Order by', 'web-stories' ),
				'type'            => 'select',
				'choices'         => $this->get_order_choices( $order ),
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);

		$wp_customize->add_setting(
			'story-options[list_view_image_alignment]',
			[
				'type'    => 'option',
				'default' => 'left',
			]
		);

		$wp_customize->add_control(
			'story-options[list_view_image_alignment]',
			[
				'type'            => 'radio',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Image alignment', 'web-stories' ),
				'choices'         => [
					'left'  => __( 'Left', 'web-stories' ),
					'right' => __( 'Right', 'web-stories' ),
				],
				'active_callback' => function() {
					return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'list' ) );
				},
			]
		);

		if ( true === $show_title ) {

			$wp_customize->add_setting(
				'story-options[show_title]',
				[
					'default' => $show_title_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_title]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show story title', 'web-stories' ),
					'active_callback' => function() {
						return $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' );
					},
				]
			);
		}

		if ( true === $show_author ) {
			$wp_customize->add_setting(
				'story-options[show_author]',
				[
					'default' => $show_author_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_author]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show author', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
					},
				]
			);
		}

		if ( true === $show_date ) {
			$wp_customize->add_setting(
				'story-options[show_date]',
				[
					'default' => $show_date_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_date]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show date', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
					},
				]
			);
		}

		$wp_customize->add_setting(
			'story-options[show_square_corners]',
			[
				'default' => false,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[show_square_corners]',
			[
				'type'            => 'checkbox',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Show square corners', 'web-stories' ),
				'active_callback' => function() {
					return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
				},
			]
		);

		if ( true === $show_stories_archive_link ) {
			$wp_customize->add_setting(
				'story-options[show_stories_archive_link]',
				[
					'default' => false,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_stories_archive_link]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show stories archive link', 'web-stories' ),
					'active_callback' => function() {
						return $this->is_option_enabled( 'show_stories' );
					},
				]
			);

			$wp_customize->add_setting(
				'story-options[stories_archive_label]',
				[
					'type'    => 'option',
					'default' => $stories_archive_label,
				]
			);

			$wp_customize->add_control(
				'story-options[stories_archive_label]',
				[
					'type'            => 'text',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Stories archive label', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && $this->is_option_enabled( 'show_stories_archive_link' ) );
					},
				]
			);

			$wp_customize->add_setting(
				'story-options[show_story_poster]',
				[
					'default' => $show_story_poster_default,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				'story-options[show_story_poster]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show story poster', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'grid' ) );
					},
				]
			);

		}

	}

	/**
	 * Gets the view type choices.
	 *
	 * @param array $view_type View type to check.
	 *
	 * @return array An array of view type choices.
	 */
	protected function get_view_type_choices( $view_type ) {

		if ( empty( $view_type ) ) {
			return [ 'circles' => __( 'Circles', 'web-stories' ) ];
		}

		$view_type_choices = [];

		if ( in_array( 'circles', $view_type ) ) {
			$view_type_choices['circles'] = __( 'Circles', 'web-stories' );
		}

		if ( in_array( 'grid', $view_type ) ) {
			$view_type_choices['grid'] = __( 'Grid', 'web-stories' );
		}

		if ( in_array( 'list', $view_type ) ) {
			$view_type_choices['list'] = __( 'List', 'web-stories' );
		}

		if ( in_array( 'carousel', $view_type ) ) {
			$view_type_choices['carousel'] = __( 'Carousel', 'web-stories' );
		}

		return $view_type_choices;

	}


	/**
	 * Gets the order choices.
	 *
	 * @param array $order An array of order support.
	 *
	 * @return array An array of order choices.
	 */
	protected function get_order_choices( $order ) {

		$order_choices = [];

		if ( empty( $order ) ) {
			return [
				'latest'               => __( 'Latest', 'web-stories' ),
				'oldest'               => __( 'Oldest', 'web-stories' ),
				'alphabetical'         => __( 'A -> Z', 'web-stories' ),
				'reverse-alphabetical' => __( 'Z -> A', 'web-stories' ),
			];
		}

		if ( in_array( 'latest', $order ) ) {
			$order_choices['latest'] = __( 'Latest', 'web-stories' );
		}

		if ( in_array( 'oldest', $order ) ) {
			$order_choices['oldest'] = __( 'Oldest', 'web-stories' );
		}

		if ( in_array( 'alphabetical', $order ) ) {
			$order_choices['alphabetical'] = __( 'A -> Z', 'web-stories' );
		}

		if ( in_array( 'reverse-alphabetical', $order ) ) {
			$order_choices['reverse-alphabetical'] = __( 'Z -> A', 'web-stories' );
		}

		return $order_choices;

	}

	/**
	 * Checks whether the given option is enabled or not.
	 *
	 * @param string $option_name The name of the option to check.
	 *
	 * @return boolean Returns true if the given option is enabled otherwise false.
	 */
	protected function is_option_enabled( $option_name ) {
		$setting = $this->wp_customize->get_setting( "story-options[{$option_name}]" );
		return ( $setting instanceof \WP_Customize_Setting && true === $setting->value() );
	}

	/**
	 * Verifies the current view type.
	 *
	 * @param string $view_type View type to check.
	 *
	 * @return bool Whether or not current view type matches the one passed.
	 */
	protected function is_view_type( $view_type ) {
		$setting = $this->wp_customize->get_setting( 'story-options[view_type]' );
		return ( $setting instanceof \WP_Customize_Setting && $view_type === $setting->value() );
	}

	/**
	 * Validates the number of story setting value.
	 *
	 * @param \WP_Error $validity WP_Error object.
	 * @param int       $value    Value to be validated.
	 *
	 * @return \WP_Error
	 */
	public function validate_number_of_stories( $validity, $value ) {
		$value = intval( $value );

		if ( $value <= 0 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 20.', 'web-stories' ) );
		} elseif ( $value > 20 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 20.', 'web-stories' ) );
		}
		return $validity;
	}

	/**
	 * Validates the number of columns setting value.
	 *
	 * @param \WP_Error $validity WP_Error object.
	 * @param int       $value Value to be validated.
	 *
	 * @return \WP_Error
	 */
	public function validate_number_of_columns( $validity, $value ) {
		$value = intval( $value );

		if ( $value <= 0 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 4.', 'web-stories' ) );
		} elseif ( $value > 5 ) {
			$validity->add( 'invalid_number', __( 'The number of stories must be between 1 and 4.', 'web-stories' ) );
		}
		return $validity;
	}

	/**
	 * Renders web stories based on the customizer selected options.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 * @SuppressWarnings(PHPMD.CyclomaticComplexity)
	 *
	 * @return string|void
	 */
	public static function render_stories() {
		$options = get_option( 'story-options' );

		if ( empty( $options['show_stories'] ) || true !== $options['show_stories'] ) {
			return;
		}

		$theme_support = get_theme_support( 'web-story-options' );

		$default_array = [
			'view_type'             => ( ! empty( $theme_support[0]['view-type-default'] ) ) ? $theme_support[0]['view-type-default'] : 'circles',
			'show_title'            => ( ! empty( $theme_support[0]['title-default'] ) ) ? $theme_support[0]['title-default'] : false,
			'show_author'           => ( ! empty( $theme_support[0]['author-default'] ) ) ? $theme_support[0]['author-default'] : false,
			'show_date'             => ( ! empty( $theme_support[0]['date-default'] ) ) ? $theme_support[0]['date-default'] : false,
			'stories_archive_label' => ( ! empty( $theme_support[0]['stories-archive-label'] ) ) ? $theme_support[0]['stories-archive-label'] : 'View all stories',
			'show_story_poster'     => ( ! empty( $theme_support[0]['show-story-poster-default'] ) ) ? $theme_support[0]['show-story-poster-default'] : true,
			'number_of_columns'     => ( ! empty( $theme_support[0]['grid-columns-default'] ) && is_numeric( $theme_support[0]['grid-columns-default'] ) ) ? $theme_support[0]['grid-columns-default'] : 2,
		];

		$query_arguments = [
			'posts_per_page' => ( ! empty( $theme_support[0]['number-of-stories'] ) && is_numeric( $theme_support[0]['number-of-stories'] ) ) ? $theme_support[0]['number-of-stories'] : 5,
		];

		$query_arguments['posts_per_page'] = ! empty( $options['number_of_stories'] ) ? $options['number_of_stories'] : $query_arguments['posts_per_page'];

		$order_by = ! empty( $theme_support[0]['order-default'] ) ? $theme_support[0]['order-default'] : 'latest';
		$order_by = ! empty( $options['order'] ) ? $options['order'] : $order_by;

		switch ( $order_by ) {
			case 'oldest':
				$query_arguments['order'] = 'ASC';
				break;
			case 'alphabetical':
				$query_arguments['orderby'] = 'title';
				$query_arguments['order']   = 'ASC';
				break;
			case 'reverse-alphabetical':
				$query_arguments['orderby'] = 'title';
				$query_arguments['order']   = 'DESC';
				break;
			case 'random':
				$query_arguments['orderby'] = 'rand'; //phpcs:ignore WordPressVIPMinimum.Performance.OrderByRand.orderby_orderby
				$query_arguments['order']   = 'DESC';
				break;
		}

		$story_arguments = wp_parse_args( $options, $default_array );

		$story_arguments['class'] = 'web-stories-list--customizer';

		$stories = new Story_Query( $story_arguments, $query_arguments );

		return $stories->render();

	}

}
