<?php
/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Integration;

/**
 * Class Assets
 *
 * @coversDefaultClass \Google\Web_Stories\Assets
 */
class Assets extends TestCase {
	public function tear_down() {
		wp_deregister_script( 'test_script' );
		wp_deregister_script( 'fake_js_chunk' );
		wp_deregister_style( 'test_style' );
		wp_deregister_style( 'fake_css_chunk' );

		parent::tear_down();
	}

	/**
	 * @covers ::register_style
	 */
	public function test_register_style() {
		$assets          = new \Google\Web_Stories\Assets();
		$results         = $assets->register_style( 'test_style', false );
		$register_styles = $this->get_private_property( $assets, 'register_styles' );
		$this->assertArrayHasKey( 'test_style', $register_styles );
		$this->assertTrue( $results );
	}

	/**
	 * @covers ::register_script
	 */
	public function test_register_script() {
		$assets           = new \Google\Web_Stories\Assets();
		$results          = $assets->register_script( 'test_script', 'https://example.com/test.js' );
		$register_scripts = $this->get_private_property( $assets, 'register_scripts' );
		$this->assertArrayHasKey( 'test_script', $register_scripts );
		$this->assertTrue( $results );
		$this->assertArrayHasKey( 'test_script', wp_scripts()->registered );
		$this->assertSame( 'web-stories', wp_scripts()->registered['test_script']->textdomain );
	}

	/**
	 * @covers ::register_script
	 */
	public function test_register_script_without_src() {
		$assets           = new \Google\Web_Stories\Assets();
		$results          = $assets->register_script( 'test_script', false );
		$register_scripts = $this->get_private_property( $assets, 'register_scripts' );
		$this->assertArrayHasKey( 'test_script', $register_scripts );
		$this->assertTrue( $results );
		$this->assertArrayHasKey( 'test_script', wp_scripts()->registered );
		$this->assertNull( wp_scripts()->registered['test_script']->textdomain );
	}

	/**
	 * @covers ::enqueue_style
	 */
	public function test_enqueue_style() {
		$assets = new \Google\Web_Stories\Assets();
		$assets->enqueue_style( 'test_style', false );
		$register_styles = $this->get_private_property( $assets, 'register_styles' );
		$this->assertArrayHasKey( 'test_style', $register_styles );
		$this->assertTrue( wp_style_is( 'test_style' ) );
	}

	/**
	 * @covers ::enqueue_script
	 */
	public function test_enqueue_script() {
		$assets = new \Google\Web_Stories\Assets();
		$assets->enqueue_script( 'test_script', false );
		$register_scripts = $this->get_private_property( $assets, 'register_scripts' );
		$this->assertArrayHasKey( 'test_script', $register_scripts );
		$this->assertTrue( wp_script_is( 'test_script' ) );
	}

	/**
	 * @covers ::register_script_asset
	 */
	public function test_register_script_asset() {
		$assets = $this->getMockBuilder( \Google\Web_Stories\Assets::class )->setMethods( [ 'get_asset_metadata' ] )->getMock();
		$assets->method( 'get_asset_metadata' )
			->willReturn(
				[
					'dependencies' => [],
					'version'      => '9.9.9',
					'js'           => [ 'fake_js_chunk' ],
					'css'          => [ 'fake_css_chunk' ],
					'chunks'       => [],
				]
			);
		$assets->register_script_asset( 'test_script' );
		$this->assertTrue( wp_script_is( 'test_script', 'registered' ) );
		$this->assertTrue( wp_script_is( 'fake_js_chunk', 'registered' ) );
	}

	/**
	 * @covers ::register_script_asset
	 */
	public function test_register_script_asset_prints_translations_for_chunks() {
		$assets = $this->getMockBuilder( \Google\Web_Stories\Assets::class )->setMethods( [ 'get_asset_metadata' ] )->getMock();
		$assets->method( 'get_asset_metadata' )
			->willReturn(
				[
					'dependencies' => [],
					'version'      => '9.9.9',
					'js'           => [ 'fake_js_chunk' ],
					'css'          => [ 'fake_css_chunk' ],
					'chunks'       => [ 'dynamic_import_chunk' ],
				]
			);
		$assets->register_script_asset( 'test_script' );
		$this->assertTrue( wp_script_is( 'test_script', 'registered' ) );
		$this->assertTrue( wp_script_is( 'fake_js_chunk', 'registered' ) );
		$this->assertTrue( wp_script_is( 'dynamic_import_chunk', 'registered' ) );

		// Verifies that wp_set_script_translations() has been called.
		$this->assertSame( 'web-stories', wp_scripts()->registered['test_script']->textdomain );
		$this->assertSame( 'web-stories', wp_scripts()->registered['fake_js_chunk']->textdomain );
		$this->assertSame( 'web-stories', wp_scripts()->registered['dynamic_import_chunk']->textdomain );
		$this->assertContains( 'wp-i18n', wp_scripts()->registered['test_script']->deps );
		$this->assertContains( 'fake_js_chunk', wp_scripts()->registered['test_script']->deps );
		$this->assertNotContains( 'dynamic_import_chunk', wp_scripts()->registered['test_script']->deps );
		$this->assertContains( 'wp-i18n', wp_scripts()->registered['fake_js_chunk']->deps );
		$this->assertContains( 'wp-i18n', wp_scripts()->registered['dynamic_import_chunk']->deps );
	}

	/**
	 * @covers ::register_style_asset
	 */
	public function test_register_style_asset() {
		$assets = $this->getMockBuilder( \Google\Web_Stories\Assets::class )->setMethods( [ 'get_asset_metadata' ] )->getMock();
		$assets->method( 'get_asset_metadata' )
			->willReturn(
				[
					'dependencies' => [],
					'version'      => '9.9.9',
					'js'           => [ 'fake_js_chunk' ],
					'css'          => [ 'fake_css_chunk' ],
					'chunks'       => [],
				]
			);
		$assets->register_style_asset( 'test_style' );
		$this->assertTrue( wp_style_is( 'test_style', 'registered' ) );
		$this->assertTrue( wp_style_is( 'fake_css_chunk', 'registered' ) );
	}

	/**
	 * @covers ::get_asset_metadata
	 */
	public function test_get_asset_metadata() {
		$assets  = new \Google\Web_Stories\Assets();
		$results = $assets->get_asset_metadata( 'test_script' );
		$this->assertIsArray( $results );
		$this->assertArrayHasKey( 'dependencies', $results );
		$this->assertArrayHasKey( 'version', $results );
		$this->assertArrayHasKey( 'js', $results );
		$this->assertArrayHasKey( 'css', $results );

		$this->assertIsArray( $results['dependencies'] );
		$this->assertIsArray( $results['js'] );
		$this->assertIsArray( $results['css'] );
		$this->assertSame( $results['version'], WEBSTORIES_VERSION );
	}
}
