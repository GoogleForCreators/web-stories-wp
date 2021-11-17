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

namespace Google\Web_Stories\Tests\Integration\Integrations;

use Google\Web_Stories\Media\Media_Source_Taxonomy;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use Google\Web_Stories\Integrations\Jetpack as Jetpack_Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Jetpack
 */
class Jetpack extends DependencyInjectedTestCase {
	const ATTACHMENT_URL = 'https://www.example.com/test.mp4';
	const MP4_FILE       = 'video.mp4';
	const POSTER_URL     = 'https://www.example.com/test.mp4';

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Integrations\Jetpack
	 */
	protected $instance;

	public function set_up() {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Integrations\Jetpack::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$this->instance->register();

		$this->assertFalse( has_filter( 'wpcom_sitemap_post_types', [ $this->instance, 'add_to_jetpack_sitemap' ] ) );
		$this->assertSame( 10, has_filter( 'jetpack_sitemap_post_types', [ $this->instance, 'add_to_jetpack_sitemap' ] ) );
		$this->assertSame( 10, has_filter( 'jetpack_is_amp_request', [ $this->instance, 'force_amp_request' ] ) );

		remove_all_filters( 'jetpack_sitemap_post_types' );
	}

	/**
	 * @covers ::register
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_register_is_wpcom() {
		define( 'IS_WPCOM', true );

		$this->instance->register();

		$this->assertSame( 10, has_filter( 'wpcom_sitemap_post_types', [ $this->instance, 'add_to_jetpack_sitemap' ] ) );
		$this->assertFalse( has_filter( 'jetpack_sitemap_post_types', [ $this->instance, 'add_to_jetpack_sitemap' ] ) );

		remove_all_filters( 'wpcom_sitemap_post_types' );
	}

	/**
	 * @covers ::add_to_jetpack_sitemap
	 */
	public function test_add_to_jetpack_sitemap() {
		$this->assertEqualSets( [ Story_Post_Type::POST_TYPE_SLUG ], $this->instance->add_to_jetpack_sitemap( [] ) );
	}

	/**
	 * @covers ::filter_rest_api_response
	 * @covers ::add_extra_data
	 */
	public function test_filter_rest_api_response() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => Jetpack_Integration::VIDEOPRESS_MIME_TYPE,
				'post_title'     => __METHOD__,
			]
		);

		$post = get_post( $video_attachment_id );

		$data = [
			'source_url'         => self::ATTACHMENT_URL,
			'featured_media_src' => [],
		];

		$response = rest_ensure_response( $data );

		add_filter( 'get_post_metadata', [ $this, 'filter_wp_get_attachment_metadata' ], 10, 3 );

		$results = $this->instance->filter_rest_api_response( $response, $post );

		remove_filter( 'get_post_metadata', [ $this, 'filter_wp_get_attachment_metadata' ] );

		$data = $results->get_data();

		$this->assertArrayHasKey( 'mime_type', $data );
		$this->assertSame( 'video/mp4', $data['mime_type'] );

		$this->assertArrayHasKey( $this->container->get( 'media.media_source' )::MEDIA_SOURCE_KEY, $data );
		$this->assertSame( 'video-optimization', $data[ $this->container->get( 'media.media_source' )::MEDIA_SOURCE_KEY ] );

		$this->assertArrayHasKey( 'source_url', $data );
		$this->assertSame( 'https://videopress.example.com/videos/video.mp4', $data['source_url'] );

		$this->assertArrayHasKey( 'media_details', $data );
		$this->assertArrayHasKey( 'length_formatted', $data['media_details'] );
		$this->assertArrayHasKey( 'length', $data['media_details'] );
		$this->assertSame( '0:05', $data['media_details']['length_formatted'] );
		$this->assertSame( 5, $data['media_details']['length'] );
	}

	/**
	 * @covers ::add_term
	 */
	public function test_add_term() {
		$this->instance->register();

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$this->instance->register();

		add_post_meta( $poster_attachment_id, Jetpack_Integration::VIDEOPRESS_POSTER_META_KEY, 'hello world' );

		$terms = wp_get_post_terms( $poster_attachment_id, $this->container->get( 'media.media_source' )->get_taxonomy_slug() );
		$slugs = wp_list_pluck( $terms, 'slug' );
		$this->assertCount( 1, $terms );
		$this->assertEqualSets( [ 'poster-generation' ], $slugs );
	}

	/**
	 * @covers ::filter_admin_ajax_response
	 * @covers ::add_extra_data
	 */
	public function test_filter_admin_ajax_response() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => Jetpack_Integration::VIDEOPRESS_MIME_TYPE,
				'post_title'     => __METHOD__,
			]
		);

		add_filter( 'get_post_metadata', [ $this, 'filter_wp_get_attachment_metadata' ], 10, 3 );

		$attachment = get_post( $video_attachment_id );
		$response   = wp_prepare_attachment_for_js( $attachment );
		$data       = $this->instance->filter_admin_ajax_response( $response, $attachment );

		remove_filter( 'get_post_metadata', [ $this, 'filter_wp_get_attachment_metadata' ] );

		$this->assertArrayHasKey( 'mime', $data );
		$this->assertSame( 'video/mp4', $data['mime'] );

		$this->assertArrayHasKey( 'subtype', $data );
		$this->assertSame( 'mp4', $data['subtype'] );

		$this->assertArrayHasKey( $this->container->get( 'media.media_source' )::MEDIA_SOURCE_KEY, $data );
		$this->assertSame( 'video-optimization', $data[ $this->container->get( 'media.media_source' )::MEDIA_SOURCE_KEY ] );

		$this->assertArrayHasKey( 'url', $data );
		$this->assertSame( 'https://videopress.example.com/videos/video.mp4', $data['url'] );

		$this->assertArrayHasKey( 'media_details', $data );
		$this->assertArrayHasKey( 'length_formatted', $data['media_details'] );
		$this->assertArrayHasKey( 'length', $data['media_details'] );
		$this->assertSame( '0:05', $data['media_details']['length_formatted'] );
		$this->assertSame( 5, $data['media_details']['length'] );
	}

	/**
	 * @covers ::filter_ajax_query_attachments_args
	 */
	public function test_filter_ajax_query_attachments_args() {
		$types                = $this->injector->make( \Google\Web_Stories\Media\Types::class );
		$allowed_mime_types   = $types->get_allowed_mime_types();
		$allowed_mime_types   = array_merge( ...array_values( $allowed_mime_types ) );
		$allowed_mime_types[] = $this->instance::VIDEOPRESS_MIME_TYPE;
		$args                 = [ 'post_mime_type' => $allowed_mime_types ];
		$this->instance->filter_ajax_query_attachments_args( $args );
		$this->assertSame(
			15,
			has_filter(
				'wp_prepare_attachment_for_js',
				[
					$this->instance,
					'filter_admin_ajax_response',
				]
			)
		);
	}

	/**
	 * @dataProvider get_format_milliseconds_data
	 *
	 * @param string $milliseconds
	 * @param string $string
	 * @covers ::format_milliseconds
	 */
	public function test_format_milliseconds( $milliseconds, $string ) {
		$result = $this->call_private_method( $this->instance, 'format_milliseconds', [ $milliseconds ] );
		$this->assertSame( $result, $string );
	}

	/**
	 * @param mixed $value
	 * @param $object_id
	 * @param $meta_key
	 *
	 * @return \array[][]|mixed
	 */
	public function filter_wp_get_attachment_metadata( $value, $object_id, $meta_key ) {
		if ( '_wp_attachment_metadata' !== $meta_key ) {
			return $value;
		}

		$original_data = [
			[
				'videopress' => [
					'duration'      => 5000,
					'finished'      => false,
					'original'      => self::ATTACHMENT_URL,
					'width'         => 720,
					'height'        => 1080,
					'poster'        => self::POSTER_URL,
					'file_url_base' => [
						'https' => 'https://videopress.example.com/videos/',
					],
					'files'         => [
						'hd' => [
							'mp4' => self::MP4_FILE,
						],
					],
				],
			],
		];

		return $original_data;
	}

	/**
	 * @return array[]
	 */
	public function get_format_milliseconds_data(): array {
		return [
			'5000'      => [
				5000,
				'0:05',
			],
			'15123'     => [
				15123,
				'0:15',
			],
			'15999'     => [
				15123,
				'0:15',
			],
			'0'         => [
				0,
				'0:00',
			],
			'-1'        => [
				- 1,
				'0:00',
			],
			'-5000'     => [
				- 5000,
				'0:00',
			],
			'30526'     => [
				30526,
				'0:30',
			],
			'13123'     => [
				13123,
				'0:13',
			],
			'3600000'   => [
				3600000,
				'60:00',
			],
			'98765431'  => [
				98765431,
				'1646:05',
			],
			'5000.9876' => [
				5000.9876,
				'0:05',
			],
		];
	}
}
