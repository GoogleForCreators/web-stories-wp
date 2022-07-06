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

namespace Google\Web_Stories\Tests\Integration\Model;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Model\Story
 */
class Story extends TestCase {
	/**
	 * @covers ::__construct
	 */
	public function test_init(): void {
		$data  = [
			'title' => 'test title',
			'url'   => 'https://www.google.com',
		];
		$story = new \Google\Web_Stories\Model\Story( $data );

		$this->assertEquals( $story->get_title(), $data['title'] );
		$this->assertEquals( $story->get_url(), $data['url'] );
	}

	/**
	 * @covers ::load_from_post
	 */
	public function test_load_from_post(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
	}


	/**
	 * @covers ::load_from_post
	 */
	public function test_load_from_post_with_poster(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		wp_maybe_generate_attachment_metadata( get_post( $poster_attachment_id ) );
		set_post_thumbnail( $post->ID, $poster_attachment_id );

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
		$this->assertNotEmpty( $story->get_poster_portrait() );
		$this->assertIsString( $story->get_poster_portrait() );
		$this->assertNotEmpty( $story->get_poster_sizes() );
		$this->assertIsString( $story->get_poster_sizes() );
		$this->assertNotEmpty( $story->get_poster_srcset() );
		$this->assertIsString( $story->get_poster_srcset() );
	}

	/**
	 * @covers ::load_from_post
	 */
	public function test_load_from_post_with_poster_meta(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		add_post_meta(
			$post->ID,
			\Google\Web_Stories\Story_Post_Type::POSTER_META_KEY,
			[
				'url'        => 'http://www.example.com/image.png',
				'height'     => 1000,
				'width'      => 1000,
				'needsProxy' => false,
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
		$this->assertEquals( 'http://www.example.com/image.png', $story->get_poster_portrait() );
		$this->assertEqualSets( [ 1000, 1000 ], $story->get_poster_portrait_size() );
		$this->assertEmpty( $story->get_poster_srcset() );
	}

	/**
	 * @covers ::load_from_post
	 */
	public function test_invalid_load_from_post(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), '' );
		$this->assertEquals( $story->get_url(), '' );
	}
}
