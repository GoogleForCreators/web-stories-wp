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
	 * @covers Sanitization_Utils::add_poster_images
	 *
	 * @param string   $source   Source.
	 * @param string   $expected Expected.
	 */
	public function test_sanitize_poster_image( $source, $expected ) {
		$args = [
			'publisher_logo'             => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * @covers Sanitization_Utils::transform_html_start_tag
	 */
	public function test_transform_html_start_tag() {
		$source = '<html><head></head><body><amp-story></amp-story></body></html>';

		$args = [
			'publisher_logo'             => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertContains( ' lang="en-US"', $actual );
	}

	/**
	 * @covers Sanitization_Utils::transform_a_tags
	 */
	public function test_transform_a_tags() {
		$source = '<html><head></head><body><amp-story><a href="https://www.google.com">Google</a></amp-story></body></html>';

		$args = [
			'publisher_logo'             => '',
			'publisher_logo_placeholder' => '',
			'poster_images'              => [],
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertContains( 'rel="noreferrer"', $actual );
		$this->assertContains( 'target="_blank"', $actual );
	}
}
