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

/**
 * Trait MarkupComparison.
 *
 * @package AmpProject\AmpWP
 */

namespace Google\Web_Stories\Tests;

/**
 * Helper trait for comparing strings of HTML markup.
 *
 * @see https://github.com/ampproject/amp-wp/blob/59021205940e72dffa9e6ef370ab7f3ea536ea39/tests/php/src/Helpers/MarkupComparison.php
 *
 * @package AmpProject\AmpWP
 */
trait MarkupComparison {

	/**
	 * Assert markup is equal.
	 *
	 * @param string $expected Expected markup.
	 * @param string $actual   Actual markup.
	 */
	protected function assertEqualMarkup( $expected, $actual ) { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName
		// Normalize whitespace (`foo   bar` => `foo bar`).
		$actual   = preg_replace( '/\s+/', ' ', $actual );
		$expected = preg_replace( '/\s+/', ' ', $expected );

		// Remove whitespace between elements (` <br> <br> ` => `<br><br>`).
		$actual   = preg_replace( '/(?<=>)\s+(?=<)/', '', trim( $actual ) );
		$expected = preg_replace( '/(?<=>)\s+(?=<)/', '', trim( $expected ) );

		// Normalize boolean attributes that use their name as value.
		$actual   = preg_replace( '/(?<=\s)([a-zA-Z-_]+)="(?:\1|)"/i', '$1', $actual );
		$expected = preg_replace( '/(?<=\s)([a-zA-Z-_]+)="(?:\1|)"/i', '$1', $expected );

		// Split into an array of individual elements.
		$actual   = preg_split( '#(<[^>]+>|[^<>]+)#', $actual, -1, PREG_SPLIT_DELIM_CAPTURE );
		$expected = preg_split( '#(<[^>]+>|[^<>]+)#', $expected, -1, PREG_SPLIT_DELIM_CAPTURE );

		$this->assertEquals( array_filter( $expected ), array_filter( $actual ) );
	}

	/**
	 * Assert markup is similar, disregarding differences that are inconsequential for functionality.
	 *
	 * @param string $expected Expected markup.
	 * @param string $actual   Actual markup.
	 */
	protected function assertSimilarMarkup( $expected, $actual ) { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName
		// Normalize whitespace (`foo   bar` => `foo bar`).
		$actual   = preg_replace( '/\s+/', ' ', $actual );
		$expected = preg_replace( '/\s+/', ' ', $expected );

		// Remove whitespace between elements (`<br> <br>` => `<br><br>`).
		$actual   = preg_replace( '/(?<=>)\s+(?=<)/', '', trim( $actual ) );
		$expected = preg_replace( '/(?<=>)\s+(?=<)/', '', trim( $expected ) );

		// Remove empty values (`foo=""` => `foo`).
		$actual   = preg_replace( '/=([\'"]){2}/', '', $actual );
		$expected = preg_replace( '/=([\'"]){2}/', '', $expected );

		// Normalize case of doctype element.
		$actual   = preg_replace( '/<!doctype/i', '<!DOCTYPE', $actual );
		$expected = preg_replace( '/<!doctype/i', '<!DOCTYPE', $expected );

		// Wrap all attributes in quotes (`foo=bar` => `foo="bar"`).
		$actual   = preg_replace( '/(\s+[a-zA-Z-_]+)=(?!")([a-zA-Z-_.]+)/', '\1="\2"', $actual );
		$expected = preg_replace( '/(\s+[a-zA-Z-_]+)=(?!")([a-zA-Z-_.]+)/', '\1="\2"', $expected );

		// Normalize empty JSON objects (`<script> { } </script>` => `<script>{}</script>`).
		$actual   = preg_replace( '/>\s*{\s*}\s*</', '>{}<', $actual );
		$expected = preg_replace( '/>\s*{\s*}\s*</', '>{}<', $expected );

		// Normalize boolean attributes that use their name as value.
		$actual   = preg_replace( '/(?<=\s)([a-zA-Z-_]+)="(?:\1|)"/i', '$1', $actual );
		$expected = preg_replace( '/(?<=\s)([a-zA-Z-_]+)="(?:\1|)"/i', '$1', $expected );

		$normalize_attributes = static function ( $element ) {
			// Extract attributes for the given element.
			if ( ! preg_match( '#^(<[a-z0-9-]+)(\s[^>]+)>$#i', $element, $matches ) ) {
				return $element;
			}

			// Split into individual attributes.
			$attributes = array_map(
				'trim',
				array_filter(
					preg_split(
						'#(\s+[^"\'\s=]+(?:=(?:"[^"]+"|\'[^\']+\'|[^"\'\s]+))?)#',
						$matches[2],
						-1,
						PREG_SPLIT_DELIM_CAPTURE
					)
				)
			);

			// Normalize sort order.
			sort( $attributes );

			$attribute_string = implode( ' ', $attributes );

			if ( ! empty( $attribute_string ) ) {
				$attribute_string = " {$attribute_string}";
			}

			return "{$matches[1]}{$attribute_string}>";
		};

		// Split into an array of individual elements.
		$actual   = preg_split( '#(<[^>]+>|[^<>]+)#', $actual, -1, PREG_SPLIT_DELIM_CAPTURE );
		$expected = preg_split( '#(<[^>]+>|[^<>]+)#', $expected, -1, PREG_SPLIT_DELIM_CAPTURE );

		// Normalize the attributes for each individual element.
		$actual   = array_map( $normalize_attributes, array_filter( $actual ) );
		$expected = array_map( $normalize_attributes, array_filter( $expected ) );

		$this->assertEquals( $expected, $actual );
	}
}
