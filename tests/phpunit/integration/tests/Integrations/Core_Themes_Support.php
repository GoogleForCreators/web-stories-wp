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

namespace Google\Web_Stories\Tests\Integration\Integrations;

use Google\Web_Stories\Admin\Customizer;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Core_Themes_Support
 */
class Core_Themes_Support extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Integrations\Core_Themes_Support
	 */
	protected $instance;

	/**
	 * Current template.
	 *
	 * @var string
	 */
	protected $stylesheet;

	/**
	 * Runs prior to each test and sets up the testee object.
	 */
	public function set_up() {
		parent::set_up();

		$this->stylesheet = get_stylesheet();

		// Set stylesheet from one of the supported themes.
		update_option( 'stylesheet', 'twentytwentyone' );
		update_option( Customizer::STORY_OPTION, [ 'show_stories' => true ] );

		$this->instance = $this->injector->make( \Google\Web_Stories\Integrations\Core_Themes_Support::class );
	}

	/**
	 * Runs after each test and resets the actions.
	 */
	public function tear_down() {
		remove_action( 'wp_body_open', [ $this->instance, 'embed_web_stories' ] );

		remove_theme_support( 'web-stories' );

		delete_option( Customizer::STORY_OPTION );
		update_option( 'stylesheet', $this->stylesheet );

		parent::tear_down();
	}

	/**
	 * Tests register with core theme.
	 *
	 * @covers ::register
	 */
	public function test_register() {
		$this->instance->register();

		$this->assertEquals( 10, has_filter( 'body_class', [ $this->instance, 'add_core_theme_classes' ] ) );
		$this->assertEquals( 10, has_action( 'wp_body_open', [ $this->instance, 'embed_web_stories' ] ) );
	}

	/**
	 * Tests register with non-core theme.
	 *
	 * @covers ::register
	 */
	public function test_register_non_core_theme() {
		update_option( 'stylesheet', '' );

		$this->instance->register();

		$this->assertFalse( has_action( 'wp_body_open', [ $this->instance, 'embed_web_stories' ] ) );
	}

	public function test_get_supported_themes() {

		$expected = [
			'twentytwentyone',
			'twentytwenty',
			'twentynineteen',
			'twentyseventeen',
			'twentysixteen',
			'twentyfifteen',
			'twentyfourteen',
			'twentythirteen',
			'twentytwelve',
			'twentyeleven',
			'twentyten',
		];

		$actual = $this->get_static_private_property( $this->instance, 'supported_themes' );

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the support is added with core theme.
	 *
	 * @covers ::extend_theme_support
	 */
	public function test_extend_theme_support() {
		$this->instance->register();

		$this->assertTrue( get_theme_support( 'web-stories' ) );
	}

	/**
	 * Tests whether the support is added with non-core theme.
	 *
	 * @covers ::extend_theme_support
	 */
	public function test_extend_theme_support_non_core_themes() {
		update_option( 'stylesheet', '' );

		$this->instance->register();

		$this->assertFalse( get_theme_support( 'web-stories' ) );
	}

	/**
	 *
	 * @covers ::embed_web_stories
	 */
	public function embed_web_stories() {
		ob_start();
		$this->instance->embed_web_stories();

		$actual = ob_get_clean();

		$this->assertTrue( wp_script_is( 'web-stories-theme-style-twentytwentyone' ) );
		$this->assertStringContainsString( 'web-stories-theme-header-section', $actual );
	}
}
