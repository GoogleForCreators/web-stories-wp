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

/**
 * @coversDefaultClass \Google\Web_Stories\Decoder
 */
class Decoder extends \WP_UnitTestCase {

	public function test_base64_decode() {
		// Hello 🌍 - これはサンプルです。
		$encoded = '__WEB_STORIES_ENCODED__SABlAGwAbABvACAAPNgN3yAALQAgAFMwjDBvMLUw8zDXMOswZzBZMAIw';

		$decoder = new \Google\Web_Stories\Decoder();
		$actual  = $decoder->base64_decode( $encoded );

		$this->assertSame( 'Hello 🌍 - これはサンプルです。', $actual );
	}

	public function test_base64_decode_no_prefix() {
		// Hello 🌍 - これはサンプルです。
		$encoded = 'SABlAGwAbABvACAAPNgN3yAALQAgAFMwjDBvMLUw8zDXMOswZzBZMAIw';

		$decoder = new \Google\Web_Stories\Decoder();
		$actual  = $decoder->base64_decode( $encoded );

		$this->assertSame( $encoded, $actual );
	}

	public function test_base64_decode_not_encoded() {
		$encoded = 'Hello World';

		$decoder = new \Google\Web_Stories\Decoder();
		$actual  = $decoder->base64_decode( $encoded );

		$this->assertSame( 'Hello World', $actual );
	}
}
