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
class SVG extends \WP_UnitTestCase {
	use Private_Access;

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$svg = $this->get_svg_object();
		$svg->init();

		$this->assertSame( 10, has_filter( 'web_stories_allowed_mime_types', [ $svg, 'web_stories_allowed_mime_types' ] ) );
		$this->assertSame( 10, has_filter( 'upload_mimes', [ $svg, 'upload_mimes_add_svg' ] ) );
		$this->assertSame( 10, has_filter( 'mime_types', [ $svg, 'mime_types_add_svg' ] ) );
		$this->assertSame( 10, has_filter( 'wp_handle_upload_prefilter', [ $svg, 'wp_handle_upload' ] ) );
		$this->assertSame( 10, has_filter( 'wp_generate_attachment_metadata', [ $svg, 'wp_generate_attachment_metadata' ] ) );
		$this->assertSame( 10, has_filter( 'wp_check_filetype_and_ext', [ $svg, 'wp_check_filetype_and_ext' ] ) );
		$this->assertSame( 10, has_filter( 'site_option_upload_filetypes', [ $svg, 'filter_list_of_allowed_filetypes' ] ) );
	}

	/**
	 * @covers ::upload_mimes_add_svg
	 */
	public function test_upload_mimes_add_svg() {
		$svg = $this->get_svg_object();
		$svg->init();
		$allowed_mime_types = wp_get_mime_types();
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );
	}

	/**
	 * @covers ::upload_mimes_add_svg
	 */
	public function test_mime_types_add_svg() {
		$svg = $this->get_svg_object();
		$svg->init();
		$allowed_mime_types = get_allowed_mime_types();
		$mine_types         = array_values( $allowed_mime_types );
		$this->assertContains( 'image/svg+xml', $mine_types );
	}

	/**
	 * @covers ::filter_list_of_allowed_filetypes
	 */
	public function test_filter_list_of_allowed_filetypes() {
		$svg = $this->get_svg_object();
		$svg->init();
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
		$svg->init();

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
	 * @covers ::sanitize
	 */
	public function test_sanitize() {
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
	 * @return \Google\Web_Stories\SVG
	 */
	protected function get_svg_object() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );

		return new \Google\Web_Stories\SVG( $experiments );
	}


}
