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

/**
 * Tracking class.
 */
class Tracking {
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
	 * Tracking constructor.
	 *
	 * @since 1.4.0
	 *
	 * @param Experiments $experiments Experiments instance.
	 */
	public function __construct( Experiments $experiments ) {
		$this->experiments = $experiments;
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
	public function init() {
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
	 * @global string $wp_version WordPress version.
	 *
	 * @return array User properties.
	 */
	private function get_user_properties() {
		global $wp_version;

		$role        = ! empty( wp_get_current_user()->roles ) ? wp_get_current_user()->roles[0] : '';
		$experiments = implode( ',', $this->experiments->get_enabled_experiments() );

		return [
			'siteLocale'         => get_locale(),
			'userLocale'         => get_user_locale(),
			'userRole'           => $role,
			'enabledExperiments' => $experiments,
			'wpVersion'          => $wp_version,
			'phpVersion'         => PHP_VERSION,
			'pluginVersion'      => WEBSTORIES_VERSION,
			'isMultisite'        => (int) is_multisite(),
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
