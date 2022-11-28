<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\Media\Video;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use WP_REST_Request;
use WP_REST_Server;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Video\Muting
 */
class Muting extends DependencyInjectedTestCase {
	private \Google\Web_Stories\Media\Video\Muting $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Media\Video\Muting::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 10, has_action( 'rest_api_init', [ $this->instance, 'rest_api_init' ] ) );
		$this->assertSame( 10, has_action( 'delete_attachment', [ $this->instance, 'delete_video' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'wp_prepare_attachment_for_js',
				[
					$this->instance,
					'wp_prepare_attachment_for_js',
				]
			)
		);
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta(): void {
		$this->instance->register_meta();

		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::IS_MUTED_POST_META_KEY, 'attachment' ) );
		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::MUTED_ID_POST_META_KEY, 'attachment' ) );
	}

	/**
	 * @covers ::wp_prepare_attachment_for_js
	 * @covers ::get_callback_is_muted
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

		$this->assertArrayNotHasKey( $this->instance::IS_MUTED_REST_API_KEY, $image );
		$this->assertArrayHasKey( $this->instance::IS_MUTED_REST_API_KEY, $video );
	}

	/**
	 * @covers ::rest_api_init
	 * @covers ::get_callback_is_muted
	 */
	public function test_rest_api_init(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$this->assertNotWPError( $video_attachment_id );

		$request  = new WP_REST_Request( WP_REST_Server::READABLE, sprintf( '/web-stories/v1/media/%d', $video_attachment_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( $this->instance::IS_MUTED_REST_API_KEY, $data );
		$this->assertNull( $data[ $this->instance::IS_MUTED_REST_API_KEY ] );
	}

	/**
	 * @covers ::get_callback_is_muted
	 */
	public function test_get_callback_is_muted(): void {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$this->assertNotWPError( $video_attachment_id );

		update_post_meta( $video_attachment_id, $this->instance::IS_MUTED_POST_META_KEY, '1' );
		$result = $this->instance->get_callback_is_muted( [ 'id' => $video_attachment_id ] );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::update_callback_is_muted
	 */
	public function test_update_callback_is_muted(): void {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$this->assertNotWPError( $video_attachment_id );

		$actual = $this->instance->update_callback_is_muted( true, get_post( $video_attachment_id ) );
		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::update_callback_is_muted
	 */
	public function test_update_callback_is_muted_error(): void {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$this->assertNotWPError( $video_attachment_id );

		$result = $this->instance->update_callback_is_muted( true, get_post( $video_attachment_id ) );
		$this->assertInstanceOf( 'WP_Error', $result );
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

		$this->assertNotWPError( $video_attachment_id );

		$muted_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$this->assertNotWPError( $muted_attachment_id );

		add_post_meta( $video_attachment_id, $this->instance::MUTED_ID_POST_META_KEY, $muted_attachment_id );
		$this->assertSame( $muted_attachment_id, get_post_meta( $video_attachment_id, $this->instance::MUTED_ID_POST_META_KEY, true ) );
		wp_delete_attachment( $muted_attachment_id );
		$this->assertEmpty( get_post_meta( $video_attachment_id, $this->instance::MUTED_ID_POST_META_KEY, true ) );
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

		$muted_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$this->assertNotWPError( $muted_attachment_id );

		add_post_meta( $video_attachment_id, $this->instance::MUTED_ID_POST_META_KEY, $muted_attachment_id );
		add_post_meta( $muted_attachment_id, $this->instance::IS_MUTED_POST_META_KEY, '1' );
		$this->instance->on_plugin_uninstall();
		$this->assertSame( 0, get_post_meta( $video_attachment_id, $this->instance::MUTED_ID_POST_META_KEY, true ) );
		$this->assertFalse( get_post_meta( $muted_attachment_id, $this->instance::IS_MUTED_POST_META_KEY, true ) );
	}
}
