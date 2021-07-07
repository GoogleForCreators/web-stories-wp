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

namespace Google\Web_Stories\Tests\AMP;

use AMP_DOM_Utils;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Publisher;
use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Story_Sanitizer
 */
class Story_Sanitizer extends Test_Case {
	/**
	 * Helper method for tests.
	 * @param string $source
	 * @param array $sanitizer_args
	 * @return string Sanitized HTML.
	 */
	protected function sanitize_and_get( $source, $sanitizer_args ) {
		$dom = AMP_DOM_Utils::get_dom_from_content( $source );
		$dom->documentElement->setAttribute( 'amp', '' );

		$sanitizer = new \Google\Web_Stories\AMP\Story_Sanitizer( $dom, $sanitizer_args );
		$sanitizer->sanitize();

		return $dom->saveHTML( $dom->documentElement );
	}

	public function get_publisher_logo_data() {
		return [
			'publisher_logo_exists'      => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			],
			'publisher_logo_missing'     => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" poster-portrait-src="https://example.com/image.png" publisher-logo-src="https://example.com/publisher_logo.png"></amp-story></body></html>',
			],
			'publisher_logo_empty'       => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/publisher_logo.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			],
			'publisher_logo_placeholder' => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/placeholder_logo.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/publisher_logo.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			],
		];
	}

	/**
	 * @dataProvider get_publisher_logo_data
	 * @covers ::sanitize
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher_logo
	 *
	 * @param string   $source   Source.
	 * @param string   $expected Expected.
	 */
	public function test_sanitize_publisher_logo( $source, $expected ) {
		$args = [
			'publisher'                  => 'Web Stories',
			'publisher_logo'             => 'https://example.com/publisher_logo.png',
			'publisher_logo_placeholder' => 'https://example.com/placeholder_logo.png',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertEquals( $expected, $actual );
	}

	public function get_poster_image_data() {
		return [
			'poster_image_exists'  => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			],
			'poster_image_missing' => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"></amp-story>',
				'<html lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"></amp-story></body></html>',
			],
			'poster_image_empty'   => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src=""></amp-story>',
				'<html lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src=""></amp-story></body></html>',
			],
		];
	}

	/**
	 * @dataProvider get_poster_image_data
	 * @covers ::sanitize
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_poster_images
	 *
	 * @param string   $source   Source.
	 * @param string   $expected Expected.
	 */
	public function test_sanitize_poster_image( $source, $expected ) {
		$args = [
			'publisher_logo'             => '',
			'publisher'                  => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertEquals( $expected, $actual );
	}

	public function get_publisher_data() {
		return [
			'publisher_exists'        => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="New publisher" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
				[
					'publisher_logo'             => '',
					'publisher'                  => 'New publisher',
					'publisher_logo_placeholder' => '',
					'poster_images'              => [],
				],
			],
			'no_publisher'            => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="New publisher"></amp-story></body></html>',
				[
					'publisher_logo'             => '',
					'publisher'                  => 'New publisher',
					'publisher_logo_placeholder' => '',
					'poster_images'              => [],
				],
			],
			'empty_publisher'         => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
				[
					'publisher_logo'             => '',
					'publisher'                  => '',
					'publisher_logo_placeholder' => '',
					'poster_images'              => [],
				],
			],
			'double_quotes_publisher' => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher=\'"double quotes"\'></amp-story></body></html>',
				[
					'publisher_logo'             => '',
					'publisher'                  => '"double quotes"',
					'publisher_logo_placeholder' => '',
					'poster_images'              => [],
				],
			],
			'single_quotes_publisher' => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="\'single quotes\'"></amp-story></body></html>',
				[
					'publisher_logo'             => '',
					'publisher'                  => "'single quotes'",
					'publisher_logo_placeholder' => '',
					'poster_images'              => [],
				],
			],
			'not_english_publisher'   => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="PRÓXIMA"></amp-story></body></html>',
				[
					'publisher_logo'             => '',
					'publisher'                  => 'PRÓXIMA',
					'publisher_logo_placeholder' => '',
					'poster_images'              => [],
				],
			],
			'html_publisher'          => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="this &gt; that &lt; that &lt;randomhtml /&gt;"></amp-story></body></html>',
				[
					'publisher_logo'             => '',
					'publisher'                  => 'this > that < that <randomhtml />',
					'publisher_logo_placeholder' => '',
					'poster_images'              => [],
				],
			],
		];
	}

	/**
	 * @dataProvider get_publisher_data
	 * @covers ::sanitize
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher
	 *
	 * @param string $source   Source.
	 * @param string $expected Expected.
	 * @param array  $args   Args
	 */
	public function test_sanitize_publisher( $source, $expected, $args ) {
		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::transform_html_start_tag
	 */
	public function test_transform_html_start_tag() {
		$source = '<html><head></head><body><amp-story></amp-story></body></html>';

		$args = [
			'publisher_logo'             => '',
			'publisher'                  => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertContains( ' lang="en-US"', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::transform_a_tags
	 */
	public function test_transform_a_tags() {
		$source = '<html><head></head><body><amp-story><a href="https://www.google.com">Google</a></amp-story></body></html>';

		$args = [
			'publisher_logo'             => '',
			'publisher'                  => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertContains( 'rel="noreferrer"', $actual );
		$this->assertContains( 'target="_blank"', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::transform_a_tags
	 */
	public function test_transform_a_tags_data_attributes() {
		$source = '<html><head></head><body><amp-story><a href="https://www.google.com" data-tooltip-icon="" data-tooltip-text="">Google</a></amp-story></body></html>';

		$args = [
			'publisher_logo'             => '',
			'publisher'                  => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertNotContains( 'data-tooltip-icon', $actual );
		$this->assertNotContains( 'data-tooltip-text', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::deduplicate_inline_styles
	 */
	public function test_deduplicate_inline_styles() {
		$source = '<html><head></head><body><amp-story><div style="color: blue;"></div><div style="color: blue;"></div><div style="color: blue; background: white;"></div><div style="color: red;"></div></amp-story></body></html>';

		$args = [
			'publisher_logo'             => '',
			'publisher'                  => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertContains( '<style>._a7988c6{color: blue;}._91f054f{color: blue; background: white;}._f479d19{color: red;}</style>', $actual );
		$this->assertNotContains( 'style="', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::remove_blob_urls
	 */
	public function test_remove_blob_urls() {
		$source = '<html><head></head><body><amp-story><amp-video width="720" height="960" poster="blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a" layout="responsive"><source type="video/mp4" src="blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a" /></amp-video><amp-img src="blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a" width="100" height="100"></amp-img></amp-story></body></html>';

		$args = [
			'publisher_logo'             => '',
			'publisher'                  => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertNotContains( 'blob:', $actual );
	}
}
