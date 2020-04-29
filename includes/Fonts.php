<?php
/**
 * Class Fonts
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

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

namespace Google\Web_Stories;

/**
 * Class Fonts
 */
class Fonts {
	/**
	 * Get list of fonts used in AMP Stories.
	 *
	 * @return array Fonts.
	 */
	public static function get_fonts() {
		static $fonts = null;

		if ( isset( $fonts ) ) {
			return $fonts;
		}

		$default_weight = [ 400, 700 ];
		$default_styles = [ 'italic', 'regular' ];

		// Default system fonts.
		$fonts = [
			[
				'name'      => 'Arial',
				'fallbacks' => [ 'Helvetica Neue', 'Helvetica', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Arial Black',
				'fallbacks' => [ 'Arial Black', 'Arial Bold', 'Gadget', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Arial Narrow',
				'fallbacks' => [ 'Arial', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Baskerville',
				'fallbacks' => [ 'Baskerville Old Face', 'Hoefler Text', 'Garamond', 'Times New Roman', 'serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Brush Script MT',
				'fallbacks' => [ 'cursive' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Copperplate',
				'fallbacks' => [ 'Copperplate Gothic Light', 'fantasy' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Courier New',
				'fallbacks' => [ 'Courier', 'Lucida Sans Typewriter', 'Lucida Typewriter', 'monospace' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Century Gothic',
				'fallbacks' => [ 'CenturyGothic', 'AppleGothic', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Garamond',
				'fallbacks' => [ 'Baskerville', 'Baskerville Old Face', 'Hoefler Text', 'Times New Roman', 'serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Georgia',
				'fallbacks' => [ 'Times', 'Times New Roman', 'serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Gill Sans',
				'fallbacks' => [ 'Gill Sans MT', 'Calibri', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Lucida Bright',
				'fallbacks' => [ 'Georgia', 'serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Lucida Sans Typewriter',
				'fallbacks' => [ 'Lucida Console', 'monaco', 'Bitstream Vera Sans Mono', 'monospace' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Palatino',
				'fallbacks' => [ 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', 'Georgia', 'serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Papyrus',
				'fallbacks' => [ 'fantasy' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Tahoma',
				'fallbacks' => [ 'Verdana', 'Segoe', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Times New Roman',
				'fallbacks' => [ 'Times New Roman', 'Times', 'Baskerville', 'Georgia', 'serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Trebuchet MS',
				'fallbacks' => [ 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', 'Tahoma', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
			[
				'name'      => 'Verdana',
				'fallbacks' => [ 'Geneva', 'sans-serif' ],
				'weights'   => $default_weight,
				'styles'    => $default_styles,
				'service'   => 'system',
			],
		];
		$file  = __DIR__ . '/data/fonts.json';
		$fonts = array_merge( $fonts, self::get_google_fonts( $file ) );

		$columns = wp_list_pluck( $fonts, 'name' );
		array_multisort( $columns, SORT_ASC, $fonts );

		return $fonts;
	}

	/**
	 * Get list of Google Fonts from a given JSON file.
	 *
	 * @param string $file Path to file containing Google Fonts definitions.
	 *
	 * @return array $fonts Fonts list.
	 */
	public static function get_google_fonts( $file ) {
		if ( ! is_readable( $file ) ) {
			return [];
		}
		$file_content = file_get_contents( $file );  // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents, WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown

		if ( ! $file_content ) {
			return [];
		}

		$google_fonts = json_decode( $file_content, true );

		if ( empty( $google_fonts ) ) {
			return [];
		}

		$fonts = [];

		foreach ( $google_fonts as $font ) {
			$variants = [];
			$weights  = [];
			$styles   = [];

			// Example variants: 100,100italic,300,300italic,regular,italic, etc.
			foreach ( $font['variants'] as $variant ) {
				preg_match( '/(?<weight>\d+)?(?<style>\D+)?/', $variant, $matches );

				$weight = isset( $matches['weight'] ) ? (int) $matches['weight'] : false;
				if ( $weight ) {
					$weights[] = $weight;
				}

				$style = isset( $matches['style'] ) ? $matches['style'] : false;
				if ( $style ) {
					if ( 'regular' === $style || ! $weight ) {
						$weights[] = 400;
					}

					$styles[] = $style;
				}

				$variants[] = [ (int) ( 'italic' === $style ), $weight ?: 400 ];
			}

			$weights  = array_unique( $weights );
			$styles   = array_unique( $styles );
			$variants = array_intersect_key( $variants, array_unique( array_map( 'serialize', $variants ) ) );

			$fonts[] = [
				'name'      => $font['family'],
				'fallbacks' => (array) self::get_font_fallback( $font['category'] ),
				'weights'   => array_values( $weights ),
				'styles'    => array_values( $styles ),
				'variants'  => array_values( $variants ),
				'service'   => 'fonts.google.com',
			];
		}

		return $fonts;
	}

	/**
	 * Helper method to lookup fallback font.
	 *
	 * @param string $category Google font category.
	 *
	 * @return string $fallback Fallback font.
	 */
	public static function get_font_fallback( $category ) {
		switch ( $category ) {
			case 'sans-serif':
				return 'sans-serif';
			case 'handwriting':
			case 'display':
				return 'cursive';
			case 'monospace':
				return 'monospace';
			default:
				return 'serif';
		}
	}

	/**
	 * Get a font.
	 *
	 * @param string $name Font family name.
	 *
	 * @return array|null The font or null if not defined.
	 */
	public static function get_font( $name ) {
		$fonts = array_filter(
			self::get_fonts(),
			static function ( $font ) use ( $name ) {
				return $font['name'] === $name;
			}
		);

		return array_shift( $fonts );
	}

}
