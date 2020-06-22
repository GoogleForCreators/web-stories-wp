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
	 * Get asset metadata.
	 *
	 * @param string $handle Script handle.
	 *
	 * @return array
	 */
	protected function get_asset_metadata( $handle ) {
		$asset_file            = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/js/' . $handle . '.asset.php';
		$asset                 = is_readable( $asset_file ) ? require $asset_file : [];
		$asset['dependencies'] = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$asset['version']      = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;

		return $asset;
	}

	/**
	 * Register script using handle.
	 *
	 * @param string $script_handle Handle of script.
	 * @param array  $script_dependencies Array of extra dependencies.
	 *
	 * @return void
	 */
	public function register_script( $script_handle, array $script_dependencies = [] ) {
		$asset        = $this->get_asset_metadata( $script_handle );
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$version      = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;
		$dependencies = array_merge( $dependencies, $script_dependencies );

		wp_register_script(
			$script_handle,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/' . $script_handle . '.js',
			$dependencies,
			$version,
			false
		);

		wp_set_script_translations( $script_handle, 'web-stories' );
	}

	/**
	 * Enqueue script using handle.
	 *
	 * @param string $script_handle Handle of script.
	 * @param array  $script_dependencies Array of extra dependencies.
	 *
	 * @return void
	 */
	public function enqueue_script( $script_handle, array $script_dependencies = [] ) {
		$this->register_script( $script_handle, $script_dependencies );
		wp_enqueue_script( $script_handle );
	}

	/**
	 * Register style using handle.
	 *
	 * @param string $style_handle Handle of script.
	 * @param array  $style_dependencies Array of extra dependencies.
	 *
	 * @return void
	 */
	public function register_style( $style_handle, array $style_dependencies = [] ) {
		$asset   = $this->get_asset_metadata( $style_handle );
		$version = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;
		wp_register_style(
			$style_handle,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/css/' . $style_handle . '.css',
			$style_dependencies,
			$version
		);
	}

	/**
	 * Enqueue style using handle.
	 *
	 * @param string $style_handle Handle of style.
	 * @param array  $style_dependencies Array of extra dependencies.
	 *
	 * @return void
	 */
	public function enqueue_style( $style_handle, array $style_dependencies = [] ) {
		$this->register_style( $style_handle, $style_dependencies );
		wp_enqueue_style( $style_handle );
	}
}
