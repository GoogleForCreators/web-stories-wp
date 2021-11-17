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

namespace Google\Web_Stories\Tests\Unit\AMP;

use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories\Tests\Unit\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Canonical_Sanitizer
 */
class Canonical_Sanitizer extends TestCase {
	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_exists() {
		$source = '<html><head><title>Example</title><link rel="canonical" href="https://example.com/canonical.html"></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer(
			$dom,
			[ 'canonical_url' => 'https://example.com/new-canonical.html' ]
		);
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );
		$this->assertStringContainsString( '<link rel="canonical" href="https://example.com/canonical.html">', $actual );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_remove_duplicates() {
		$source = '<html><head><title>Example</title><link rel="canonical" href="https://example.com/canonical.html"><link rel="canonical" href="https://example.com/canonical2.html"></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer(
			$dom,
			[ 'canonical_url' => 'https://example.com/new-canonical.html' ]
		);
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );
		$this->assertStringContainsString( '<link rel="canonical" href="https://example.com/canonical.html">', $actual );
		$this->assertStringNotContainsString( '<link rel="canonical" href="https://example.com/canonical2.html">', $actual );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_missing() {
		$canonical = 'https://example.com/new-canonical.html';

		$source = '<html><head><title>Example</title></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer(
			$dom,
			[ 'canonical_url' => $canonical ]
		);
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );

		$this->assertStringContainsString( '<link rel="canonical" href="' . $canonical . '">', $actual );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_empty_value() {
		$canonical = 'https://example.com/new-canonical.html';

		$source = '<html><head><title>Example</title><link rel="canonical" href=""></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer(
			$dom,
			[ 'canonical_url' => $canonical ]
		);
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );

		$this->assertStringContainsString( '<link rel="canonical" href="', $actual );
		$this->assertStringNotContainsString( '<link rel="canonical" href="">', $actual );
		$this->assertStringContainsString( '<link rel="canonical" href="' . $canonical . '">', $actual );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_missing_existing_link_tags() {
		$canonical = 'https://example.com/new-canonical.html';

		$source = '<html><head><title>Example</title><link rel="stylesheet" href="https://example.com/style.css"><link rel="stylesheet" href="https://example.com/style2.css"></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer(
			$dom,
			[ 'canonical_url' => $canonical ]
		);
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );

		$this->assertStringContainsString( '<link rel="canonical" href="' . $canonical . '">', $actual );
	}
}
