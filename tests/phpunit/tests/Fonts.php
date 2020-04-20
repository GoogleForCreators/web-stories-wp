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

class Fonts extends \WP_UnitTestCase {
	public function test_get_fonts() {
		$fonts = \Google\Web_Stories\Fonts::get_fonts();
		$this->assertInternalType( 'array', $fonts );

		$arial_font = current(
			array_filter(
				$fonts,
				static function ( $font ) {
					return 'Arial' === $font['name'];
				}
			)
		);

		$roboto_font = current(
			array_filter(
				$fonts,
				static function ( $font ) {
					return 'Roboto' === $font['name'];
				}
			)
		);

		$this->assertCount( 5, $arial_font );
		$this->assertArrayHasKey( 'name', $arial_font );
		$this->assertArrayHasKey( 'fallbacks', $arial_font );
		$this->assertArrayHasKey( 'weights', $arial_font );
		$this->assertArrayHasKey( 'slug', $arial_font );
		$this->assertArrayHasKey( 'service', $arial_font );
		$this->assertEquals(
			[
				'name'      => 'Arial',
				'fallbacks' => [ 'Helvetica Neue', 'Helvetica', 'sans-serif' ],
				'slug'      => 'arial',
				'weights'   => [ '400', '700' ],
				'service'   => 'system',
			],
			$arial_font
		);

		$this->assertCount( 8, $roboto_font );
		$this->assertArrayHasKey( 'name', $roboto_font );
		$this->assertArrayHasKey( 'slug', $roboto_font );
		$this->assertArrayHasKey( 'handle', $roboto_font );
		$this->assertArrayHasKey( 'fallbacks', $roboto_font );
		$this->assertArrayHasKey( 'weights', $roboto_font );
		$this->assertArrayHasKey( 'src', $roboto_font );
		$this->assertArrayHasKey( 'gfont', $roboto_font );
		$this->assertArrayHasKey( 'service', $roboto_font );
		$this->assertSame( 'fonts.google.com', $roboto_font['service'] );
	}

	public function test_get_google_fonts() {
		$fonts_file = dirname( dirname( dirname( __DIR__ ) ) ) . '/includes/data/fonts.json';

		if ( ! file_exists( $fonts_file ) ) {
			$this->markTestSkipped( 'List of Google Fonts is missing' );
		}

		$fonts = \Google\Web_Stories\Fonts::get_google_fonts( $fonts_file );
		$this->assertInternalType( 'array', $fonts );

		$roboto_font = current(
			array_filter(
				$fonts,
				static function ( $font ) {
					return 'Roboto' === $font['name'];
				}
			)
		);

		$this->assertCount( 5, $roboto_font );
		$this->assertArrayHasKey( 'name', $roboto_font );
		$this->assertArrayHasKey( 'fallbacks', $roboto_font );
		$this->assertArrayHasKey( 'weights', $roboto_font );
		$this->assertArrayHasKey( 'gfont', $roboto_font );
		$this->assertArrayHasKey( 'service', $roboto_font );

		$this->assertEquals(
			[
				'name'      => 'Roboto',
				'fallbacks' => [ 'sans-serif' ],
				'weights'   => [ '100', '300', '400', '500', '700', '900' ],
				'gfont'     => 'Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i',
				'service'   => 'fonts.google.com',
			],
			$roboto_font
		);
	}

	public static function data_font_fallback() {
		return [
			[ 'sans-serif', 'sans-serif' ],
			[ 'display', 'cursive' ],
			[ 'handwriting', 'cursive' ],
			[ 'monospace', 'monospace' ],
			[ 'serif', 'serif' ],
			[ 'invalid', 'serif' ],
		];
	}

	/**
	 * @dataProvider data_font_fallback
	 */
	public function test_get_font_fallback( $category, $expected ) {
		$actual = \Google\Web_Stories\Fonts::get_font_fallback( $category );
		$this->assertSame( $actual, $expected );
	}
}
