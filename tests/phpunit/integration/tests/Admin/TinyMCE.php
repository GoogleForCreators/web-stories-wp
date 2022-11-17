<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\Admin;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\TinyMCE
 */
class TinyMCE extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 */
	protected \Google\Web_Stories\Admin\TinyMCE $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Admin\TinyMCE::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 10, has_filter( 'mce_buttons', [ $this->instance, 'tinymce_web_stories_button' ] ) );
		$this->assertSame( 10, has_filter( 'mce_external_plugins', [ $this->instance, 'web_stories_mce_plugin' ] ) );
		$this->assertSame( 10, has_filter( 'admin_footer', [ $this->instance, 'web_stories_tinymce_root_element' ] ) );
		$this->assertSame( 10, has_filter( 'script_loader_tag', [ $this->instance, 'script_loader_tag' ] ) );
	}

	/**
	 * @covers ::register_assets
	 */
	public function test_register_assets(): void {
		$this->instance->register_assets();

		$this->assertTrue( wp_script_is( \Google\Web_Stories\Admin\TinyMCE::SCRIPT_HANDLE, 'registered' ) );
	}

	/**
	 * @covers ::tinymce_web_stories_button
	 */
	public function test_tinymce_web_stories_button(): void {
		$result = $this->instance->tinymce_web_stories_button( [] );

		$this->assertContains( 'web_stories', $result );
	}

	/**
	 * @covers ::web_stories_mce_plugin
	 */
	public function test_web_stories_mce_plugin(): void {
		$result = $this->instance->web_stories_mce_plugin( [] );

		$this->assertArrayHasKey( 'web_stories', $result );
	}

	/**
	 * @covers ::web_stories_tinymce_root_element
	 */
	public function test_web_stories_tinymce_root_element(): void {
		$result = get_echo( [ $this->instance, 'web_stories_tinymce_root_element' ] );
		$result = trim( $result );

		$this->assertSame( '<div id="web-stories-tinymce"></div>', $result );
	}

	/**
	 * @covers ::script_loader_tag
	 */
	public function test_script_loader_tag(): void {
		$result = $this->instance->script_loader_tag( "<script src='http://www.example.com/test.js'></script>", \Google\Web_Stories\Admin\TinyMCE::SCRIPT_HANDLE, 'http://www.example.com/test.js' );

		$this->assertSame( '', $result );
	}
}
