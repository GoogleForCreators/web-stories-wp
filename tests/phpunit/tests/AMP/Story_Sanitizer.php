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
use Google\Web_Stories\Traits\Publisher;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Story_Sanitizer
 */
class Story_Sanitizer extends \WP_UnitTestCase {
	use Publisher;

	public function setUp() {
		parent::setUp();

		add_filter(
			'web_stories_publisher_logo',
			static function() {
				return 'https://example.com/publisher-logo.png';
			}
		);
	}

	public function tearDown() {
		remove_all_filters( 'web_stories_publisher_logo' );

		parent::tearDown();
	}

	public function get_publisher_logo_data() {
		$placeholder = $this->get_publisher_logo_placeholder();

		return [
			'publisher_logo_kept'        => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
			],
			'publisher_logo_missing'     => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" poster-portrait-src="https://example.com/image.png" publisher-logo-src="https://example.com/publisher-logo.png"></amp-story>',
			],
			'publisher_logo_empty'       => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/publisher-logo.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
			],
			'publisher_logo_placeholder' => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="' . $placeholder . '" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/publisher-logo.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
			],
		];
	}

	/**
	 * @dataProvider get_publisher_logo_data
	 * @covers ::sanitize
	 *
	 * @param string   $source   Source.
	 * @param string   $expected Expected.
	 */
	public function test_sanitize_publisher_logo( $source, $expected ) {
		$dom = AMP_DOM_Utils::get_dom_from_content( $source );

		$sanitizer = new \Google\Web_Stories\AMP\Story_Sanitizer( $dom );
		$sanitizer->sanitize();

		$actual = AMP_DOM_Utils::get_content_from_dom( $dom );
		$this->assertEquals( $expected, $actual );
	}

	public function get_poster_image_data() {
		return [
			'poster_image_exists'  => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp=""><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			],
			'poster_image_missing' => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"></amp-story>',
				'<html><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"></amp-story></body></html>',
			],
			'poster_image_empty'   => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src=""></amp-story>',
				'<html><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src=""></amp-story></body></html>',
			],
		];
	}

	/**
	 * @dataProvider get_poster_image_data
	 * @covers ::sanitize
	 *
	 * @param string   $source   Source.
	 * @param string   $expected Expected.
	 */
	public function test_sanitize_poster_image( $source, $expected ) {
		$dom = AMP_DOM_Utils::get_dom_from_content( $source );
		$dom->documentElement->setAttribute( 'amp', '' );

		$sanitizer = new \Google\Web_Stories\AMP\Story_Sanitizer( $dom );
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );
		$this->assertEquals( $expected, $actual );
	}
}
