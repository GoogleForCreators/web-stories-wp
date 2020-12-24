<?php
/**
 * Field State Interface
 *
 * Renderer fields will change state based on view types.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Interfaces;

/**
 * Interface FieldState.
 */
interface FieldState {

	/**
	 * Get title field along with its state for
	 * current view type.
	 *
	 * @return Field
	 */
	public function title();

	/**
	 * Get excerpt field along with its state for
	 * current view type.
	 *
	 * @return Field
	 */
	public function excerpt();

	/**
	 * Get image alignment field along with its state for
	 * current view type.
	 *
	 * @return Field
	 */
	public function image_align();

	/**
	 * Get author field along with its state for
	 * current view type.
	 *
	 * @return Field
	 */
	public function author();

	/**
	 * Get date field along with its state for
	 * current view type.
	 *
	 * @return Field
	 */
	public function date();

	/**
	 * Get archive link field along with its state for
	 * current view type.
	 *
	 * @return Field
	 */
	public function archive_link();

	/**
	 * Get sharp corner field along with its state for
	 * current view type.
	 *
	 * @return Field
	 */
	public function sharp_corners();
}
