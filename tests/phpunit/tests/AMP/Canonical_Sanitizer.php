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

use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Canonical_Sanitizer
 */
class Canonical_Sanitizer extends Test_Case {
	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_exists() {
		$source = '<html><head><title>Example</title><link rel="canonical" href="https://example.com/canonical.html"></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer( $dom );
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );
		$this->assertContains( '<link rel="canonical" href="https://example.com/canonical.html">', $actual );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_missing() {
		$post_id   = self::factory()->post->create();
		$canonical = wp_get_canonical_url( $post_id );

		$source = '<html><head><title>Example</title></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$this->go_to( get_permalink( $post_id ) );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer( $dom );
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );

		wp_delete_post( $post_id );

		$this->assertContains( '<link rel="canonical" href="' . $canonical . '">', $actual );
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_missing_existing_link_tags() {
		$post_id   = self::factory()->post->create();
		$canonical = wp_get_canonical_url( $post_id );

		$source = '<html><head><title>Example</title><link rel="stylesheet" href="https://example.com/style.css"><link rel="stylesheet" href="https://example.com/style2.css"></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$this->go_to( get_permalink( $post_id ) );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer( $dom );
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );

		wp_delete_post( $post_id );

		$this->assertContains( '<link rel="canonical" href="' . $canonical . '">', $actual );
	}
}
