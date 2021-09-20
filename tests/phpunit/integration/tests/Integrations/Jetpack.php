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
use Google\Web_Stories\Tests\Integration\TestCase;
use Google\Web_Stories\Integrations\Jetpack as Jetpack_Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Jetpack
 */
class Jetpack extends TestCase {

	const ATTACHMENT_URL = 'http://www.example.com/test.mp4';

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$media_source = new Media_Source_Taxonomy();
		$jetpack      = new Jetpack_Integration( $media_source );
		$jetpack->register();

		$this->assertFalse( has_filter( 'wpcom_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );
		$this->assertSame( 10, has_filter( 'jetpack_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );
		$this->assertSame( 10, has_filter( 'jetpack_is_amp_request', [ $jetpack, 'force_amp_request' ] ) );

		remove_all_filters( 'jetpack_sitemap_post_types' );
	}

	/**
	 * @covers ::register
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_register_is_wpcom() {
		define( 'IS_WPCOM', true );

		$media_source = new Media_Source_Taxonomy();
		$jetpack      = new Jetpack_Integration( $media_source );
		$jetpack->register();

		$this->assertSame( 10, has_filter( 'wpcom_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );
		$this->assertFalse( has_filter( 'jetpack_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );

		remove_all_filters( 'wpcom_sitemap_post_types' );
	}

	/**
	 * @covers ::add_to_jetpack_sitemap
	 */
	public function test_add_to_jetpack_sitemap() {
		$media_source = new Media_Source_Taxonomy();
		$jetpack      = new Jetpack_Integration( $media_source );
		$this->assertEqualSets( [ Story_Post_Type::POST_TYPE_SLUG ], $jetpack->add_to_jetpack_sitemap( [] ) );
	}

	/**
	 * @covers ::filter_api_response
	 * @covers ::add_extra_data
	 */
	public function test_filter_api_response() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => Jetpack_Integration::VIDEOPRESS_MIME_TYPE,
				'post_title'     => __METHOD__,
			]
		);
		$attachment          = get_post( $video_attachment_id );

		$media_source = new Media_Source_Taxonomy();
		$jetpack      = new Jetpack_Integration( $media_source );
		// wp_prepare_attachment_for_js doesn't exactly match the output of media REST API, but it good enough for these tests.
		$original_data = wp_prepare_attachment_for_js( $attachment );

		$original_data['media_details']['videopress'] = [
			'duration' => 5000,
			'finished' => false,
			'original' => self::ATTACHMENT_URL,
		];

		$response = rest_ensure_response( $original_data );

		$results = $jetpack->filter_api_response( $response, $attachment );
		$data    = $results->get_data();

		$this->assertArrayHasKey( 'mime_type', $data );
		$this->assertSame( $data['mime_type'], 'video/mp4' );

		$this->assertArrayHasKey( 'media_source', $data );
		$this->assertSame( $data['media_source'], 'video-optimization' );

		$this->assertArrayHasKey( 'source_url', $data );
		$this->assertSame( $data['source_url'], self::ATTACHMENT_URL );

		$this->assertArrayHasKey( 'media_details', $data );
		$this->assertArrayHasKey( 'length_formatted', $data['media_details'] );
		$this->assertArrayHasKey( 'length', $data['media_details'] );
		$this->assertSame( $data['media_details']['length_formatted'], '0:05' );
		$this->assertSame( $data['media_details']['length'], 5 );
	}

	/**
	 * @covers ::add_term
	 */
	public function test_add_term() {
		$media_source = new Media_Source_Taxonomy();

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		$jetpack              = new Jetpack_Integration( $media_source );
		$jetpack->register();

		add_post_meta( $poster_attachment_id, Jetpack_Integration::VIDEOPRESS_POSTER_META_KEY, 'hello world' );

		$terms = wp_get_post_terms( $poster_attachment_id, $media_source->get_taxonomy_slug() );
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
		$attachment          = get_post( $video_attachment_id );

		$media_source = new Media_Source_Taxonomy();
		$jetpack      = new Jetpack_Integration( $media_source );
		add_filter( 'get_post_metadata', [ $this, 'filter_wp_get_attachment_metadata' ], 10, 3 );
		$response = wp_prepare_attachment_for_js( $attachment );

		$data = $jetpack->filter_admin_ajax_response( $response, $attachment );

		$this->assertArrayHasKey( 'mime', $data );
		$this->assertSame( $data['mime'], 'video/mp4' );

		$this->assertArrayHasKey( 'subtype', $data );
		$this->assertSame( $data['subtype'], 'mp4' );

		$this->assertArrayHasKey( 'media_source', $data );
		$this->assertSame( $data['media_source'], 'video-optimization' );

		$this->assertArrayHasKey( 'url', $data );
		$this->assertSame( $data['url'], self::ATTACHMENT_URL );

		$this->assertArrayHasKey( 'media_details', $data );
		$this->assertArrayHasKey( 'length_formatted', $data['media_details'] );
		$this->assertArrayHasKey( 'length', $data['media_details'] );
		$this->assertSame( $data['media_details']['length_formatted'], '0:05' );
		$this->assertSame( $data['media_details']['length'], 5 );

		remove_filter( 'get_post_metadata', [ $this, 'filter_wp_get_attachment_metadata' ] );
	}

	/**
	 * @covers ::filter_ajax_query_attachments_args
	 */
	public function test_filter_ajax_query_attachments_args() {
		$media_source         = new Media_Source_Taxonomy();
		$jetpack              = new Jetpack_Integration( $media_source );
		$allowed_mime_types   = $jetpack->get_allowed_mime_types();
		$allowed_mime_types   = array_merge( ...array_values( $allowed_mime_types ) );
		$allowed_mime_types[] = $jetpack::VIDEOPRESS_MIME_TYPE;
		$args                 = [ 'post_mime_type' => $allowed_mime_types ];
		$jetpack->filter_ajax_query_attachments_args( $args );
		$this->assertSame( 15, has_filter( 'wp_prepare_attachment_for_js', [ $jetpack, 'filter_admin_ajax_response' ] ) );
	}

	/**
	 * @dataProvider get_sample_data
	 *
	 * @param string $milliseconds
	 * @param string $string
	 * @covers ::format_milliseconds
	 */
	public function test_format_milliseconds( $milliseconds, $string ) {

		$media_source = new Media_Source_Taxonomy();
		$jetpack      = new Jetpack_Integration( $media_source );
		$result       = $this->call_private_method( $jetpack, 'format_milliseconds', [ $milliseconds ] );
		$this->assertSame( $result, $string );
	}

	/**
	 * @param $value
	 * @param $object_id
	 * @param $meta_key
	 *
	 * @return \array[][]
	 */
	public function filter_wp_get_attachment_metadata( $value, $object_id, $meta_key ) {
		if ( '_wp_attachment_metadata' !== $meta_key ) {
			return $value;
		}

		$original_data = [
			[
				'videopress' => [
					'duration' => 5000,
					'finished' => false,
					'original' => self::ATTACHMENT_URL,
				],
			],
		];

		return $original_data;
	}

	/**
	 * @return array[]
	 */
	public function get_sample_data() {
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
