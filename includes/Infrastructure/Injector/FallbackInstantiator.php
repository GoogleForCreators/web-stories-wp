<?php
/**
 * Final class FallbackInstantiator.
 *
 * Infrastructure code based on https://github.com/mwpd/basic-scaffold.
 *
 * @package Google\Web_Stories
 */

namespace Google\Web_Stories\Infrastructure\Injector;

use Google\Web_Stories\Infrastructure\Instantiator;

/**
 * Fallback instantiator to use in case none was provided.
 *
 * @since 1.6
 * @internal
 */
final class FallbackInstantiator implements Instantiator {

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class        Class to make an object instance out of.
	 * @param array  $dependencies Optional. Dependencies of the class.
	 * @return object Instantiated object.
	 */
	public function instantiate( $class, $dependencies = [] ) {
		return new $class( ...$dependencies );
	}
}
