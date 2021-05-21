<?php
/**
 * Class Site_Kit
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Analytics;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class Site_Kit.
 */
class Site_Kit extends Service_Base {
	/**
	 * Analytics instance.
	 *
	 * @var Analytics
	 */
	protected $analytics;

	/**
	 * Constructor.
	 *
	 * @param Analytics $analytics Analytics instance.
	 */
	public function __construct( Analytics $analytics ) {
		$this->analytics = $analytics;
	}

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function register() {
		add_filter( 'googlesitekit_amp_gtag_opt', [ $this, 'filter_site_kit_gtag_opt' ] );

		if ( $this->is_analytics_module_active() ) {
			remove_action( 'web_stories_print_analytics', [ $this->analytics, 'print_analytics_tag' ] );
		}
		$this->is_adsense_module_active();
	}

	/**
	 * Determines whether Site Kit is active.
	 *
	 * @since 1.2.0
	 *
	 * @return bool Whether Site Kit is active.
	 */
	protected function is_plugin_active() {
		return defined( 'GOOGLESITEKIT_VERSION' );
	}


	/**
	 * Determines whether the built-in adsense module in Site Kit is active.
	 *
	 * @since 1.8.0
	 *
	 * @return bool Whether Site Kit's analytics module is active.
	 */
	protected function is_adsense_module_active() {
		$adsense_module_active       = in_array( 'adsense', $this->get_site_kit_active_modules_option(), true );
		$adsense_options             = get_option( 'googlesitekit_adsense_settings' );
		$adsense_options_client_id   = ! empty( $adsense_options['clientID'] );
		$adsense_options_use_snippet = ! empty( $adsense_options['useSnippet'] );
		$adsense_web_stories_ad_unit = ! empty( $adsense_options['webStoriesAdUnit'] );

		return $adsense_module_active && $adsense_options_use_snippet && $adsense_web_stories_ad_unit && $adsense_options_client_id;
	}

	/**
	 * Determines whether the built-in Analytics module in Site Kit is active.
	 *
	 * @since 1.2.0
	 *
	 * @return bool Whether Site Kit's analytics module is active.
	 */
	protected function is_analytics_module_active() {
		$analytics_module_active = in_array( 'analytics', $this->get_site_kit_active_modules_option(), true );
		$analytics_options       = get_option( 'googlesitekit_analytics_settings' );
		$analytics_use_snippet   = ! empty( $analytics_options['useSnippet'] );

		return $analytics_module_active && $analytics_use_snippet;
	}

	/**
	 * Filters Site Kit's Google Analytics configuration.
	 *
	 * @since 1.2.0
	 *
	 * @param array $gtag_opt Array of gtag configuration options.
	 *
	 * @return array Modified configuration options.
	 */
	public function filter_site_kit_gtag_opt( $gtag_opt ) {
		if ( ! is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return $gtag_opt;
		}

		$default_config             = $this->analytics->get_default_configuration( $gtag_opt['vars']['gtag_id'] );
		$default_config['triggers'] = isset( $default_config['triggers'] ) ? $default_config['triggers'] : [];

		$gtag_opt['triggers'] = isset( $gtag_opt['triggers'] ) ? $gtag_opt['triggers'] : [];
		$gtag_opt['triggers'] = array_merge(
			$default_config['triggers'],
			$gtag_opt['triggers']
		);

		return $gtag_opt;
	}

	/**
	 * Gets the option containing the active Site Kit modules.
	 *
	 * Checks two options as it was renamed at some point in Site Kit.
	 *
	 * Bails early if the Site Kit plugin itself is not active.
	 *
	 * @see \Google\Site_Kit\Core\Modules\Modules::get_active_modules_option
	 *
	 * @since 1.2.0
	 *
	 * @return array List of active module slugs.
	 */
	protected function get_site_kit_active_modules_option() {
		if ( ! $this->is_plugin_active() ) {
			return [];
		}

		$option = get_option( 'googlesitekit_active_modules' );

		if ( is_array( $option ) ) {
			return $option;
		}

		$legacy_option = get_option( 'googlesitekit-active-modules' );

		if ( is_array( $legacy_option ) ) {
			return $legacy_option;
		}

		return [];
	}

	/**
	 * Returns the Site Kit plugin status.
	 *
	 * @since 1.2.0
	 *
	 * @return array Plugin status.
	 */
	public function get_plugin_status() {
		$is_installed        = array_key_exists( 'google-site-kit/google-site-kit.php', get_plugins() );
		$is_active           = $this->is_plugin_active();
		$is_analytics_active = $this->is_analytics_module_active();
		$is_adsense_active   = $this->is_adsense_module_active();

		$analytics_link = __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' );
		$adsense_link   = __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' );
		$dashboard      = admin_url( 'admin.php?page=googlesitekit-dashboard' );
		$settings       = admin_url( 'admin.php?page=googlesitekit-settings' );

		if ( $is_active ) {
			if ( $is_analytics_active ) {
				if ( current_user_can( 'googlesitekit_view_dashboard' ) ) {
					$analytics_link = $dashboard;
				}
			}

			if ( $is_adsense_active ) {
				if ( current_user_can( 'googlesitekit_view_dashboard' ) ) {
					$adsense_link = $dashboard;
				}
			}

			if ( current_user_can( 'googlesitekit_manage_options' ) ) {
				$analytics_link = $settings;
				$adsense_link   = $settings;
			} elseif ( current_user_can( 'googlesitekit_view_dashboard' ) ) {
				$analytics_link = $dashboard;
				$adsense_link   = $dashboard;
			}
		} elseif ( $is_installed ) {
			if ( current_user_can( 'activate_plugin', 'google-site-kit/google-site-kit.php' ) ) {
				$analytics_link = admin_url( 'plugins.php' );
				$adsense_link   = $analytics_link;
			}
		} elseif ( current_user_can( 'install_plugins' ) ) {
			$analytics_link = admin_url(
				add_query_arg(
					[
						's'   => urlencode( __( 'Site Kit by Google', 'web-stories' ) ),
						'tab' => 'search',
					],
					'plugin-install.php'
				)
			);
			$adsense_link   = $analytics_link;
		}

		return [
			'installed'       => $is_active || $is_installed,
			'active'          => $is_active,
			'analyticsActive' => $is_analytics_active,
			'adsenseActive'   => $is_adsense_active,
			'analyticsLink'   => $analytics_link,
			'adsenseLink'     => $adsense_link,
		];
	}
}
