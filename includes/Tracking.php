<?php
/**
 * Tracking class.
 *
 * Used for setting up telemetry.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

declare(strict_types = 1);

namespace Google\Web_Stories;

use Google\Web_Stories\Integrations\Site_Kit;
use Google\Web_Stories\Integrations\WooCommerce;
use Google\Web_Stories\User\Preferences;
use WP_User;

/**
 * Tracking class.
 */
class Tracking extends Service_Base {
	/**
	 * Web Stories tracking script handle.
	 */
	public const SCRIPT_HANDLE = 'web-stories-tracking';

	/**
	 * Google Analytics property ID.
	 */
	public const TRACKING_ID = 'UA-168571240-1';

	/**
	 * Google Analytics 4 measurement ID.
	 */
	public const TRACKING_ID_GA4 = 'G-T88C9951CM';

	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private Experiments $experiments;

	/**
	 * Site_Kit instance.
	 *
	 * @var Site_Kit Site_Kit instance.
	 */
	private Site_Kit $site_kit;

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private Assets $assets;

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private Settings $settings;

	/**
	 * Preferences instance.
	 *
	 * @var Preferences Preferences instance.
	 */
	private Preferences $preferences;

	/**
	 * WooCommerce instance.
	 *
	 * @var WooCommerce WooCommerce instance.
	 */
	private WooCommerce $woocommerce;

	/**
	 * Tracking constructor.
	 *
	 * @since 1.4.0
	 *
	 * @param Experiments $experiments Experiments instance.
	 * @param Site_Kit    $site_kit    Site_Kit instance.
	 * @param Assets      $assets      Assets instance.
	 * @param Settings    $settings    Settings instance.
	 * @param Preferences $preferences Preferences instance.
	 * @param WooCommerce $woocommerce WooCommerce instance.
	 */
	public function __construct(
		Experiments $experiments,
		Site_Kit $site_kit,
		Assets $assets,
		Settings $settings,
		Preferences $preferences,
		WooCommerce $woocommerce
	) {
		$this->assets      = $assets;
		$this->experiments = $experiments;
		$this->site_kit    = $site_kit;
		$this->settings    = $settings;
		$this->preferences = $preferences;
		$this->woocommerce = $woocommerce;
	}

	/**
	 * Initializes tracking.
	 *
	 * Registers the setting in WordPress.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		// By not passing an actual script src we can print only the inline script.
		$this->assets->register_script(
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
	public static function get_registration_action(): string {
		return 'admin_init';
	}

	/**
	 * Returns tracking settings to pass to the inline script.
	 *
	 * @since 1.0.0
	 *
	 * @return array<string, array<string, bool|int|string>|bool|string> Tracking settings.
	 */
	public function get_settings(): array {
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
	 * Is tracking active for the current user?
	 *
	 * @return bool True if tracking enabled, and False if not.
	 */
	public function is_active(): bool {
		return (bool) $this->preferences->get_preference( get_current_user_id(), Preferences::OPTIN_META_KEY );
	}

	/**
	 * Returns a list of user properties.
	 *
	 * @since 1.4.0
	 *
	 * @return array<string, string|int|bool> User properties.
	 */
	private function get_user_properties(): array {
		/**
		 * Current user.
		 *
		 * @var null|WP_User $current_user
		 */
		$current_user = wp_get_current_user();
		$roles        = $current_user instanceof WP_User ? $current_user->roles : [];
		$role         = ! empty( $roles ) && \is_array( $roles ) ? array_shift( $roles ) : '';
		$experiments  = implode( ',', $this->experiments->get_enabled_experiments() );

		$active_plugins = [];

		$woocommerce_status = $this->woocommerce->get_plugin_status();
		if ( $woocommerce_status['active'] ) {
			$active_plugins[] = 'woocommerce';
		}

		$site_kit_status = $this->site_kit->get_plugin_status();
		$analytics       = $site_kit_status['analyticsActive'] ? 'google-site-kit' : ! empty( $this->settings->get_setting( $this->settings::SETTING_NAME_TRACKING_ID ) );
		if ( $site_kit_status['active'] ) {
			$active_plugins[] = 'google-site-kit';
		}

		/**
		 * Ad network type.
		 *
		 * @var string $ad_network
		 */
		$ad_network = $this->settings->get_setting( $this->settings::SETTING_NAME_AD_NETWORK, 'none' );

		return [
			'siteLocale'         => get_locale(),
			'userLocale'         => get_user_locale(),
			'userRole'           => $role,
			'enabledExperiments' => $experiments,
			'wpVersion'          => (string) get_bloginfo( 'version' ),
			'phpVersion'         => (string) PHP_VERSION,
			'isMultisite'        => (int) is_multisite(),
			'serverEnvironment'  => wp_get_environment_type(),
			'adNetwork'          => $ad_network,
			'analytics'          => $analytics,
			'activePlugins'      => implode( ',', $active_plugins ),
		];
	}
}
