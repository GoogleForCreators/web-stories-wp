<?php
/**
 * Interface PluginDeactivationAware.
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
 * Something that can be deactivated.
 *
 * By tagging a service with this interface, the system will automatically hook
 * it up to the WordPress deactivation hook.
 *
 * This way, we can just add the simple interface marker and not worry about how
 * to wire up the code to reach that part during the static deactivation hook.
 *
 * @internal
 *
 * @since 1.6.0
 */
interface PluginDeactivationAware {

	/**
	 * Act on plugin deactivation.
	 *
	 * @since 1.6.0
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 */
	public function on_plugin_deactivation( bool $network_wide ): void;
}
