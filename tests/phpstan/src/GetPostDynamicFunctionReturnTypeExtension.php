<?php
/**
 * Copied from szepeviktor/phpstan-wordpress
 */

/**
 * Set return type of get_post().
 */

namespace PHPStan\WordPress;

use PhpParser\Node\Expr\ConstFetch;
use PhpParser\Node\Expr\FuncCall;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\FunctionReflection;
use PHPStan\Type\Type;
use PHPStan\Type\ArrayType;
use PHPStan\Type\StringType;
use PHPStan\Type\IntegerType;
use PHPStan\Type\MixedType;
use PHPStan\Type\ObjectType;
use PHPStan\Type\NullType;
use PHPStan\Type\TypeCombinator;

class GetPostDynamicFunctionReturnTypeExtension implements \PHPStan\Type\DynamicFunctionReturnTypeExtension
{
	public function isFunctionSupported(FunctionReflection $functionReflection): bool
	{
		return in_array($functionReflection->getName(), ['get_post', 'get_page_by_path'], true);
	}

	// phpcs:ignore SlevomatCodingStandard.Functions.UnusedParameter
	public function getTypeFromFunctionCall(FunctionReflection $functionReflection, FuncCall $functionCall, Scope $scope): Type
	{
		$output = 'OBJECT';
		if (count($functionCall->args) >= 2 && $functionCall->args[1]->value instanceof ConstFetch) {
			$output = $functionCall->args[1]->value->name->getLast();
		}
		if ($output === 'ARRAY_A') {
			return TypeCombinator::union(new ArrayType(new StringType(), new MixedType()), new NullType());
		}
		if ($output === 'ARRAY_N') {
			return TypeCombinator::union(new ArrayType(new IntegerType(), new MixedType()), new NullType());
		}

		return TypeCombinator::union(new ObjectType('WP_Post'), new NullType());
	}
}
