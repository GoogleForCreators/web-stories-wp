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

namespace Google\Web_Stories\Tests\Integration\Admin;

use Google\Web_Stories\Assets;
use Google\Web_Stories\Admin\ImgAreaSelect_Patch as Testee;
use Google\Web_Stories\Context;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * Class ImgAreaSelect_Patch
 *
 * @package Google\Web_Stories\Tests\Admin
 *
 * @coversDefaultClass \Google\Web_Stories\Admin\ImgAreaSelect_Patch
 */
class ImgAreaSelect_Patch extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Admin\ImgAreaSelect_Patch
	 */
	protected $instance;

	public function set_up() {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Admin\ImgAreaSelect_Patch::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$this->instance->register();

		$this->assertSame( 10, has_filter( 'script_loader_tag', [ $this->instance, 'script_loader_tag' ] ) );
	}

	/**
	 * @covers ::script_loader_tag
	 */
	public function test_script_loader_tag() {
		$assets = $this->getMockBuilder( Assets::class )
				->setMethods( [ 'get_asset_metadata', 'get_base_url' ] )
				->getMock();
		$assets->method( 'get_asset_metadata' )
			->willReturn(
				[
					'dependencies' => [],
					'version'      => '9.9.9',
					'js'           => [ 'fake_js_chunk' ],
					'css'          => [ 'fake_css_chunk' ],
				]
			);
		$assets->method( 'get_base_url' )->willReturn( 'http://www.google.com/foo.js' );
		$context = $this->getMockBuilder( Context::class )
						->setConstructorArgs( [ $this->injector->make( Story_Post_Type::class ) ] )
						->setMethods( [ 'is_story_editor' ] )
						->getMock();
		$context->method( 'is_story_editor' )->willReturn( true );

		$this->instance = $this->getMockBuilder( Testee::class )
						->setConstructorArgs( [ $assets, $context ] )
						->setMethodsExcept( [ 'script_loader_tag' ] )
						->getMock();

		$tag = '<script src="http://www.example.com/foo.js"></script>';

		$results = $this->instance->script_loader_tag( $tag, Testee::SCRIPT_HANDLE, 'http://www.example.com/foo.js' );

		$this->assertIsString( $results );
		$this->assertStringContainsString( '9.9.9', $results );
		$this->assertStringContainsString( 'http://www.google.com/foo.js', $results );
		$this->assertStringNotContainsString( 'http://www.example.com/foo.js', $results );
	}

	/**
	 * @covers ::script_loader_tag
	 */
	public function test_script_loader_tag_wrong_handle() {
		$tag     = '<script src="http://www.example.com/foo.js"></script>';
		$results = $this->instance->script_loader_tag( $tag, 'wrong-handle', 'http://www.example.com/foo.js' );
		$this->assertSame( $tag, $results );
	}

	/**
	 * @covers ::script_loader_tag
	 */
	public function test_script_loader_tag_not_editor() {
		$tag     = '<script src="http://www.example.com/foo.js"></script>';
		$results = $this->instance->script_loader_tag( $tag, Testee::SCRIPT_HANDLE, 'http://www.example.com/foo.js' );
		$this->assertSame( $tag, $results );
	}
}
