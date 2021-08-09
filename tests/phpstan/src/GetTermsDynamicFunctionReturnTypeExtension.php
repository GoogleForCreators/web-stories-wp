<?php
/**
 * Copied from szepeviktor/phpstan-wordpress
 */

/**
 * Set return type of get_terms().
 */

namespace PHPStan\WordPress;

use PhpParser\Node\Expr\FuncCall;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\FunctionReflection;
use PHPStan\Type\Type;
use PHPStan\Type\ArrayType;
use PHPStan\Type\IntegerType;
use PHPStan\Type\ObjectType;
use PHPStan\Type\Constant\ConstantArrayType;
use PHPStan\Type\Constant\ConstantStringType;

class GetTermsDynamicFunctionReturnTypeExtension implements \PHPStan\Type\DynamicFunctionReturnTypeExtension
{
	public function isFunctionSupported(FunctionReflection $functionReflection): bool
	{
		return in_array($functionReflection->getName(), [
			'get_tags',
			'get_terms',
			'wp_get_object_terms',
		], true);
	}

	/**
	 * @see https://developer.wordpress.org/reference/classes/wp_term_query/__construct/
	 */
	public function getTypeFromFunctionCall(FunctionReflection $functionReflection, FuncCall $functionCall, Scope $scope): Type
	{
		// Called without arguments
		if (count($functionCall->args) === 0) {
			return new ArrayType(new IntegerType(), new ObjectType('WP_Term'));
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
			return new ArrayType(new IntegerType(), new ObjectType('WP_Term'));
		}

		switch ($fields) {
			case 'count':
				return new IntegerType();
			case 'names':
			case 'slugs':
			case 'id=>name':
			case 'id=>slug':
				return new ArrayType(new IntegerType(), new StringType());
			case 'ids':
			case 'tt_ids':
			case 'id=>parent':
				return new ArrayType(new IntegerType(), new IntegerType());
			case 'all':
			case 'all_with_object_id':
			default:
				return new ArrayType(new IntegerType(), new ObjectType('WP_Term'));
		}
	}
}
