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

namespace Google\Web_Stories\Tests\Integration\Media\Video;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Video\Trimming
 */
class Trimming extends TestCase {

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Media\Video\Trimming
	 */
	protected $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = new \Google\Web_Stories\Media\Video\Trimming();
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 10, has_filter( 'wp_prepare_attachment_for_js', [ $this->instance, 'wp_prepare_attachment_for_js' ] ) );
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta(): void {
		$this->instance->register_meta();

		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::TRIM_POST_META_KEY, 'attachment' ) );
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

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		$image = $this->instance->wp_prepare_attachment_for_js(
			[
				'id'   => $poster_attachment_id,
				'type' => 'image',
				'url'  => wp_get_attachment_url( $poster_attachment_id ),
			]
		);
		$video = $this->instance->wp_prepare_attachment_for_js(
			[
				'id'   => $video_attachment_id,
				'type' => 'video',
				'url'  => wp_get_attachment_url( $video_attachment_id ),
			]
		);

		$this->assertArrayNotHasKey( $this->instance::TRIM_DATA_KEY, $image );
		$this->assertArrayHasKey( $this->instance::TRIM_DATA_KEY, $video );
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

		add_post_meta( $video_attachment_id, $this->instance::TRIM_POST_META_KEY, [] );
		$this->instance->on_plugin_uninstall();
		$this->assertSame( '', get_post_meta( $video_attachment_id, $this->instance::TRIM_POST_META_KEY, true ) );
	}
}
