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

namespace Google\Web_Stories\Tests\Block;

use WP_Block_Type_Registry;

/**
 * @coversDefaultClass \Google\Web_Stories\Block\Web_Stories_Block
 */
class Web_Stories_Block extends \WP_UnitTestCase {
	public function tearDown() {
		unregister_block_type( \Google\Web_Stories\Block\Web_Stories_Block::BLOCK_NAME );

		parent::tearDown();
	}

	/**
	 * @covers ::init
	 */
	public function test_registers_block_type() {
		$this->assertTrue( WP_Block_Type_Registry::get_instance()->is_registered( \Google\Web_Stories\Block\Web_Stories_Block::BLOCK_NAME ) );
	}

	/**
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Embed::render
	 */
	public function test_render_block() {
		$embed_block = new \Google\Web_Stories\Block\Web_Stories_Block();

		$actual = $embed_block->render_block(
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
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Embed::render
	 */
	public function test_render_block_missing_url() {
		$embed_block = new \Google\Web_Stories\Block\Web_Stories_Block();

		$actual = $embed_block->render_block(
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
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Embed::render
	 */
	public function test_render_block_missing_title() {
		$embed_block = new \Google\Web_Stories\Block\Web_Stories_Block();

		$actual = $embed_block->render_block(
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
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Image::render
	 */
	public function test_render_block_feed_no_poster() {
		$embed_block = new \Google\Web_Stories\Block\Web_Stories_Block();

		$this->go_to( '/?feed=rss2' );

		$actual = $embed_block->render_block(
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
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Story_Renderer\Image::render
	 */
	public function test_render_block_with_poster() {
		$embed_block = new \Google\Web_Stories\Block\Web_Stories_Block();
		$embed_block->init();

		$this->go_to( '/?feed=rss2' );

		$actual = $embed_block->render_block(
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
