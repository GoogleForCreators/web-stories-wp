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

		$theme_support = self::get_stories_theme_support();

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
				'default' => $theme_support['view-type-default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[view_type]',
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
			'story-options[number_of_stories]',
			[
				'default'           => $theme_support['number-of-stories'],
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
				'default'           => $theme_support['grid-columns-default'],
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
				'default' => $theme_support['order-default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			'story-options[order]',
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

		if ( true === $theme_support['title'] ) {

			$wp_customize->add_setting(
				'story-options[show_title]',
				[
					'default' => $theme_support['title-default'],
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

		if ( true === $theme_support['author'] ) {
			$wp_customize->add_setting(
				'story-options[show_author]',
				[
					'default' => $theme_support['author-default'],
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

		if ( true === $theme_support['date'] ) {
			$wp_customize->add_setting(
				'story-options[show_date]',
				[
					'default' => $theme_support['date-default'],
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

		if ( true === $theme_support['stories-archive-link'] ) {
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
					'default' => $theme_support['stories-archive-label'],
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
					'default' => $theme_support['show-story-poster-default'],
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
	private function get_view_type_choices( $view_type ) {

		if ( empty( $view_type ) ) {
			return [ 'circles' => __( 'Circles', 'web-stories' ) ];
		}

		$view_type = array_keys( $view_type );

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
	private function get_order_choices( $order ) {

		$order_choices = [];

		if ( empty( $order ) ) {
			return [
				'latest'               => __( 'Latest', 'web-stories' ),
				'oldest'               => __( 'Oldest', 'web-stories' ),
				'alphabetical'         => __( 'A -> Z', 'web-stories' ),
				'reverse-alphabetical' => __( 'Z -> A', 'web-stories' ),
			];
		}

		$order = array_keys( $order );

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
	private function is_option_enabled( $option_name ) {
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
	private function is_view_type( $view_type ) {
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
	 * Gets the stories theme support data.
	 *
	 * @return array An array of web story theme support data.
	 */
	public static function get_stories_theme_support() {

		$theme_support = get_theme_support( 'web-story-options' );
		$theme_support = ! empty( $theme_support[0] ) && is_array( $theme_support[0] ) ? $theme_support[0] : [];

		$default_theme_support = [
			'view-type'                 => [],
			'view-type-default'         => 'circles',
			'grid-columns-default'      => 2,
			'title'                     => true,
			'title-default'             => true,
			'author'                    => true,
			'author-default'            => true,
			'date'                      => false,
			'date-default'              => false,
			'stories-archive-link'      => false,
			'stories-archive-label'     => __( 'View all stories', 'web-stories' ),
			'number-of-stories'         => 10,
			'order'                     => [],
			'order-default'             => 'oldest',
			'show-story-poster-default' => true,
		];

		$theme_support = wp_parse_args( $theme_support, $default_theme_support );

		$theme_support['view-type']            = is_array( $theme_support['view-type'] ) ? $theme_support['view-type'] : [];
		$theme_support['order']                = is_array( $theme_support['order'] ) ? $theme_support['order'] : [];
		$theme_support['number-of-stories']    = is_numeric( $theme_support['number-of-stories'] ) ? $theme_support['number-of-stories'] : 5;
		$theme_support['grid-columns-default'] = is_numeric( $theme_support['grid-columns-default'] ) ? $theme_support['grid-columns-default'] : 2;

		return $theme_support;
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

		$theme_support = self::get_stories_theme_support();

		$default_array = [
			'view_type'             => $theme_support['view-type-default'],
			'show_title'            => $theme_support['title-default'],
			'show_author'           => $theme_support['author-default'],
			'show_date'             => $theme_support['date-default'],
			'stories_archive_label' => $theme_support['stories-archive-label'],
			'show_story_poster'     => $theme_support['show-story-poster-default'],
			'number_of_columns'     => $theme_support['grid-columns-default'],
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
