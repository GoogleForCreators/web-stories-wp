<?php
/**
 * Trait Assets
 *
 * @package   Google\Web_Stories\Traits
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

namespace Google\Web_Stories\Traits;

/**
 * Trait Assets
 *
 * @package Google\Web_Stories\Traits
 */
trait Assets {
	/**
	 * Helper method to load assets based on a handle.
	 *
	 * @param string       $script_handle Handle of script.
	 * @param array        $script_dependencies Array of extra dependencies.
	 * @param string|false $style_handle Handle of style.
	 * @param array        $style_dependencies Array of extra dependencies.
	 */
	public function load_asset( $script_handle, array $script_dependencies = [], $style_handle = false, array $style_dependencies = [] ) {
		$asset_file   = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/js/' . $script_handle . '.asset.php';
		$asset        = is_readable( $asset_file ) ? require $asset_file : [];
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$version      = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;

		$dependencies = array_merge( $dependencies, $script_dependencies );

		wp_enqueue_script(
			$script_handle,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/' . $script_handle . '.js',
			$dependencies,
			$version,
			false
		);

		wp_set_script_translations( $script_handle, 'web-stories' );

		if ( $style_handle ) {
			wp_enqueue_style(
				$style_handle,
				WEBSTORIES_PLUGIN_DIR_URL . 'assets/css/' . $style_handle . '.css',
				$style_dependencies,
				$version
			);
		}
	}
}
