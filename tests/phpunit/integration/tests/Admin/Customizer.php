<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\Admin;

use Google\Web_Stories\Admin\Customizer as TheCustomizer;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use WP_Customize_Manager;
use WP_Customize_Section;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Customizer
 * @runInSeparateProcess
 * @preserveGlobalState disabled
 */
class Customizer extends DependencyInjectedTestCase {

	/**
	 * Test instance.
	 */
	private TheCustomizer $instance;

	/**
	 * Test instance.
	 */
	private ?WP_Customize_Manager $wp_customize_mock = null;

	public static function wpSetUpBeforeClass(): void {
		require_once ABSPATH . WPINC . '/class-wp-customize-manager.php';
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/functions.php';
	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function set_up(): void {
		parent::set_up();

		$wp_customize            = new WP_Customize_Manager();
		$GLOBALS['wp_customize'] = $wp_customize;
		$this->wp_customize_mock = $GLOBALS['wp_customize'];

		$this->instance = $this->injector->make( TheCustomizer::class );
	}

	public function tear_down(): void {
		$this->wp_customize_mock = null;
		unset( $GLOBALS['wp_customize'] );

		remove_theme_support( 'web-stories' );

		parent::tear_down();
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed(): void {
		$this->assertTrue( $this->instance::is_needed() );
	}

	/**
	 * Add theme support for web stories.
	 */
	private function add_web_stories_theme_support(): void {
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
	public function test_register(): void {

		$this->instance->register();
		$this->assertSame(
			10,
			has_action(
				'customize_register',
				[
					$this->instance,
					'register_customizer_settings',
				]
			)
		);
	}

	/**
	 * @covers ::register_customizer_settings
	 */
	public function test_customizer_web_stories_section_added(): void {
		$this->add_web_stories_theme_support();

		$this->assertInstanceOf( WP_Customize_Manager::class, $this->wp_customize_mock );
		$this->wp_customize_mock->add_section(
			TheCustomizer::SECTION_SLUG,
			[
				'title'          => 'Web Stories',
				'theme_supports' => 'web-stories',
			]
		);

		$this->instance->register_customizer_settings( $this->wp_customize_mock );
		$settings = $this->wp_customize_mock->sections();
		$this->assertIsArray( $settings );
		$this->assertArrayHasKey( TheCustomizer::SECTION_SLUG, $settings );
		$this->assertInstanceOf( WP_Customize_Section::class, $settings[ TheCustomizer::SECTION_SLUG ] );
		$this->assertObjectHasAttribute( 'title', $settings[ TheCustomizer::SECTION_SLUG ] );
		$this->assertObjectHasAttribute( 'theme_supports', $settings[ TheCustomizer::SECTION_SLUG ] );

		$this->assertSame( 'Web Stories', $settings[ TheCustomizer::SECTION_SLUG ]->title );
		$this->assertSame( 'web-stories', $settings[ TheCustomizer::SECTION_SLUG ]->theme_supports );
	}

	/**
	 * @covers ::register_customizer_settings
	 */
	public function test_customizer_settings_added(): void {
		$this->add_web_stories_theme_support();
		$this->assertInstanceOf( WP_Customize_Manager::class, $this->wp_customize_mock );
		$this->instance->register_customizer_settings( $this->wp_customize_mock );
		$settings = $this->wp_customize_mock->settings();
		$this->assertIsArray( $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[show_stories]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[view_type]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[number_of_stories]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[number_of_columns]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[orderby]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[order]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[circle_size]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[image_alignment]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[show_title]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[show_excerpt]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[show_author]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[show_date]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[show_archive_link]', $settings );
		$this->assertArrayHasKey( 'web_stories_customizer_settings[archive_link_label]', $settings );
	}
	
	/**
	 * @covers ::validate_number_of_stories
	 */
	public function test_validate_number_of_stories(): void {
		$output = $this->instance->validate_number_of_stories( new \WP_Error(), 20 );

		$this->assertEmpty( $output->errors );

		$output = $this->instance->validate_number_of_stories( new \WP_Error(), 30 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

		$output = $this->instance->validate_number_of_stories( new \WP_Error(), 0 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

	}

	/**
	 * @covers ::validate_number_of_columns
	 */
	public function test_validate_number_of_columns(): void {
		$output = $this->instance->validate_number_of_columns( new \WP_Error(), 2 );

		$this->assertEmpty( $output->errors );

		$output = $this->instance->validate_number_of_columns( new \WP_Error(), 6 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

		$output = $this->instance->validate_number_of_columns( new \WP_Error(), 0 );

		$this->assertNotEmpty( $output->errors );
		$this->assertNotEmpty( $output->errors['invalid_number'] );

	}

	/**
	 * @covers ::get_stories_theme_support
	 */
	public function test_get_stories_theme_support(): void {
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

		$output = $this->instance->get_stories_theme_support();

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::render_stories
	 */
	public function test_render_stories(): void {
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

		$output = $this->instance->render_stories();

		$this->assertEmpty( $output );

		update_option( 'web_stories_customizer_settings', $options );

		self::factory()->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$output = $this->instance->render_stories();

		$this->assertNotEmpty( $output );
		$this->assertStringContainsString( 'web-stories-list--customizer', $output );
	}
}
