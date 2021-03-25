<?php
/**
 * Interface ServiceContainer.
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

namespace Google\Web_Stories\Infrastructure;

use Google\Web_Stories\Exception\InvalidService;
use ArrayAccess;
use Countable;
use Traversable;

/**
 * The service container collects all services to manage them.
 *
 * This is based on PSR-11 and should extend that one if Composer dependencies
 * are being used. Relying on a standardized interface like PSR-11 means you'll
 * be able to easily swap out the implementation for something else later on.
 *
 * @see https://www.php-fig.org/psr/psr-11/
 * @since 1.6
 * @internal
 */
interface ServiceContainer extends Traversable, Countable, ArrayAccess {

	/**
	 * Find a service of the container by its identifier and return it.
	 *
	 * @since 1.6.0
	 *
	 * @param string $id Identifier of the service to look for.
	 *
	 * @throws InvalidService If the service could not be found.
	 *
	 * @return Service Service that was requested.
	 */
	public function get( $id );

	/**
	 * Check whether the container can return a service for the given
	 * identifier.
	 *
	 * @since 1.6.0
	 *
	 * @param string $id Identifier of the service to look for.
	 *
	 * @return bool
	 */
	public function has( $id );

	/**
	 * Put a service into the container for later retrieval.
	 *
	 * @since 1.6.0
	 *
	 * @param string  $id      Identifier of the service to put into the
	 *                         container.
	 * @param Service $service Service to put into the container.
	 *
	 * @return void
	 */
	public function put( $id, Service $service );
}
