<?php
/**
 * Final class SimpleServiceContainer.
 *
 * @link      https://www.mwpd.io/
 *
 * @copyright 2019 Alain Schlesser
 * @license   MIT
 */

/**
 * Original code modified for this project.
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

declare(strict_types = 1);

namespace Google\Web_Stories\Infrastructure\ServiceContainer;

use ArrayObject;
use Google\Web_Stories\Exception\InvalidService;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Infrastructure\ServiceContainer;

/**
 * A simplified implementation of a service container.
 *
 * We extend ArrayObject so we have default implementations for iterators and
 * array access.
 *
 * @internal
 *
 * @since 1.6.0
 */
final class SimpleServiceContainer extends ArrayObject implements ServiceContainer {

	/**
	 * Find a service of the container by its identifier and return it.
	 *
	 * @since 1.6.0
	 *
	 * @throws InvalidService If the service could not be found.
	 *
	 * @param string $id Identifier of the service to look for.
	 * @return Service Service that was requested.
	 */
	public function get( string $id ): Service {
		if ( ! $this->has( $id ) ) {
			throw InvalidService::from_service_id( $id ); // phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped
		}

		/**
		 * Service.
		 *
		 * @var Service $service Service.
		 */
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
	 */
	public function has( string $id ): bool {
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
	 */
	public function put( string $id, Service $service ): void {
		$this->offsetSet( $id, $service );
	}
}
