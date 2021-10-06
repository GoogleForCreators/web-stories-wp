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

namespace Google\Web_Stories\Tests\Integration\AMP;

use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Canonical_Sanitizer
 */
class Canonical_Sanitizer extends TestCase {
	protected static $user_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);
	}

	/**
	 * @covers ::sanitize
	 */
	public function test_sanitize_canonical_missing_draft() {
		// Needed so that the user is allowed to preview drafts.
		wp_set_current_user( self::$user_id );

		$post_id   = self::factory()->post->create(
			[
				'post_status' => 'draft',
			]
		);
		$canonical = get_permalink( $post_id );

		$source = '<html><head><title>Example</title></head><body><p>Hello World</p></body></html>';

		$dom = Document::fromHtml( $source );

		$this->go_to( get_preview_post_link( $post_id ) );
		$this->assertQueryTrue( 'is_single', 'is_singular', 'is_preview' );

		$sanitizer = new \Google\Web_Stories\AMP\Canonical_Sanitizer(
			$dom,
			[ 'canonical_url' => get_permalink( $post_id ) ]
		);
		$sanitizer->sanitize();

		$actual = $dom->saveHTML( $dom->documentElement );

		wp_delete_post( $post_id );

		$this->assertStringContainsString( '<link rel="canonical" href="', $actual );
		$this->assertStringNotContainsString( '<link rel="canonical" href="">', $actual );
		$this->assertStringContainsString( '<link rel="canonical" href="' . $canonical . '">', $actual );
	}
}
