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

/**
 * @coversDefaultClass \Google\Web_Stories\SVG
 */
class SVG extends Test_Case {

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$svg = $this->get_svg_object();
		$svg->register();

		$this->assertSame(
			10,
			has_filter(
				'web_stories_allowed_mime_types',
				[
					$svg,
					'web_stories_allowed_mime_types',
				]
			)
		);
		$this->assertSame( 10, has_filter( 'upload_mimes', [ $svg, 'upload_mimes_add_svg' ] ) );
		$this->assertSame( 10, has_filter( 'mime_types', [ $svg, 'mime_types_add_svg' ] ) );
		$this->assertSame( 10, has_filter( 'wp_handle_upload_prefilter', [ $svg, 'wp_handle_upload' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'wp_generate_attachment_metadata',
				[
					$svg,
					'wp_generate_attachment_metadata',
				]
			)
		);
		$this->assertSame( 10, has_filter( 'wp_check_filetype_and_ext', [ $svg, 'wp_check_filetype_and_ext' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'site_option_upload_filetypes',
				[
					$svg,
					'filter_list_of_allowed_filetypes',
				]
			)
		);
	}

	/**
	 * @covers ::svg_already_enabled
	 */
	public function test_svg_already_enabled() {
		$svg      = $this->get_svg_object();
		$_results = $this->call_private_method( $svg, 'svg_already_enabled' );

		$this->assertFalse( $_results );
	}

	/**
	 * @covers ::upload_mimes_add_svg
	 */
	public function test_upload_mimes_add_svg() {
		$svg = $this->get_svg_object();
		$svg->register();
		$allowed_mime_types = wp_get_mime_types();
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );

		$allowed_mime_types = $svg->upload_mimes_add_svg( [] );
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );
	}

	/**
	 * @covers ::mime_types_add_svg
	 */
	public function test_mime_types_add_svg() {
		$svg = $this->get_svg_object();
		$svg->register();
		$allowed_mime_types = get_allowed_mime_types();
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );

		$allowed_mime_types = $svg->mime_types_add_svg( [] );
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );
	}


	/**
	 * @covers ::web_stories_allowed_mime_types
	 */
	public function test_web_stories_allowed_mime_types() {
		$svg                = $this->get_svg_object();
		$allowed_mime_types = $svg->web_stories_allowed_mime_types( [] );

		$this->assertArrayHasKey( 'image', $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $allowed_mime_types['image'] );
	}

	/**
	 * @covers ::filter_list_of_allowed_filetypes
	 */
	public function test_filter_list_of_allowed_filetypes() {
		$svg = $this->get_svg_object();
		$svg->register();
		$setting = get_site_option( 'upload_filetypes', 'jpg jpeg png gif' );

		$this->assertContains( 'svg', $setting );
	}

	/**
	 * @covers ::wp_generate_attachment_metadata
	 * @covers ::get_svg_size
	 */
	public function test_upload_svg() {
		$svg_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => __DIR__ . '/../data/video-play.svg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/svg+xml',
				'post_title'     => 'Test svg',
			]
		);

		$svg = $this->get_svg_object();
		$svg->register();

		$attachment_metadata = wp_generate_attachment_metadata( $svg_attachment_id, get_attached_file( $svg_attachment_id ) );
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
	public function test_wp_generate_attachment_metadata_update() {
		$svg_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => __DIR__ . '/../data/video-play.svg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/svg+xml',
				'post_title'     => 'Test svg',
			]
		);

		$svg    = $this->get_svg_object();
		$result = $svg->wp_generate_attachment_metadata( [], $svg_attachment_id, 'update' );
		$this->assertEqualSets( [], $result );
	}


	/**
	 * @covers ::wp_generate_attachment_metadata
	 */
	public function test_wp_generate_attachment_metadata_invalud() {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$svg    = $this->get_svg_object();
		$result = $svg->wp_generate_attachment_metadata( [], $attachment_id, 'create' );
		$this->assertEqualSets( [], $result );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize() {
		$svg      = $this->get_svg_object();
		$_results = $this->call_private_method( $svg, 'sanitize', [ __DIR__ . '/../data/video-play.svg' ] );

		$this->assertTrue( $_results );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_fail() {
		$svg      = $this->get_svg_object();
		$_results = $this->call_private_method( $svg, 'sanitize', [ __DIR__ . '/../data/animated.svg' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'insecure_svg_file', $_results->get_error_code() );
		$this->assertSame( 'Sorry, this file couldn\'t be sanitized so for security reasons wasn\'t uploaded.', $_results->get_error_message() );
	}

	/**
	 * @covers ::get_svg_size
	 * @covers ::get_svg_data
	 * @covers ::get_xml
	 */
	public function test_get_svg_size_invalid_size() {
		$svg      = $this->get_svg_object();
		$_results = $this->call_private_method( $svg, 'get_svg_size', [ __DIR__ . '/../data/add.svg' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'invalid_svg_size', $_results->get_error_code() );
		$this->assertSame( 'Unable to generate SVG image size.', $_results->get_error_message() );
	}

	/**
	 * @covers ::get_svg_size
	 * @covers ::get_svg_data
	 * @covers ::get_xml
	 */
	public function test_get_svg_size_invalid_viewbox() {
		$svg      = $this->get_svg_object();
		$_results = $this->call_private_method( $svg, 'get_svg_size', [ __DIR__ . '/../data/add-invalid.svg' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'invalid_svg_size', $_results->get_error_code() );
		$this->assertSame( 'Unable to generate SVG image size.', $_results->get_error_message() );
	}

	/**
	 * @covers ::get_xml
	 */
	public function test_get_xml_invalid_file() {
		$svg      = $this->get_svg_object();
		$_results = $this->call_private_method( $svg, 'get_xml', [ '<invalid' ] );

		$this->assertFalse( $_results );
	}

	/**
	 * @covers ::sanitize
	 * @covers ::get_svg_data
	 */
	public function test_sanitize_invalid_file() {
		$svg      = $this->get_svg_object();
		$_results = $this->call_private_method( $svg, 'sanitize', [ '' ] );

		$this->assertInstanceOf( 'WP_Error', $_results );
		$this->assertSame( 'invalid_xml_svg', $_results->get_error_code() );
		$this->assertSame( 'Invalid xml in SVG.', $_results->get_error_message() );
	}

	/**
	 * @covers ::wp_check_filetype_and_ext
	 */
	public function test_wp_check_filetype_and_ext() {
		$svg = $this->get_svg_object();
		$svg->register();
		$filepath = __DIR__ . '/../data/animated.svg';
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
	public function test_wp_check_filetype_and_ext_method() {
		$svg  = $this->get_svg_object();
		$data = $svg->wp_check_filetype_and_ext( [], '', '', [], 'image/svg' );

		$this->assertArrayHasKey( 'ext', $data );
		$this->assertArrayHasKey( 'type', $data );

		$this->assertSame( $data['ext'], 'svg' );
		$this->assertSame( $data['type'], 'image/svg+xml' );
	}

	/**
	 * @covers ::wp_handle_upload
	 */
	public function test_wp_handle_upload() {
		$svg    = $this->get_svg_object();
		$upload = [
			'tmp_name' => __DIR__ . '/../data/video-play.svg',
			'type'     => 'image/svg+xml',
		];
		$data   = $svg->wp_handle_upload( $upload );
		$this->assertSame( $data, $upload );
	}

	/**
	 * @covers ::wp_handle_upload
	 */
	public function test_wp_handle_upload_invalid() {
		$svg    = $this->get_svg_object();
		$upload = [
			'tmp_name' => __DIR__ . '/../data/attachment.jpg',
			'type'     => 'image/jpeg',
		];
		$data   = $svg->wp_handle_upload( $upload );
		$this->assertSame( $data, $upload );
	}

	/**
	 * @return \Google\Web_Stories\SVG
	 */
	protected function get_svg_object() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );

		return new \Google\Web_Stories\SVG( $experiments );
	}
}
