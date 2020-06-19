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

namespace Google\Web_Stories\Tests;

use WP_Block_Type_Registry;

class Embed_Block extends \WP_UnitTestCase {
	public function tearDown() {
		if ( WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) ) {
			unregister_block_type( 'web-stories/embed' );
		}

		parent::tearDown();
	}

	public function test_registers_block_type() {
		$this->assertTrue( WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) );
	}

	public function test_adds_amp_story_player_to_list_of_allowed_html() {
		$this->assertArrayHasKey( 'amp-story-player', wp_kses_allowed_html() );
	}

	public function test_render_block() {
		$embed_block = new \Google\Web_Stories\Embed_Block();
		$embed_block->init();

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

	public function test_render_block_missing_url() {
		$embed_block = new \Google\Web_Stories\Embed_Block();
		$embed_block->init();

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

	public function test_render_block_missing_title() {
		$embed_block = new \Google\Web_Stories\Embed_Block();
		$embed_block->init();

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

	public function test_render_block_feed_no_poster() {
		$embed_block = new \Google\Web_Stories\Embed_Block();
		$embed_block->init();

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

	public function test_render_block_with_poster() {
		$embed_block = new \Google\Web_Stories\Embed_Block();
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
