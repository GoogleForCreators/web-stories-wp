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

namespace Google\Web_Stories\Tests\Integration\Renderer;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Image;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\TestCase;
use WP_UnitTest_Factory;

/**
 * Class Single
 *
 * @coversDefaultClass \Google\Web_Stories\Renderer\Oembed
 */
class Oembed extends TestCase {

	/**
	 * Admin user for test.
	 */
	protected static int $admin_id;

	/**
	 * Story id.
	 */
	protected static int $story_id;

	/**
	 * @param WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ): void {
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Story_Post_Type Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
			]
		);

		/**
		 * @var int $poster_attachment_id
		 */
		$poster_attachment_id = $factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	/**
	 * @covers ::get_embed_height_width
	 */
	public function test_get_embed_height_width(): void {
		$renderer = new \Google\Web_Stories\Renderer\Oembed();
		$actual   = $this->call_private_method( [ $renderer, 'get_embed_height_width' ], [ 600 ] );
		$expected = [
			'width'  => 360,
			'height' => 600,
		];

		$this->assertEqualSets( $expected, $actual );
	}

	/**
	 * @covers ::filter_oembed_response_data
	 */
	public function test_filter_oembed_response_data(): void {
		$renderer     = new \Google\Web_Stories\Renderer\Oembed();
		$old          = [
			'existing' => 'data',
		];
		$current_post = get_post( self::$story_id );
		$this->assertNotNull( $current_post );
		$actual   = $renderer->filter_oembed_response_data( $old, $current_post, 600 );
		$expected = [
			'existing' => 'data',
			'width'    => 360,
			'height'   => 600,
		];

		$this->assertEqualSets( $expected, $actual );
	}

	/**
	 * @covers ::filter_embed_html
	 */
	public function test_filter_embed_htmla(): void {
		$renderer     = new \Google\Web_Stories\Renderer\Oembed();
		$current_post = get_post( self::$story_id );
		$this->assertNotNull( $current_post );
		$story = new Story();
		$story->load_from_post( $current_post );
		$image_renderer = new Image( $story );
		$output         = $image_renderer->render(
			[
				'height' => 10000,
				'width'  => 2000,
			]
		);

		$actual = $renderer->filter_embed_html( $output, $current_post, 2000, 10000 );
		$this->assertStringContainsString( 'width="360"', $actual );
		$this->assertStringContainsString( 'height="600"', $actual );
	}
}
