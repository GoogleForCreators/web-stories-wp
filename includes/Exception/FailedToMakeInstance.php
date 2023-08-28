<?php
/**
 * Exception FailedToMakeInstance.
 *
 * @link      https://www.mwpd.io/
 *
 * @copyright 2019 Alain Schlesser
 * @license   MIT
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

declare(strict_types = 1);

namespace Google\Web_Stories\Exception;

use Google\Web_Stories\Infrastructure\Injector\InjectionChain;
use RuntimeException;

/**
 * Exception thrown when the injector couldn't instantiate a given class or
 * interface.
 *
 * @internal
 *
 * @since 1.6.0
 */
final class FailedToMakeInstance extends RuntimeException implements WebStoriesException {

	// These constants are public so you can use them to find out what exactly
	// happened when you catch a "FailedToMakeInstance" exception.
	public const CIRCULAR_REFERENCE             = 100;
	public const UNRESOLVED_INTERFACE           = 200;
	public const UNREFLECTABLE_CLASS            = 300;
	public const UNRESOLVED_ARGUMENT            = 400;
	public const UNINSTANTIATED_SHARED_INSTANCE = 500;
	public const INVALID_DELEGATE               = 600;

	/**
	 * Create a new instance of the exception for an interface or class that
	 * created a circular reference.
	 *
	 * @since 1.6.0
	 *
	 * @param string         $interface_or_class         Interface or class name that
	 *                                                   generated the circular
	 *                                                   reference.
	 * @param InjectionChain $injection_chain    Injection chain that led to the
	 *                                           circular reference.
	 */
	public static function for_circular_reference(
		string $interface_or_class,
		InjectionChain $injection_chain
	): self {
		$message = \sprintf(
			'Circular reference detected while trying to resolve the interface or class "%s".',
			$interface_or_class
		);

		$message .= "\nInjection chain:\n";
		foreach ( $injection_chain->get_chain() as $link ) {
			$message .= "{$link}\n";
		}

		return new self( $message, self::CIRCULAR_REFERENCE );
	}

	/**
	 * Create a new instance of the exception for an interface that could not
	 * be resolved to an instantiable class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $interface_name Interface that was left unresolved.
	 */
	public static function for_unresolved_interface( string $interface_name ): self {
		$message = \sprintf(
			'Could not resolve the interface "%s" to an instantiable class, probably forgot to bind an implementation.',
			$interface_name
		);

		return new self( $message, self::UNRESOLVED_INTERFACE );
	}

	/**
	 * Create a new instance of the exception for an interface or class that
	 * could not be reflected upon.
	 *
	 * @since 1.6.0
	 *
	 * @param string $interface_or_class Interface or class that could not be
	 *                                   reflected upon.
	 */
	public static function for_unreflectable_class( string $interface_or_class ): self {
		$message = \sprintf(
			'Could not reflect on the interface or class "%s", probably not a valid FQCN.',
			$interface_or_class
		);

		return new self( $message, self::UNREFLECTABLE_CLASS );
	}

	/**
	 * Create a new instance of the exception for an argument that could not be
	 * resolved.
	 *
	 * @since 1.6.0
	 *
	 * @param string $argument_name Name of the argument that could not be
	 *                              resolved.
	 * @param string $class_name    Class that had the argument in its
	 *                              constructor.
	 */
	public static function for_unresolved_argument( string $argument_name, string $class_name ): self {
		$message = \sprintf(
			'Could not resolve the argument "%s" while trying to instantiate the class "%s".',
			$argument_name,
			$class_name
		);

		return new self( $message, self::UNRESOLVED_ARGUMENT );
	}

	/**
	 * Create a new instance of the exception for a class that was meant to be
	 * reused but was not yet instantiated.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class_name Class that was not yet instantiated.
	 */
	public static function for_uninstantiated_shared_instance( string $class_name ): self {
		$message = \sprintf(
			'Could not retrieve the shared instance for "%s" as it was not instantiated yet.',
			$class_name
		);

		return new self( $message, self::UNINSTANTIATED_SHARED_INSTANCE );
	}

	/**
	 * Create a new instance of the exception for a delegate that was requested
	 * for a class that doesn't have one.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class_name Class for which there is no delegate.
	 */
	public static function for_invalid_delegate( string $class_name ): self {
		$message = \sprintf(
			'Could not retrieve a delegate for "%s", none was defined.',
			$class_name
		);

		return new self( $message, self::INVALID_DELEGATE );
	}
}
