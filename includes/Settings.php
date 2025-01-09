<?php
/**
 * Settings class.
 *
 * Responsible for adding the stories Settings to WordPress admin.
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

use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Shopping\Shopping_Vendors;

/**
 * Settings class.
 */
class Settings extends Service_Base implements PluginUninstallAware {
	/**
	 * Settings group.
	 */
	public const SETTING_GROUP = 'web-stories';

	/**
	 * Experiments settings group.
	 */
	public const SETTING_GROUP_EXPERIMENTS = 'web-stories-experiments';

	/**
	 * Experiments setting name.
	 */
	public const SETTING_NAME_EXPERIMENTS = 'web_stories_experiments';

	/**
	 * GA Tracking ID setting name.
	 */
	public const SETTING_NAME_TRACKING_ID = 'web_stories_ga_tracking_id';

	/**
	 * Legacy analytics usage flag.
	 */
	public const SETTING_NAME_USING_LEGACY_ANALYTICS = 'web_stories_using_legacy_analytics';

	/**
	 * Type of adloader.
	 */
	public const SETTING_NAME_AD_NETWORK = 'web_stories_ad_network';

	/**
	 * AdSense Publisher ID setting name.
	 */
	public const SETTING_NAME_ADSENSE_PUBLISHER_ID = 'web_stories_adsense_publisher_id';

	/**
	 * AdSense Slot ID setting name.
	 */
	public const SETTING_NAME_ADSENSE_SLOT_ID = 'web_stories_adsense_slot_id';

	/**
	 * Ad Manager Slot ID setting name.
	 */
	public const SETTING_NAME_AD_MANAGER_SLOT_ID = 'web_stories_ad_manager_slot_id';

	/**
	 * MGID Widget ID setting name.
	 */
	public const SETTING_NAME_MGID_WIDGET_ID = 'web_stories_mgid_widget_id';

	/**
	 * Active publisher logo setting name.
	 */
	public const SETTING_NAME_ACTIVE_PUBLISHER_LOGO = 'web_stories_active_publisher_logo';

	/**
	 * Publisher logos setting name.
	 */
	public const SETTING_NAME_PUBLISHER_LOGOS = 'web_stories_publisher_logos';

	/**
	 * Video cache setting name.
	 */
	public const SETTING_NAME_VIDEO_CACHE = 'web_stories_video_cache';

	/**
	 * Data removal setting name.
	 */
	public const SETTING_NAME_DATA_REMOVAL = 'web_stories_data_removal';

	/**
	 * Web Stories archive setting name.
	 */
	public const SETTING_NAME_ARCHIVE = 'web_stories_archive';

	/**
	 * Web Stories archive page ID setting name.
	 */
	public const SETTING_NAME_ARCHIVE_PAGE_ID = 'web_stories_archive_page_id';

	/**
	 * Shopping provider, e.g. woocommerce or shopify
	 */
	public const SETTING_NAME_SHOPPING_PROVIDER = 'web_stories_shopping_provider';

	/**
	 * Shopify store URL, e.g. acme-store.myshopify.com.
	 */
	public const SETTING_NAME_SHOPIFY_HOST = 'web_stories_shopify_host';

	/**
	 * Shopify Storefront API access token.
	 */
	public const SETTING_NAME_SHOPIFY_ACCESS_TOKEN = 'web_stories_shopify_access_token';

	/**
	 * Auto-advance setting, `true` means advancing automatically.
	 */
	public const SETTING_NAME_AUTO_ADVANCE = 'web_stories_auto_advance';

	/**
	 * Default Page Duration in seconds.
	 */
	public const SETTING_NAME_DEFAULT_PAGE_DURATION = 'web_stories_default_page_duration';

	/**
	 * GA Tracking Handler.
	 */
	public const SETTING_NAME_TRACKING_HANDLER = 'web_stories_ga_tracking_handler';

	/**
	 * Customizer settings.
	 */
	public const SETTING_NAME_CUSTOMIZER_SETTINGS = 'web_stories_customizer_settings';

	/**
	 * Shopping_Vendors instance.
	 *
	 * @var Shopping_Vendors Shopping_Vendors instance.
	 */
	private Shopping_Vendors $shopping_vendors;

	/**
	 * Constructor.
	 *
	 * @param Shopping_Vendors $shopping_vendors Shopping_Vendors instance.
	 */
	public function __construct( Shopping_Vendors $shopping_vendors ) {
		$this->shopping_vendors = $shopping_vendors;
	}

	/**
	 * Primes option caches for specified groups if the function exists.
	 *
	 * @since 1.37.0
	 */
	public function prime_option_caches(): void {
		wp_prime_option_caches_by_group( self::SETTING_GROUP );
		wp_prime_option_caches_by_group( self::SETTING_GROUP_EXPERIMENTS );
	}

	/**
	 * Register settings.
	 *
	 * @SuppressWarnings("PHPMD.ExcessiveMethodLength")
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_TRACKING_ID,
			[
				'description'  => __( 'Google Analytics Tracking ID', 'web-stories' ),
				'type'         => 'string',
				'default'      => '',
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_USING_LEGACY_ANALYTICS,
			[
				'description'       => __( 'Using legacy analytics configuration', 'web-stories' ),
				'type'              => 'boolean',
				'default'           => false,
				'show_in_rest'      => true,
				'sanitize_callback' => 'rest_sanitize_boolean',
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_AD_NETWORK,
			[
				'description'  => __( 'Ad Network', 'web-stories' ),
				'type'         => 'string',
				'default'      => 'none',
				'enum'         => [ 'none', 'adsense', 'admanager', 'mgid' ],
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_ADSENSE_PUBLISHER_ID,
			[
				'description'  => __( 'Google AdSense Publisher ID', 'web-stories' ),
				'type'         => 'string',
				'default'      => '',
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_ADSENSE_SLOT_ID,
			[
				'description'  => __( 'Google AdSense Slot ID', 'web-stories' ),
				'type'         => 'string',
				'default'      => '',
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_AD_MANAGER_SLOT_ID,
			[
				'description'  => __( 'Google Ad Manager Slot ID', 'web-stories' ),
				'type'         => 'string',
				'default'      => '',
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_MGID_WIDGET_ID,
			[
				'description'  => __( 'MGID Widget ID', 'web-stories' ),
				'type'         => 'string',
				'default'      => '',
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_ACTIVE_PUBLISHER_LOGO,
			[
				'description'  => __( 'Default Publisher Logo', 'web-stories' ),
				'type'         => 'integer',
				'default'      => 0,
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_PUBLISHER_LOGOS,
			[
				'description'     => __( 'Publisher Logos', 'web-stories' ),
				'type'            => 'array',
				'default'         => [],
				'show_in_rest'    => [
					'schema' => [
						'items' => [
							'type' => 'integer',
						],
					],
				],
				// WPGraphQL errors when encountering array or object types.
				// See https://github.com/wp-graphql/wp-graphql/issues/2065.
				'show_in_graphql' => false,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_VIDEO_CACHE,
			[
				'description'  => __( 'Video Cache', 'web-stories' ),
				'type'         => 'boolean',
				'default'      => false,
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_DATA_REMOVAL,
			[
				'description'  => __( 'Data Removal', 'web-stories' ),
				'type'         => 'boolean',
				'default'      => false,
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_ARCHIVE,
			[
				'description'  => __( 'Web Stories Archive', 'web-stories' ),
				'type'         => 'string',
				'default'      => 'default',
				'show_in_rest' => [
					'schema' => [
						'type' => 'string',
						'enum' => [ 'default', 'disabled', 'custom' ],
					],
				],
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_ARCHIVE_PAGE_ID,
			[
				'description'  => __( 'Web Stories Archive Page ID', 'web-stories' ),
				'type'         => 'integer',
				'default'      => 0,
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP_EXPERIMENTS,
			self::SETTING_NAME_EXPERIMENTS,
			[
				'description'  => __( 'Experiments', 'web-stories' ),
				'type'         => 'object',
				'default'      => [],
				'show_in_rest' => [
					'schema' => [
						'properties'           => [],
						'additionalProperties' => true,
					],
				],
			]
		);

		$vendors        = $this->shopping_vendors->get_vendors();
		$vendor_options = array_keys( $vendors );
		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_SHOPPING_PROVIDER,
			[
				'description'  => __( 'Shopping provider', 'web-stories' ),
				'type'         => 'string',
				'default'      => 'none',
				'enum'         => $vendor_options,
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_SHOPIFY_HOST,
			[
				'description'  => __( 'Shopify Host', 'web-stories' ),
				'type'         => 'string',
				'default'      => '',
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_SHOPIFY_ACCESS_TOKEN,
			[
				'description'  => __( 'Shopify API Access Token', 'web-stories' ),
				'type'         => 'string',
				'default'      => '',
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_AUTO_ADVANCE,
			[
				'description'  => __( 'Auto-advance', 'web-stories' ),
				'type'         => 'boolean',
				'default'      => true,
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_DEFAULT_PAGE_DURATION,
			[
				'description'  => __( 'Default Page Duration', 'web-stories' ),
				'type'         => 'number',
				'default'      => 7,
				'show_in_rest' => true,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_TRACKING_HANDLER,
			[
				'description'  => __( 'Tracking Handler', 'web-stories' ),
				'type'         => 'string',
				'default'      => 'site-kit',
				'show_in_rest' => [
					'schema' => [
						'type' => 'string',
						'enum' => [ 'site-kit', 'web-stories', 'both' ],
					],
				],
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_CUSTOMIZER_SETTINGS,
			[
				'description'  => __( 'Customizer settings', 'web-stories' ),
				'type'         => 'array',
				'default'      => [],
				'show_in_rest' => false,
			]
		);

		add_action( 'init', [ $this, 'prime_option_caches' ] );
	}

	/**
	 * Returns the value for a given setting.
	 *
	 * @SuppressWarnings("PHPMD.BooleanArgumentFlag")
	 *
	 * @since 1.12.0
	 *
	 * @param string $key           Setting key.
	 * @param mixed  $default_value Optional. Default value to return if the option does not exist.
	 * @return string|array<int|string,mixed>|bool|int Setting value.
	 */
	public function get_setting( string $key, $default_value = false ) {
		// Distinguish between `false` as a default, and not passing one, just like WordPress.
		$passed_default = \func_num_args() > 1;

		if ( $passed_default ) {
			/**
			 * Setting value.
			 *
			 * @var string|array<int|string,mixed>|bool
			 */
			$option = get_option( $key, $default_value );
			if ( $option === $default_value ) {
				return $option;
			}
		} else {
			/**
			 * Setting value.
			 *
			 * @var string|array<int|string,mixed>|bool
			 */
			$option = get_option( $key );
		}

		$settings = $this->get_registered_options();
		if ( isset( $settings[ $key ] ) ) {
			$value = rest_sanitize_value_from_schema( $option, $settings[ $key ] );
			if ( is_wp_error( $value ) ) {
				return $option;
			}
			/**
			 * Setting value.
			 *
			 * @var string|array<int|string,mixed>|bool
			 */
			$option = $value;
		}

		return $option;
	}

	/**
	 * Updates the given setting with a new value.
	 *
	 * @since 1.12.0
	 *
	 * @param string $key Setting key.
	 * @param mixed  $value Setting value.
	 * @return mixed Setting value.
	 */
	public function update_setting( string $key, $value ) {
		return update_option( $key, $value );
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		delete_option( self::SETTING_NAME_ARCHIVE );
		delete_option( self::SETTING_NAME_EXPERIMENTS );
		delete_option( self::SETTING_NAME_TRACKING_ID );
		delete_option( self::SETTING_NAME_USING_LEGACY_ANALYTICS );
		delete_option( self::SETTING_NAME_AD_NETWORK );
		delete_option( self::SETTING_NAME_ADSENSE_PUBLISHER_ID );
		delete_option( self::SETTING_NAME_ADSENSE_SLOT_ID );
		delete_option( self::SETTING_NAME_AD_MANAGER_SLOT_ID );
		delete_option( self::SETTING_NAME_MGID_WIDGET_ID );
		delete_option( self::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );
		delete_option( self::SETTING_NAME_PUBLISHER_LOGOS );
		delete_option( self::SETTING_NAME_VIDEO_CACHE );
		delete_option( self::SETTING_NAME_DATA_REMOVAL );
		delete_option( self::SETTING_NAME_ARCHIVE );
		delete_option( self::SETTING_NAME_ARCHIVE_PAGE_ID );
		delete_option( self::SETTING_NAME_SHOPPING_PROVIDER );
		delete_option( self::SETTING_NAME_SHOPIFY_HOST );
		delete_option( self::SETTING_NAME_SHOPIFY_ACCESS_TOKEN );
		delete_option( self::SETTING_NAME_DEFAULT_PAGE_DURATION );
		delete_option( self::SETTING_NAME_AUTO_ADVANCE );
		delete_option( self::SETTING_NAME_TRACKING_HANDLER );
	}

	/**
	 * Retrieves all of the registered options for the Settings API.
	 * Inspired by get_registered_options method found in WordPress. But also get settings that are registered without `show_in_rest` property.
	 *
	 * @since 1.28.0
	 *
	 * @link https://github.com/WordPress/wordpress-develop/blob/trunk/src/wp-includes/rest-api/endpoints/class-wp-rest-settings-controller.php#L211-L267
	 *
	 * @return array<string, array<string,string>> Array of registered options.
	 */
	protected function get_registered_options(): array {
		$rest_options = [];

		foreach ( get_registered_settings() as $name => $args ) {
			$rest_args = [];

			if ( ! empty( $args['show_in_rest'] ) && \is_array( $args['show_in_rest'] ) ) {
				$rest_args = $args['show_in_rest'];
			}

			$defaults = [
				'name'   => ! empty( $rest_args['name'] ) ? $rest_args['name'] : $name,
				'schema' => [],
			];

			$rest_args = array_merge( $defaults, $rest_args );

			$default_schema = [
				'type'        => empty( $args['type'] ) ? null : $args['type'],
				'description' => empty( $args['description'] ) ? '' : $args['description'],
				'default'     => $args['default'] ?? null,
			];

			$schema = array_merge( $default_schema, $rest_args['schema'] );
			$schema = rest_default_additional_properties_to_false( $schema );

			$rest_options[ $name ] = $schema;
		}

		return $rest_options;
	}
}
