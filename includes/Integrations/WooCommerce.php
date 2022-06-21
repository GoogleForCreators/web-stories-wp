<?php
/**
 * Class WooCommerce
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

/**
 * Class WooCommerce.
 */
class
WooCommerce {
	protected const PLUGIN = 'woocommerce/woocommerce.php';

	/**
	 * Determines whether WooCommerce is active.
	 *
	 * @since 1.21.0
	 *
	 * @return bool Whether WooCommerce is active.
	 */
	protected function is_plugin_active(): bool {
		return class_exists( 'WooCommerce', false );
	}

	/**
	 * Returns the WooCommerce plugin status.
	 *
	 * @since 1.21.0
	 *
	 * @return array{installed: bool, active: bool, canManage: bool, link: string} Plugin status.
	 */
	public function get_plugin_status(): array {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$is_installed = \array_key_exists( self::PLUGIN, get_plugins() );
		$is_active    = $this->is_plugin_active();
		$can_manage   = false;
		$link         = '';

		if ( $is_active ) {
			$can_manage = current_user_can( 'manage_woocommerce' );
			if ( $can_manage ) {
				$link = admin_url( 'admin.php?page=wc-admin' );
			}
		} elseif ( $is_installed ) {
			if ( current_user_can( 'activate_plugin', self::PLUGIN ) ) {
				$link = admin_url( 'plugins.php' );
			}
		} elseif ( current_user_can( 'install_plugins' ) ) {
			$link = admin_url(
				add_query_arg(
					[
						's'   => rawurlencode( __( 'WooCommerce', 'web-stories' ) ),
						'tab' => 'search',
					],
					'plugin-install.php'
				)
			);
		} else {
			$link = __( 'https://wordpress.org/plugins/woocommerce/', 'web-stories' );
		}

		return [
			'installed' => $is_active || $is_installed,
			'active'    => $is_active,
			'canManage' => $can_manage,
			'link'      => $link,
		];
	}
}
