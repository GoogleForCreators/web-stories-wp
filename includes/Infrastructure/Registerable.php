<?php
/**
 * Interface Registerable.
 *
 * Infrastructure code based on https://github.com/mwpd/basic-scaffold.
 *
 * @package Google\Web_Stories
 */

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
 * @since 1.6
 * @internal
 */
interface Registerable {

	/**
	 * Register the service.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function register();
}
