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
		$fonts     = new \Google\Web_Stories\Fonts();
		$font_list = $fonts->get_fonts();
		$this->assertInternalType( 'array', $font_list );

		$arial_font = current(
			array_filter(
				$font_list,
				static function ( $font ) {
					return 'Arial' === $font['family'];
				}
			)
		);

		$roboto_font = current(
			array_filter(
				$font_list,
				static function ( $font ) {
					return 'Roboto' === $font['family'];
				}
			)
		);

		$this->assertCount( 6, $arial_font );
		$this->assertArrayHasKey( 'family', $arial_font );
		$this->assertArrayHasKey( 'fallbacks', $arial_font );
		$this->assertArrayHasKey( 'weights', $arial_font );
		$this->assertArrayHasKey( 'styles', $arial_font );
		$this->assertArrayHasKey( 'service', $arial_font );
		$this->assertArrayHasKey( 'metrics', $arial_font );
		$this->assertEqualSetsWithIndex(
			[
				'family'    => 'Arial',
				'fallbacks' => [ 'Helvetica Neue', 'Helvetica', 'sans-serif' ],
				'weights'   => [ 400, 700 ],
				'styles'    => [ 'italic', 'regular' ],
				'service'   => 'system',
				'metrics'   => [
					'upm'   => 2048,
					'asc'   => 1854,
					'des'   => -434,
					'tAsc'  => 1491,
					'tDes'  => -431,
					'tLGap' => 307,
					'wAsc'  => 1854,
					'wDes'  => 1854,
					'xH'    => 1062,
					'capH'  => 1467,
					'yMin'  => -665,
					'yMax'  => 2060,
					'hAsc'  => 1854,
					'hDes'  => -434,
					'lGap'  => 67,
				],
			],
			$arial_font
		);

		$this->assertCount( 7, $roboto_font );
		$this->assertArrayHasKey( 'family', $roboto_font );
		$this->assertArrayHasKey( 'fallbacks', $roboto_font );
		$this->assertArrayHasKey( 'weights', $roboto_font );
		$this->assertArrayHasKey( 'styles', $roboto_font );
		$this->assertArrayHasKey( 'variants', $roboto_font );
		$this->assertArrayHasKey( 'service', $roboto_font );
		$this->assertArrayHasKey( 'metrics', $roboto_font );
		$this->assertSame( 'fonts.google.com', $roboto_font['service'] );
	}

	public function test_get_google_fonts() {
		$fonts_file = dirname( dirname( dirname( __DIR__ ) ) ) . '/includes/data/fonts.json';

		if ( ! file_exists( $fonts_file ) ) {
			$this->markTestSkipped( 'List of Google Fonts is missing' );
		}
		$fonts     = new \Google\Web_Stories\Fonts();
		$font_list = $fonts->get_google_fonts( $fonts_file );
		$this->assertInternalType( 'array', $font_list );

		$roboto_font = current(
			array_filter(
				$font_list,
				static function ( $font ) {
					return 'Roboto' === $font['family'];
				}
			)
		);

		$this->assertCount( 7, $roboto_font );
		$this->assertArrayHasKey( 'family', $roboto_font );
		$this->assertArrayHasKey( 'fallbacks', $roboto_font );
		$this->assertArrayHasKey( 'weights', $roboto_font );
		$this->assertArrayHasKey( 'styles', $roboto_font );
		$this->assertArrayHasKey( 'variants', $roboto_font );
		$this->assertArrayHasKey( 'service', $roboto_font );
		$this->assertArrayHasKey( 'metrics', $roboto_font );
		$this->assertEqualSetsWithIndex(
			[
				'family'    => 'Roboto',
				'fallbacks' => [ 'sans-serif' ],
				'weights'   => [ 100, 300, 400, 500, 700, 900 ],
				'styles'    => [ 'italic', 'regular' ],
				'service'   => 'fonts.google.com',
				'variants'  => [
					[ 0, 100 ],
					[ 1, 100 ],
					[ 0, 300 ],
					[ 1, 300 ],
					[ 0, 400 ],
					[ 1, 400 ],
					[ 0, 500 ],
					[ 1, 500 ],
					[ 0, 700 ],
					[ 1, 700 ],
					[ 0, 900 ],
					[ 1, 900 ],
				],
				'metrics'   => [
					'upm'   => 2048,
					'asc'   => 1900,
					'des'   => -500,
					'tAsc'  => 1536,
					'tDes'  => -512,
					'tLGap' => 102,
					'wAsc'  => 1946,
					'wDes'  => 512,
					'xH'    => 1082,
					'capH'  => 1456,
					'yMin'  => -555,
					'yMax'  => 2163,
					'hAsc'  => 1900,
					'hDes'  => -500,
					'lGap'  => 0,
				],
			],
			$roboto_font
		);
	}
}
