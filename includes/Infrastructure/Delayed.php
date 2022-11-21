<?php
/**
 * Interface Delayed.
 *
 * @link      https://www.mwpd.io/
 *
 * @copyright 2019 Alain Schlesser
 * @license   MIT
 */

/**
 * Original code modified for this project.
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

declare(strict_types = 1);

namespace Google\Web_Stories\Infrastructure;

/**
 * Something that is delayed to a later point in the execution flow.
 *
 * A class marked as being delayed can return the action at which it requires
 * to be registered.
 *
 * This can be used to only register a given object after certain contextual
 * requirements are met, like registering a frontend rendering service only
 * after the loop has been set up.
 *
 * @internal
 *
 * @since 1.6.0
 */
interface Delayed {

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string;


	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int;
}
