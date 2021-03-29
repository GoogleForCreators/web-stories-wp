<?php
/**
 * Final class LazilyInstantiatedService.
 *
 * Infrastructure code based on https://github.com/mwpd/basic-scaffold.
 *
 * @package Google\Web_Stories
 */

namespace Google\Web_Stories\Infrastructure\ServiceContainer;

use Google\Web_Stories\Exception\InvalidService;
use Google\Web_Stories\Infrastructure\Service;

/**
 * A service that only gets properly instantiated when it is actually being
 * retrieved from the container.
 *
 * @since 1.6
 * @internal
 */
final class LazilyInstantiatedService implements Service {

	/**
	 * Instantiation of Class.
	 *
	 * @var callable
	 */
	private $instantiation;

	/**
	 * Instantiate a LazilyInstantiatedService object.
	 *
	 * @param callable $instantiation Instantiation callable to use.
	 */
	public function __construct( callable $instantiation ) {
		$this->instantiation = $instantiation;
	}

	/**
	 * Do the actual service instantiation and return the real service.
	 *
	 * @since 1.6.0
	 *
	 * @throws InvalidService If the service could not be properly instantiated.
	 *
	 * @return Service Properly instantiated service.
	 */
	public function instantiate() {
		$instantiation = $this->instantiation; // Because uniform variable syntax not supported in PHP 5.6.
		$service       = $instantiation();

		if ( ! $service instanceof Service ) {
			throw InvalidService::from_service( $service );
		}

		return $service;
	}
}
