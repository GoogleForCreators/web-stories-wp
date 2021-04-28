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

use Google\Web_Stories\Traits\Layout;
use Google\Web_Stories\Traits\Theme_Support;
use WP_Customize_Manager;
use WP_Customize_Setting;
use WP_Error;

/**
 * Class customizer settings.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 *
 * @package Google\Web_Stories
 */
class Customizer extends Service_Base {
	use Theme_Support;
	use Layout;

	/**
	 * Customizer section slug.
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	const SECTION_SLUG = 'web_story_options';

	/**
	 * Customizer web stories options key.
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	const STORY_OPTION = 'web_stories_customizer_settings';

	/**
	 * WP_Customize_Manager instance.
	 *
	 * @since 1.5.0
	 *
	 * @var WP_Customize_Manager $wp_customize WP_Customize_Manager instance.
	 */
	private $wp_customize;

	/**
	 * Initializes the customizer logic.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'customize_register', [ $this, 'register_customizer_settings' ] );
	}

	/**
	 * Registers web stories customizer settings.
	 *
	 * @since 1.5.0
	 *
	 * @param WP_Customize_Manager $wp_customize WP_Customize_Manager instance.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 * @SuppressWarnings(PHPMD.CyclomaticComplexity)
	 *
	 * @return void
	 */
	public function register_customizer_settings( WP_Customize_Manager $wp_customize ) {
		$this->wp_customize = $wp_customize;

		$theme_support = $this->get_stories_theme_support()['customizer'];

		$active_callback = function() {
			return $this->is_option_enabled( 'show_stories' );
		};

		$wp_customize->add_section(
			self::SECTION_SLUG,
			[
				'title'          => esc_html__( 'Web Stories', 'web-stories' ),
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
				'label'   => __( 'Display stories', 'web-stories' ),
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[view_type]',
			[
				'default' => $theme_support['view_type']['default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[view_type]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'View Type', 'web-stories' ),
				'type'            => 'select',
				'choices'         => $this->get_view_type_choices( $theme_support['view_type']['enabled'] ),
				'active_callback' => $active_callback,
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[number_of_stories]',
			[
				'default'           => $theme_support['number_of_stories']['default'],
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_stories' ],
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[number_of_stories]',
			[
				'type'            => 'number',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Number of Stories', 'web-stories' ),
				'input_attrs'     => [
					'min' => 1,
					'max' => 20,
				],
				'active_callback' => $active_callback,
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[number_of_columns]',
			[
				'default'           => $theme_support['number_of_columns']['default'],
				'type'              => 'option',
				'validate_callback' => [ $this, 'validate_number_of_columns' ],
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[number_of_columns]',
			[
				'type'            => 'number',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Number of Columns', 'web-stories' ),
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
			self::STORY_OPTION . '[orderby]',
			[
				'default' => $theme_support['orderby']['default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[orderby]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Order By', 'web-stories' ),
				'type'            => 'select',
				'choices'         => [
					'post_title' => __( 'Title', 'web-stories' ),
					'post_date'  => __( 'Date', 'web-stories' ),
				],
				'active_callback' => $active_callback,
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[order]',
			[
				'default' => $theme_support['order']['default'],
				'type'    => 'option',
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[order]',
			[
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Order', 'web-stories' ),
				'type'            => 'select',
				'choices'         => [
					'ASC'  => __( 'Ascending', 'web-stories' ),
					'DESC' => __( 'Descending', 'web-stories' ),
				],
				'active_callback' => $active_callback,
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[circle_size]',
			[
				'default' => $theme_support['circle_size']['default'],
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
					return $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'circles' );
				},
			]
		);

		$wp_customize->add_setting(
			self::STORY_OPTION . '[image_alignment]',
			[
				'type'    => 'option',
				'default' => $theme_support['image_alignment']['default'],
			]
		);

		$wp_customize->add_control(
			self::STORY_OPTION . '[image_alignment]',
			[
				'type'            => 'radio',
				'section'         => self::SECTION_SLUG,
				'label'           => __( 'Image Alignment', 'web-stories' ),
				'choices'         => [
					'left'  => __( 'Left', 'web-stories' ),
					'right' => __( 'Right', 'web-stories' ),
				],
				'active_callback' => function() {
					return ( $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'list' ) );
				},
			]
		);

		if ( $theme_support['title']['enabled'] ) {

			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_title]',
				[
					'default' => $theme_support['title']['default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_title]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Display Title', 'web-stories' ),
					'active_callback' => $active_callback,
				]
			);
		}

		if ( $theme_support['excerpt']['enabled'] ) {

			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_excerpt]',
				[
					'default' => $theme_support['excerpt']['default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_excerpt]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Display Excerpt', 'web-stories' ),
					'active_callback' => function() {
						return $this->is_option_enabled( 'show_stories' ) && $this->is_view_type( 'list' );
					},
				]
			);
		}

		if ( $theme_support['author']['enabled'] ) {
			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_author]',
				[
					'default' => $theme_support['author']['default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_author]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Display Author', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
					},
				]
			);
		}

		if ( $theme_support['date']['enabled'] ) {
			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_date]',
				[
					'default' => $theme_support['date']['default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_date]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Display Date', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
					},
				]
			);
		}

		if ( $theme_support['sharp_corners']['enabled'] ) {
			$wp_customize->add_setting(
				self::STORY_OPTION . '[sharp_corners]',
				[
					'default' => $theme_support['sharp_corners']['default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[sharp_corners]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Sharp Corners', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && ! $this->is_view_type( 'circles' ) );
					},
				]
			);
		}

		if ( $theme_support['archive_link']['enabled'] ) {
			$wp_customize->add_setting(
				self::STORY_OPTION . '[show_archive_link]',
				[
					'default' => $theme_support['archive_link']['default'],
					'type'    => 'option',
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[show_archive_link]',
				[
					'type'            => 'checkbox',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Display Archive Link', 'web-stories' ),
					'active_callback' => $active_callback,
				]
			);

			$wp_customize->add_setting(
				self::STORY_OPTION . '[archive_link_label]',
				[
					'type'    => 'option',
					'default' => $theme_support['archive_link']['label'],
				]
			);

			$wp_customize->add_control(
				self::STORY_OPTION . '[archive_link_label]',
				[
					'type'            => 'text',
					'section'         => self::SECTION_SLUG,
					'label'           => __( 'Archive Link Label', 'web-stories' ),
					'active_callback' => function() {
						return ( $this->is_option_enabled( 'show_stories' ) && $this->is_option_enabled( 'show_archive_link' ) );
					},
				]
			);
		}
	}

	/**
	 * Gets the view type choices.
	 *
	 * @since 1.5.0
	 *
	 * @param array $view_type View type to check.
	 *
	 * @return array An array of view type choices.
	 */
	private function get_view_type_choices( array $view_type ) {
		$view_type_choices = $this->get_layouts();

		if ( empty( $view_type ) ) {
			return $view_type_choices;
		}

		return array_intersect_key( $view_type_choices, array_fill_keys( $view_type, true ) );
	}

	/**
	 * Checks whether the given option is enabled or not.
	 *
	 * @since 1.5.0
	 *
	 * @param string $option_name The name of the option to check.
	 *
	 * @return boolean Returns true if the given option is enabled otherwise false.
	 */
	private function is_option_enabled( $option_name ) {
		$setting = $this->wp_customize->get_setting( self::STORY_OPTION . "[{$option_name}]" );
		return ( $setting instanceof WP_Customize_Setting && true === $setting->value() );
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
	private function is_view_type( $view_type ) {
		$setting = $this->wp_customize->get_setting( self::STORY_OPTION . '[view_type]' );
		return ( $setting instanceof WP_Customize_Setting && $view_type === $setting->value() );
	}

	/**
	 * Validates the number of story setting value.
	 *
	 * @since 1.5.0
	 *
	 * @param WP_Error $validity WP_Error object.
	 * @param int      $value    Value to be validated.
	 *
	 * @return WP_Error
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
	 * @since 1.5.0
	 *
	 * @param WP_Error $validity WP_Error object.
	 * @param int      $value Value to be validated.
	 *
	 * @return WP_Error
	 */
	public function validate_number_of_columns( $validity, $value ) {
		$value = (int) $value;

		if ( $value <= 0 || $value > 5 ) {
			$validity->add( 'invalid_number', __( 'The number of columns must be between 1 and 4.', 'web-stories' ) );
		}
		return $validity;
	}

	/**
	 * Renders web stories based on the customizer selected options.
	 *
	 * @since 1.5.0
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

		$theme_support = $this->get_stories_theme_support()['customizer'];

		$story_attributes = [
			'view_type'          => isset( $options['view_type'] ) ? $options['view_type'] : $theme_support['view_type']['default'],
			'show_title'         => isset( $options['show_title'] ) ? (bool) $options['show_title'] : $theme_support['title']['default'],
			'show_excerpt'       => isset( $options['show_excerpt'] ) ? (bool) $options['show_excerpt'] : $theme_support['excerpt']['default'],
			'show_author'        => isset( $options['show_author'] ) ? (bool) $options['show_author'] : $theme_support['author']['default'],
			'show_date'          => isset( $options['show_date'] ) ? (bool) $options['show_date'] : $theme_support['date']['default'],
			'show_archive_link'  => isset( $options['show_archive_link'] ) ? (bool) $options['show_archive_link'] : $theme_support['archive_link']['default'],
			'archive_link_label' => isset( $options['archive_link_label'] ) ? (string) $options['archive_link_label'] : $theme_support['archive_link']['label'],
			'circle_size'        => isset( $options['circle_size'] ) ? (int) $options['circle_size'] : $theme_support['circle_size']['default'],
			'sharp_corners'      => isset( $options['sharp_corners'] ) ? (bool) $options['sharp_corners'] : $theme_support['sharp_corners']['default'],
			'image_alignment'    => isset( $options['image_alignment'] ) ? (string) $options['image_alignment'] : $theme_support['image_alignment']['default'],
			'number_of_columns'  => isset( $options['number_of_columns'] ) ? (int) $options['number_of_columns'] : $theme_support['number_of_columns']['default'],
			'class'              => 'web-stories-list--customizer',
		];

		$query_arguments = [
			'posts_per_page' => isset( $options['number_of_stories'] ) ? (int) $options['number_of_stories'] : $theme_support['number_of_stories']['default'], // phpcs:ignore WordPress.WP.PostsPerPage.posts_per_page_posts_per_page
			'orderby'        => isset( $options['orderby'] ) ? (string) $options['orderby'] : $theme_support['orderby']['default'],
			'order'          => isset( $options['order'] ) ? (string) $options['order'] : $theme_support['order']['default'],
		];

		$stories = new Story_Query( $story_attributes, $query_arguments );

		return $stories->render();
	}
}
