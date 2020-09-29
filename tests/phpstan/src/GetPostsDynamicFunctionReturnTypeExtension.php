<?php
/**
 * Copied from szepeviktor/phpstan-wordpress
 */

/**
 * Set return type of get_post().
 */

namespace PHPStan\WordPress;

use PhpParser\Node\Expr\FuncCall;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\FunctionReflection;
use PHPStan\Reflection\ParametersAcceptorSelector;
use PHPStan\Type\Type;
use PHPStan\Type\ArrayType;
use PHPStan\Type\IntegerType;
use PHPStan\Type\ObjectType;
use PHPStan\Type\Constant\ConstantArrayType;
use PHPStan\Type\Constant\ConstantStringType;

class GetPostsDynamicFunctionReturnTypeExtension implements \PHPStan\Type\DynamicFunctionReturnTypeExtension
{
	public function isFunctionSupported(FunctionReflection $functionReflection): bool
	{
		return in_array($functionReflection->getName(), ['get_posts'], true);
	}

	/**
	 * @see https://developer.wordpress.org/reference/classes/wp_query/#return-fields-parameter
	 */
	public function getTypeFromFunctionCall(FunctionReflection $functionReflection, FuncCall $functionCall, Scope $scope): Type
	{
		// Called without arguments
		if (count($functionCall->args) === 0) {
			return new ArrayType(new IntegerType(), new ObjectType('WP_Post'));
		}

		$argumentType = $scope->getType($functionCall->args[0]->value);

		// Called with an array argument
		if ($argumentType instanceof ConstantArrayType) {
			foreach ($argumentType->getKeyTypes() as $index => $key) {
				if (! $key instanceof ConstantStringType || $key->getValue() !== 'fields') {
					continue;
				}

				$fieldsType = $argumentType->getValueTypes()[$index];
				if ($fieldsType instanceof ConstantStringType) {
					$fields = $fieldsType->getValue();
				}
				break;
			}
		}
		// Called with a string argument
		if ($argumentType instanceof ConstantStringType) {
			parse_str($argumentType->getValue(), $variables);
			$fields = $variables['fields'] ?? 'all';
		}

		// Without constant argument return default return type
		if (! isset($fields)) {
			return ParametersAcceptorSelector::selectFromArgs(
				$scope,
				$functionCall->args,
				$functionReflection->getVariants()
			)->getReturnType();
		}

		switch ($fields) {
			case 'ids':
				return new ArrayType(new IntegerType(), new IntegerType());
			case 'id=>parent':
				return new ArrayType(new IntegerType(), new ObjectType('stdClass'));
			case 'all':
			default:
				return new ArrayType(new IntegerType(), new ObjectType('WP_Post'));
		}
	}
}
