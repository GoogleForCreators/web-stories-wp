<?php
/**
 * Field Interface.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Interfaces;

/**
 * Interface Field.
 *
 * @package Google\Web_Stories\Interfaces
 */
interface Field {

	/**
	 * Whether to display the field.
	 *
	 * @since 1.5.0
	 *
	 * @return bool
	 */
	public function show() : bool;

	/**
	 * Label for current field.
	 *
	 * @since 1.5.0
	 *
	 * @return string
	 */
	public function label() : string;

	/**
	 * Whether the field is hidden.
	 *
	 * @since 1.5.0
	 *
	 * @return bool
	 */
	public function hidden() : bool;
}
