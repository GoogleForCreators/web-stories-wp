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

		$request  = new WP_REST_Request( 'GET', sprintf( '/wp/v2/media/%d', $video_attachment_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'featured_media', $data );
		$this->assertEquals( $poster_attachment_id, $data['featured_media'] );
		$this->assertEquals( wp_get_attachment_url( $poster_attachment_id ), $data['featured_media_src'] );
	}

	/**
	 * Test image_downsize()
	 */
	public function test_image_downsize() {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => '../data/unlock.svg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/svg+xml',
				'post_title'     => 'Test Image',
			]
		);

		$actual = \Google\Web_Stories\Media::image_downsize( false, $attachment_id, [ 123, 456 ] );
		$this->assertEquals( wp_get_attachment_url( $attachment_id ), $actual[0] );
		$this->assertEquals( 123, $actual[1] );
		$this->assertEquals( 456, $actual[2] );
	}

	/**
	 * Test image_downsize()
	 */
	public function test_image_downsize_no_size() {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => '../data/unlock.svg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/svg+xml',
				'post_title'     => 'Test Image',
			]
		);

		$actual = \Google\Web_Stories\Media::image_downsize( false, $attachment_id, 'thumbnail' );
		$this->assertEquals( wp_get_attachment_url( $attachment_id ), $actual[0] );
		$this->assertEquals( 300, $actual[1] );
		$this->assertEquals( 300, $actual[2] );
	}
}
