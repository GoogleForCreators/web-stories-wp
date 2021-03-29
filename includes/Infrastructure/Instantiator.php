<?php
/**
 * Interface Instantiator.
 *
 * Infrastructure code based on https://github.com/mwpd/basic-scaffold.
 *
 * @package Google\Web_Stories
 */

namespace Google\Web_Stories\Infrastructure;

/**
 * Interface to make the act of instantiation extensible/replaceable.
 *
 * This way, a more elaborate mechanism can be plugged in, like using
 * ProxyManager to instantiate proxies instead of actual objects.
 *
 * @since 1.6
 * @internal
 */
interface Instantiator {

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class        Class to make an object instance out of.
	 * @param array  $dependencies Optional. Dependencies of the class.
	 * @return object Instantiated object.
	 */
	public function instantiate( $class, $dependencies = [] );
}
