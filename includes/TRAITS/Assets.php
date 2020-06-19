<?php
/**
 * Trait Assets
 *
 * @package   Google\Web_Stories\TRAITS
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2020 Google LLC
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

namespace Google\Web_Stories\TRAITS;

/**
 * Trait Assets
 *
 * @package Google\Web_Stories\TRAITS
 */
trait Assets {
	/**
	 * Helper method to load assets based on a handle.
	 *
	 * @param string $handle Handle of script.
	 * @param array  $extra_dependencies Array of extra dependencies.
	 */
	public function load_assert( $handle, array $extra_dependencies = [] ) {
		$asset_file   = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/js/' . $handle . '.asset.php';
		$asset        = is_readable( $asset_file ) ? require $asset_file : [];
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$version      = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;

		$dependencies = array_merge( $dependencies, $extra_dependencies );

		wp_enqueue_script(
			$handle,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/' . $handle . '.js',
			$dependencies,
			$version,
			false
		);

		wp_set_script_translations( $handle, 'web-stories' );
	}
}
