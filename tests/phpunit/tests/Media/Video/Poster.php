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

namespace Google\Web_Stories\Tests\Media\Video;

use Google\Web_Stories\Tests\Test_Case;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Video\Poster
 */
class Poster extends Test_Case {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$media = new \Google\Web_Stories\Media\Video\Poster();
		$media->register();

		$this->assertSame( 10, has_action( 'rest_api_init', [ $media, 'rest_api_init' ] ) );
		$this->assertSame( 10, has_action( 'delete_attachment', [ $media, 'delete_video_poster' ] ) );
		$this->assertSame( 10, has_filter( 'wp_prepare_attachment_for_js', [ $media, 'wp_prepare_attachment_for_js' ] ) );
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta() {
		$media = new \Google\Web_Stories\Media\Video\Poster();
		$this->call_private_method( $media, 'register_meta' );

		$this->assertTrue( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Video\Poster::POSTER_ID_POST_META_KEY, 'attachment' ) );
		$this->assertFalse( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Video\Poster::POSTER_POST_META_KEY, 'attachment' ) );
	}

	/**
	 * @covers ::rest_api_init
	 */
	public function test_rest_api_init() {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		$video_attachment_id  = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, sprintf( '/web-stories/v1/media/%d', $video_attachment_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'featured_media', $data );
		$this->assertEquals( $poster_attachment_id, $data['featured_media'] );
		$this->assertEquals( wp_get_attachment_url( $poster_attachment_id ), $data['featured_media_src']['src'] );
	}

	/**
	 * @covers ::wp_prepare_attachment_for_js
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

		$media = new \Google\Web_Stories\Media\Video\Poster();
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

		$this->assertArrayHasKey( 'featured_media', $video );
		$this->assertArrayHasKey( 'featured_media_src', $video );
		$this->assertArrayNotHasKey( 'featured_media', $image );
		$this->assertArrayNotHasKey( 'featured_media_src', $image );
	}

	/**
	 * @covers ::get_thumbnail_data
	 */
	public function test_get_thumbnail_data() {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$media  = new \Google\Web_Stories\Media\Video\Poster();
		$result = $media->get_thumbnail_data( $attachment_id );
		$this->assertCount( 4, $result );
		$this->assertArrayHasKey( 'src', $result );
		$this->assertArrayHasKey( 'width', $result );
		$this->assertArrayHasKey( 'height', $result );
		$this->assertArrayHasKey( 'generated', $result );
		$this->assertFalse( $result['generated'] );
	}

	/**
	 * @covers ::get_thumbnail_data
	 */
	public function test_get_thumbnail_data_generated() {
		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media_Source_Taxonomy::TAXONOMY_SLUG );

		$media  = new \Google\Web_Stories\Media\Video\Poster();
		$result = $media->get_thumbnail_data( $poster_attachment_id );
		$this->assertTrue( $result['generated'] );
	}

	/**
	 * @covers ::delete_video_poster
	 */
	public function test_delete_video_poster() {
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
		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media_Source_Taxonomy::TAXONOMY_SLUG );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media\Video\Poster::POSTER_ID_POST_META_KEY, $poster_attachment_id );

		$media = new \Google\Web_Stories\Media\Video\Poster();
		$media->delete_video_poster( $video_attachment_id );
		$this->assertNull( get_post( $poster_attachment_id ) );
	}

	/**
	 * @covers ::delete_video_poster
	 */
	public function test_delete_video_poster_no_generated_poster() {
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

		$media = new \Google\Web_Stories\Media\Video\Poster();
		$media->delete_video_poster( $video_attachment_id );
		$this->assertNotNull( get_post( $poster_attachment_id ) );
	}

	/**
	 * @covers ::delete_video_poster
	 */
	public function test_delete_video_poster_when_attachment_is_deleted() {
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

		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media_Source_Taxonomy::TAXONOMY_SLUG );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media\Video\Poster::POSTER_ID_POST_META_KEY, $poster_attachment_id );
		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		wp_delete_attachment( $video_attachment_id );
		$this->assertNull( get_post( $poster_attachment_id ) );
	}

	/**
	 * @covers ::is_poster
	 */
	public function test_is_poster() {
		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$media = new \Google\Web_Stories\Media\Video\Poster();

		$result1 = $this->call_private_method( $media, 'is_poster', [ $poster_attachment_id ] );
		$this->assertFalse( $result1 );

		wp_set_object_terms( $poster_attachment_id, 'editor', \Google\Web_Stories\Media\Media_Source_Taxonomy::TAXONOMY_SLUG );
		$result2 = $this->call_private_method( $media, 'is_poster', [ $poster_attachment_id ] );
		$this->assertFalse( $result2 );

		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media_Source_Taxonomy::TAXONOMY_SLUG );
		$result3 = $this->call_private_method( $media, 'is_poster', [ $poster_attachment_id ] );
		$this->assertTrue( $result3 );
	}
}
