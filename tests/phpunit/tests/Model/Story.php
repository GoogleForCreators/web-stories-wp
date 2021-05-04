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

namespace Google\Web_Stories\Tests\Model;

use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Model\Story
 */
class Story extends Test_Case {
	/**
	 * @covers ::__construct
	 */
	public function test_init() {
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
	public function test_load_from_post() {
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
	public function test_invalid_load_from_post() {
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
