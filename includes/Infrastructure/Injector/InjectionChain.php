<?php
/**
 * Final class InjectionChain.
 *
 * @package Google\Web_Stories
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

namespace Google\Web_Stories\Infrastructure\Injector;

use LogicException;

/**
 * The injection chain is similar to a trace, keeping track of what we have done
 * so far and at what depth within the auto-wiring we currently are.
 *
 * It is used to detect circular dependencies, and can also be dumped for
 * debugging information.
 *
 * @since 1.6
 * @internal
 */
final class InjectionChain {

	/**
	 * Chain.
	 *
	 * @var array<string>
	 */
	private $chain = [];

	/**
	 * Resolutions.
	 *
	 * @var array<bool>
	 */
	private $resolutions = [];

	/**
	 * Add class to injection chain.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class Class to add to injection chain.
	 * @return self Modified injection chain.
	 */
	public function add_to_chain( $class ) {
		$new_chain          = clone $this;
		$new_chain->chain[] = $class;

		return $new_chain;
	}

	/**
	 * Add resolution for circular reference detection.
	 *
	 * @since 1.6.0
	 *
	 * @param string $resolution Resolution to add.
	 * @return self Modified injection chain.
	 */
	public function add_resolution( $resolution ) {
		$new_chain                             = clone $this;
		$new_chain->resolutions[ $resolution ] = true;

		return $new_chain;
	}

	/**
	 * Get the last class that was pushed to the injection chain.
	 *
	 * @since 1.6.0
	 *
	 * @return string Last class pushed to the injection chain.
	 * @throws LogicException If the injection chain is accessed too early.
	 */
	public function get_class() {
		if ( empty( $this->chain ) ) {
			throw new LogicException(
				'Access to injection chain before any resolution was made.'
			);
		}

		return \end( $this->chain ) ?: '';
	}

	/**
	 * Get the injection chain.
	 *
	 * @return array Chain of injections.
	 */
	public function get_chain() {
		return \array_reverse( $this->chain );
	}

	/**
	 * Check whether the injection chain already has a given resolution.
	 *
	 * @since 1.6.0
	 *
	 * @param string $resolution Resolution to check for.
	 * @return bool Whether the resolution was found.
	 */
	public function has_resolution( $resolution ) {
		return \array_key_exists( $resolution, $this->resolutions );
	}

	/**
	 * Check whether the injection chain already encountered a class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class Class to check.
	 * @return bool Whether the given class is already part of the chain.
	 */
	public function is_in_chain( $class ) {
		return in_array( $class, $this->chain, true );
	}
}
