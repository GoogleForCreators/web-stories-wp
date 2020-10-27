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

namespace Google\Web_Stories\Tests\Traits;

use Google\Web_Stories\Tests\Private_Access;

/**
 * @coversDefaultClass \Google\Web_Stories\Traits\Decoder
 */
class Decoder extends \WP_UnitTestCase {
	use Private_Access;

	public function test_base64_decode() {
		$encoded = '__WEB_STORIES_ENCODED__SABlAGwAbABvACAAPNgN3w=='; // Hello 🌍

		$mock   = $this->getMockForTrait( \Google\Web_Stories\Traits\Decoder::class );
		$actual = $this->call_private_method( $mock, 'base64_decode', [ $encoded ] );
		$this->assertSame( 'Hello 🌍', $actual );
	}

	public function test_base64_decode_no_prefix() {
		$encoded = 'SABlAGwAbABvACAAPNgN3w=='; // Hello 🌍

		$mock   = $this->getMockForTrait( \Google\Web_Stories\Traits\Decoder::class );
		$actual = $this->call_private_method( $mock, 'base64_decode', [ $encoded ] );
		$this->assertSame( 'SABlAGwAbABvACAAPNgN3w==', $actual );
	}

	public function test_base64_decode_not_encoded() {
		$encoded = 'Hello World';

		$mock   = $this->getMockForTrait( \Google\Web_Stories\Traits\Decoder::class );
		$actual = $this->call_private_method( $mock, 'base64_decode', [ $encoded ] );
		$this->assertSame( 'Hello World', $actual );
	}
}
