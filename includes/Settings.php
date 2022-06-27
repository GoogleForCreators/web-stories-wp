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

namespace Google\Web_Stories;

use Google\Web_Stories\Shopping\Shopping_Vendors;

/**
 * Settings class.
 */
class Settings extends Service_Base {
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
	 * Shopping_Vendors instance.
	 *
	 * @var Shopping_Vendors Shopping_Vendors instance.
	 */
	private $shopping_vendors;

	/**
	 * Constructor.
	 *
	 * @param Shopping_Vendors $shopping_vendors Shopping_Vendors instance.
	 */
	public function __construct( Shopping_Vendors $shopping_vendors ) {
		$this->shopping_vendors = $shopping_vendors;
	}

	/**
	 * Register settings.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
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
				'enum'         => [ 'none', 'adsense', 'admanager' ],
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
				'description'     => __( 'Experiments', 'web-stories' ),
				'type'            => 'object',
				'default'         => [],
				'show_in_rest'    => [
					'schema' => [
						'properties' => [],
					],
				],
				// WPGraphQL errors when encountering array or object types.
				// See https://github.com/wp-graphql/wp-graphql/issues/2065.
				'show_in_graphql' => false,
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
	}

	/**
	 * Returns the value for a given setting.
	 *
	 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
	 *
	 * @since 1.12.0
	 *
	 * @param string $key Setting key.
	 * @param mixed  $default Optional. Default value to return if the option does not exist.
	 * @return string|array<int|string,mixed>|bool Setting value.
	 */
	public function get_setting( string $key, $default = false ) {
		/**
		 * Setting value.
		 *
		 * @var string|array<int|string,mixed>|bool
		 */
		return get_option( $key, $default );
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
}
