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

use Google\Web_Stories\Traits\ThemeSupport;

/**
 * Class customizer settings.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 *
 * @package Google\Web_Stories
 */
class Customizer {

	use ThemeSupport;

	/**
	 * Customizer section slug.
	 *
	 * @var string
	 */
	const SECTION_SLUG = 'web_story_options';

	/**
	 * Customizer web stories options key.
	 *
	 * @var string
	 */
	const STORY_OPTION = 'story-options';

	/**
	 * WP_Customize_Manager instance.
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
	 * Registers web stories customizer settings.
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

		$theme_support = $this->get_stories_theme_support();

		// Add Content section.
		$wp_customize->add_section(
			self::SECTION_SLUG,
			[
				'title'          => esc_html__( 'Web Story Options', 'web-stories' ),
				'theme_supports' => 'web-stories',
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[show_stories]',
			[
				'default' => false,
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[show_stories]',
			[
				'type'    => 'checkbox',
				'section' => self::SECTION_SLUG,
				'label'   => __( 'Show stories', 'web-stories' ),
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[view_type]',
			[
				'default' => $theme_support['view-type-default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[view_type]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Story view type', 'web-stories' ),
				'type'            => 'select',
				'choices'         => $this->get_view_type_choices( $theme_support['view-type'] ),
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[number_of_stories]',
			[
				'default'           => $theme_support['number-of-stories'],
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_stories' ],
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[number_of_stories]',
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
			self::STORY_OPTION . '[number_of_columns]',
			[
				'default'           => $theme_support['grid-columns-default'],
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_columns' ],
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[number_of_columns]',
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
			self::STORY_OPTION . '[order]',
			[
				'default' => $theme_support['order-default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[order]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Order by', 'web-stories' ),
				'type'            => 'select',
				'choices'         => $this->get_order_choices( $theme_support['order'] ),
				'active_callback' => function() {
					return $this->is_option_enabled( 'show_stories' );
				},
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[circle_size]',
			[
				'default' => $theme_support['circle-size-default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[circle_size]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Circle Size', 'web-stories' ),
				'type'            => 'number',
				'input_attrs'     => [
					'min'  => 80,
					'max'  => 200,
					'step' => 5,
				],
				'active_callback' => function() {
					return $this->is_view_type( 'circles' );
				},
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[list_view_image_alignment]',
			[
				'type'    => 'option',
				'default' => 'left',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[list_view_image_alignment]',
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

		if ( true === $theme_support['title'] ) {

			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_title]',
				[
					'default' => $theme_support['title-default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_title]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Show story title', 'web-stories' ),
					'active_callback' => function() {
						return $this->is_option_enabled( 'show_stories' );
					},
				]
			);
		}

		if ( true === $theme_support['author'] ) {
			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_author]',
				[
					'default' => $theme_support['author-default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_author]',
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

		if ( true === $theme_support['date'] ) {
			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_date]',
				[
					'default' => $theme_support['date-default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_date]',
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

		if ( true === $theme_support['stories-archive-link'] ) {
			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_stories_archive_link]',
				[
					'default' => false,
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_stories_archive_link]',
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
				self::STORY_OPTION . '[stories_archive_label]',
				[
					'type'    => 'option',
					'default' => $theme_support['stories-archive-label'],
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[stories_archive_label]',
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
				self::STORY_OPTION . '[show_story_poster]',
				[
					'default' => $theme_support['show-story-poster-default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_story_poster]',
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
	private function get_view_type_choices( array $view_type ) {
		$view_type_choices = get_layouts();

		if ( empty( $view_type ) ) {
			return $view_type_choices;
		}

		return array_intersect_key( $view_type, $view_type_choices );
	}

	/**
	 * Gets the order choices.
	 *
	 * @param array $order An array of order support.
	 *
	 * @return array An array of order choices.
	 */
	private function get_order_choices( array $order ) {
		$order_choices = get_stories_order();

		if ( empty( $order ) ) {
			return $order_choices;
		}

		return array_intersect_key( $order_choices, $order );
	}

	/**
	 * Checks whether the given option is enabled or not.
	 *
	 * @param string $option_name The name of the option to check.
	 *
	 * @return boolean Returns true if the given option is enabled otherwise false.
	 */
	private function is_option_enabled( $option_name ) {
		$setting = $this->wp_customize->get_setting( self::STORY_OPTION . "[{$option_name}]" );
		return ( $setting instanceof \WP_Customize_Setting && true === $setting->value() );
	}

	/**
	 * Verifies the current view type.
	 *
	 * @param string $view_type View type to check.
	 *
	 * @return bool Whether or not current view type matches the one passed.
	 */
	private function is_view_type( $view_type ) {
		$setting = $this->wp_customize->get_setting( self::STORY_OPTION . '[view_type]' );
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
		$value = (int) $value;

		if ( $value <= 0 || $value > 20 ) {
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

		if ( $value <= 0 || $value > 5 ) {
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
	 * @return string
	 */
	public function render_stories() {
		$options = get_option( self::STORY_OPTION );

		if ( empty( $options['show_stories'] ) || true !== $options['show_stories'] ) {
			return '';
		}

		$theme_support = $this->get_stories_theme_support();

		$default_array = [
			'view_type'             => $theme_support['view-type-default'],
			'show_title'            => $theme_support['title-default'],
			'show_author'           => $theme_support['author-default'],
			'show_date'             => $theme_support['date-default'],
			'stories_archive_label' => $theme_support['stories-archive-label'],
			'show_story_poster'     => $theme_support['show-story-poster-default'],
			'number_of_columns'     => $theme_support['grid-columns-default'],
			'circle_size'           => $theme_support['circle-size-default'],
		];

		$query_arguments = [
			'posts_per_page' => ! empty( $options['number_of_stories'] ) ? $options['number_of_stories'] : $theme_support['number-of-stories'],
		];

		$order_by = ! empty( $options['order'] ) ? $options['order'] : $theme_support['order-default'];

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
