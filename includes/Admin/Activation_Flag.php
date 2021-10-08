<?php
/**
 * Class Activation_Flag.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Infrastructure\PluginActivationAware;
use Google\Web_Stories\Infrastructure\PluginDeactivationAware;
use Google\Web_Stories\Infrastructure\Service;

/**
 * Class Activation_Flag.
 */
class Activation_Flag implements Service, PluginActivationAware, PluginDeactivationAware {
	const OPTION_SHOW_ACTIVATION_NOTICE = 'web_stories_show_activation_notice';

	/**
	 * Act on plugin activation.
	 *
	 * @since 1.13.0
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 * @return void
	 */
	public function on_plugin_activation( $network_wide ){
		$this->set_activation_flag( $network_wide );
	}

	/**
	 * Act on plugin deactivation.
	 *
	 * @since 1.13.0
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 * @return void
	 */
	public function on_plugin_deactivation( $network_wide ){
		$this->delete_activation_flag( $network_wide );
	}

	/**
	 * Sets the flag that the plugin has just been activated.
	 *
	 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
	 *
	 * @since 1.0.0
	 *
	 * @param bool $network_wide Whether the plugin is being activated network-wide.
	 *
	 * @return bool
	 */
	public function set_activation_flag( bool $network_wide = false ): bool {
		if ( $network_wide ) {
			return update_site_option( self::OPTION_SHOW_ACTIVATION_NOTICE, '1' );
		}

		return update_option( self::OPTION_SHOW_ACTIVATION_NOTICE, '1', false );
	}

	/**
	 * Gets the flag that the plugin has just been activated.
	 *
	 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
	 *
	 * @since 1.0.0
	 *
	 * @param bool $network_wide Whether to check the flag network-wide.
	 *
	 * @return bool True if just activated, false otherwise.
	 */
	public function get_activation_flag( bool $network_wide = false ): bool {
		if ( $network_wide ) {
			return (bool) get_site_option( self::OPTION_SHOW_ACTIVATION_NOTICE, false );
		}

		return (bool) get_option( self::OPTION_SHOW_ACTIVATION_NOTICE, false );
	}

	/**
	 * Deletes the flag that the plugin has just been activated.
	 *
	 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
	 *
	 * @since 1.0.0
	 *
	 * @param bool $network_wide Whether the plugin is being deactivated network-wide.
	 *
	 * @return bool True if flag deletion is successful, false otherwise.
	 */
	public function delete_activation_flag( bool $network_wide = false ): bool {
		if ( $network_wide ) {
			return delete_site_option( self::OPTION_SHOW_ACTIVATION_NOTICE );
		}

		return delete_option( self::OPTION_SHOW_ACTIVATION_NOTICE );
	}
}
