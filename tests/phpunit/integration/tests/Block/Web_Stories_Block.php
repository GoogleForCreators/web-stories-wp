<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\Block;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use WP_Block;
use WP_Block_Type_Registry;

/**
 * @coversDefaultClass \Google\Web_Stories\Block\Web_Stories_Block
 */
class Web_Stories_Block extends DependencyInjectedTestCase {
	private \Google\Web_Stories\Block\Web_Stories_Block $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Block\Web_Stories_Block::class );
	}

	public function tear_down(): void {
		unregister_block_type( 'web-stories/embed' );

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 * @covers ::register_block_type
	 */
	public function test_registers_block_type(): void {
		$this->assertTrue( WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) );
	}

	/**
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_block(): void {
		$actual = $this->instance->render_block(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => 'Example Story',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			'',
			new WP_Block( [ 'blockName' => 'web-stories/embed' ] )
		);

		$this->assertStringContainsString( '<amp-story-player', $actual );
	}

	/**
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_block_missing_url(): void {
		$actual = $this->instance->render_block(
			[
				'url'    => '',
				'title'  => 'Example Story',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			'',
			new WP_Block( [ 'blockName' => 'web-stories/embed' ] )
		);

		$this->assertEmpty( $actual );
	}

	/**
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Embed::render
	 */
	public function test_render_block_missing_title(): void {
		$actual = $this->instance->render_block(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => '',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			'',
			new WP_Block( [ 'blockName' => 'web-stories/embed' ] )
		);

		$this->assertStringContainsString( __( 'Web Story', 'web-stories' ), $actual );
	}

	/**
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Image::render
	 */
	public function test_render_block_feed_no_poster(): void {
		$this->go_to( '/?feed=rss2' );

		$actual = $this->instance->render_block(
			[
				'url'   => 'https://example.com/story.html',
				'title' => 'Example Story',
				'align' => 'none',
			],
			'',
			new WP_Block( [ 'blockName' => 'web-stories/embed' ] )
		);

		$this->assertStringNotContainsString( '<amp-story-player', $actual );
		$this->assertStringNotContainsString( '<img', $actual );
	}

	/**
	 * @covers ::render_block
	 * @covers \Google\Web_Stories\Embed_Base::render
	 * @covers \Google\Web_Stories\Embed_Base::default_attrs
	 * @covers \Google\Web_Stories\Renderer\Story\Image::render
	 */
	public function test_render_block_with_poster(): void {
		$this->go_to( '/?feed=rss2' );

		$actual = $this->instance->render_block(
			[
				'url'    => 'https://example.com/story.html',
				'title'  => 'Example Story',
				'poster' => 'https://example.com/story.jpg',
				'align'  => 'none',
				'width'  => 360,
				'height' => 600,
			],
			'',
			new WP_Block( [ 'blockName' => 'web-stories/embed' ] )
		);

		$this->assertStringNotContainsString( '<amp-story-player', $actual );
		$this->assertStringContainsString( '<img', $actual );
	}
}
