<?php
/**
 * Interface Instantiator.
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

namespace Google\Web_Stories\Infrastructure;

/**
 * Interface to make the act of instantiation extensible/replaceable.
 *
 * This way, a more elaborate mechanism can be plugged in, like using
 * ProxyManager to instantiate proxies instead of actual objects.
 *
 * @since 1.6
 * @internal
 */
interface Instantiator {

	/**
	 * Make an object instance out of an interface or class.
	 *
	 * @since 1.6.0
	 *
	 * @param string $class        Class to make an object instance out of.
	 * @param array  $dependencies Optional. Dependencies of the class.
	 * @return object Instantiated object.
	 */
	public function instantiate( $class, $dependencies = [] );
}
