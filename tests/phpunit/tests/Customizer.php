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

use Google\Web_Stories\Customizer as TheCustomizer;
use Google\Web_Stories\Traits\ThemeSupport;
use WP_Error;

/**
 * @coversDefaultClass \Google\Web_Stories\Customizer
 */
class Customizer extends \WP_UnitTestCase {

	use ThemeSupport;

	/**
	 * Instance of WP_Customize_Manager which is reset for each test.
	 *
	 * @var WP_Customize_Manager
	 */
	public $wp_customize;

	/**
	 * Customizer mock object.
	 *
	 * @var \PHPUnit\Framework\MockObject\MockObject|\WP_Customize_Manager
	 */
	private $customizer_mock;

	public static function wpSetUpBeforeClass() {
		require_once ABSPATH . WPINC . '/class-wp-customize-manager.php';
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/functions.php';
	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function setUp() {

		global $wp_customize;

		$this->customizer      = new \Google\Web_Stories\Customizer();
		$this->wp_customize    = new \WP_Customize_Manager();
		$wp_customize          = $this->wp_customize;
		$this->customizer_mock = $this->createMock( \WP_Customize_Manager::class );
	}

	/**
	 * Add theme support for web stories.
	 */
	private function add_web_stories_theme_support() {
		add_theme_support(
			'web-stories',
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
				'default-circle-size'       => 150,
				'order'                     => [ 'alphabetical', 'reverse-alphabetical', 'latest', 'oldest' ],
				'order-default'             => 'oldest',
				'show-story-poster-default' => true,
			]
		);
	}

	public function test_init() {

		$this->customizer->init();
		$this->assertSame(
			10,
			has_action(
				'customize_register',
				[
					$this->customizer,
					'register_customizer_settings',
				]
			)
		);
	}

	/**
	 * @covers ::register_customizer_settings
	 */
	public function test_customizer_web_stories_section_added() {
		$this->add_web_stories_theme_support();

		$this->customizer_mock->expects( $this->once() )->method( 'add_section' )->with(
			TheCustomizer::SECTION_SLUG,
			[
				'title'          => esc_html__( 'Web Story Options', 'web-stories' ),
				'theme_supports' => 'web-stories',
			]
		);

		$this->customizer->register_customizer_settings( $this->customizer_mock );
	}

	/**
	 * @covers ::register_customizer_settings
	 */
	public function test_customizer_settings_added() {
		$this->add_web_stories_theme_support();
		$this->customizer_mock->expects( $this->exactly( 13 ) )->method( 'add_setting' );
		$this->customizer->register_customizer_settings( $this->customizer_mock );
	}

	/**
	 * @covers ::register_customizer_settings
	 */
	public function test_customizer_show_stories_settings_added() {
		$this->add_web_stories_theme_support();
		$this->customizer_mock->expects( $this->exactly( 13 ) )->
		method( 'add_setting' )->
		withConsecutive(
			[
				'story-options[show_stories]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'story-options[view_type]',
				[
					'default' => 'circles',
					'type'    => 'option',
				],
			],
			[
				'story-options[number_of_stories]',
				[
					'default'           => 5,
					'type'              => 'option',
					'validate_callback' => [ $this->customizer, 'validate_number_of_stories' ],
				],
			],
			[
				'story-options[number_of_columns]',
				[
					'default'           => 4,
					'type'              => 'option',
					'validate_callback' => [ $this->customizer, 'validate_number_of_columns' ],
				],
			],
			[
				'story-options[order]',
				[
					'default' => 'oldest',
					'type'    => 'option',
				],
			],
			[
				'story-options[circle_size]',
				[
					'default'           => 150,
					'type'              => 'option',
				],
			],
			[
				'story-options[list_view_image_alignment]',
				[
					'type'    => 'option',
					'default' => 'left',
				],
			],
			[
				'story-options[show_title]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'story-options[show_author]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'story-options[show_date]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'story-options[show_stories_archive_link]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'story-options[stories_archive_label]',
				[
					'type'    => 'option',
					'default' => 'View all stories',
				],
			],
			[
				'story-options[show_story_poster]',
				[
					'type'    => 'option',
					'default' => true,
				],
			]
		);

		$this->customizer->register_customizer_settings( $this->customizer_mock );
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
	 * @covers ::get_stories_theme_support
	 */
	public function test_get_stories_theme_support() {

		add_theme_support( 'web-stories' );

		$expected = [
			'view-type'                 => [
				'circles' => __( 'Circle Carousel', 'web-stories' ),
			],
			'view-type-default'         => 'circles',
			'grid-columns-default'      => 2,
			'title'                     => true,
			'title-default'             => true,
			'author'                    => true,
			'author-default'            => false,
			'date'                      => false,
			'date-default'              => false,
			'stories-archive-link'      => true,
			'stories-archive-label'     => __( 'View all stories', 'web-stories' ),
			'number-of-stories'         => 10,
			'default-circle-size'       => 150,
			'order'                     => [
				'latest'               => __( 'Latest', 'web-stories' ),
				'oldest'               => __( 'Oldest', 'web-stories' ),
				'alphabetical'         => __( 'A -> Z', 'web-stories' ),
				'reverse-alphabetical' => __( 'Z -> A', 'web-stories' ),
			],
			'order-default'             => 'latest',
			'show-story-poster-default' => true,
		];

		$output = $this->get_stories_theme_support();

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::render_stories
	 */
	public function test_render_stories() {

		add_theme_support(
			'web-stories',
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
				'default-circle-size'       => 150,
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
