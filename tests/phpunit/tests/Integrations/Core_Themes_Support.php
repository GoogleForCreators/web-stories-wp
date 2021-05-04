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

namespace Google\Web_Stories\Tests\Integrations;

use Google\Web_Stories\Customizer;
use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Core_Themes_Support
 */
class Core_Themes_Support extends Test_Case {
	/**
	 * Stub for the conditional tests.
	 *
	 * @var null
	 */
	protected $stub = null;

	/**
	 * Current template.
	 *
	 * @var null
	 */
	protected $stylesheet = null;

	/**
	 * Runs prior to each test and sets up the testee object.
	 */
	public function setUp() {
		$this->stylesheet = get_stylesheet();

		// Set stylesheet from one of the supported themes.
		update_option( 'stylesheet', 'twentytwentyone' );
		update_option( Customizer::STORY_OPTION, [ 'show_stories' => true ] );
		$this->stub = new \Google\Web_Stories\Integrations\Core_Themes_Support();
	}

	/**
	 * Runs after each test and resets the actions.
	 */
	public function tearDown() {
		remove_action( 'wp_body_open', [ $this->stub, 'embed_web_stories' ] );

		if ( get_theme_support( 'web-stories' ) ) {
			remove_theme_support( 'web-stories' );
		}

		update_option( 'stylesheet', $this->stylesheet );

		unset( $this->stub );
		unset( $this->stylesheet );

		parent::tearDown();
	}

	/**
	 * Tests register with core theme.
	 *
	 * @covers ::register
	 */
	public function test_register() {
		$this->stub->register();

		$this->assertEquals( 10, has_filter( 'body_class', [ $this->stub, 'add_core_theme_classes' ] ) );
		$this->assertEquals( 10, has_action( 'wp_body_open', [ $this->stub, 'embed_web_stories' ] ) );
	}

	/**
	 * Tests register with non-core theme.
	 *
	 * @covers ::register
	 */
	public function test_register_non_core_theme() {
		update_option( 'stylesheet', '' );

		$this->stub->register();

		$this->assertFalse( has_action( 'wp_body_open', [ $this->stub, 'embed_web_stories' ] ) );
	}

	/**
	 * @covers ::get_supported_themes
	 */
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

		$actual = $this->get_static_private_property( $this->stub, 'supported_themes' );

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the support is added with core theme.
	 *
	 * @covers ::extend_theme_support
	 */
	public function test_extend_theme_support() {
		$this->stub->register();

		$this->assertTrue( get_theme_support( 'web-stories' ) );
	}

	/**
	 * Tests whether the support is added with non-core theme.
	 *
	 * @covers ::extend_theme_support
	 */
	public function test_extend_theme_support_non_core_themes() {
		update_option( 'stylesheet', '' );
		$this->stub->register();

		$this->assertFalse( get_theme_support( 'web-stories' ) );
	}

	/**
	 *
	 * @covers ::embed_web_stories
	 */
	public function embed_web_stories() {
		ob_start();
		$this->stub->embed_web_stories();

		$actual = ob_get_clean();

		$this->assertTrue( wp_script_is( 'web-stories-theme-style-twentytwentyone' ) );
		$this->assertContains( 'web-stories-theme-header-section', $actual );
	}
}
