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

declare(strict_types = 1);

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
	public function title();

	/**
	 * Get excerpt field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function excerpt();

	/**
	 * Get image alignment field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function image_alignment();

	/**
	 * Get author field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function author();

	/**
	 * Get date field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function date();

	/**
	 * Get archive link field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function archive_link();

	/**
	 * Get sharp corner field along with its state for
	 * current view type.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function sharp_corners();

	/**
	 * Get circle size field along with its state for
	 * current view type.
	 *
	 * @since 1.40.0
	 *
	 * @return Field
	 */
	public function circle_size();

	/**
	 * Get number of columns field along with its state for
	 * current view type.
	 *
	 * @since 1.40.0
	 *
	 * @return Field
	 */
	public function number_of_columns();
}
