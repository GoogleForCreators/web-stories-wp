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

namespace Google\Web_Stories\Tests\Integration\Media;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Image_Sizes
 */
class Image_Sizes extends TestCase {

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$media = new \Google\Web_Stories\Media\Image_Sizes();
		$media->register();

		$this->assertSame( 10, has_filter( 'wp_prepare_attachment_for_js', [ $media, 'wp_prepare_attachment_for_js' ] ) );
	}

	/**
	 * @covers ::add_image_sizes
	 */
	public function test_add_image_sizes(): void {
		$media = new \Google\Web_Stories\Media\Image_Sizes();
		$this->call_private_method( [ $media, 'add_image_sizes' ] );

		$this->assertTrue( has_image_size( \Google\Web_Stories\Media\Image_Sizes::POSTER_PORTRAIT_IMAGE_SIZE ) );
		$this->assertTrue( has_image_size( \Google\Web_Stories\Media\Image_Sizes::STORY_THUMBNAIL_IMAGE_SIZE ) );
		$this->assertTrue( has_image_size( \Google\Web_Stories\Media\Image_Sizes::PUBLISHER_LOGO_IMAGE_SIZE ) );
	}

	/**
	 * @covers ::wp_prepare_attachment_for_js
	 */
	public function test_wp_prepare_attachment_for_js(): void {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$this->assertNotWPError( $video_attachment_id );

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$this->assertNotWPError( $poster_attachment_id );

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		$media = new \Google\Web_Stories\Media\Image_Sizes();
		$image = $media->wp_prepare_attachment_for_js(
			[
				'id'   => $poster_attachment_id,
				'type' => 'image',
				'url'  => wp_get_attachment_url( $poster_attachment_id ),
			],
			get_post( $poster_attachment_id )
		);
		$video = $media->wp_prepare_attachment_for_js(
			[
				'id'   => $video_attachment_id,
				'type' => 'video',
				'url'  => wp_get_attachment_url( $video_attachment_id ),
			],
			get_post( $video_attachment_id )
		);

		$this->assertIsArray( $video );
		$this->assertIsArray( $image );
		$this->assertArrayHasKey( 'media_details', $video );
		$this->assertArrayHasKey( 'media_details', $image );
	}
}
