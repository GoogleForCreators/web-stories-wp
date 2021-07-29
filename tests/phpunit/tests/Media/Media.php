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

namespace Google\Web_Stories\Tests\Media;

use Google\Web_Stories\Tests\Test_Case;
use WP_Query;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Media
 */
class Media extends Test_Case {

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$media = new \Google\Web_Stories\Media\Media();
		$media->register();

		$this->assertSame( 10, has_action( 'rest_api_init', [ $media, 'rest_api_init' ] ) );
		$this->assertSame( 10, has_filter( 'wp_prepare_attachment_for_js', [ $media, 'wp_prepare_attachment_for_js' ] ) );
		$this->assertSame( 10, has_action( 'delete_attachment', [ $media, 'delete_video_poster' ] ) );
		$this->assertSame( 10, has_filter( 'ajax_query_attachments_args', [ $media, 'filter_ajax_query_attachments_args' ] ) );
		$this->assertSame( 10, has_filter( 'pre_get_posts', [ $media, 'filter_generated_media_attachments' ] ) );
		$this->assertSame( 15, has_filter( 'default_post_metadata', [ $media, 'filter_default_value_is_muted' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'rest_attachment_query',
				[
					$media,
					'filter_rest_generated_media_attachments',
				]
			)
		);
	}

	/**
	 * @covers ::add_image_sizes
	 */
	public function test_add_image_sizes() {
		$media = new \Google\Web_Stories\Media\Media();
		$this->call_private_method( $media, 'add_image_sizes' );

		$this->assertTrue( has_image_size( \Google\Web_Stories\Media\Media::POSTER_PORTRAIT_IMAGE_SIZE ) );
		$this->assertTrue( has_image_size( \Google\Web_Stories\Media\Media::STORY_THUMBNAIL_IMAGE_SIZE ) );
		$this->assertTrue( has_image_size( \Google\Web_Stories\Media\Media::PUBLISHER_LOGO_IMAGE_SIZE ) );
	}


	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta() {
		$media = new \Google\Web_Stories\Media\Media();
		$this->call_private_method( $media, 'register_meta' );

		$this->assertTrue( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Media::IS_MUTED_POST_META_KEY, 'attachment' ) );
		$this->assertTrue( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Media::MUTED_ID_POST_META_KEY, 'attachment' ) );
		$this->assertTrue( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Media::OPTIMIZED_ID_POST_META_KEY, 'attachment' ) );
		$this->assertTrue( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Media::POSTER_ID_POST_META_KEY, 'attachment' ) );
		$this->assertFalse( registered_meta_key_exists( 'post', \Google\Web_Stories\Media\Media::POSTER_POST_META_KEY, 'attachment' ) );
	}

	/**
	 * @covers ::register_taxonomy
	 */
	public function test_register_taxonomy() {
		$media = new \Google\Web_Stories\Media\Media();
		$this->call_private_method( $media, 'register_taxonomy' );

		$this->assertTrue( taxonomy_exists( \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY ) );
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
		wp_set_object_terms( $video_attachment_id, 'editor', \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, sprintf( '/web-stories/v1/media/%d', $video_attachment_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'featured_media', $data );
		$this->assertArrayHasKey( 'media_source', $data );
		$this->assertEquals( $poster_attachment_id, $data['featured_media'] );
		$this->assertEquals( wp_get_attachment_url( $poster_attachment_id ), $data['featured_media_src']['src'] );
		$this->assertEquals( 'editor', $data['media_source'] );
	}

	/**
	 * @covers ::wp_prepare_attachment_for_js
	 */
	public function test_wp_prepare_attachment_for_js() {
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
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		$media = new \Google\Web_Stories\Media\Media();
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

		$this->assertEqualSets(
			[
				'type'          => 'image',
				'media_source'  => '',
				'id'            => $poster_attachment_id,
				'url'           => wp_get_attachment_url( $poster_attachment_id ),
				'media_details' => [],
			],
			$image
		);

		$this->assertArrayHasKey( 'media_source', $image );
		$this->assertArrayHasKey( 'featured_media', $video );
		$this->assertArrayHasKey( 'featured_media_src', $video );
		$this->assertArrayHasKey( 'media_source', $video );
		$this->assertArrayHasKey( 'meta', $video );
		$this->assertArrayHasKey( \Google\Web_Stories\Media\Media::IS_MUTED_POST_META_KEY, $video['meta'] );
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

		$media  = new \Google\Web_Stories\Media\Media();
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

		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY );

		$media  = new \Google\Web_Stories\Media\Media();
		$result = $media->get_thumbnail_data( $poster_attachment_id );
		$this->assertTrue( $result['generated'] );
	}

	/**
	 * @covers ::delete_video_poster
	 */
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
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );
		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media\Media::POSTER_ID_POST_META_KEY, $poster_attachment_id );

		$media = new \Google\Web_Stories\Media\Media();
		$media->delete_video_poster( $video_attachment_id );
		$this->assertNull( get_post( $poster_attachment_id ) );
	}

	/**
	 * @covers ::delete_video_poster
	 */
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
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );

		$media = new \Google\Web_Stories\Media\Media();
		$media->delete_video_poster( $video_attachment_id );
		$this->assertNotNull( get_post( $poster_attachment_id ) );
	}

	/**
	 * @covers ::delete_video_poster
	 */
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
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media\Media::POSTER_ID_POST_META_KEY, $poster_attachment_id );
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

		$media = new \Google\Web_Stories\Media\Media();

		$result1 = $this->call_private_method( $media, 'is_poster', [ $poster_attachment_id ] );
		$this->assertFalse( $result1 );

		wp_set_object_terms( $poster_attachment_id, 'editor', \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY );
		$result2 = $this->call_private_method( $media, 'is_poster', [ $poster_attachment_id ] );
		$this->assertFalse( $result2 );

		wp_set_object_terms( $poster_attachment_id, 'poster-generation', \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY );
		$result3 = $this->call_private_method( $media, 'is_poster', [ $poster_attachment_id ] );
		$this->assertTrue( $result3 );
	}

	/**
	 * @covers ::filter_ajax_query_attachments_args
	 * @covers ::get_exclude_tax_query
	 */
	public function test_filter_ajax_query_attachments_args() {
		$expected = [
			'tax_query' => [
				[
					'taxonomy' => \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY,
					'field'    => 'slug',
					'terms'    => [ 'poster-generation', 'source-video', 'source-image' ],
					'operator' => 'NOT IN',
				],
			],
		];

		$media  = new \Google\Web_Stories\Media\Media();
		$actual = $media->filter_ajax_query_attachments_args( [] );

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::filter_ajax_query_attachments_args
	 * @covers ::get_exclude_tax_query
	 */
	public function test_filter_ajax_query_attachments_args_existing_tax_query() {
		$expected = [
			'tax_query' => [
				[
					'taxonomy' => \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY,
					'field'    => 'slug',
					'terms'    => [ 'poster-generation', 'source-video', 'source-image' ],
					'operator' => 'NOT IN',
				],
				[
					[
						'taxonomy' => 'category',
						'field'    => 'slug',
						'terms'    => [ 'uncategorized' ],
						'operator' => 'NOT IN',
					],
				],
			],
		];

		$media  = new \Google\Web_Stories\Media\Media();
		$actual = $media->filter_ajax_query_attachments_args(
			[
				'tax_query' => [
					[
						'taxonomy' => 'category',
						'field'    => 'slug',
						'terms'    => [ 'uncategorized' ],
						'operator' => 'NOT IN',
					],
				],
			]
		);

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::filter_generated_media_attachments
	 */
	public function test_filter_generated_media_attachments_no_screen() {
		$query    = new WP_Query();
		$expected = $query->get( 'tax_query' );

		$media = new \Google\Web_Stories\Media\Media();
		$media->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::filter_generated_media_attachments
	 */
	public function test_filter_generated_media_attachments_not_main_query() {
		$GLOBALS['current_screen'] = convert_to_screen( 'upload' );

		$query    = new WP_Query();
		$expected = $query->get( 'tax_query' );

		$media = new \Google\Web_Stories\Media\Media();
		$media->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		unset( $GLOBALS['current_screen'] );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::filter_generated_media_attachments
	 */
	public function test_filter_generated_media_attachments_not_upload_screen() {
		$GLOBALS['current_screen'] = convert_to_screen( 'post' );

		$query                   = new WP_Query();
		$GLOBALS['wp_the_query'] = $query;
		$expected                = $query->get( 'tax_query' );

		$media = new \Google\Web_Stories\Media\Media();
		$media->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		unset( $GLOBALS['current_screen'], $GLOBALS['wp_the_query'] );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::filter_generated_media_attachments
	 */
	public function test_filter_generated_media_attachmentss() {
		$expected = [
			[
				'taxonomy' => \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY,
				'field'    => 'slug',
				'terms'    => [ 'poster-generation', 'source-video', 'source-image' ],
				'operator' => 'NOT IN',
			],
			[
				[
					'taxonomy' => 'category',
					'field'    => 'slug',
					'terms'    => [ 'uncategorized' ],
					'operator' => 'NOT IN',
				],
			],
		];

		$GLOBALS['current_screen'] = convert_to_screen( 'upload' );

		$query                   = new WP_Query();
		$GLOBALS['wp_the_query'] = $query;
		$query->set(
			'tax_query',
			[
				[
					'taxonomy' => 'category',
					'field'    => 'slug',
					'terms'    => [ 'uncategorized' ],
					'operator' => 'NOT IN',
				],
			]
		);

		$media = new \Google\Web_Stories\Media\Media();
		$media->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		unset( $GLOBALS['current_screen'], $GLOBALS['wp_the_query'] );

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::filter_rest_generated_media_attachments
	 */
	public function test_filter_rest_generated_media_attachments_wrong_route() {
		$expected = [];

		$media  = new \Google\Web_Stories\Media\Media();
		$actual = $media->filter_rest_generated_media_attachments( [], new WP_REST_Request() );

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::filter_rest_generated_media_attachments
	 */
	public function test_filter_rest_generated_media_attachments() {
		$expected = [
			'tax_query' => [
				[
					'taxonomy' => \Google\Web_Stories\Media\Media::STORY_MEDIA_TAXONOMY,
					'field'    => 'slug',
					'terms'    => [ 'poster-generation', 'source-video', 'source-image' ],
					'operator' => 'NOT IN',
				],
			],
		];

		$media  = new \Google\Web_Stories\Media\Media();
		$actual = $media->filter_rest_generated_media_attachments(
			[],
			new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media' )
		);

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::filter_default_value_is_muted
	 */
	public function filter_default_value_is_muted() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);
		wp_generate_attachment_metadata( $video_attachment_id, get_attached_file( $video_attachment_id ) );

		$meta = get_post_meta( $video_attachment_id, \Google\Web_Stories\Media\Media::IS_MUTED_POST_META_KEY, true );
		$this->assertFalse( $meta );
	}

	/**
	 * @covers ::filter_default_value_is_muted
	 */
	public function filter_default_value_is_muted_image() {
		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		wp_generate_attachment_metadata( $poster_attachment_id, get_attached_file( $poster_attachment_id ) );

		$meta = get_post_meta( $poster_attachment_id, \Google\Web_Stories\Media\Media::IS_MUTED_POST_META_KEY, true );
		$this->assertFalse( $meta );
	}

	/**
	 * @covers ::filter_default_value_is_muted
	 */
	public function filter_default_value_is_muted_no_sound() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => WEB_STORIES_TEST_DATA_DIR . '/video-no-sound.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video - no sounds',
			]
		);
		wp_generate_attachment_metadata( $video_attachment_id, get_attached_file( $video_attachment_id ) );

		$meta = get_post_meta( $video_attachment_id, \Google\Web_Stories\Media\Media::IS_MUTED_POST_META_KEY, true );
		$this->assertTrue( $meta );

	}
}
