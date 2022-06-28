<?php
/**
 * Class Site_Kit
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Analytics;
use Google\Web_Stories\Context;
use Google\Web_Stories\Service_Base;

/**
 * Class Site_Kit.
 *
 * @phpstan-type GtagOpt array{
 *   vars: array{
 *     gtag_id?: string
 *   },
 *   triggers?: array<string, mixed>
 * }
 */
class Site_Kit extends Service_Base {
	/**
	 * Analytics instance.
	 *
	 * @var Analytics
	 */
	protected $analytics;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Constructor.
	 *
	 * @param Analytics $analytics Analytics instance.
	 * @param Context   $context   Context instance.
	 */
	public function __construct( Analytics $analytics, Context $context ) {
		$this->analytics = $analytics;
		$this->context   = $context;
	}

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 */
	public function register(): void {
		add_filter( 'googlesitekit_amp_gtag_opt', [ $this, 'filter_site_kit_gtag_opt' ] );

		if ( $this->is_analytics_module_active() ) {
			remove_action( 'web_stories_print_analytics', [ $this->analytics, 'print_analytics_tag' ] );
		}
	}

	/**
	 * Determines whether Site Kit is active.
	 *
	 * @since 1.2.0
	 *
	 * @return bool Whether Site Kit is active.
	 */
	protected function is_plugin_active(): bool {
		return \defined( 'GOOGLESITEKIT_VERSION' );
	}


	/**
	 * Determines whether the built-in adsense module in Site Kit is active.
	 *
	 * @since 1.8.0
	 *
	 * @return bool Whether Site Kit's analytics module is active.
	 */
	protected function is_adsense_module_active(): bool {
		$adsense_module_active       = \in_array( 'adsense', $this->get_site_kit_active_modules_option(), true );
		$adsense_options             = (array) get_option( 'googlesitekit_adsense_settings' );
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
	protected function is_analytics_module_active(): bool {
		$analytics_module_active = \in_array( 'analytics', $this->get_site_kit_active_modules_option(), true );
		$analytics_options       = (array) get_option( 'googlesitekit_analytics_settings' );
		$analytics_use_snippet   = ! empty( $analytics_options['useSnippet'] );

		return $analytics_module_active && $analytics_use_snippet;
	}

	/**
	 * Filters Site Kit's Google Analytics configuration.
	 *
	 * @since 1.2.0
	 *
	 * @param array|mixed $gtag_opt Array of gtag configuration options.
	 * @return array|mixed Modified configuration options.
	 *
	 * @phpstan-param GtagOpt $gtag_opt
	 */
	public function filter_site_kit_gtag_opt( $gtag_opt ) {
		if (
			! \is_array( $gtag_opt ) ||
			! isset( $gtag_opt['vars']['gtag_id'] ) ||
			! $this->context->is_web_story()
		) {
			return $gtag_opt;
		}

		$default_config             = $this->analytics->get_default_configuration( $gtag_opt['vars']['gtag_id'] );
		$default_config['triggers'] = $default_config['triggers'] ?? [];

		$gtag_opt['triggers'] = $gtag_opt['triggers'] ?? [];
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
	 * @since 1.2.0
	 *
	 * @see \Google\Site_Kit\Core\Modules\Modules::get_active_modules_option
	 *
	 * @return string[] List of active module slugs.
	 */
	protected function get_site_kit_active_modules_option(): array {
		if ( ! $this->is_plugin_active() ) {
			return [];
		}

		/**
		 * Option value.
		 *
		 * @var string[]|false $option
		 */
		$option = get_option( 'googlesitekit_active_modules' );

		if ( \is_array( $option ) ) {
			return $option;
		}

		/**
		 * Legacy option value.
		 *
		 * @var string[]|false $legacy_option
		 */
		$legacy_option = get_option( 'googlesitekit-active-modules' );

		if ( \is_array( $legacy_option ) ) {
			return $legacy_option;
		}

		return [];
	}

	/**
	 * Returns the Site Kit plugin status.
	 *
	 * @since 1.2.0
	 *
	 * @return array{installed: bool, active: bool, analyticsActive: bool, adsenseActive: bool, analyticsLink: string, adsenseLink: string} Plugin status.
	 */
	public function get_plugin_status(): array {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$is_installed        = \array_key_exists( 'google-site-kit/google-site-kit.php', get_plugins() );
		$is_active           = $this->is_plugin_active();
		$is_analytics_active = $this->is_analytics_module_active();
		$is_adsense_active   = $this->is_adsense_module_active();

		$analytics_link = __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' );
		$adsense_link   = __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' );
		$dashboard      = admin_url( 'admin.php?page=googlesitekit-dashboard' );
		$settings       = admin_url( 'admin.php?page=googlesitekit-settings' );

		if ( $is_active ) {
			$dashboard_capability = current_user_can( 'googlesitekit_view_dashboard' );
			$settings_capability  = current_user_can( 'googlesitekit_manage_options' );

			// If analytics is active and current user can view dashboard.
			if ( $is_analytics_active && $dashboard_capability ) {
				$analytics_link = $dashboard;
			} elseif ( $settings_capability ) {
				$analytics_link = $settings;
			} elseif ( $dashboard_capability ) {
				$analytics_link = $dashboard;
			}

			// If adsense is active and current user can view dashboard.
			if ( $is_adsense_active && $dashboard_capability ) {
				$adsense_link = $dashboard;
			} elseif ( $settings_capability ) {
				$adsense_link = $settings;
			} elseif ( $dashboard_capability ) {
				$adsense_link = $dashboard;
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
						's'   => rawurlencode( __( 'Site Kit by Google', 'web-stories' ) ),
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
