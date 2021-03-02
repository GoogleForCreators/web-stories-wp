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
	 * Whether to show the field.
	 *
	 * @since 1.5.0
	 *
	 * @return bool
	 */
	public function show();

	/**
	 * Label for current field.
	 *
	 * @since 1.5.0
	 *
	 * @return string
	 */
	public function label();

	/**
	 * Whether the field is readonly.
	 *
	 * @since 1.5.0
	 *
	 * @return bool
	 */
	public function readonly();
}
