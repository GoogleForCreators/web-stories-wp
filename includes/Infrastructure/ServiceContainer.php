<?php
/**
 * Interface ServiceContainer.
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
 * @since 1.6.0
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
