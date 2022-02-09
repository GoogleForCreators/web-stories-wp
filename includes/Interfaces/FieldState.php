<?php
/**
 * Field State Interface
 *
 * Renderer fields will change state based on view types.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function title(): Field;

	/**
	 * Get excerpt field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function excerpt(): Field;

	/**
	 * Get image alignment field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function image_alignment(): Field;

	/**
	 * Get author field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function author(): Field;

	/**
	 * Get date field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function date(): Field;

	/**
	 * Get archive link field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function archive_link(): Field;

	/**
	 * Get sharp corner field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function sharp_corners(): Field;
}
