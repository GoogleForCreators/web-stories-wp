<?php
/**
 * Interface Instantiator.
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
 * Interface to make the act of instantiation extensible/replaceable.
 *
 * This way, a more elaborate mechanism can be plugged in, like using
 * ProxyManager to instantiate proxies instead of actual objects.
 *
 * @internal
 *
 * @since 1.6.0
 *
 * @template T
 */
interface Instantiator {
	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param string            $class        Class to make an object instance out of.
	 * @param array<int, mixed> $dependencies Optional. Dependencies of the class.
	 * @return T Instantiated object.
	 *
	 * @phpstan-param class-string<T> $class Class to make an object instance out of.
	 */
	public function instantiate( string $class, array $dependencies = [] );
}
