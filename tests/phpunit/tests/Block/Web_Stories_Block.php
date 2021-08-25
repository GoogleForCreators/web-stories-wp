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

use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Block\Web_Stories_Block as Block;
use Google\Web_Stories\Tests\TestCase;
use WP_Block_Type_Registry;

/**
 * @coversDefaultClass \Google\Web_Stories\Block\Web_Stories_Block
 */
class Web_Stories_Block extends TestCase {
	/** @var Block */
	private $instance;

	public function setUp() {
		parent::setUp();

		if ( WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) ) {
			unregister_block_type( 'web-stories/embed' );
		}
	}

	public function tearDown() {
		if ( WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) ) {
			unregister_block_type( 'web-stories/embed' );
		}

		parent::tearDown();
	}

	/**
	 * @covers ::register
	 * @covers ::register_block_type
	 */
	public function test_registers_block_type() {
		$assets                  = new Assets();
		$amp_story_player_assets = new AMP_Story_Player_Assets();
		$embed_block             = new Block( $assets, $amp_story_player_assets );

		$embed_block->register();

		$this->assertTrue( WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) );
	}

	/**
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_block() {
		$assets                  = new Assets();
		$amp_story_player_assets = new AMP_Story_Player_Assets();
		$embed_block             = new Block( $assets, $amp_story_player_assets );

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
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_block_missing_url() {
		$assets                  = new Assets();
		$amp_story_player_assets = new AMP_Story_Player_Assets();
		$embed_block             = new Block( $assets, $amp_story_player_assets );

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
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_block_missing_title() {
		$assets                  = new Assets();
		$amp_story_player_assets = new AMP_Story_Player_Assets();
		$embed_block             = new Block( $assets, $amp_story_player_assets );

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
	 * @covers \Google\Web_Stories\Renderer\Story\Image::render
	 */
	public function test_render_block_feed_no_poster() {
		$assets                  = new Assets();
		$amp_story_player_assets = new AMP_Story_Player_Assets();
		$embed_block             = new Block( $assets, $amp_story_player_assets );

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
	 * @covers \Google\Web_Stories\Renderer\Story\Image::render
	 */
	public function test_render_block_with_poster() {
		$assets                  = new Assets();
		$amp_story_player_assets = new AMP_Story_Player_Assets();
		$embed_block             = new Block( $assets, $amp_story_player_assets );

		$embed_block->register();

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
