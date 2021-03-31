<?php
/**
 * Final class SimpleServiceContainer.
 *
 * @package   Google\Web_Stories
 * @copyright 2019 Alain Schlesser
 * @license   MIT
 * @link      https://www.mwpd.io/
 */

/**
 * Original code modified for this project.
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

namespace Google\Web_Stories\Infrastructure\ServiceContainer;

use Google\Web_Stories\Exception\InvalidService;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Infrastructure\ServiceContainer;
use ArrayObject;

/**
 * A simplified implementation of a service container.
 *
 * We extend ArrayObject so we have default implementations for iterators and
 * array access.
 *
 * @since 1.6.0
 * @internal
 */
final class SimpleServiceContainer
	extends ArrayObject
	implements ServiceContainer {

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
	public function get( $id ) {
		if ( ! $this->has( $id ) ) {
			throw InvalidService::from_service_id( $id );
		}

		$service = $this->offsetGet( $id );

		// Instantiate actual services if they were stored lazily.
		if ( $service instanceof LazilyInstantiatedService ) {
			$service = $service->instantiate();
			$this->put( $id, $service );
		}

		return $service;
	}

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
	public function has( $id ) {
		return $this->offsetExists( $id );
	}

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
	public function put( $id, Service $service ) {
		$this->offsetSet( $id, $service );
	}
}
