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

use Google\Web_Stories\Tests\Private_Access;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Site_Kit
 */
class Core_Themes_Support extends \WP_UnitTestCase {
	use Private_Access;

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
	 * Tests init with core theme.
	 *
	 * @covers ::init
	 */
	public function test_init() {
		$this->stub->init();

		$this->assertEquals( 10, has_action( 'wp_enqueue_scripts', [ $this->stub, 'assets' ] ) );
		$this->assertEquals( 10, has_action( 'body_class', [ $this->stub, 'add_core_theme_classes' ] ) );
		$this->assertEquals( 10, has_action( 'wp_body_open', [ $this->stub, 'embed_web_stories' ] ) );
	}

	/**
	 * Tests init with non-core theme.
	 *
	 * @covers ::init
	 */
	public function test_init_non_core_theme() {
		update_option( 'stylesheet', '' );

		$this->stub->init();

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
		$this->stub->init();

		$this->assertTrue( get_theme_support( 'web-stories' ) );
	}

	/**
	 * Tests whether the support is added with non-core theme.
	 *
	 * @covers ::extend_theme_support
	 */
	public function test_extend_theme_support_non_core_themes() {
		update_option( 'stylesheet', '' );
		$this->stub->init();

		$this->assertFalse( get_theme_support( 'web-stories' ) );
	}
}
