<?php
/**
 * Interface Registerable.
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

namespace Google\Web_Stories\Infrastructure;

/**
 * Something that can be registered.
 *
 * For a clean code base, a class instantiation should never have side-effects,
 * only initialize the internals of the object so that it is ready to be used.
 *
 * This means, though, that the system does not have any knowledge of the
 * objects when they are merely instantiated.
 *
 * Registering such an object is the explicit act of making it known to the
 * overarching system.
 *
 * @internal
 *
 * @since 1.6.0
 */
interface Registerable {

	/**
	 * Register the service.
	 *
	 * @since 1.6.0
	 */
	public function register(): void;
}
