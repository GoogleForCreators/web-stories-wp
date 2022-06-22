<?php
/**
 * Interface Plugin
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

namespace Google\Web_Stories\Infrastructure;

/**
 * A plugin is basically nothing more than a convention on how manage the
 * lifecycle of a modular piece of code, so that you can:
 *  1. activate it,
 *  2. register it with the framework, and
 *  3. deactivate it again.
 *
 * This is what this interface represents, by assembling the separate,
 * segregated interfaces for each of these lifecycle actions.
 *
 * Additionally, we provide a means to get access to the plugin's container that
 * collects all the services it is made up of. This allows direct access to the
 * services to outside code if needed.
 *
 * @internal
 *
 * @since 1.6.0
 */
interface Plugin extends PluginActivationAware, PluginDeactivationAware, Registerable, SiteInitializationAware, SiteRemovalAware {

	/**
	 * Get the service container that contains the services that make up the
	 * plugin.
	 *
	 * @since 1.6.0
	 *
	 * @return ServiceContainer<Service> Service container of the plugin.
	 */
	public function get_container(): ServiceContainer;
}
