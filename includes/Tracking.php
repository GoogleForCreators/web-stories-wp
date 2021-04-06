<?php
/**
 * Tracking class.
 *
 * Used for setting up telemetry.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Integrations\Site_Kit;

/**
 * Tracking class.
 */
class Tracking extends Service_Base {
	/**
	 * Web Stories tracking script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-tracking';

	/**
	 * Google Analytics property ID.
	 *
	 * @var string
	 */
	const TRACKING_ID = 'UA-168571240-1';

	/**
	 * Google Analytics 4 measurement ID.
	 *
	 * @var string
	 */
	const TRACKING_ID_GA4 = 'G-T88C9951CM';

	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

	/**
	 * Site_Kit instance.
	 *
	 * @var Site_Kit Site_Kit instance.
	 */
	private $site_kit;

	/**
	 * Tracking constructor.
	 *
	 * @since 1.4.0
	 *
	 * @param Experiments $experiments Experiments instance.
	 * @param Site_Kit    $site_kit Site_Kit instance.
	 */
	public function __construct( Experiments $experiments, Site_Kit $site_kit ) {
		$this->experiments = $experiments;
		$this->site_kit    = $site_kit;
	}

	/**
	 * Initializes tracking.
	 *
	 * Registers the setting in WordPress.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register() {
		// By not passing an actual script src we can print only the inline script.
		wp_register_script(
			self::SCRIPT_HANDLE,
			false,
			[],
			WEBSTORIES_VERSION,
			false
		);

		wp_add_inline_script(
			self::SCRIPT_HANDLE,
			'window.webStoriesTrackingSettings = ' . wp_json_encode( $this->get_settings() ) . ';'
		);
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action() {
		return 'admin_init';
	}

	/**
	 * Returns tracking settings to pass to the inline script.
	 *
	 * @since 1.0.0
	 *
	 * @return array Tracking settings.
	 */
	public function get_settings() {
		return [
			'trackingAllowed' => $this->is_active(),
			'trackingId'      => self::TRACKING_ID,
			'trackingIdGA4'   => self::TRACKING_ID_GA4,
			// This doesn't seem to be fully working for web properties.
			// So we send it as both app_version and a user property.
			// See https://support.google.com/analytics/answer/9268042.
			'appVersion'      => WEBSTORIES_VERSION,
			'userProperties'  => $this->get_user_properties(),
		];
	}

	/**
	 * Returns a list of user properties.
	 *
	 * @since 1.4.0
	 *
	 * @return array User properties.
	 */
	private function get_user_properties() {
		$role        = ! empty( wp_get_current_user()->roles ) ? wp_get_current_user()->roles[0] : '';
		$experiments = implode( ',', $this->experiments->get_enabled_experiments() );

		$site_kit_status = $this->site_kit->get_plugin_status();
		$active_plugins  = $site_kit_status['active'] ? 'google-site-kit' : '';
		$analytics       = $site_kit_status['analyticsActive'] ? 'google-site-kit' : ! empty( get_option( Settings::SETTING_NAME_TRACKING_ID ) );

		return [
			'siteLocale'         => get_locale(),
			'userLocale'         => get_user_locale(),
			'userRole'           => $role,
			'enabledExperiments' => $experiments,
			'wpVersion'          => get_bloginfo( 'version' ),
			'phpVersion'         => PHP_VERSION,
			'isMultisite'        => (int) is_multisite(),
			'adNetwork'          => (string) get_option( Settings::SETTING_NAME_AD_NETWORK, 'none' ),
			'analytics'          => $analytics,
			'activePlugins'      => $active_plugins,
		];
	}

	/**
	 * Is tracking active for the current user?
	 *
	 * @return bool True if tracking enabled, and False if not.
	 */
	public function is_active() {
		return (bool) get_user_meta( get_current_user_id(), User_Preferences::OPTIN_META_KEY, true );
	}
}
