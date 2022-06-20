<?php
/**
 * Final class FallbackInstantiator.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Original code modified for this project.
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

namespace Google\Web_Stories\Infrastructure\Injector;

use Google\Web_Stories\Infrastructure\Instantiator;

/**
 * Fallback instantiator to use in case none was provided.
 *
 * @internal
 *
 * @since 1.6.0
 */
final class FallbackInstantiator implements Instantiator {

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param string            $class        Class to make an object instance out of.
	 * @param array<int, mixed> $dependencies Optional. Dependencies of the class.
	 * @return object Instantiated object.
	 */
	public function instantiate( string $class, $dependencies = [] ): object {
		return new $class( ...$dependencies );
	}
}
