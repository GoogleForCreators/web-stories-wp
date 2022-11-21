<?php
/**
 * Field Interface.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

declare(strict_types = 1);

namespace Google\Web_Stories\Interfaces;

/**
 * Interface Field.
 */
interface Field {

	/**
	 * Whether to display the field.
	 *
	 * @since 1.5.0
	 */
	public function show(): bool;

	/**
	 * Label for current field.
	 *
	 * @since 1.5.0
	 */
	public function label(): string;

	/**
	 * Whether the field is hidden.
	 *
	 * @since 1.5.0
	 */
	public function hidden(): bool;
}
