<?php
/**
 * Interface Injector.
 *
 * @package Google\Web_Stories
 */

/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories\Infrastructure;

/**
 * The dependency injector should be the only piece of code doing actual
 * instantiations, with the following exceptions:
 *  - Factories can instantiate directly.
 *  - Value objects should be instantiated directly where they are being used.
 *
 * Through technical features like "binding" interfaces to classes or
 * "auto-wiring" to resolve all dependency of a class to be instantiated
 * automatically, the dependency injector allows for the largest part of the
 * code to adhere to the "Code against Interfaces, not Implementations"
 * principle.
 *
 * Finally, the dependency injector should be the only one to decide what
 * objects to "share" (always handing out the same instance) or not to share
 * (always returning a fresh new instance on each subsequent call). This
 * effectively gets rid of the dreaded Singletons.
 *
 * @since 1.6
 * @internal
 */
interface Injector extends Service {

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param string|class-string|object $interface_or_class Interface or class to make an object
	 *                                   instance out of.
	 * @param array                      $arguments          Optional. Additional arguments to pass
	 *                                                       to the constructor. Defaults to an
	 *                                                       empty array.
	 * @return object Instantiated object.
	 */
	public function make( $interface_or_class, $arguments = [] );

	/**
	 * Bind a given interface or class to an implementation.
	 *
	 * Note: The implementation can be an interface as well, as long as it can
	 * be resolved to an instantiatable class at runtime.
	 *
	 * @since 1.6.0
	 *
	 * @param string $from Interface or class to bind an implementation to.
	 * @param string $to   Interface or class that provides the implementation.
	 * @return Injector
	 */
	public function bind( $from, $to );

	/**
	 * Bind an argument for a class to a specific value.
	 *
	 * @since 1.6.0
	 *
	 * @param string $interface_or_class Interface or class to bind an argument
	 *                                   for.
	 * @param string $argument_name      Argument name to bind a value to.
	 * @param mixed  $value              Value to bind the argument to.
	 *
	 * @return Injector
	 */
	public function bind_argument(
		$interface_or_class,
		$argument_name,
		$value
	);

	/**
	 * Always reuse and share the same instance for the provided interface or
	 * class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $interface_or_class Interface or class to reuse.
	 * @return Injector
	 */
	public function share( $interface_or_class );

	/**
	 * Delegate instantiation of an interface or class to a callable.
	 *
	 * @since 1.6.0
	 *
	 * @param string   $interface_or_class Interface or class to delegate the
	 *                                     instantiation of.
	 * @param callable $callable           Callable to use for instantiation.
	 * @return Injector
	 */
	public function delegate( $interface_or_class, callable $callable );
}
