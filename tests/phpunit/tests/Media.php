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

use WP_REST_Request;

class Media extends \WP_UnitTestCase {
	/**
	 * Test rest_api_init()
	 */
	public function test_rest_api_init() {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		$video_attachment_id  = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );
		wp_set_object_terms( $video_attachment_id, 'editor', \Google\Web_Stories\Media::STORY_MEDIA_TAXONOMY );

		$request  = new WP_REST_Request( 'GET', sprintf( '/wp/v2/media/%d', $video_attachment_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'featured_media', $data );
		$this->assertArrayHasKey( 'media_source', $data );
		$this->assertEquals( $poster_attachment_id, $data['featured_media'] );
		$this->assertEquals( wp_get_attachment_url( $poster_attachment_id ), $data['featured_media_src']['src'] );
		$this->assertEquals( 'editor', $data['media_source'] );
	}

	public function test_delete_video_poster() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );
		add_post_meta( $poster_attachment_id, \Google\Web_Stories\Media::POSTER_POST_META_KEY, 'true' );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media::POSTER_ID_POST_META_KEY, $poster_attachment_id );

		\Google\Web_Stories\Media::delete_video_poster( $video_attachment_id );
		$this->assertNull( get_post( $poster_attachment_id ) );
	}

	public function test_delete_video_poster_no_generated_poster() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		\Google\Web_Stories\Media::delete_video_poster( $video_attachment_id );
		$this->assertNotNull( get_post( $poster_attachment_id ) );
	}

	public function test_delete_video_poster_when_attachment_is_deleted() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		add_post_meta( $poster_attachment_id, \Google\Web_Stories\Media::POSTER_POST_META_KEY, 'true' );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media::POSTER_ID_POST_META_KEY, $poster_attachment_id );
		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		wp_delete_attachment( $video_attachment_id );
		$this->assertNull( get_post( $poster_attachment_id ) );
	}
}
