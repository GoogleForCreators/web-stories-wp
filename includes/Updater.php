<?php
/**
 * Class Updater
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
 * Plugin updater class.
 *
 * Allows updating from beta releases to the most current version.
 *
 * @todo Remove for stable release.
 */
class Updater {
	/**
	 * Registers functionality through WordPress hooks.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'plugins_api', [ $this, 'plugin_info' ], 10, 3 );
		add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'updater_data' ] );
		add_action( 'load-update-core.php', [ $this, 'clear_plugin_data' ] );
		add_action( 'upgrader_process_complete', [ $this, 'upgrader_process_complete' ], 10, 2 );
	}

	/**
	 * Retrieves plugin information data from custom API endpoint.
	 *
	 * @param false|object|array $value  The result object or array. Default false.
	 * @param string             $action The type of information being requested from the Plugin Installation API.
	 * @param mixed              $args   Plugin API arguments.
	 * @return false|object|array Updated $value, or passed-through $value on failure.
	 */
	public function plugin_info( $value, $action, $args ) {
		list( $plugin_slug ) = explode( '/', plugin_basename( WEBSTORIES_PLUGIN_FILE ) );
		if ( 'plugin_information' !== $action || $plugin_slug !== $args->slug ) {
			return $value;
		}
		$data = $this->fetch_plugin_data();
		if ( ! $data ) {
			return $value;
		}
		$new_data = [
			'slug'          => $plugin_slug,
			'name'          => $data['name'],
			'version'       => $data['version'],
			'author'        => '<a href="https://opensource.google.com">Google</a>',
			'download_link' => $data['download_url'],
			'trunk'         => $data['download_url'],
			'tested'        => $data['tested'],
			'requires'      => $data['requires'],
			'requires_php'  => $data['requires_php'],
			'last_updated'  => $data['last_updated'],
		];
		if ( ! empty( $data['icons'] ) ) {
			$new_data['icons'] = $data['icons'];
		}
		if ( ! empty( $data['banners'] ) ) {
			$new_data['banners'] = $data['banners'];
		}
		if ( ! empty( $data['banners_rtl'] ) ) {
			$new_data['banners_rtl'] = $data['banners_rtl'];
		}
		return (object) $new_data;
	}

	/**
	 * Retrieves plugin update data from custom API endpoint.
	 *
	 * @param mixed $value Update check object.
	 * @return object Modified update check object.
	 */
	public function updater_data( $value ) {
		// Stop here if the current user does not have sufficient capabilities.
		if ( ! current_user_can( 'update_plugins' ) ) {
			return $value;
		}
		$data = $this->fetch_plugin_data();
		if ( ! $data || ! isset( $data['download_url'] ) ) {
			return $value;
		}
		list( $plugin_slug ) = explode( '/', plugin_basename( WEBSTORIES_PLUGIN_FILE ) );
		$new_data            = [
			'id'           => 'https://github.com/google/web-stories-wp',
			'slug'         => $plugin_slug,
			'plugin'       => plugin_basename( WEBSTORIES_PLUGIN_FILE ),
			'new_version'  => $data['version'],
			'url'          => $data['url'],
			'package'      => $data['download_url'],
			'tested'       => $data['tested'],
			'requires'     => $data['requires'],
			'requires_php' => $data['requires_php'],
		];
		if ( ! empty( $data['icons'] ) ) {
			$new_data['icons'] = $data['icons'];
		}
		if ( ! empty( $data['banners'] ) ) {
			$new_data['banners'] = $data['banners'];
		}
		if ( ! empty( $data['banners_rtl'] ) ) {
			$new_data['banners_rtl'] = $data['banners_rtl'];
		}

		$is_plugin_outdated = version_compare( WEBSTORIES_VERSION, $data['version'], '<' );

		// Return data if Web Stories plugin is not up to date.
		if ( $is_plugin_outdated && is_wp_version_compatible( $data['requires'] ) && is_php_version_compatible( $data['requires_php'] ) ) {
			$value->response[ plugin_basename( WEBSTORIES_PLUGIN_FILE ) ] = (object) $new_data;
		} else {
			$value->no_update[ plugin_basename( WEBSTORIES_PLUGIN_FILE ) ] = (object) $new_data;
		}
		return $value;
	}

	/**
	 * Gets plugin data from the API.
	 *
	 * @return array|false Associative array of plugin data, or false on failure.
	 */
	private function fetch_plugin_data() {
		$data = get_site_transient( 'web_stories_updater' );
		// Query our custom endpoint if the transient is expired.
		if ( empty( $data ) ) {
			$response = wp_remote_get( 'https://google.github.io/web-stories-wp/service/plugin-updates.json' ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_remote_get_wp_remote_get
			// Retrieve data from the body and decode json format.
			$data = json_decode( wp_remote_retrieve_body( $response ), true );
			// Stop here if there is an error, set a temporary transient and bail out.
			if ( is_wp_error( $response ) || isset( $data['error'] ) || ! isset( $data['version'] ) ) {
				set_site_transient( 'web_stories_updater', [ 'version' => WEBSTORIES_VERSION ], 30 * MINUTE_IN_SECONDS );
				return false;
			}
			set_site_transient( 'web_stories_updater', $data, DAY_IN_SECONDS );
		}
		return $data;
	}

	/**
	 * Clears plugin data transient.
	 *
	 * @return void
	 */
	public function clear_plugin_data() {
		delete_site_transient( 'web_stories_updater' );
	}

	/**
	 * Callback for when updates are finished.
	 *
	 * @param \WP_Upgrader $upgrader Upgrader instance.
	 * @param array        $options  Upgrader event data.
	 * @return void
	 */
	public function upgrader_process_complete( $upgrader, $options ) {
		if (
			'update' !== $options['action'] ||
			'plugin' !== $options['type'] ||
			! isset( $options['plugins'] ) ||
			! in_array( plugin_basename( WEBSTORIES_PLUGIN_FILE ), $options['plugins'], true )
		) {
			return;
		}
		$this->clear_plugin_data();
	}
}
