<?php

declare(strict_types = 1);

/**
 * Copyright 2022 Google LLC
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
 * @coversDefaultClass \Google\Web_Stories\Media\Cropping
 */
class Cropping extends TestCase {
	/**
	 * Test instance.
	 */
	protected \Google\Web_Stories\Media\Cropping $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = new \Google\Web_Stories\Media\Cropping();
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::CROPPED_ID_POST_META_KEY, 'attachment' ) );
		$this->assertSame( 10, has_action( 'delete_attachment', [ $this->instance, 'delete_video' ] ) );
	}

	/**
	 * @covers ::delete_video
	 */
	public function test_delete_video_meta_attachment_is_deleted(): void {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$cropped_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		$this->assertNotWPError( $video_attachment_id );
		add_post_meta( $video_attachment_id, $this->instance::CROPPED_ID_POST_META_KEY, $cropped_attachment_id );
		$post_meta = get_post_meta( $video_attachment_id, $this->instance::CROPPED_ID_POST_META_KEY, true );
		$this->assertIsNumeric( $post_meta );
		$this->assertSame( $cropped_attachment_id, $post_meta );
		wp_delete_attachment( $cropped_attachment_id );
		$this->assertEmpty( get_post_meta( $video_attachment_id, $this->instance::CROPPED_ID_POST_META_KEY, true ) );
	}


	/**
	 * @covers ::on_plugin_uninstall
	 */
	public function test_on_plugin_uninstall(): void {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);
		$this->assertNotWPError( $video_attachment_id );
		add_post_meta( $video_attachment_id, $this->instance::CROPPED_ID_POST_META_KEY, 999 );
		$this->instance->on_plugin_uninstall();
		$this->assertSame( '', get_post_meta( $video_attachment_id, $this->instance::CROPPED_ID_POST_META_KEY, true ) );
	}
}
