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

namespace Google\Web_Stories\Tests\Shortcode;

use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Shortcode\Embed_Shortcode
 */
class Embed_Shortcode extends Test_Case {
	public function tearDown() {
		remove_shortcode( \Google\Web_Stories\Shortcode\Embed_Shortcode::SHORTCODE_NAME );

		parent::tearDown();
	}

	/**
	 * @covers ::register
	 */
	public function test_registers_block_type() {
		$this->assertTrue( shortcode_exists( \Google\Web_Stories\Shortcode\Embed_Shortcode::SHORTCODE_NAME ) );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Embed::render
	 */
	public function test_render_shortcode() {
		$embed_shortcode = new \Google\Web_Stories\Shortcode\Embed_Shortcode();

		$actual = $embed_shortcode->render_shortcode(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => 'Example Story',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			''
		);

		$this->assertContains( '<amp-story-player', $actual );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Embed::render
	 */
	public function test_render_shortcode_missing_url() {
		$embed_shortcode = new \Google\Web_Stories\Shortcode\Embed_Shortcode();

		$actual = $embed_shortcode->render_shortcode(
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
	 * @covers \Google\Web_Stories\Story_Renderer\Embed::render
	 */
	public function test_render_shortcode_missing_title() {
		$embed_shortcode = new \Google\Web_Stories\Shortcode\Embed_Shortcode();

		$actual = $embed_shortcode->render_shortcode(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => '',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			''
		);

		$this->assertContains( __( 'Web Story', 'web-stories' ), $actual );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Image::render
	 */
	public function test_render_shortcode_feed_no_poster() {
		$embed_shortcode = new \Google\Web_Stories\Shortcode\Embed_Shortcode();

		$this->go_to( '/?feed=rss2' );

		$actual = $embed_shortcode->render_shortcode(
			[
				'url'   => 'https://example.com/story.html',
				'title' => 'Example Story',
			],
			''
		);

		$this->assertNotContains( '<amp-story-player', $actual );
		$this->assertNotContains( '<img', $actual );
	}

	/**
	 * @covers ::render_shortcode
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Image::render
	 */
	public function test_render_shortcode_with_poster() {
		$embed_shortcode = new \Google\Web_Stories\Shortcode\Embed_Shortcode();
		$embed_shortcode->register();

		$this->go_to( '/?feed=rss2' );

		$actual = $embed_shortcode->render_shortcode(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => 'Example Story',
				'poster' => 'https://example.com/story.jpg',
				'width'  => 360,
				'height' => 600,
			],
			''
		);

		$this->assertNotContains( '<amp-story-player', $actual );
		$this->assertContains( '<img', $actual );
	}
}
