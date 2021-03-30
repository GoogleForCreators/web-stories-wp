<?php
/**
 * Interface Deactivateable.
 *
 * @package   Google\Web_Stories
 * @copyright 2019 Alain Schlesser
 * @license   MIT
 * @link      https://www.mwpd.io/
 */

/**
 * Original code modified for this project.
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

namespace Google\Web_Stories\Infrastructure;

/**
 * Something that can be deactivated.
 *
 * By tagging a service with this interface, the system will automatically hook
 * it up to the WordPress deactivation hook.
 *
 * This way, we can just add the simple interface marker and not worry about how
 * to wire up the code to reach that part during the static deactivation hook.
 *
 * @since 1.6
 * @internal
 */
interface Deactivateable {

	/**
	 * Deactivate the service.
	 *
	 * @since 1.6.0
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 * @return void
	 */
	public function deactivate( $network_wide );
}
