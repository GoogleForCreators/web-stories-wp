<?php
/**
 * Exception InvalidStopwatchEvent.
 *
 * @package Google\Web_Stories
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

use InvalidArgumentException;

/**
 * Exception thrown when an invalid stopwatch name was requested.
 *
 * @since 1.6
 * @internal
 */
final class InvalidStopwatchEvent
	extends InvalidArgumentException
	implements WebStoriesException {

	/**
	 * Create a new instance of the exception for a stopwatch event name that is
	 * not recognized but requested to be stopped.
	 *
	 * @since 1.6.0
	 *
	 * @param string $name Name of the event that was requested to be stopped.
	 *
	 * @return self
	 */
	public static function from_name_to_stop( $name ) {
		$message = \sprintf(
			'The stopwatch event "%s" is not recognized and cannot be stopped.',
			$name
		);

		return new self( $message );
	}
}
