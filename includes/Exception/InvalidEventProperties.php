<?php
/**
 * Exception InvalidEventProperties.
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

declare(strict_types = 1);

namespace Google\Web_Stories\Exception;

use InvalidArgumentException;

/**
 * Exception thrown when an invalid properties are added to an Event.
 *
 * @internal
 *
 * @since 1.6.0
 */
final class InvalidEventProperties extends InvalidArgumentException implements WebStoriesException {

	/**
	 * Create a new instance of the exception for a properties value that has
	 * the wrong type.
	 *
	 * @since 1.6.0
	 *
	 * @param mixed $properties Properties value that has the wrong type.
	 */
	public static function from_invalid_type( $properties ): self {
		$type = \is_object( $properties )
			? \get_class( $properties )
			: \gettype( $properties );

		$message = sprintf(
			'The properties argument for adding properties to an event needs to be an array, but is of type %s',
			$type
		);

		return new self( $message );
	}

	/**
	 * Create a new instance of the exception for a properties value that has
	 * the wrong key type for one or more of its elements.
	 *
	 * @since 1.6.0
	 *
	 * @param mixed $property Property element that has the wrong type.
	 */
	public static function from_invalid_element_key_type( $property ): self {
		$type = \is_object( $property )
			? \get_class( $property )
			: \gettype( $property );

		$message = sprintf(
			'Each property element key for adding properties to an event needs to of type string, but found an element key of type %s',
			$type
		);

		return new self( $message );
	}

	/**
	 * Create a new instance of the exception for a properties value that has
	 * the wrong value type for one or more of its elements.
	 *
	 * @param mixed $property Property element that has the wrong type.
	 */
	public static function from_invalid_element_value_type( $property ): self {
		$type = \is_object( $property )
			? \get_class( $property )
			: \gettype( $property );

		$message = sprintf(
			'Each property element value for adding properties to an event needs to be a scalar value, but found an element value of type %s',
			$type
		);

		return new self( $message );
	}
}
