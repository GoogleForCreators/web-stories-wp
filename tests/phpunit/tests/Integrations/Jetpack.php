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

namespace Google\Web_Stories\Tests\Integrations;

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Jetpack
 */
class Jetpack extends Test_Case {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$jetpack = $this->get_jetpack_object();
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

		$jetpack = $this->get_jetpack_object();
		$jetpack->register();

		$this->assertSame( 10, has_filter( 'wpcom_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );
		$this->assertFalse( has_filter( 'jetpack_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );

		remove_all_filters( 'wpcom_sitemap_post_types' );
	}

	/**
	 * @covers ::add_to_jetpack_sitemap
	 */
	public function test_add_to_jetpack_sitemap() {
		$jetpack = $this->get_jetpack_object();
		$this->assertEqualSets( [ Story_Post_Type::POST_TYPE_SLUG ], $jetpack->add_to_jetpack_sitemap( [] ) );
	}

	/**
	 * @covers ::filter_api_response
	 */
	public function test_filter_api_response() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mp4',
				'post_parent'    => 0,
				'post_mime_type' => \Google\Web_Stories\Integrations\Jetpack::VIDEOPRESS_MIME_TYPE,
				'post_title'     => __METHOD__,
			]
		);
		$attachment          = get_post( $video_attachment_id );

		$jetpack = $this->get_jetpack_object();
		// wp_prepare_attachment_for_js doesn't exactly match the output of media REST API, but it good enough for these tests.
		$response = rest_ensure_response( wp_prepare_attachment_for_js( $attachment ) );

		$results = $jetpack->filter_api_response( $response, $attachment );
		$data    = $results->get_data();
		$this->assertArrayHasKey( 'mime_type', $data );
		$this->assertSame( $data['mime_type'], 'video/mp4' );
	}

	/**
	 * @covers ::filter_admin_ajax_response
	 */
	public function test_filter_admin_ajax_response() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mp4',
				'post_parent'    => 0,
				'post_mime_type' => \Google\Web_Stories\Integrations\Jetpack::VIDEOPRESS_MIME_TYPE,
				'post_title'     => __METHOD__,
			]
		);
		$attachment          = get_post( $video_attachment_id );

		$jetpack  = $this->get_jetpack_object();
		$response = wp_prepare_attachment_for_js( $attachment );

		$data = $jetpack->filter_admin_ajax_response( $response, $attachment );
		$this->assertArrayHasKey( 'mime', $data );
		$this->assertSame( $data['mime'], \Google\Web_Stories\Integrations\Jetpack::VIDEOPRESS_MIME_TYPE );

		$_POST = [ // phpcs:ignore WordPress.Security.NonceVerification.Missing
			'action' => 'query-attachments',
			'query'  => [
				'source' => 'web_stories_editor',
			],
		];

		$data = $jetpack->filter_admin_ajax_response( $response, $attachment );
		$this->assertArrayHasKey( 'mime', $data );
		$this->assertSame( $data['mime'], 'video/mp4' );

		unset( $_POST ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
	}

	/**
	 * @return \Google\Web_Stories\Integrations\Jetpack
	 */
	protected function get_jetpack_object() {
		return new \Google\Web_Stories\Integrations\Jetpack();
	}
}
