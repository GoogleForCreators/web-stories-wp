<?php
/**
 * Final class LazilyInstantiatedService.
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

use Google\Web_Stories\Exception\InvalidService;
use Google\Web_Stories\Infrastructure\Service;

/**
 * A service that only gets properly instantiated when it is actually being
 * retrieved from the container.
 *
 * @internal
 *
 * @since 1.6.0
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
	public function instantiate(): Service {
		$instantiation = $this->instantiation; // Because uniform variable syntax not supported in PHP 5.6.
		$service       = $instantiation();

		if ( ! $service instanceof Service ) {
			throw InvalidService::from_service( $service );
		}

		return $service;
	}
}
