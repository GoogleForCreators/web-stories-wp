<?php
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


namespace Google\Web_Stories\Tests;

use WP_Error;

/**
 * @coversDefaultClass \Google\Web_Stories\Customizer
 */
class Customizer extends \WP_UnitTestCase {

	/**
	 * Instance of WP_Customize_Manager which is reset for each test.
	 *
	 * @var WP_Customize_Manager
	 */
	public $wp_customize;

	public static function wpSetUpBeforeClass() {
		require_once ABSPATH . WPINC . '/class-wp-customize-manager.php';
	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function setUp() {

		global $wp_customize;

		$this->customizer   = new \Google\Web_Stories\Customizer();
		$this->wp_customize = new \WP_Customize_Manager();
		$wp_customize       = $this->wp_customize;

	}

	public function test_init() {

		$this->customizer->init();
		$this->assertSame( 10, has_action( 'customize_register', [ $this->customizer, 'register_customizer_settings' ] ) );
	}

	/**
	 * @covers ::register_customizer_settings
	 * @covers ::get_order_choices
	 * @covers ::get_view_type_choices
	 */
	public function test_register_customizer_settings() {

		add_theme_support(
			'web-story-options',
			[
				'view-type'                 => [ 'circles', 'grid', 'list', 'carousel' ],
				'view-type-default'         => 'circles',
				'grid-columns-default'      => 4,
				'title'                     => true,
				'title-default'             => false,
				'author'                    => true,
				'author-default'            => false,
				'date'                      => true,
				'date-default'              => false,
				'stories-archive-link'      => true,
				'stories-archive-label'     => 'View all stories',
				'number-of-stories'         => 5,
				'order'                     => [ 'alphabetical', 'reverse-alphabetical', 'latest', 'oldest' ],
				'order-default'             => 'oldest',
				'show-story-poster-default' => true,
			]
		);

		$this->customizer->register_customizer_settings( $this->wp_customize );

		$this->assertNotEmpty( $this->wp_customize->get_section( \Google\Web_Stories\Customizer::SECTION_SLUG ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[show_stories]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[show_stories]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[view_type]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[view_type]' ) );

		$expected_view_choices = [
			'circles'  => __( 'Circles', 'web-stories' ),
			'grid'     => __( 'Grid', 'web-stories' ),
			'list'     => __( 'List', 'web-stories' ),
			'carousel' => __( 'Carousel', 'web-stories' ),
		];

		$this->assertEquals( $expected_view_choices, $this->wp_customize->get_control( 'story-options[view_type]' )->choices );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[number_of_stories]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[number_of_stories]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[number_of_columns]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[number_of_columns]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[order]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[order]' ) );

		$expected_order_choices = [
			'latest'               => __( 'Latest', 'web-stories' ),
			'oldest'               => __( 'Oldest', 'web-stories' ),
			'alphabetical'         => __( 'A -> Z', 'web-stories' ),
			'reverse-alphabetical' => __( 'Z -> A', 'web-stories' ),
		];

		$this->assertEquals( $expected_order_choices, $this->wp_customize->get_control( 'story-options[order]' )->choices );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[list_view_image_alignment]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[list_view_image_alignment]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[show_title]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[show_title]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[show_author]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[show_author]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[show_square_corners]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[show_square_corners]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[show_date]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[show_date]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[show_stories_archive_link]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[show_stories_archive_link]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[stories_archive_label]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[stories_archive_label]' ) );

		$this->assertNotEmpty( $this->wp_customize->get_setting( 'story-options[show_story_poster]' ) );
		$this->assertNotEmpty( $this->wp_customize->get_control( 'story-options[show_story_poster]' ) );

	}

	/**
	 * @covers ::validate_number_of_stories
	 */
	public function test_validate_number_of_stories() {
		$output = $this->customizer->validate_number_of_stories( new WP_Error(), 20 );

		$this->assertEmpty( $output->errors );

		$output = $this->customizer->validate_number_of_stories( new WP_Error(), 30 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

		$output = $this->customizer->validate_number_of_stories( new WP_Error(), 0 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

	}

	/**
	 * @covers ::validate_number_of_columns
	 */
	public function test_validate_number_of_columns() {
		$output = $this->customizer->validate_number_of_columns( new WP_Error(), 2 );

		$this->assertEmpty( $output->errors );

		$output = $this->customizer->validate_number_of_columns( new WP_Error(), 6 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

		$output = $this->customizer->validate_number_of_columns( new WP_Error(), 0 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

	}

	/**
	 * @covers ::render_stories
	 */
	public function test_render_stories() {

		add_theme_support(
			'web-story-options',
			[
				'view-type'                 => [ 'circles', 'grid', 'list', 'carousel' ],
				'view-type-default'         => 'circles',
				'grid-columns-default'      => 4,
				'title'                     => true,
				'title-default'             => false,
				'author'                    => true,
				'author-default'            => false,
				'date'                      => true,
				'date-default'              => false,
				'stories-archive-link'      => true,
				'stories-archive-label'     => 'View all stories',
				'number-of-stories'         => 5,
				'order'                     => [ 'alphabetical', 'reverse-alphabetical', 'latest', 'oldest' ],
				'order-default'             => 'oldest',
				'show-story-poster-default' => true,
			]
		);

		$options = [
			'show_stories' => true,
		];

		$output = $this->customizer->render_stories();

		$this->assertEmpty( $output );

		update_option( 'story-options', $options );

		$this->factory->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$output = $this->customizer->render_stories();

		$this->assertNotEmpty( $output );

		$this->assertContains( 'web-stories-list--customizer', $output );

	}

}
