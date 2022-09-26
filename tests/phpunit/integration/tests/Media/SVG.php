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

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\SVG
 */
class SVG extends TestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Media\SVG
	 */
	protected $instance;

	public function set_up(): void {
		parent::set_up();

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );

		$this->instance = new \Google\Web_Stories\Media\SVG( $experiments );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame(
			10,
			has_filter(
				'web_stories_allowed_mime_types',
				[
					$this->instance,
					'web_stories_allowed_mime_types',
				]
			)
		);
		$this->assertSame( 10, has_filter( 'upload_mimes', [ $this->instance, 'upload_mimes_add_svg' ] ) );
		$this->assertSame( 10, has_filter( 'mime_types', [ $this->instance, 'mime_types_add_svg' ] ) );
		$this->assertSame( 10, has_filter( 'wp_handle_upload_prefilter', [ $this->instance, 'wp_handle_upload' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'wp_generate_attachment_metadata',
				[
					$this->instance,
					'wp_generate_attachment_metadata',
				]
			)
		);
		$this->assertSame( 10, has_filter( 'wp_check_filetype_and_ext', [ $this->instance, 'wp_check_filetype_and_ext' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'site_option_upload_filetypes',
				[
					$this->instance,
					'filter_list_of_allowed_filetypes',
				]
			)
		);
	}

	/**
	 * @covers ::svg_already_enabled
	 */
	public function test_svg_already_enabled(): void {
		$_results = $this->call_private_method( $this->instance, 'svg_already_enabled' );

		$this->assertFalse( $_results );
	}

	/**
	 * @covers ::upload_mimes_add_svg
	 */
	public function test_upload_mimes_add_svg(): void {
		$this->instance->register();

		$allowed_mime_types = wp_get_mime_types();
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );

		$allowed_mime_types = $this->instance->upload_mimes_add_svg( [] );
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );
	}

	/**
	 * @covers ::mime_types_add_svg
	 */
	public function test_mime_types_add_svg(): void {
		$this->instance->register();

		$allowed_mime_types = get_allowed_mime_types();
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );

		$allowed_mime_types = $this->instance->mime_types_add_svg( [] );
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );
	}


	/**
	 * @covers ::web_stories_allowed_mime_types
	 */
	public function test_web_stories_allowed_mime_types(): void {
		$allowed_mime_types = $this->instance->web_stories_allowed_mime_types( [] );

		$this->assertArrayHasKey( 'vector', $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $allowed_mime_types['vector'] );
	}

	/**
	 * @covers ::filter_list_of_allowed_filetypes
	 */
	public function test_filter_list_of_allowed_filetypes(): void {
		$this->instance->register();

		$site_exts = explode( ' ', get_site_option( 'upload_filetypes', 'jpg jpeg png gif' ) );
		$this->assertContains( 'svg', $site_exts );
	}

	/**
	 * @covers ::wp_generate_attachment_metadata
	 * @covers ::get_svg_size
	 */
	public function test_upload_svg(): void {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => WEB_STORIES_TEST_DATA_DIR . '/video-play.svg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/svg+xml',
				'post_title'     => 'Test svg',
			]
		);

		$this->instance->register();

		$attachment_metadata = wp_generate_attachment_metadata( $attachment_id, get_attached_file( $attachment_id ) );
		$this->assertArrayHasKey( 'width', $attachment_metadata );
		$this->assertArrayHasKey( 'height', $attachment_metadata );
		$this->assertArrayHasKey( 'file', $attachment_metadata );
		$this->assertArrayHasKey( 'filesize', $attachment_metadata );
		$this->assertArrayHasKey( 'sizes', $attachment_metadata );

		$this->assertSame( $attachment_metadata['width'], 64 );
		$this->assertSame( $attachment_metadata['height'], 64 );
	}

	/**
	 * @covers ::wp_generate_attachment_metadata
	 */
	public function test_wp_generate_attachment_metadata_update(): void {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => WEB_STORIES_TEST_DATA_DIR . '/video-play.svg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/svg+xml',
				'post_title'     => 'Test svg',
			]
		);

		$result = $this->instance->wp_generate_attachment_metadata( [], $attachment_id, 'update' );
		$this->assertEqualSets( [], $result );
	}


	/**
	 * @covers ::wp_generate_attachment_metadata
	 */
	public function test_wp_generate_attachment_metadata_invalid(): void {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$result = $this->instance->wp_generate_attachment_metadata( [], $attachment_id, 'create' );
		$this->assertEqualSets( [], $result );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize(): void {
		$_results = $this->call_private_method( $this->instance, 'sanitize', [ WEB_STORIES_TEST_DATA_DIR . '/video-play.svg' ] );

		$this->assertTrue( $_results );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_fail(): void {
		$_results = $this->call_private_method( $this->instance, 'sanitize', [ WEB_STORIES_TEST_DATA_DIR . '/animated.svg' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'insecure_svg_file', $_results->get_error_code() );
		$this->assertSame( 'Sorry, this file couldn\'t be sanitized so for security reasons wasn\'t uploaded.', $_results->get_error_message() );
	}

	/**
	 * @covers ::get_svg_size
	 * @covers ::get_svg_data
	 * @covers ::get_xml
	 */
	public function test_get_svg_size_from_viewbox(): void {
		$_results = $this->call_private_method( $this->instance, 'get_svg_size', [ WEB_STORIES_TEST_DATA_DIR . '/why.svg' ] );

		$this->assertEqualSetsWithIndex(
			[
				'width'  => 100,
				'height' => 100,
			],
			$_results
		);
		$this->assertIsInt( $_results['width'] );
		$this->assertIsInt( $_results['height'] );
	}

	/**
	 * @covers ::get_svg_size
	 * @covers ::get_svg_data
	 * @covers ::get_xml
	 */
	public function test_get_svg_size_invalid_size(): void {
		$_results = $this->call_private_method( $this->instance, 'get_svg_size', [ WEB_STORIES_TEST_DATA_DIR . '/add.svg' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'invalid_svg_size', $_results->get_error_code() );
		$this->assertSame( 'Unable to generate SVG image size.', $_results->get_error_message() );
	}

	/**
	 * @covers ::get_svg_size
	 * @covers ::get_svg_data
	 * @covers ::get_xml
	 */
	public function test_get_svg_size_invalid_viewbox(): void {
		$_results = $this->call_private_method( $this->instance, 'get_svg_size', [ WEB_STORIES_TEST_DATA_DIR . '/add-invalid.svg' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'invalid_svg_size', $_results->get_error_code() );
		$this->assertSame( 'Unable to generate SVG image size.', $_results->get_error_message() );
	}

	/**
	 * @covers ::get_xml
	 */
	public function test_get_xml_invalid_file(): void {
		$_results = $this->call_private_method( $this->instance, 'get_xml', [ '<invalid' ] );

		$this->assertFalse( $_results );
	}

	/**
	 * @covers ::sanitize
	 * @covers ::get_svg_data
	 */
	public function test_sanitize_invalid_file(): void {
		$_results = $this->call_private_method( $this->instance, 'sanitize', [ '' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'invalid_xml_svg', $_results->get_error_code() );
		$this->assertSame( 'Invalid XML in SVG.', $_results->get_error_message() );
	}

	/**
	 * @covers ::wp_check_filetype_and_ext
	 */
	public function test_wp_check_filetype_and_ext(): void {
		$this->instance->register();
		$filepath = WEB_STORIES_TEST_DATA_DIR . '/animated.svg';
		$data     = wp_check_filetype_and_ext( $filepath, $filepath );
		$this->assertArrayHasKey( 'ext', $data );
		$this->assertArrayHasKey( 'type', $data );
		$this->assertArrayHasKey( 'proper_filename', $data );

		$this->assertSame( $data['ext'], 'svg' );
		$this->assertSame( $data['type'], 'image/svg+xml' );
	}

	/**
	 * @covers ::wp_check_filetype_and_ext
	 */
	public function test_wp_check_filetype_and_ext_method(): void {
		$data = $this->instance->wp_check_filetype_and_ext( [], '', '', [], 'image/svg' );

		$this->assertArrayHasKey( 'ext', $data );
		$this->assertArrayHasKey( 'type', $data );

		$this->assertSame( $data['ext'], 'svg' );
		$this->assertSame( $data['type'], 'image/svg+xml' );
	}

	/**
	 * @covers ::wp_handle_upload
	 */
	public function test_wp_handle_upload(): void {
		$upload = [
			'tmp_name' => WEB_STORIES_TEST_DATA_DIR . '/video-play.svg',
			'type'     => 'image/svg+xml',
		];
		$data   = $this->instance->wp_handle_upload( $upload );
		$this->assertSame( $data, $upload );
	}

	/**
	 * @covers ::wp_handle_upload
	 */
	public function test_wp_handle_upload_invalid(): void {
		$upload = [
			'tmp_name' => WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg',
			'type'     => 'image/jpeg',
		];
		$data   = $this->instance->wp_handle_upload( $upload );
		$this->assertSame( $data, $upload );
	}
}
