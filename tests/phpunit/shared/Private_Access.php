<?php

declare(strict_types = 1);

/**
 * Copyright 2020 Google LLC
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

namespace Google\Web_Stories\Tests\Shared;

use ReflectionClass;
use ReflectionException;

/**
 * Trait Private_Access.
 *
 * Allows accessing private methods and properties for testing.
 *
 * @internal
 */
trait Private_Access {

	/**
	 * Call a private method as if it was public.
	 *
	 * @throws ReflectionException If the object could not be reflected upon.
	 *
	 * @param callable|array $callback Object instance or class string to call the method of.
	 * @param array          $args     Optional. Array of arguments to pass to the method.
	 * @return mixed Return value of the method call.
	 *
	 * @template C
	 * @template A
	 *
	 * @phpstan-param callable(A): C $callback
	 * @phpstan-param array<A> $args
	 * @phpstan-return C
	 */
	protected function call_private_method( $callback, array $args = [] ) {
		$method = ( new ReflectionClass( $callback[0] ) )->getMethod( $callback[1] );
		if ( PHP_VERSION_ID < 80100 ) {
			$method->setAccessible( true );
		}
		return $method->invokeArgs( $callback[0], $args );
	}

	/**
	 * Call a private static method as if it was public.
	 *
	 * @throws ReflectionException If the class could not be reflected upon.
	 *
	 * @param callable|array $callback Object instance or class string to call the method of.
	 * @param array          $args     Optional. Array of arguments to pass to the method.
	 * @return mixed Return value of the method call.
	 *
	 * @template C
	 * @template A
	 *
	 * @phpstan-param array<A> $args
	 * @phpstan-param callable(A): C $callback
	 * @phpstan-return C
	 */
	protected function call_private_static_method( $callback, array $args = [] ) {
		$method = ( new ReflectionClass( $callback[0] ) )->getMethod( $callback[1] );
		if ( PHP_VERSION_ID < 80100 ) {
			$method->setAccessible( true );
		}
		return $method->invokeArgs( null, $args );
	}

	/**
	 * Set a private property as if it was public.
	 *
	 * @throws ReflectionException If the object could not be reflected upon.
	 *
	 * @param object|string $instance      Object instance or class string to set the property of.
	 * @param string        $property_name Name of the property to set.
	 * @param mixed         $value         Value to set the property to.
	 */
	protected function set_private_property( $instance, string $property_name, $value ): void {
		$reflection_class = new ReflectionClass( $instance );
		$property         = $reflection_class->getProperty( $property_name );
		if ( PHP_VERSION_ID < 80100 ) {
			$property->setAccessible( true );
		}

		$property->isStatic() ? $reflection_class->setStaticPropertyValue( $property_name, $value ) : $property->setValue( $instance, $value );
	}

	/**
	 * Get a private property as if it was public.
	 *
	 * @throws ReflectionException If the object could not be reflected upon.
	 *
	 * @param object|string $instance      Object instance or class string to get the property of.
	 * @param string        $property_name Name of the property to get.
	 * @return mixed Return value of the property.
	 */
	protected function get_private_property( $instance, string $property_name ) {
		$property = ( new ReflectionClass( $instance ) )->getProperty( $property_name );
		if ( PHP_VERSION_ID < 80100 ) {
			$property->setAccessible( true );
		}
		return $property->getValue( $instance );
	}

	/**
	 * Get a static private property as if it was public.
	 *
	 * @throws ReflectionException If the class could not be reflected upon.
	 *
	 * @param string $class_name    Class string to get the property of.
	 * @param string $property_name Name of the property to get.
	 * @return mixed Return value of the property.
	 */
	protected function get_static_private_property( string $class_name, string $property_name ) {
		$properties = ( new ReflectionClass( $class_name ) )->getStaticProperties();
		return \array_key_exists( $property_name, $properties ) ? $properties[ $property_name ] : null;
	}
}
