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

namespace Google\Web_Stories\Tests\Integration\Media;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use WP_Query;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Media_Source_Taxonomy
 */
class Media_Source_Taxonomy extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Media\Media_Source_Taxonomy
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Media\Media_Source_Taxonomy::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 10, has_action( 'rest_api_init', [ $this->instance, 'rest_api_init' ] ) );
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
		$this->assertSame(
			10,
			has_filter(
				'ajax_query_attachments_args',
				[
					$this->instance,
					'filter_ajax_query_attachments_args',
				]
			)
		);
		$this->assertSame( 10, has_filter( 'pre_get_posts', [ $this->instance, 'filter_generated_media_attachments' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'web_stories_rest_attachment_query',
				[
					$this->instance,
					'filter_rest_generated_media_attachments',
				]
			)
		);
	}

	/**
	 * @covers ::register_taxonomy
	 */
	public function test_register_taxonomy(): void {
		$this->call_private_method( $this->instance, 'register_taxonomy' );

		$this->assertTrue( taxonomy_exists( $this->instance->get_taxonomy_slug() ) );
	}

	/**
	 * @covers ::rest_api_init
	 */
	public function test_rest_api_init(): void {
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
		wp_set_object_terms( $video_attachment_id, 'editor', $this->instance->get_taxonomy_slug() );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, sprintf( '/wp/v2/media/%d', $video_attachment_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( $this->instance::MEDIA_SOURCE_KEY, $data );
		$this->assertEquals( 'editor', $data[ $this->instance::MEDIA_SOURCE_KEY ] );
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
			],
			get_post( $poster_attachment_id )
		);
		$video = $this->instance->wp_prepare_attachment_for_js(
			[
				'id'   => $video_attachment_id,
				'type' => 'video',
				'url'  => wp_get_attachment_url( $video_attachment_id ),
			],
			get_post( $video_attachment_id )
		);

		$this->assertEqualSets(
			[
				'type'                     => 'image',
				'web_stories_media_source' => '',
				'id'                       => $poster_attachment_id,
				'url'                      => wp_get_attachment_url( $poster_attachment_id ),

			],
			$image
		);

		$this->assertArrayHasKey( $this->instance::MEDIA_SOURCE_KEY, $image );
		$this->assertArrayHasKey( $this->instance::MEDIA_SOURCE_KEY, $video );
	}

	/**
	 * @covers ::get_exclude_tax_query
	 */
	public function test_get_exclude_tax_query_filter(): void {
		add_filter( 'web_stories_hide_auto_generated_attachments', '__return_false' );
		$tax_query = [
			[
				'taxonomy' => 'people',
				'field'    => 'slug',
				'terms'    => 'bob',
			],
		];
		$args      = [
			'tax_query' => $tax_query,
		];
		$results   = $this->call_private_method( $this->instance, 'get_exclude_tax_query', [ $args ] );
		remove_filter( 'web_stories_hide_auto_generated_attachments', '__return_false' );
		$this->assertSame( $tax_query, $results );
	}

	/**
	 * @covers ::filter_ajax_query_attachments_args
	 * @covers ::get_exclude_tax_query
	 */
	public function test_filter_ajax_query_attachments_args(): void {
		$tax_slug = $this->instance->get_taxonomy_slug();

		$expected = [
			'tax_query' => [
				[
					[
						'taxonomy' => $tax_slug,
						'field'    => 'slug',
						'terms'    => [ 'poster-generation', 'source-video', 'source-image', 'page-template' ],
						'operator' => 'NOT IN',
					],
				],
			],
		];

		$actual = $this->instance->filter_ajax_query_attachments_args( [] );

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::filter_ajax_query_attachments_args
	 * @covers ::get_exclude_tax_query
	 */
	public function test_filter_ajax_query_attachments_args_existing_tax_query(): void {
		$tax_slug = $this->instance->get_taxonomy_slug();

		$expected = [
			'tax_query' => [
				[
					[
						'taxonomy' => $tax_slug,
						'field'    => 'slug',
						'terms'    => [ 'poster-generation', 'source-video', 'source-image', 'page-template' ],
						'operator' => 'NOT IN',
					],
				],
				[
					'taxonomy' => 'category',
					'field'    => 'slug',
					'terms'    => [ 'uncategorized' ],
					'operator' => 'NOT IN',
				],
			],
		];

		$actual = $this->instance->filter_ajax_query_attachments_args(
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
	public function test_filter_generated_media_attachments_no_screen(): void {
		$query    = new WP_Query();
		$expected = $query->get( 'tax_query' );

		$this->instance->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::filter_generated_media_attachments
	 */
	public function test_filter_generated_media_attachments_not_main_query(): void {
		$GLOBALS['current_screen'] = convert_to_screen( 'upload' );

		$query    = new WP_Query();
		$expected = $query->get( 'tax_query' );

		$this->instance->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::filter_generated_media_attachments
	 */
	public function test_filter_generated_media_attachments_not_upload_screen(): void {
		$GLOBALS['current_screen'] = convert_to_screen( 'post' );

		$query                   = new WP_Query();
		$GLOBALS['wp_the_query'] = $query;
		$expected                = $query->get( 'tax_query' );

		$this->instance->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::filter_generated_media_attachments
	 */
	public function test_filter_generated_media_attachmentss(): void {

		$expected = [
			[
				[
					'taxonomy' => $this->instance->get_taxonomy_slug(),
					'field'    => 'slug',
					'terms'    => [ 'poster-generation', 'source-video', 'source-image', 'page-template' ],
					'operator' => 'NOT IN',
				],
			],
			[
				'taxonomy' => 'category',
				'field'    => 'slug',
				'terms'    => [ 'uncategorized' ],
				'operator' => 'NOT IN',
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

		$this->instance->filter_generated_media_attachments( $query );
		$actual = $query->get( 'tax_query' );

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::filter_rest_generated_media_attachments
	 */
	public function test_filter_rest_generated_media_attachments(): void {
		$tax_slug = $this->instance->get_taxonomy_slug();

		$expected = [
			'tax_query' => [
				[
					[
						'taxonomy' => $tax_slug,
						'field'    => 'slug',
						'terms'    => [ 'poster-generation', 'source-video', 'source-image', 'page-template' ],
						'operator' => 'NOT IN',
					],
				],
			],
		];

		$actual = $this->instance->filter_rest_generated_media_attachments( [] );

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}
}
