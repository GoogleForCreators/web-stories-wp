<?php
/**
 * Class Activation_Notice.
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

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tracking;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service as ServiceInterface;
use Google\Web_Stories\Assets;

/**
 * Class Activation_Notice.
 */
class Activation_Notice implements ServiceInterface, Registerable {

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-activation-notice';

	/**
	 * Activation flag instance.
	 *
	 * @var Activation_Flag
	 */
	protected $activation_flag;

	/**
	 * Google_Fonts instance.
	 *
	 * @var Google_Fonts Google_Fonts instance.
	 */
	protected $google_fonts;

	/**
	 * Assets instance.
	 *
	 * @var \Google\Web_Stories\Assets Assets instance.
	 */
	private $assets;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Activation_Flag $activation_flag Activation flag instance.
	 * @param Google_Fonts    $google_fonts   Google_Fonts instance.
	 * @param Assets          $assets          Assets instance.
	 */
	public function __construct( Activation_Flag $activation_flag, Google_Fonts $google_fonts, Assets $assets ) {
		$this->activation_flag = $activation_flag;
		$this->google_fonts    = $google_fonts;
		$this->assets          = $assets;
	}

	/**
	 * Initializes the plugin activation notice.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'admin_notices', [ $this, 'render_notice' ] );
		add_action( 'network_admin_notices', [ $this, 'render_notice' ] );
	}

	/**
	 * Enqueues assets for the plugin activation notice.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook_suffix The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( ! $this->is_plugins_page( $hook_suffix ) || ! $this->activation_flag->get_activation_flag( is_network_admin() ) ) {
			return;
		}

		/**
		 * Prevent the default WordPress "Plugin Activated" notice from rendering.
		 *
		 * @link https://github.com/WordPress/WordPress/blob/e1996633228749cdc2d92bc04cc535d45367bfa4/wp-admin/plugins.php#L569-L570
		 */
		unset( $_GET['activate'] ); // phpcs:ignore WordPress.Security.NonceVerification, WordPress.VIP.SuperGlobalInputUsage

		$font_handle = $this->google_fonts->get_handle();
		$this->assets->enqueue_style( $font_handle );

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
	protected function get_script_settings() {
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
	 *
	 * @return void
	 */
	public function render_notice() {
		global $hook_suffix;

		if ( ! $this->is_plugins_page( $hook_suffix ) ) {
			return;
		}

		$network_wide = is_network_admin();
		$flag         = $this->activation_flag->get_activation_flag( $network_wide );

		if ( ! $flag ) {
			return;
		}

		// Unset the flag so that the notice only shows once.
		$this->activation_flag->delete_activation_flag( $network_wide );

		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/admin/activation-notice.php';
	}

	/**
	 * Determines whether we're currently on the Plugins page or not.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook_suffix Current hook_suffix.
	 *
	 * @return bool Whether we're on the Plugins page.
	 */
	protected function is_plugins_page( $hook_suffix ) {
		return ( ! empty( $hook_suffix ) && 'plugins.php' === $hook_suffix );
	}
}
