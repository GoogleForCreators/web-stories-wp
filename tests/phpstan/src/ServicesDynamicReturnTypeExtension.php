<?php
/**
 * Class ServicesDynamicReturnTypeExtension
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

namespace Google\Web_Stories\PHPStan;

use Google\Web_Stories\Plugin;
use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Services;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Scalar\String_;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\MethodReflection;
use PHPStan\Reflection\ParametersAcceptorSelector;
use PHPStan\ShouldNotHappenException;
use PHPStan\Type\Constant\ConstantBooleanType;
use PHPStan\Type\DynamicStaticMethodReturnTypeExtension;
use PHPStan\Type\ObjectType;
use PHPStan\Type\Type;

/**
 * PHPStan extension class that provides the type for services returned via the
 * static service locator.
 *
 * phpcs:disable WordPress.NamingConventions.ValidVariableName
 * phpcs:disable PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations
 * phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
 */
final class ServicesDynamicReturnTypeExtension implements DynamicStaticMethodReturnTypeExtension {

	public function getClass(): string {
		return Services::class;
	}

	public function isStaticMethodSupported(
		MethodReflection $methodReflection
	): bool {
		return in_array( $methodReflection->getName(), [ 'get' ], true );
	}

	public function getTypeFromStaticMethodCall(
		MethodReflection $methodReflection,
		StaticCall $methodCall,
		Scope $scope
	): Type {
		switch ( $methodReflection->getName() ) {
			case 'get':
				return $this->getGetTypeFromStaticMethodCall(
					$methodReflection,
					$methodCall
				);
		}

		throw new ShouldNotHappenException();
	}

	private function getGetTypeFromStaticMethodCall(
		MethodReflection $methodReflection,
		StaticCall $methodCall
	): Type {
		$return_type = ParametersAcceptorSelector::selectSingle(
			$methodReflection->getVariants()
		)->getReturnType();

		if (
			! isset( $methodCall->args[0] )
			||
			empty( $methodCall->args[0]->value )
		) {
			return $return_type;
		}

		$service_id = $methodCall->args[0]->value;
		if ( $service_id instanceof String_ ) {
			$service_id = $service_id->value;
		}

		$services = array_merge(
			[ 'injector' => Injector::class ],
			Plugin::SERVICES
		);

		if ( $service_id instanceof Variable ) {
			return new ObjectType( Service::class );
		}

		if ( array_key_exists( (string) $service_id, $services ) ) {
			return new ObjectType( $services[ (string) $service_id ] );
		}

		return $return_type;
	}
}
