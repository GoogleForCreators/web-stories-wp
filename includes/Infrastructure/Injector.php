<?php
/**
 * Interface Injector.
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
 * @internal
 *
 * @since 1.6.0
 */
interface Injector extends Service {

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param class-string|object $interface_or_class Interface or class to make an object instance out of.
	 * @param class-string[]      $arguments          Optional. Additional arguments to pass to the constructor.
	 *                                                Defaults to an empty array.
	 * @return object Instantiated object.
	 */
	public function make( $interface_or_class, array $arguments = [] ): object;

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
	 */
	public function bind( string $from, string $to ): Injector;

	/**
	 * Bind an argument for a class to a specific value.
	 *
	 * @since 1.6.0
	 *
	 * @param string $interface_or_class Interface or class to bind an argument
	 *                                   for.
	 * @param string $argument_name      Argument name to bind a value to.
	 * @param mixed  $value              Value to bind the argument to.
	 */
	public function bind_argument(
		string $interface_or_class,
		string $argument_name,
		$value
	): Injector;

	/**
	 * Always reuse and share the same instance for the provided interface or
	 * class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $interface_or_class Interface or class to reuse.
	 */
	public function share( string $interface_or_class ): Injector;

	/**
	 * Delegate instantiation of an interface or class to a callable.
	 *
	 * @since 1.6.0
	 *
	 * @param string   $interface_or_class Interface or class to delegate the
	 *                                     instantiation of.
	 * @param callable $callable           Callable to use for instantiation.
	 */
	public function delegate( string $interface_or_class, callable $callable ): Injector;
}
