<?php
/**
 * Exception InvalidService.
 *
 * @link      https://www.mwpd.io/
 *
 * @copyright 2019 Alain Schlesser
 * @license   MIT
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
 * Exception thrown when an invalid service was requested.
 *
 * @internal
 *
 * @since 1.6.0
 */
final class InvalidService
	extends InvalidArgumentException
	implements WebStoriesException {

	/**
	 * Create a new instance of the exception for a service class name that is
	 * not recognized.
	 *
	 * @since 1.6.0
	 *
	 * @param string|object $service Class name of the service that was not
	 *                               recognized.
	 */
	public static function from_service( $service ): self {
		$message = \sprintf(
			'The service "%s" is not recognized and cannot be registered.',
			\is_object( $service )
				? \get_class( $service )
				: (string) $service
		);

		return new self( $message );
	}

	/**
	 * Create a new instance of the exception for a service identifier that is
	 * not recognized.
	 *
	 * @param string $service_id Identifier of the service that is not being
	 *                           recognized.
	 */
	public static function from_service_id( string $service_id ): self {
		$message = \sprintf(
			'The service ID "%s" is not recognized and cannot be retrieved.',
			$service_id
		);

		return new self( $message );
	}
}
