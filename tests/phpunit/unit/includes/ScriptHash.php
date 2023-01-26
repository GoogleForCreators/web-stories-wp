<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Unit;

trait ScriptHash {
	/**
	 * Generate hash for inline amp-script.
	 *
	 * Copied from amp-helper-functions.php
	 *
	 * The sha384 hash used by amp-script is represented not as hexadecimal but as base64url, which is defined in RFC 4648
	 * under section 5, "Base 64 Encoding with URL and Filename Safe Alphabet". It is sometimes referred to as "web safe".
	 *
	 * @link https://amp.dev/documentation/components/amp-script/#security-features
	 * @link https://github.com/ampproject/amphtml/blob/e8707858895c2af25903af25d396e144e64690ba/extensions/amp-script/0.1/amp-script.js#L401-L425
	 * @link https://github.com/ampproject/amphtml/blob/27b46b9c8c0fb3711a00376668d808f413d798ed/src/service/crypto-impl.js#L67-L124
	 * @link https://github.com/ampproject/amphtml/blob/c4a663d0ba13d0488c6fe73c55dc8c971ac6ec0d/src/utils/base64.js#L52-L61
	 * @link https://tools.ietf.org/html/rfc4648#section-5
	 * @see ::generate_script_hash()
	 *
	 * @param string $script Script.
	 * @return string|null Script hash or null if the sha384 algorithm is not supported.
	 */
	public function generate_script_hash( string $script ): ?string {
		$sha384 = hash( 'sha384', $script, true );
		if ( ! $sha384 ) {
			return null;
		}
		$hash = str_replace(
			[ '+', '/', '=' ],
			[ '-', '_', '.' ],
			base64_encode( $sha384 ) // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		);
		return 'sha384-' . $hash;
	}
}
