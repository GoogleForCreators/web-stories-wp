<?php
/**
 * Copied from szepeviktor/phpstan-wordpress
 *
 * @copyright Viktor Szépe
 * @license   MIT
 * @link      https://github.com/szepeviktor/phpstan-wordpress
 */

/**
 * Custom rule to validate a PHPDoc docblock that precedes a hook.
 */

declare(strict_types=1);

namespace SzepeViktor\PHPStan\WordPress;

use PhpParser\Node;
use PhpParser\Node\Arg;
use PhpParser\Node\Expr\FuncCall;
use PHPStan\Analyser\Scope;
use PHPStan\PhpDoc\Tag\ParamTag;
use PHPStan\Rules\RuleErrorBuilder;
use PHPStan\Rules\RuleLevelHelper;
use PHPStan\Type\FileTypeMapper;
use PHPStan\Type\VerbosityLevel;

/**
 * @implements \PHPStan\Rules\Rule<\PhpParser\Node\Expr\FuncCall>
 */
class HookDocsRule implements \PHPStan\Rules\Rule
{
	private const SUPPORTED_FUNCTIONS = [
		'apply_filters',
		'do_action',
	];

	/** @var \SzepeViktor\PHPStan\WordPress\HookDocBlock */
	protected $hookDocBlock;

	/** @var \PHPStan\Rules\RuleLevelHelper */
	protected $ruleLevelHelper;

	/** @var \PhpParser\Node\Expr\FuncCall */
	protected $currentNode;

	/** @var \PHPStan\Analyser\Scope */
	protected $currentScope;

	/** @var \PHPStan\PhpDoc\ResolvedPhpDocBlock $resolvedPhpDoc */
	protected $resolvedPhpDoc;

	public function __construct(
		FileTypeMapper $fileTypeMapper,
		RuleLevelHelper $ruleLevelHelper
	) {
		$this->hookDocBlock = new HookDocBlock($fileTypeMapper);
		$this->ruleLevelHelper = $ruleLevelHelper;
	}

	public function getNodeType(): string
	{
		return FuncCall::class;
	}

	/**
	 * @param \PhpParser\Node\Expr\FuncCall $node
	 * @param \PHPStan\Analyser\Scope       $scope
	 * @return array<int, \PHPStan\Rules\RuleError>
	 */
	public function processNode(Node $node, Scope $scope): array
	{
		$name = $node->name;
		$this->currentNode = $node;
		$this->currentScope = $scope;

		if (!($name instanceof \PhpParser\Node\Name)) {
			return [];
		}

		if (!in_array($name->toString(), self::SUPPORTED_FUNCTIONS, true)) {
			return [];
		}

		$resolvedPhpDoc = $this->hookDocBlock->getNullableHookDocBlock($node, $scope);

		// A docblock is optional.
		if ($resolvedPhpDoc === null) {
			return [];
		}

		return $this->validateDocBlock($resolvedPhpDoc);
	}

	/**
	 * Validates the `@param` tags documented in the given docblock.
	 *
	 * @param \PHPStan\PhpDoc\ResolvedPhpDocBlock $resolvedPhpDoc
	 * @return array<int,\PHPStan\Rules\RuleError>
	 */
	public function validateDocBlock(\PHPStan\PhpDoc\ResolvedPhpDocBlock $resolvedPhpDoc): array
	{
		// Count all documented `@param` tag strings in the docblock.
		$numberOfParamTagStrings = substr_count($resolvedPhpDoc->getPhpDocString(), '* @param ');

		// A docblock with no param tags is allowed and gets skipped.
		if ($numberOfParamTagStrings === 0) {
			return [];
		}

		try {
			$this->validateParamCount($numberOfParamTagStrings);
		} catch (\SzepeViktor\PHPStan\WordPress\HookDocsParamException $e) {
			return [RuleErrorBuilder::message($e->getMessage())->build()];
		}

		// Fetch the parsed `@param` tags from the docblock.
		$paramTags = $resolvedPhpDoc->getParamTags();

		try {
			$this->validateParamDocumentation(count($paramTags), $resolvedPhpDoc);
		} catch (\SzepeViktor\PHPStan\WordPress\HookDocsParamException $e) {
			return [RuleErrorBuilder::message($e->getMessage())->build()];
		}

		$nodeArgs = $this->currentNode->getArgs();
		$errors = [];
		$i = 1;

		foreach ($paramTags as $paramName => $paramTag) {
			try {
				$this->validateSingleParamTag($paramName, $paramTag, $nodeArgs[$i]);
			} catch (\SzepeViktor\PHPStan\WordPress\HookDocsParamException $e) {
				$errors[] = RuleErrorBuilder::message($e->getMessage())->build();
			}

			$i += 1;
		}

		return $errors;
	}

	/**
	 * Validates the number of documented `@param` tags in the docblock.
	 *
	 * @param int $numberOfParamTagStrings
	 *
	 * @throws \SzepeViktor\PHPStan\WordPress\HookDocsParamException When the number of documented tags is incorrect.
	 */
	public function validateParamCount(int $numberOfParamTagStrings): void
	{
		$numberOfParams = count($this->currentNode->getArgs()) - 1;

		// Incorrect number of `@param` tags.
		if ($numberOfParams !== $numberOfParamTagStrings) {
			$message = sprintf(
				'Expected %1$d @param tags, found %2$d.',
				$numberOfParams,
				$numberOfParamTagStrings
			);

			// If the number of param tags doesn't match the number of
			// parameters, bail out early with an error. There's no point
			// trying to reconcile param tags in this situation.
			throw new \SzepeViktor\PHPStan\WordPress\HookDocsParamException($message);
		}
	}

	/**
	 * Validates the number of parsed and valid `@param` tags in the docblock.
	 *
	 * @param int $numberOfParamTags
	 * @param \PHPStan\PhpDoc\ResolvedPhpDocBlock $resolvedPhpDoc
	 *
	 * @throws \SzepeViktor\PHPStan\WordPress\HookDocsParamException When the number of parsed and valid tags is incorrect.
	 */
	public function validateParamDocumentation(
		int $numberOfParamTags,
		\PHPStan\PhpDoc\ResolvedPhpDocBlock $resolvedPhpDoc
	): void {
		$nodeArgs = $this->currentNode->getArgs();
		$numberOfParams = count($nodeArgs) - 1;

		// No invalid `@param` tags.
		if ($numberOfParams === $numberOfParamTags) {
			return;
		}

		// We might have an invalid `@param` tag because it's named `$this`.
		if (strpos($resolvedPhpDoc->getPhpDocString(), ' $this') !== false) {
			foreach ($nodeArgs as $param) {
				if (($param->value instanceof \PhpParser\Node\Expr\Variable) && $param->value->name === 'this') {
					// PHPStan does not detect param tags named `$this`, it skips the tag.
					// We can indirectly detect this by checking the actual parameter name,
					// and if one of them is `$this` assume that's the problem.
					throw new \SzepeViktor\PHPStan\WordPress\HookDocsParamException('@param tag must not be named $this. Choose a descriptive alias, for example $instance.');
				}
			}
		}

		throw new \SzepeViktor\PHPStan\WordPress\HookDocsParamException('One or more @param tags has an invalid name or invalid syntax.');
	}

	/**
	 * Validates a `@param` tag against its actual parameter.
	 *
	 * @param string                       $paramName The param tag name.
	 * @param \PHPStan\PhpDoc\Tag\ParamTag $paramTag  The param tag instance.
	 * @param \PhpParser\Node\Arg          $arg       The actual parameter instance.
	 *
	 * @throws \SzepeViktor\PHPStan\WordPress\HookDocsParamException When the tag is not valid.
	 */
	protected function validateSingleParamTag(string $paramName, ParamTag $paramTag, Arg $arg): void
	{
		$paramTagType = $paramTag->getType();
		$paramType = $this->currentScope->getType($arg->value);
		$accepted = $this->ruleLevelHelper->accepts(
			$paramTagType,
			$paramType,
			$this->currentScope->isDeclareStrictTypes()
		);

		if (! $accepted) {
			$paramTagVerbosityLevel = VerbosityLevel::getRecommendedLevelByType($paramTagType);
			$paramVerbosityLevel = VerbosityLevel::getRecommendedLevelByType($paramType);

			$message = sprintf(
				'@param %1$s $%2$s does not accept actual type of parameter: %3$s.',
				$paramTagType->describe($paramTagVerbosityLevel),
				$paramName,
				$paramType->describe($paramVerbosityLevel)
			);

			throw new \SzepeViktor\PHPStan\WordPress\HookDocsParamException($message);
		}
	}
}
