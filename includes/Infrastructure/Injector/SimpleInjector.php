<?php
/**
 * Final class SimpleInjector.
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

namespace Google\Web_Stories\Infrastructure\Injector;

use Google\Web_Stories\Exception\FailedToMakeInstance;
use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\Instantiator;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionParameter;
use function array_map;

/**
 * A simplified implementation of a dependency injector.
 *
 * @internal
 *
 * @since 1.6.0
 */
final class SimpleInjector implements Injector {

	/**
	 * Special-case index key for handling globally defined named arguments.
	 */
	public const GLOBAL_ARGUMENTS = '__global__';

	/**
	 * Mappings.
	 *
	 * @var array<string>
	 */
	private $mappings = [];

	/**
	 * Shared instances
	 *
	 * @var array<object|null>
	 */
	private $shared_instances = [];

	/**
	 * Delegates.
	 *
	 * @var array<callable>
	 */
	private $delegates = [];

	/**
	 * Argument mappings.
	 *
	 * @var array<string, array<mixed>>
	 */
	private $argument_mappings = [
		self::GLOBAL_ARGUMENTS => [],
	];

	/**
	 * Instantiator.
	 *
	 * @var Instantiator
	 */
	private $instantiator;

	/**
	 * Instantiate a SimpleInjector object.
	 *
	 * @since 1.6.0
	 *
	 * @param Instantiator|null $instantiator Optional. Instantiator to use.
	 */
	public function __construct( ?Instantiator $instantiator = null ) {
		$this->instantiator = $instantiator ?? new FallbackInstantiator();
	}

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param string         $interface_or_class Interface or class to make an object instance out of.
	 * @param class-string[] $arguments          Optional. Additional arguments to pass to the constructor.
	 *                                           Defaults to an empty array.
	 * @return object Instantiated object.
	 */
	public function make( string $interface_or_class, array $arguments = [] ): object {
		$injection_chain = $this->resolve(
			new InjectionChain(),
			$interface_or_class
		);

		$class = $injection_chain->get_class();

		if ( $this->has_shared_instance( $class ) ) {
			return $this->get_shared_instance( $class );
		}

		if ( $this->has_delegate( $class ) ) {
			$delegate = $this->get_delegate( $class );
			$object   = $delegate( $class );
		} else {
			$reflection = $this->get_class_reflection( $class );
			$this->ensure_is_instantiable( $reflection );

			$dependencies = $this->get_dependencies_for(
				$injection_chain,
				$reflection,
				$arguments
			);

			$object = $this->instantiator->instantiate( $class, $dependencies );
		}

		if ( \array_key_exists( $class, $this->shared_instances ) ) {
			$this->shared_instances[ $class ] = $object;
		}

		return $object;
	}

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
	public function bind( string $from, string $to ): Injector {
		$this->mappings[ $from ] = $to;

		return $this;
	}

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
	): Injector {
		$this->argument_mappings[ $interface_or_class ][ $argument_name ] = $value;

		return $this;
	}

	/**
	 * Always reuse and share the same instance for the provided interface or
	 * class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $interface_or_class Interface or class to reuse.
	 */
	public function share( string $interface_or_class ): Injector {
		$this->shared_instances[ $interface_or_class ] = null;

		return $this;
	}

	/**
	 * Delegate instantiation of an interface or class to a callable.
	 *
	 * @since 1.6.0
	 *
	 * @param string   $interface_or_class Interface or class to delegate the
	 *                                     instantiation of.
	 * @param callable $callable           Callable to use for instantiation.
	 */
	public function delegate( string $interface_or_class, callable $callable ): Injector {
		$this->delegates[ $interface_or_class ] = $callable;

		return $this;
	}

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param InjectionChain $injection_chain    Injection chain to track
	 *                                           resolutions.
	 * @param string         $interface_or_class Interface or class to make an
	 *                                           object instance out of.
	 * @return object Instantiated object.
	 */
	private function make_dependency(
		InjectionChain $injection_chain,
		string $interface_or_class
	): object {
		$injection_chain = $this->resolve(
			$injection_chain,
			$interface_or_class
		);

		$class = $injection_chain->get_class();

		if ( $this->has_shared_instance( $class ) ) {
			return $this->get_shared_instance( $class );
		}

		if ( $this->has_delegate( $class ) ) {
			$delegate = $this->get_delegate( $class );
			return $delegate( $class );
		}

		$reflection = $this->get_class_reflection( $class );
		$this->ensure_is_instantiable( $reflection );

		$dependencies = $this->get_dependencies_for(
			$injection_chain,
			$reflection
		);

		$object = $this->instantiator->instantiate( $class, $dependencies );

		if ( \array_key_exists( $class, $this->shared_instances ) ) {
			$this->shared_instances[ $class ] = $object;
		}

		return $object;
	}

	/**
	 * Recursively resolve an interface to the class it should be bound to.
	 *
	 * @since 1.6.0
	 *
	 * @throws FailedToMakeInstance If a circular reference was detected.
	 *
	 * @param InjectionChain $injection_chain    Injection chain to track
	 *                                           resolutions.
	 * @param string         $interface_or_class Interface or class to resolve.
	 * @return InjectionChain Modified Injection chain
	 */
	private function resolve(
		InjectionChain $injection_chain,
		string $interface_or_class
	): InjectionChain {
		if ( $injection_chain->is_in_chain( $interface_or_class ) ) {
			// Circular reference detected, aborting.
			throw FailedToMakeInstance::for_circular_reference(
				$interface_or_class,
				$injection_chain
			);
		}

		$injection_chain = $injection_chain->add_resolution( $interface_or_class );

		if ( \array_key_exists( $interface_or_class, $this->mappings ) ) {
			return $this->resolve(
				$injection_chain,
				$this->mappings[ $interface_or_class ]
			);
		}

		return $injection_chain->add_to_chain( $interface_or_class );
	}

	/**
	 * Get the array of constructor dependencies for a given reflected class.
	 *
	 * @since 1.6.0
	 *
	 * @param InjectionChain  $injection_chain Injection chain to track resolutions.
	 * @param ReflectionClass $reflection      Reflected class to get the dependencies for.
	 * @param array           $arguments       Associative array of directly provided arguments.
	 * @return class-string[] Array of dependencies that represent the arguments for the class' constructor.
	 */
	private function get_dependencies_for(
		InjectionChain $injection_chain,
		ReflectionClass $reflection,
		array $arguments = []
	): array {
		$constructor = $reflection->getConstructor();
		$class       = $reflection->getName();

		if ( null === $constructor ) {
			return [];
		}

		return array_map(
			function ( ReflectionParameter $parameter ) use ( $injection_chain, $class, $arguments ) {
				return $this->resolve_argument(
					$injection_chain,
					$class,
					$parameter,
					$arguments
				);
			},
			$constructor->getParameters()
		);
	}

	/**
	 * Ensure that a given reflected class is instantiable.
	 *
	 * @since 1.6.0
	 *
	 * @throws FailedToMakeInstance If the interface could not be resolved.
	 *
	 * @param ReflectionClass $reflection Reflected class to check.
	 */
	private function ensure_is_instantiable( ReflectionClass $reflection ): void {
		if ( ! $reflection->isInstantiable() ) {
			throw FailedToMakeInstance::for_unresolved_interface( $reflection->getName() );
		}
	}

	/**
	 * Resolve a given reflected argument.
	 *
	 * @since 1.6.0
	 *
	 * @param InjectionChain       $injection_chain  Injection chain to track resolutions.
	 * @param string               $class            Name of the class to resolve the arguments for.
	 * @param ReflectionParameter  $parameter        Parameter to resolve.
	 * @param array<string, mixed> $arguments        Associative array of directly provided arguments.
	 * @return mixed Resolved value of the argument.
	 */
	private function resolve_argument(
		InjectionChain $injection_chain,
		string $class,
		ReflectionParameter $parameter,
		array $arguments
	) {
		if ( ! $parameter->hasType() ) {
			return $this->resolve_argument_by_name(
				$class,
				$parameter,
				$arguments
			);
		}

		$type = $parameter->getType();

		// In PHP 8.0, the isBuiltin method was removed from the parent {@see ReflectionType} class.
		if ( null === $type || ( $type instanceof ReflectionNamedType && $type->isBuiltin() ) ) {
			return $this->resolve_argument_by_name(
				$class,
				$parameter,
				$arguments
			);
		}

		$type = $type instanceof ReflectionNamedType
			? $type->getName()
			: (string) $type;

		return $this->make_dependency( $injection_chain, $type );
	}

	/**
	 * Resolve a given reflected argument by its name.
	 *
	 * @since 1.6.0
	 *
	 * @throws FailedToMakeInstance If the argument could not be resolved.
	 *
	 * @param string               $class     Class to resolve the argument for.
	 * @param ReflectionParameter  $parameter Argument to resolve by name.
	 * @param array<string, mixed> $arguments Associative array of directly
	 *                                       provided arguments.
	 * @return mixed Resolved value of the argument.
	 */
	private function resolve_argument_by_name(
		string $class,
		ReflectionParameter $parameter,
		array $arguments
	) {
		$name = $parameter->getName();

		// The argument was directly provided to the make() call.
		if ( \array_key_exists( $name, $arguments ) ) {
			return $arguments[ $name ];
		}

		// Check if we have mapped this argument for the specific class.
		if ( \array_key_exists( $class, $this->argument_mappings )
			&& \array_key_exists( $name, $this->argument_mappings[ $class ] ) ) {
			$value = $this->argument_mappings[ $class ][ $name ];

			// Closures are immediately resolved, to provide lazy resolution.
			if ( is_callable( $value ) ) {
				$value = $value( $class, $parameter, $arguments );
			}

			return $value;
		}

		// No argument found for the class, check if we have a global value.
		if ( \array_key_exists( $name, $this->argument_mappings[ self::GLOBAL_ARGUMENTS ] ) ) {
			return $this->argument_mappings[ self::GLOBAL_ARGUMENTS ][ $name ];
		}

		// No provided argument found, check if it has a default value.
		try {
			if ( $parameter->isDefaultValueAvailable() ) {
				return $parameter->getDefaultValue();
			}
		} catch ( \Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// Just fall through into the FailedToMakeInstance exception.
		}

		// Out of options, fail with an exception.
		throw FailedToMakeInstance::for_unresolved_argument( $name, $class );
	}

	/**
	 * Check whether a shared instance exists for a given class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class Class to check for a shared instance.
	 * @return bool Whether a shared instance exists.
	 */
	private function has_shared_instance( string $class ): bool {
		return \array_key_exists( $class, $this->shared_instances )
			&& null !== $this->shared_instances[ $class ];
	}

	/**
	 * Get the shared instance for a given class.
	 *
	 * @since 1.6.0
	 *
	 * @throws FailedToMakeInstance If an uninstantiated shared instance is
	 *                              requested.
	 *
	 * @param string $class Class to get the shared instance for.
	 * @return object Shared instance.
	 */
	private function get_shared_instance( string $class ): object {
		if ( ! $this->has_shared_instance( $class ) ) {
			throw FailedToMakeInstance::for_uninstantiated_shared_instance( $class );
		}

		return (object) $this->shared_instances[ $class ];
	}

	/**
	 * Check whether a delegate exists for a given class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class Class to check for a delegate.
	 * @return bool Whether a delegate exists.
	 */
	private function has_delegate( string $class ): bool {
		return \array_key_exists( $class, $this->delegates );
	}

	/**
	 * Get the delegate for a given class.
	 *
	 * @since 1.6.0
	 *
	 * @throws FailedToMakeInstance If an invalid delegate is requested.
	 *
	 * @param string $class Class to get the delegate for.
	 * @return callable Delegate.
	 */
	private function get_delegate( string $class ): callable {
		if ( ! $this->has_delegate( $class ) ) {
			throw FailedToMakeInstance::for_invalid_delegate( $class );
		}

		return $this->delegates[ $class ];
	}

	/**
	 * Get the reflection for a class or throw an exception.
	 *
	 * @since 1.6.0
	 *
	 * @throws FailedToMakeInstance If the class could not be reflected.
	 *
	 * @param string|class-string $class Class to get the reflection for.
	 * @return ReflectionClass Class reflection.
	 */
	private function get_class_reflection( string $class ): ReflectionClass {
		if ( ! class_exists( $class ) ) {
			throw FailedToMakeInstance::for_unreflectable_class( $class );
		}

		// There should be no ReflectionException happening because of the class existence check above.
		return new ReflectionClass( $class );
	}
}
