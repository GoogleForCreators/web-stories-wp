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

namespace Google\Web_Stories\Tests\Integration\Shortcode;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Shortcode\Embed_Shortcode
 */
class Embed_Shortcode extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Shortcode\Embed_Shortcode
	 */
	protected $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Shortcode\Embed_Shortcode::class );
	}

	public function tear_down(): void {
		remove_shortcode( \Google\Web_Stories\Shortcode\Embed_Shortcode::SHORTCODE_NAME );

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 */
	public function test_registers_shortcode(): void {
		$this->instance->register();
		$this->assertTrue( shortcode_exists( \Google\Web_Stories\Shortcode\Embed_Shortcode::SHORTCODE_NAME ) );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_shortcode(): void {
		$actual = $this->instance->render_shortcode(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => 'Example Story',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			''
		);

		$this->assertStringContainsString( '<amp-story-player', $actual );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_shortcode_missing_url(): void {
		$actual = $this->instance->render_shortcode(
			[
				'url'    => '',
				'title'  => 'Example Story',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			''
		);

		$this->assertEmpty( $actual );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_shortcode_missing_title(): void {
		$actual = $this->instance->render_shortcode(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => '',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			''
		);

		$this->assertStringContainsString( __( 'Web Story', 'web-stories' ), $actual );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Image::render
	 */
	public function test_render_shortcode_feed_no_poster(): void {
		$this->go_to( '/?feed=rss2' );

		$actual = $this->instance->render_shortcode(
			[
				'url'   => 'https://example.com/story.html',
				'title' => 'Example Story',
			],
			''
		);

		$this->assertStringNotContainsString( '<amp-story-player', $actual );
		$this->assertStringNotContainsString( '<img', $actual );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Image::render
	 */
	public function test_render_shortcode_with_poster(): void {
		$this->instance->register();

		$this->go_to( '/?feed=rss2' );

		$actual = $this->instance->render_shortcode(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => 'Example Story',
				'poster' => 'https://example.com/story.jpg',
				'width'  => 360,
				'height' => 600,
			],
			''
		);

		$this->assertStringNotContainsString( '<amp-story-player', $actual );
		$this->assertStringContainsString( '<img', $actual );
	}
}
