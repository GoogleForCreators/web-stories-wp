<?php
/**
 * Copied from szepeviktor/phpstan-wordpress
 *
 * @copyright Viktor Szépe
 * @license   MIT
 * @link      https://github.com/szepeviktor/phpstan-wordpress
 */

/**
 * Exception thrown when validating a PHPDoc docblock that precedes a hook.
 */

declare(strict_types=1);

namespace SzepeViktor\PHPStan\WordPress;

// phpcs:ignore SlevomatCodingStandard.Classes.SuperfluousExceptionNaming.SuperfluousSuffix
class HookDocsParamException extends \DomainException
{
}
