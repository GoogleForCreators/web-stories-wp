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
	 * @since 1.0.0
	 *
	 * @param string $handle Script handle.
	 *
	 * @return array Array containing combined contents of "<$handle>.asset.php" and "<$handle>.chunks.php".
	 */
	protected function get_asset_metadata( $handle ) {
		$base_path = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/js/' . $handle;

		$asset_file  = $base_path . '.asset.php';
		$chunks_file = $base_path . '.chunks.php';
		$asset       = is_readable( $asset_file ) ? require $asset_file : [];
		$chunks      = is_readable( $chunks_file ) ? require $chunks_file : [];

		$asset['dependencies'] = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$asset['version']      = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;
		$asset['js']           = isset( $chunks['js'] ) ? $chunks['js'] : [];
		$asset['css']          = isset( $chunks['css'] ) ? $chunks['css'] : [];

		return $asset;
	}

	/**
	 * Register script using handle.
	 *
	 * @since 1.0.0
	 *
	 * @param string $script_handle Handle of script.
	 * @param array  $script_dependencies Array of extra dependencies.
	 *
	 * @return array Asset metadata of the script.
	 */
	public function register_script( $script_handle, array $script_dependencies = [] ) {
		$base_script_path = WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/';

		$asset   = $this->get_asset_metadata( $script_handle );
		$version = $asset['version'];

		// Register any chunks of $script_handle first.
		foreach ( $asset['js'] as $script_chunk ) {
			wp_register_script(
				$script_chunk,
				$base_script_path . $script_chunk . '.js',
				[],
				$version
			);
		}
		$dependencies = array_merge( $asset['dependencies'], $script_dependencies, $asset['js'] );

		wp_register_script(
			$script_handle,
			$base_script_path . $script_handle . '.js',
			$dependencies,
			$version,
			false
		);

		wp_set_script_translations( $script_handle, 'web-stories' );

		return $asset;
	}

	/**
	 * Enqueue script using handle.
	 *
	 * @since 1.0.0
	 *
	 * @param string $script_handle Handle of script.
	 * @param array  $script_dependencies Array of extra dependencies.
	 *
	 * @return array Array containing $script_handle and all dependent script chunk handles.
	 */
	public function enqueue_script( $script_handle, array $script_dependencies = [] ) {
		$asset = $this->register_script( $script_handle, $script_dependencies );

		// Enqueue chunks of $script_handle.
		$script_chunks = $asset['js'];
		foreach ( $script_chunks as $chunk ) {
			wp_enqueue_script( $chunk );
		}

		wp_enqueue_script( $script_handle );

		return array_merge( [ $script_handle ], $script_chunks );
	}

	/**
	 * Register style using handle.
	 *
	 * @since 1.0.0
	 *
	 * @param string $style_handle Handle of style.
	 * @param array  $style_dependencies Array of extra dependencies.
	 *
	 * @return array Asset metadata of the style.
	 */
	public function register_style( $style_handle, array $style_dependencies = [] ) {
		$base_style_path = WEBSTORIES_PLUGIN_DIR_URL . 'assets/css/';

		$asset   = $this->get_asset_metadata( $style_handle );
		$version = $asset['version'];

		// Register any chunks of $style_handle first.
		foreach ( $asset['css'] as $style_chunk ) {
			wp_register_style(
				$style_chunk,
				$base_style_path . $style_chunk . '.css',
				[],
				$version
			);
		}
		$style_dependencies = array_merge( $style_dependencies, $asset['css'] );

		wp_register_style(
			$style_handle, 
			$base_style_path . $style_handle . '.css', 
			$style_dependencies, 
			$version
		);

		return $asset;
	}

	/**
	 * Enqueue style using handle.
	 *
	 * @since 1.0.0
	 *
	 * @param string $style_handle Handle of style.
	 * @param array  $style_dependencies Array of extra dependencies.
	 *
	 * @return void
	 */
	public function enqueue_style( $style_handle, array $style_dependencies = [] ) {
		$asset = $this->register_style( $style_handle, $style_dependencies );

		// Enqueue chunks of $style_handle.
		$style_chunks = $asset['css'];
		foreach ( $style_chunks as $chunk ) {
			wp_enqueue_style( $chunk );
		}

		wp_enqueue_style( $style_handle );
	}

	/**
	 * Remove admin styles.
	 *
	 * @since 1.0.0
	 *
	 * @param array $styles Array to style to be removed.
	 *
	 * @return void
	 */
	public function remove_admin_style( array $styles ) {
		wp_styles()->registered['wp-admin']->deps = array_diff( wp_styles()->registered['wp-admin']->deps, $styles );
	}
}
