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

use Google\Web_Stories\Integrations\Core_Themes_Support as Testee;
use Google\Web_Stories\Tests\Private_Access;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Site_Kit
 */
class Core_Themes_Support extends \WP_UnitTestCase {
	use Private_Access;

	/**
	 * Stub for the conditional tests.
	 *
	 * @var null|Testee
	 */
	protected $stub = null;

	/**
	 * Runs prior to each test and sets up the testee object.
	 */
	public function setUp() {
		$this->stub = $this->getMockBuilder( Testee::class )->setMethods( [ 'get_current_theme' ] )->getMock();
	}

	/**
	 * Runs after each test and resets the actions.
	 */
	public function tearDown() {
		remove_action( 'wp_body_open', [ $this->stub, 'embed_web_stories' ] );

		if ( get_theme_support( 'web-stories' ) ) {
			remove_theme_support( 'web-stories' );
		}

		unset( $this->stub );
	}

	/**
	 * Helper function to mock current theme value.
	 * This will help in running tests for core and non-core themes.
	 */
	public function mock_template_value( $template = 'default' ) {
		$this->stub->expects( $this->any() )->method( 'get_current_theme' )->willReturn( $template );
	}

	/**
	 * Tests init with core theme.
	 *
	 * @covers ::init
	 */
	public function test_init() {
		$this->mock_template_value();
		$this->stub->init();

		$this->assertEquals( 10, has_action( 'wp_body_open', [ $this->stub, 'embed_web_stories' ] ) );
	}

	/**
	 * Tests init with non-core theme.
	 *
	 * @covers ::init
	 */
	public function test_init_non_core_theme() {
		$this->mock_template_value( '' );
		$this->stub->init();

		$this->assertFalse( has_action( 'wp_body_open', [ $this->stub, 'embed_web_stories' ] ) );
	}

	/**
	 * @covers ::get_supported_themes
	 */
	public function test_get_supported_themes() {
		$core_support = new \Google\Web_Stories\Integrations\Core_Themes_Support();

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
			'classic',
			'default',
		];

		$actual = $core_support::get_supported_themes();

		$this->assertEquals( $actual, $expected );
	}

	/**
	 * Tests whether the support is added with core theme.
	 *
	 * @covers ::extend_theme_support
	 */
	public function test_extend_theme_support() {
		$this->mock_template_value();
		$this->stub->init();

		$this->assertTrue( get_theme_support( 'web-stories' ) );
	}

	/**
	 * Tests whether the support is added with non-core theme.
	 *
	 * @covers ::extend_theme_support
	 */
	public function test_extend_theme_support_non_core_themes() {
		$this->mock_template_value( '' );
		$this->stub->init();

		$this->assertFalse( get_theme_support( 'web-stories' ) );
	}
}
