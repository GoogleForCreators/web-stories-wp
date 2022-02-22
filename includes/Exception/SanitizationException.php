<?php
/**
 * Exception SanitizationException.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Exception;

use RuntimeException;

/**
 * Exception thrown when AMP sanitization errors.
 *
 * @internal
 *
 * @since 1.10.0
 */
final class SanitizationException
	extends RuntimeException
	implements WebStoriesException {

	/**
	 * Create a new instance of the exception for a document that cannot be parsed.
	 *
	 * @since 1.10.0
	 */
	public static function from_document_parse_error(): self {
		return new self( 'The markup could not be parsed into a DOMDocument.' );
	}
}
