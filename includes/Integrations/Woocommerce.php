<?php


namespace Google\Web_Stories\Integrations;

class Woocommerce {
	/**
	 * Determines whether Woocommerce is active.
	 *
	 * @since 1.2.0
	 *
	 * @return bool Whether Woocommerce is active.
	 */
	protected function is_plugin_active(): bool {
		return class_exists( 'WooCommerce', false );
	}

	/**
	 * Returns the Woocommerce plugin status.
	 *
	 * @since 1.21.0
	 *
	 * @return array Plugin status.
	 */
	public function get_plugin_status(): array {
		$is_installed = \array_key_exists( 'woocommerce/woocommerce.php', get_plugins() );
		$is_active    = $this->is_plugin_active();

		return [
			'installed' => $is_active || $is_installed,
			'active'    => $is_active,
		];
	}
}
