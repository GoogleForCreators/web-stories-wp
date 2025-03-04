<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration;

use _WP_Dependency;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Experiments;
use Google\Web_Stories\Integrations\Site_Kit;
use Google\Web_Stories\Integrations\WooCommerce;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\User\Preferences;
use PHPUnit\Framework\MockObject\MockObject;
use WP_UnitTest_Factory;

/**
 * @coversDefaultClass \Google\Web_Stories\Tracking
 */
class Tracking extends DependencyInjectedTestCase {
	protected static int $user_id;

	/**
	 * @var Site_Kit & MockObject
	 */
	private $site_kit;

	/**
	 * @var WooCommerce & MockObject
	 */
	private $woocommerce;

	/**
	 * @var \Google\Web_Stories\Experiments & MockObject
	 */
	private $experiments;

	private \Google\Web_Stories\Tracking $instance;

	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ): void {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$this->experiments = $this->createMock( Experiments::class );
		$this->site_kit    = $this->createMock( Site_Kit::class );
		$assets            = $this->injector->make( Assets::class );
		$settings          = $this->injector->make( Settings::class );
		$preferences       = $this->injector->make( Preferences::class );
		$context           = $this->injector->make( Context::class );
		$this->woocommerce = $this->createMock( WooCommerce::class );
		$this->instance    = new \Google\Web_Stories\Tracking(
			$this->experiments,
			$this->site_kit,
			$assets,
			$settings,
			$preferences,
			$this->woocommerce,
			$context
		);
	}

	/**
	 * @covers ::register
	 */
	public function test_register_tracking_script(): void {
		global $current_screen;

		$current_screen = convert_to_screen( Story_Post_Type::POST_TYPE_SLUG );

		$this->site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);
		$this->woocommerce->method( 'get_plugin_status' )->willReturn(
			[
				'installed' => true,
				'active'    => true,
				'canManage' => true,
				'link'      => 'https://example.com',
			]
		);
		$this->experiments->method( 'get_enabled_experiments' )
					->willReturn( [ 'enableFoo', 'enableBar' ] );

		$this->instance->register();

		/**
		 * An array of all registered dependencies keyed by handle.
		 *
		 * @var array<string, _WP_Dependency> $registered
		 */
		$registered = wp_scripts()->registered;

		$this->assertTrue( wp_script_is( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, 'registered' ) );
		$this->assertArrayHasKey( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, $registered );
		$handle = $registered[ \Google\Web_Stories\Tracking::SCRIPT_HANDLE ];

		$this->assertEmpty( $handle->src );
		$after = wp_scripts()->get_data( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, 'after' );
		$this->assertNotEmpty( $after );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings(): void {
		wp_set_current_user( self::$user_id );

		$this->site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);
		$this->woocommerce->method( 'get_plugin_status' )->willReturn(
			[
				'installed' => true,
				'active'    => true,
				'canManage' => true,
				'link'      => 'https://example.com',
			]
		);
		$this->experiments->method( 'get_enabled_experiments' )
					->willReturn( [ 'enableFoo', 'enableBar' ] );

		$settings = $this->instance->get_settings();

		$this->assertArrayHasKey( 'trackingAllowed', $settings );
		$this->assertArrayHasKey( 'trackingId', $settings );
		$this->assertArrayHasKey( 'trackingIdGA4', $settings );
		$this->assertArrayHasKey( 'appVersion', $settings );
		$this->assertArrayHasKey( 'userProperties', $settings );
		$this->assertFalse( $settings['trackingAllowed'] );
		$this->assertSame( \Google\Web_Stories\Tracking::TRACKING_ID, $settings['trackingId'] );
		$this->assertSame( \Google\Web_Stories\Tracking::TRACKING_ID_GA4, $settings['trackingIdGA4'] );
		$this->assertSame( WEBSTORIES_VERSION, $settings['appVersion'] );

		$this->assertIsArray( $settings['userProperties'] );
		$this->assertArrayHasKey( 'siteLocale', $settings['userProperties'] );
		$this->assertArrayHasKey( 'userLocale', $settings['userProperties'] );
		$this->assertArrayHasKey( 'userRole', $settings['userProperties'] );
		$this->assertArrayHasKey( 'enabledExperiments', $settings['userProperties'] );
		$this->assertArrayHasKey( 'wpVersion', $settings['userProperties'] );
		$this->assertArrayHasKey( 'phpVersion', $settings['userProperties'] );
		$this->assertArrayHasKey( 'isMultisite', $settings['userProperties'] );
		$this->assertArrayHasKey( 'adNetwork', $settings['userProperties'] );
		$this->assertArrayHasKey( 'analytics', $settings['userProperties'] );
		$this->assertArrayHasKey( 'serverEnvironment', $settings['userProperties'] );
		$this->assertArrayHasKey( 'activePlugins', $settings['userProperties'] );
		$this->assertArrayHasKey( 'pluginVersion', $settings['userProperties'] );
		$this->assertSame( get_locale(), $settings['userProperties']['siteLocale'] );
		$this->assertSame( get_user_locale(), $settings['userProperties']['userLocale'] );
		$this->assertSame( wp_get_environment_type(), $settings['userProperties']['serverEnvironment'] );
		$this->assertSame( PHP_VERSION, $settings['userProperties']['phpVersion'] );
		$this->assertSame( get_bloginfo( 'version' ), $settings['userProperties']['wpVersion'] );
		$this->assertSame( 'administrator', $settings['userProperties']['userRole'] );
		$this->assertSame( 'enableFoo,enableBar', $settings['userProperties']['enabledExperiments'] );
		$this->assertSame( WEBSTORIES_VERSION, $settings['userProperties']['pluginVersion'] );
		$this->assertIsInt( $settings['userProperties']['isMultisite'] );
		$this->assertIsString( $settings['userProperties']['adNetwork'] );
		$this->assertIsString( $settings['userProperties']['analytics'] );
		$this->assertIsString( $settings['userProperties']['activePlugins'] );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings_with_optin(): void {
		wp_set_current_user( self::$user_id );
		add_user_meta( get_current_user_id(), Preferences::OPTIN_META_KEY, true );

		$this->site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);
		$this->woocommerce->method( 'get_plugin_status' )->willReturn(
			[
				'installed' => true,
				'active'    => true,
				'canManage' => true,
				'link'      => 'https://example.com',
			]
		);
		$this->experiments->method( 'get_enabled_experiments' )
					->willReturn( [ 'enableFoo', 'enableBar' ] );

		$settings         = $this->instance->get_settings();
		$tracking_allowed = $settings['trackingAllowed'];

		delete_user_meta( get_current_user_id(), Preferences::OPTIN_META_KEY );

		$this->assertTrue( $tracking_allowed );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings_with_woo(): void {
		wp_set_current_user( self::$user_id );

		$this->site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);

		$this->woocommerce->method( 'get_plugin_status' )->willReturn(
			[
				'installed' => true,
				'active'    => true,
				'canManage' => true,
				'link'      => 'https://example.com',
			]
		);
		$this->experiments->method( 'get_enabled_experiments' )->willReturn( [ 'enableFoo', 'enableBar' ] );

		$settings = $this->instance->get_settings();

		$this->assertIsArray( $settings['userProperties'] );
		$this->assertArrayHasKey( 'activePlugins', $settings['userProperties'] );
		$this->assertIsString( $settings['userProperties']['activePlugins'] );
		$this->assertStringContainsString( 'woocommerce', $settings['userProperties']['activePlugins'] );
	}

	/**
	 * @covers ::get_user_properties
	 */
	public function test_get_settings_user_malformed_roles(): void {
		$user_id = self::factory()->user->create(
			[
				'role' => 'administrator',
			]
		);

		$this->assertNotWPError( $user_id );

		wp_set_current_user( $user_id );

		global $current_user;
		$current_user->roles = [ 1 => 'administrator' ];

		$this->site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);
		$this->woocommerce->method( 'get_plugin_status' )->willReturn(
			[
				'installed' => true,
				'active'    => true,
				'canManage' => true,
				'link'      => 'https://example.com',
			]
		);
		$this->experiments->method( 'get_enabled_experiments' )
			->willReturn( [ 'enableFoo', 'enableBar' ] );

		$settings = $this->instance->get_settings();

		$this->assertIsArray( $settings['userProperties'] );
		$this->assertSame( 'administrator', $settings['userProperties']['userRole'] );
	}
}
