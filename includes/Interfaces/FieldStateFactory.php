<?php
/**
 * Field State Factory Interface
 *
 * Factory for field state types.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Interfaces;

/**
 * Interface FieldState.
 */
interface FieldStateFactory {

	/**
	 * Get field state by title.
	 *
	 * @since 1.5.0
	 *
	 * @return FieldState
	 */
	public function get_field();
}
