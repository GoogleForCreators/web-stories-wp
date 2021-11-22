<?php

/**
 * Set return type of apply_filters() based on its optional preceding docblock.
 */

declare(strict_types=1);

namespace PHPStan\WordPress;

use PhpParser\Node\Expr\FuncCall;
use PHPStan\Analyser\Scope;
use PHPStan\Reflection\FunctionReflection;
use PHPStan\Type\FileTypeMapper;
use PHPStan\Type\Type;
use PHPStan\Type\MixedType;

class ApplyFiltersDynamicFunctionReturnTypeExtension implements \PHPStan\Type\DynamicFunctionReturnTypeExtension
{
	/** @var \PHPStan\Type\FileTypeMapper */
	protected $fileTypeMapper;

	public function __construct(FileTypeMapper $fileTypeMapper)
	{
		$this->fileTypeMapper = $fileTypeMapper;
	}

	public function isFunctionSupported(FunctionReflection $functionReflection): bool
	{
		return in_array(
			$functionReflection->getName(),
			[
				'apply_filters',
				'apply_filters_deprecated',
				'apply_filters_ref_array',
			],
			true
		);
	}

	// phpcs:ignore SlevomatCodingStandard.Functions.UnusedParameter
	public function getTypeFromFunctionCall(FunctionReflection $functionReflection, FuncCall $functionCall, Scope $scope): Type
	{
		$default = new MixedType();
		$comment = self::getNullableNodeComment($functionCall);

		if ($comment === null) {
			return $default;
		}

		// Fetch the docblock contents.
		$code = $comment->getText();

		// Resolve the docblock in scope.
		$classReflection = $scope->getClassReflection();
		$traitReflection = $scope->getTraitReflection();
		$resolvedPhpDoc = $this->fileTypeMapper->getResolvedPhpDoc(
			$scope->getFile(),
			($scope->isInClass() && $classReflection !== null) ? $classReflection->getName() : null,
			($scope->isInTrait() && $traitReflection !== null) ? $traitReflection->getName() : null,
			$scope->getFunctionName(),
			$code
		);

		// Fetch the `@param` values from the docblock.
		$params = $resolvedPhpDoc->getParamTags();

		foreach ($params as $param) {
			return $param->getType();
		}

		return $default;
	}

	private static function getNullableNodeComment(FuncCall $node): ?\PhpParser\Comment\Doc
	{
		$startLine = $node->getStartLine();

		while ($node !== null && $node->getStartLine() === $startLine) {
			// Fetch the docblock from the node.
			$comment = $node->getDocComment();

			if ($comment !== null) {
				return $comment;
			}

			/** @var \PhpParser\Node|null */
			$node = $node->getAttribute('parent');
		}

		return null;
	}
}
