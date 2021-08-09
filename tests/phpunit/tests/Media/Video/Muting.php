<?php
/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Media\Video;

use Google\Web_Stories\Tests\Test_Case;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Video\Muting
 */
class Muting extends Test_Case {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$video_muting = new \Google\Web_Stories\Media\Video\Muting();
		$video_muting->register();

		$this->assertSame( 10, has_action( 'rest_api_init', [ $video_muting, 'rest_api_init' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'wp_prepare_attachment_for_js',
				[
					$video_muting,
					'wp_prepare_attachment_for_js',
				]
			)
		);
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta() {
		$video_muting = new \Google\Web_Stories\Media\Video\Muting();
		$this->call_private_method( $video_muting, 'register_meta' );

		$this->assertTrue( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Video\Muting::IS_MUTED_POST_META_KEY, 'attachment' ) );
		$this->assertTrue( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Video\Muting::MUTED_ID_POST_META_KEY, 'attachment' ) );
	}

	/**
	 * @covers ::wp_prepare_attachment_for_js
	 * @covers ::get_callback_is_muted
	 */
	public function test_wp_prepare_attachment_for_js() {
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

		$video_muting = new \Google\Web_Stories\Media\Video\Muting();
		$image        = $video_muting->wp_prepare_attachment_for_js(
			[
				'id'   => $poster_attachment_id,
				'type' => 'image',
				'url'  => wp_get_attachment_url( $poster_attachment_id ),
			]
		);
		$video        = $video_muting->wp_prepare_attachment_for_js(
			[
				'id'   => $video_attachment_id,
				'type' => 'video',
				'url'  => wp_get_attachment_url( $video_attachment_id ),
			]
		);

		$this->assertArrayNotHasKey( \Google\Web_Stories\Media\Video\Muting::IS_MUTED_KEY, $image );
		$this->assertArrayHasKey( \Google\Web_Stories\Media\Video\Muting::IS_MUTED_KEY, $video );
	}

	/**
	 * @covers ::rest_api_init
	 * @covers ::get_callback_is_muted
	 */
	public function test_rest_api_init() {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, sprintf( '/web-stories/v1/media/%d', $video_attachment_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( \Google\Web_Stories\Media\Video\Muting::IS_MUTED_KEY, $data );
		$this->assertNull( $data[ \Google\Web_Stories\Media\Video\Muting::IS_MUTED_KEY ] );
	}

	/**
	 * @covers ::get_callback_is_muted
	 */
	public function test_get_callback_is_muted() {
		$video_muting        = new \Google\Web_Stories\Media\Video\Muting();
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);
		update_post_meta( $video_attachment_id, \Google\Web_Stories\Media\Video\Muting::IS_MUTED_POST_META_KEY, '1' );
		$result = $video_muting->get_callback_is_muted( [ 'id' => $video_attachment_id ] );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::update_callback_is_muted
	 */
	public function test_update_callback_is_muted() {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$video_muting        = new \Google\Web_Stories\Media\Video\Muting();
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$result = $video_muting->update_callback_is_muted( true, get_post( $video_attachment_id ) );
		$this->assertTrue( $result );
		$result = $video_muting->update_callback_is_muted( true, get_post( $video_attachment_id ) );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::update_callback_is_muted
	 */
	public function test_update_callback_is_muted_error() {
		$video_muting        = new \Google\Web_Stories\Media\Video\Muting();
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$result = $video_muting->update_callback_is_muted( true, get_post( $video_attachment_id ) );
		$this->assertInstanceOf( 'WP_Error', $result );
	}
}
