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
use Google\Web_Stories\Traits\Theme_Support;
use WP_Customize_Manager;
use WP_Error;

/**
 * @coversDefaultClass \Google\Web_Stories\Customizer
 */
class Customizer extends Test_Case {
	use Theme_Support;

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

	/**
	 * Testee instance.
	 *
	 * @var \Google\Web_Stories\Customizer
	 */
	private $customizer;

	public static function wpSetUpBeforeClass() {
		require_once ABSPATH . WPINC . '/class-wp-customize-manager.php';
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/functions.php';
	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function setUp() {
		parent::setUp();

		global $wp_customize;

		$this->customizer      = new \Google\Web_Stories\Customizer();
		$this->wp_customize    = new \WP_Customize_Manager();
		$wp_customize          = $this->wp_customize;
		$this->customizer_mock = $this->createMock( WP_Customize_Manager::class );
	}

	/**
	 * Add theme support for web stories.
	 */
	private function add_web_stories_theme_support() {
		add_theme_support(
			'web-stories',
			[
				'customizer' => [
					'view_type'         => [
						'enabled' => [ 'circles', 'grid', 'list', 'carousel' ],
						'default' => 'circles',
					],
					'title'             => [
						'enabled' => true,
						'default' => false,
					],
					'author'            => [
						'enabled' => true,
						'default' => false,
					],
					'date'              => [
						'enabled' => true,
						'default' => false,
					],
					'archive_link'      => [
						'enabled' => true,
						'default' => true,
						'label'   => 'View all stories',
					],
					'sharp_corners'     => [
						'enabled' => false,
						'default' => false,
					],
					'order'             => [
						'default' => 'DESC',
					],
					'orderby'           => [
						'default' => 'post_date',
					],
					'circle_size'       => [
						'default' => 150,
					],
					'number_of_stories' => [
						'default' => 5,
					],
					'number_of_columns' => [
						'default' => 4,
					],
					'image_alignment'   => [
						'default' => is_rtl() ? 'right' : 'left',
					],
				],
			]
		);
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {

		$this->customizer->register();
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
				'title'          => 'Web Stories',
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
		$this->customizer_mock->expects( $this->exactly( 14 ) )->method( 'add_setting' );
		$this->customizer->register_customizer_settings( $this->customizer_mock );
	}

	/**
	 * @covers ::register_customizer_settings
	 */
	public function test_customizer_show_stories_settings_added() {
		$this->add_web_stories_theme_support();
		$this->customizer_mock->expects( $this->exactly( 14 ) )->
		method( 'add_setting' )->
		withConsecutive(
			[
				'web_stories_customizer_settings[show_stories]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[view_type]',
				[
					'default' => 'circles',
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[number_of_stories]',
				[
					'default'           => 5,
					'type'              => 'option',
					'validate_callback' => [ $this->customizer, 'validate_number_of_stories' ],
				],
			],
			[
				'web_stories_customizer_settings[number_of_columns]',
				[
					'default'           => 4,
					'type'              => 'option',
					'validate_callback' => [ $this->customizer, 'validate_number_of_columns' ],
				],
			],
			[
				'web_stories_customizer_settings[orderby]',
				[
					'default' => 'post_date',
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[order]',
				[
					'default' => 'DESC',
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[circle_size]',
				[
					'default' => 150,
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[image_alignment]',
				[
					'type'    => 'option',
					'default' => 'left',
				],
			],
			[
				'web_stories_customizer_settings[show_title]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[show_excerpt]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[show_author]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[show_date]',
				[
					'default' => false,
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[show_archive_link]',
				[
					'default' => true,
					'type'    => 'option',
				],
			],
			[
				'web_stories_customizer_settings[archive_link_label]',
				[
					'type'    => 'option',
					'default' => 'View all stories',
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
			'customizer' => [
				'view_type'         => [
					'enabled' => [ 'circles' ],
					'default' => 'circles',
				],
				'title'             => [
					'enabled' => true,
					'default' => true,
				],
				'excerpt'           => [
					'enabled' => true,
					'default' => false,
				],
				'author'            => [
					'enabled' => true,
					'default' => true,
				],
				'date'              => [
					'enabled' => false,
					'default' => false,
				],
				'archive_link'      => [
					'enabled' => true,
					'default' => true,
					'label'   => 'View all stories',
				],
				'sharp_corners'     => [
					'enabled' => false,
					'default' => false,
				],
				'order'             => [
					'default' => 'DESC',
				],
				'orderby'           => [
					'default' => 'post_date',
				],
				'circle_size'       => [
					'default' => 150,
				],
				'number_of_stories' => [
					'default' => 10,
				],
				'number_of_columns' => [
					'default' => 2,
				],
				'image_alignment'   => [
					'default' => is_rtl() ? 'right' : 'left',
				],
			],
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
				'customizer' => [
					'view_type'         => [
						'enabled' => [ 'circles', 'grid', 'list', 'carousel' ],
						'default' => 'circles',
					],
					'title'             => [
						'enabled' => true,
						'default' => false,
					],
					'author'            => [
						'enabled' => true,
						'default' => false,
					],
					'date'              => [
						'enabled' => true,
						'default' => false,
					],
					'archive_link'      => [
						'enabled' => true,
						'default' => true,
						'label'   => 'View all stories',
					],
					'sharp_corners'     => [
						'enabled' => false,
						'default' => false,
					],
					'order'             => [
						'default' => 'DESC',
					],
					'orderby'           => [
						'default' => 'post_date',
					],
					'circle_size'       => [
						'default' => 150,
					],
					'number_of_stories' => [
						'default' => 5,
					],
					'number_of_columns' => [
						'default' => 4,
					],
					'image_alignment'   => [
						'default' => is_rtl() ? 'right' : 'left',
					],
				],
			]
		);

		$options = [
			'show_stories' => true,
		];

		$output = $this->customizer->render_stories();

		$this->assertEmpty( $output );

		update_option( 'web_stories_customizer_settings', $options );

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
