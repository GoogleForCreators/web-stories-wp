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

namespace Google\Web_Stories\Tests;

/**
 * @coversDefaultClass \Google\Web_Stories\TinyMCE
 */
class TinyMCE extends \WP_UnitTestCase {
	use Private_Access;

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$tinymce = $this->createPartialMock(
			\Google\Web_Stories\TinyMCE::class,
			[ 'is_block_editor' ]
		);

		$tinymce->method( 'is_block_editor' )
				->willReturn( true );
		$tinymce->init();

		$this->assertSame( 10, has_filter( 'mce_buttons', [ $tinymce, 'tinymce_web_stories_button' ] ) );
		$this->assertSame( 10, has_filter( 'mce_external_plugins', [ $tinymce, 'web_stories_mce_plugin' ] ) );
		$this->assertSame( 10, has_filter( 'admin_footer', [ $tinymce, 'web_stories_tinymce_root_element' ] ) );
	}

	/**
	 * @covers ::enqueue_assets
	 */
	public function test_enqueue_assets() {
		$tinymce = new \Google\Web_Stories\TinyMCE();
		$tinymce->enqueue_assets();

		$this->assertTrue( wp_script_is( \Google\Web_Stories\TinyMCE::SCRIPT_HANDLE, 'registered' ) );
		$this->assertFalse( wp_scripts()->registered[ \Google\Web_Stories\TinyMCE::SCRIPT_HANDLE ]->src );
		$after = wp_scripts()->get_data( \Google\Web_Stories\TinyMCE::SCRIPT_HANDLE, 'data' );
		$this->assertNotEmpty( $after );
	}

	/**
	 * @covers ::tinymce_web_stories_button
	 */
	public function test_tinymce_web_stories_button() {
		$tinymce = new \Google\Web_Stories\TinyMCE();
		$result  = $tinymce->tinymce_web_stories_button( [] );

		$this->assertContains( 'web_stories', $result );
	}

	/**
	 * @covers ::web_stories_mce_plugin
	 */
	public function test_web_stories_mce_plugin() {
		$tinymce = new \Google\Web_Stories\TinyMCE();
		$result  = $tinymce->web_stories_mce_plugin( [] );

		$this->assertArrayHasKey( 'web_stories', $result );
	}

	/**
	 * @covers ::web_stories_tinymce_root_element
	 */
	public function test_web_stories_tinymce_root_element() {
		$tinymce = new \Google\Web_Stories\TinyMCE();
		$result  = get_echo( [ $tinymce, 'web_stories_tinymce_root_element' ] );
		$result  = trim( $result );

		$this->assertSame( '<div id="web-stories-tinymce"></div>', $result );
	}

	/**
	 * @covers ::is_block_editor
	 */
	public function test_is_block_editor() {
		$tinymce = new \Google\Web_Stories\TinyMCE();
		$result  = $this->call_private_method( $tinymce, 'is_block_editor' );

		$this->assertFalse( $result );
	}
}
