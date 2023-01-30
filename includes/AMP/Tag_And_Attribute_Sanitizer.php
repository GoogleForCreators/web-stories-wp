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

declare(strict_types = 1);

namespace Google\Web_Stories\AMP;

use Google\Web_Stories_Dependencies\AMP_Tag_And_Attribute_Sanitizer;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;

/**
 * Strips the tags and attributes from the content that are not allowed by the AMP spec.
 *
 * @since 1.28.0
 *
 * @see AMP_Tag_And_Attribute_Sanitizer
 */
class Tag_And_Attribute_Sanitizer extends AMP_Tag_And_Attribute_Sanitizer {
	/**
	 * AMP_Tag_And_Attribute_Sanitizer constructor.
	 *
	 * @since 1.28.0
	 *
	 * @param Document             $dom  DOM.
	 * @param array<string, mixed> $args args.
	 */
	public function __construct( Document $dom, array $args = [] ) { // phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found
		parent::__construct( $dom, $args );
	}
}
