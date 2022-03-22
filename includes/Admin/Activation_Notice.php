<?php
/**
 * Class Activation_Notice.
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Assets;
use Google\Web_Stories\Infrastructure\PluginActivationAware;
use Google\Web_Stories\Infrastructure\PluginDeactivationAware;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service as ServiceInterface;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tracking;

/**
 * Class Activation_Notice.
 */
class Activation_Notice implements ServiceInterface, Registerable, PluginActivationAware, PluginDeactivationAware {

	/**
	 * Script handle.
	 */
	public const SCRIPT_HANDLE = 'web-stories-activation-notice';

	/**
	 * Option name.
	 */
	public const OPTION_SHOW_ACTIVATION_NOTICE = 'web_stories_show_activation_notice';

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private $assets;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Assets $assets Assets instance.
	 */
	public function __construct( Assets $assets ) {
		$this->assets = $assets;
	}

	/**
	 * Initializes the plugin activation notice.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'admin_notices', [ $this, 'render_notice' ] );
		add_action( 'network_admin_notices', [ $this, 'render_notice' ] );
	}

	/**
	 * Act on plugin activation.
	 *
	 * @since 1.13.0
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 */
	public function on_plugin_activation( $network_wide ): void {
		$this->set_activation_flag( $network_wide );
	}

	/**
	 * Act on plugin deactivation.
	 *
	 * @since 1.13.0
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 */
	public function on_plugin_deactivation( $network_wide ): void {
		$this->delete_activation_flag( $network_wide );
	}

	/**
	 * Enqueues assets for the plugin activation notice.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_assets( string $hook_suffix ): void {
		if ( ! $this->is_plugins_page( $hook_suffix ) || ! $this->get_activation_flag( is_network_admin() ) ) {
			return;
		}

		/**
		 * Prevent the default WordPress "Plugin Activated" notice from rendering.
		 *
		 * @link https://github.com/WordPress/WordPress/blob/e1996633228749cdc2d92bc04cc535d45367bfa4/wp-admin/plugins.php#L569-L570
		 */
		unset( $_GET['activate'] ); // phpcs:ignore WordPress.Security.NonceVerification, WordPress.VIP.SuperGlobalInputUsage

		$this->assets->enqueue_style( Google_Fonts::SCRIPT_HANDLE );

		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE, [ Tracking::SCRIPT_HANDLE ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesActivationSettings',
			$this->get_script_settings()
		);
	}

	/**
	 * Returns script settings as an array.
	 *
	 * @since 1.0.0
	 *
	 * @return array Script settings.
	 */
	protected function get_script_settings(): array {
		$new_story_url = admin_url(
			add_query_arg(
				[
					'post_type' => Story_Post_Type::POST_TYPE_SLUG,
				],
				'post-new.php'
			)
		);

		$dashboard_url = admin_url(
			add_query_arg(
				[
					'post_type' => Story_Post_Type::POST_TYPE_SLUG,
					'page'      => 'stories-dashboard',
				],
				'edit.php'
			)
		);

		$demo_story_url = admin_url(
			add_query_arg(
				[
					'post_type'        => Story_Post_Type::POST_TYPE_SLUG,
					'web-stories-demo' => 1,
				],
				'post-new.php'
			)
		);

		return [
			'id'         => 'web-stories-plugin-activation-notice',
			'config'     => [
				'isRTL'        => is_rtl(),
				'cdnURL'       => trailingslashit( WEBSTORIES_CDN_URL ),
				'demoStoryURL' => $demo_story_url,
				'newStoryURL'  => $new_story_url,
				'dashboardURL' => $dashboard_url,
			],
			'publicPath' => $this->assets->get_base_url( 'assets/js/' ),
		];
	}

	/**
	 * Renders the plugin activation notice.
	 *
	 * @since 1.0.0
	 */
	public function render_notice(): void {
		global $hook_suffix;

		if ( ! $this->is_plugins_page( $hook_suffix ) ) {
			return;
		}

		$network_wide = is_network_admin();
		$flag         = $this->get_activation_flag( $network_wide );

		if ( ! $flag ) {
			return;
		}

		// Unset the flag so that the notice only shows once.
		$this->delete_activation_flag( $network_wide );

		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/admin/activation-notice.php';
	}

	/**
	 * Determines whether we're currently on the Plugins page or not.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook_suffix Current hook_suffix.
	 * @return bool Whether we're on the Plugins page.
	 */
	protected function is_plugins_page( $hook_suffix ): bool {
		return ( ! empty( $hook_suffix ) && 'plugins.php' === $hook_suffix );
	}

	/**
	 * Sets the flag that the plugin has just been activated.
	 *
	 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
	 *
	 * @since 1.13.0
	 *
	 * @param bool $network_wide Whether the plugin is being activated network-wide.
	 */
	protected function set_activation_flag( bool $network_wide = false ): bool {
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
	 * @since 1.13.0
	 *
	 * @param bool $network_wide Whether to check the flag network-wide.
	 * @return bool True if just activated, false otherwise.
	 */
	protected function get_activation_flag( bool $network_wide = false ): bool {
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
	 * @since 1.13.0
	 *
	 * @param bool $network_wide Whether the plugin is being deactivated network-wide.
	 * @return bool True if flag deletion is successful, false otherwise.
	 */
	protected function delete_activation_flag( bool $network_wide = false ): bool {
		if ( $network_wide ) {
			return delete_site_option( self::OPTION_SHOW_ACTIVATION_NOTICE );
		}

		return delete_option( self::OPTION_SHOW_ACTIVATION_NOTICE );
	}
}
