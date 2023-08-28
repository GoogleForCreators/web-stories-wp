<?php
/**
 * Final class InjectionChain.
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

declare(strict_types = 1);

namespace Google\Web_Stories\Infrastructure\Injector;

/**
 * The injection chain is similar to a trace, keeping track of what we have done
 * so far and at what depth within the auto-wiring we currently are.
 *
 * It is used to detect circular dependencies, and can also be dumped for
 * debugging information.
 *
 * @internal
 *
 * @since 1.6.0
 *
 * @template T
 */
final class InjectionChain {

	/**
	 * Chain.
	 *
	 * @var string[]
	 * @phpstan-var class-string<T>[]
	 */
	private array $chain = [];

	/**
	 * Resolutions.
	 *
	 * @var array<bool>
	 * @phpstan-var array<class-string, bool>
	 */
	private array $resolutions = [];

	/**
	 * Add class to injection chain.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class_name Class to add to injection chain.
	 * @return self Modified injection chain.
	 *
	 * @phpstan-param class-string<T> $class_name
	 */
	public function add_to_chain( string $class_name ): self {
		$new_chain          = clone $this;
		$new_chain->chain[] = $class_name;

		return $new_chain;
	}

	/**
	 * Add resolution for circular reference detection.
	 *
	 * @since 1.6.0
	 *
	 * @param string $resolution Resolution to add.
	 * @return self Modified injection chain.
	 *
	 * @phpstan-param class-string $resolution
	 */
	public function add_resolution( string $resolution ): self {
		$new_chain                             = clone $this;
		$new_chain->resolutions[ $resolution ] = true;

		return $new_chain;
	}

	/**
	 * Get the last class that was pushed to the injection chain.
	 *
	 * @since 1.6.0
	 *
	 * @throws \LogicException If the injection chain is accessed too early.
	 *
	 * @return string Last class pushed to the injection chain.
	 *
	 * @phpstan-return class-string<T>
	 */
	public function get_class(): string {
		if ( empty( $this->chain ) ) {
			throw new \LogicException(
				'Access to injection chain before any resolution was made.'
			);
		}

		return \end( $this->chain ) ?: '';
	}

	/**
	 * Get the injection chain.
	 *
	 * @since 1.6.0
	 *
	 * @return string[] Chain of injections.
	 *
	 * @phpstan-return class-string[]
	 */
	public function get_chain(): array {
		return \array_reverse( $this->chain );
	}

	/**
	 * Check whether the injection chain already has a given resolution.
	 *
	 * @since 1.6.0
	 *
	 * @param string $resolution Resolution to check for.
	 * @return bool Whether the resolution was found.
	 *
	 * @phpstan-param class-string<T> $resolution
	 */
	public function has_resolution( string $resolution ): bool {
		return \array_key_exists( $resolution, $this->resolutions );
	}

	/**
	 * Check whether the injection chain already encountered a class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class_name Class to check.
	 * @return bool Whether the given class is already part of the chain.
	 */
	public function is_in_chain( string $class_name ): bool {
		return \in_array( $class_name, $this->chain, true );
	}
}
