<?php
/**
 * Field State Factory Interface
 *
 * Factory for field state types.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

declare(strict_types = 1);

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
