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
class Decoder extends Test_Case {

	/**
	 * @dataProvider get_encoded_data
	 *
	 * @param string $encoded
	 * @param string $string
	 * @covers ::base64_decode
	 */
	public function test_base64_decode( $encoded, $string ) {

		$decoder = new \Google\Web_Stories\Decoder();
		$actual  = $decoder->base64_decode( $encoded );

		$this->assertSame( $string, $actual );
	}

	/**
	 * @covers ::supports_decoding
	 */
	public function test_supports_decoding() {
		$decoder = new \Google\Web_Stories\Decoder();
		$this->assertTrue( $decoder->supports_decoding() );
	}

	public function get_encoded_data() {
		return [
			'converts UTF 16'             => [
				'__WEB_STORIES_ENCODED__SGVsbG8lMjB3b3JsZCUyMC0lMjAlQzMlOTglQzMlOTklQzMlOUYlQzMlQTYlQzQlODQlQzUlOTIlQzYlOTUlQzYlOUMlQzclODQlQzclODYlQzklQjc=',
				'Hello world - ØÙßæĄŒƕƜǄǆɷ',
			],
			'converts html characters'    => [
				'__WEB_STORIES_ENCODED__SGVsbG8lMjAlMjZjb3B5JTNCJTI2ZG9sbGFyJTNCJTI2cG91bmQlM0I=',
				'Hello &copy;&dollar;&pound;',
			],
			'converts html'               => [
				'__WEB_STORIES_ENCODED__SGVsbG8lMjAlM0NhJTIwaHJlZiUzRCUyMiUyMyUyMiUzRXdvcmxkJTNDJTJGYSUzRQ==',
				'Hello <a href="#">world</a>',
			],
			'converts Unicode characters' => [
				'__WEB_STORIES_ENCODED__SGVsbG8lMjAlRjAlOUYlOEMlOEQlMjAtJTIwJUUzJTgxJTkzJUUzJTgyJThDJUUzJTgxJUFGJUUzJTgyJUI1JUUzJTgzJUIzJUUzJTgzJTk3JUUzJTgzJUFCJUUzJTgxJUE3JUUzJTgxJTk5JUUzJTgwJTgy',
				'Hello 🌍 - これはサンプルです。',
			],
			'decode_no_prefix'            => [
				'SABlAGwAbABvACAAPNgN3yAALQAgAFMwjDBvMLUw8zDXMOswZzBZMAIw',
				'SABlAGwAbABvACAAPNgN3yAALQAgAFMwjDBvMLUw8zDXMOswZzBZMAIw',
			],
			'not_encoded'                 => [
				'Hello World',
				'Hello World',
			],
		];
	}

}
