<?php
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

use Google\Web_Stories\Integrations\Site_Kit;
use Google\Web_Stories\Integrations\Woocommerce;

/**
 * @coversDefaultClass \Google\Web_Stories\Tracking
 */
class Tracking extends DependencyInjectedTestCase {
	protected static $user_id;

	/**
	 * @var Site_Kit
	 */
	private $site_kit;

	/**
	 * @var Woocommerce
	 */
	private $woocommerce;

	/**
	 * @var \Google\Web_Stories\Experiments
	 */
	private $experiments;

	/**
	 * @var \Google\Web_Stories\Tracking
	 */
	private $instance;

	public static function wpSetUpBeforeClass( $factory ): void {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$this->experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$this->site_kit    = $this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class );
		$assets            = $this->injector->make( \Google\Web_Stories\Assets::class );
		$settings          = $this->injector->make( \Google\Web_Stories\Settings::class );
		$preferences       = $this->injector->make( \Google\Web_Stories\User\Preferences::class );
		$this->woocommerce = $this->createMock( \Google\Web_Stories\Integrations\Woocommerce::class );
		$this->instance    = new \Google\Web_Stories\Tracking(
			$this->experiments,
			$this->site_kit,
			$assets,
			$settings,
			$preferences,
			$this->woocommerce
		);
	}

	/**
	 * @covers ::register
	 */
	public function test_register_tracking_script(): void {
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

		$this->assertTrue( wp_script_is( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, 'registered' ) );
		$this->assertFalse( wp_scripts()->registered[ \Google\Web_Stories\Tracking::SCRIPT_HANDLE ]->src );
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
		$this->assertSame( get_locale(), $settings['userProperties']['siteLocale'] );
		$this->assertSame( get_user_locale(), $settings['userProperties']['userLocale'] );
		$this->assertSame( wp_get_environment_type(), $settings['userProperties']['serverEnvironment'] );
		$this->assertSame( PHP_VERSION, $settings['userProperties']['phpVersion'] );
		$this->assertSame( get_bloginfo( 'version' ), $settings['userProperties']['wpVersion'] );
		$this->assertSame( 'administrator', $settings['userProperties']['userRole'] );
		$this->assertSame( 'enableFoo,enableBar', $settings['userProperties']['enabledExperiments'] );
		$this->assertIsString( $settings['userProperties']['wpVersion'] );
		$this->assertIsString( $settings['userProperties']['phpVersion'] );
		$this->assertIsInt( $settings['userProperties']['isMultisite'] );
		$this->assertIsString( $settings['userProperties']['adNetwork'] );
		$this->assertIsString( $settings['userProperties']['analytics'] );
		$this->assertIsString( $settings['userProperties']['activePlugins'] );
		$this->assertIsString( $settings['userProperties']['serverEnvironment'] );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings_with_optin(): void {
		wp_set_current_user( self::$user_id );
		add_user_meta( get_current_user_id(), \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, true );

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

		delete_user_meta( get_current_user_id(), \Google\Web_Stories\User\Preferences::OPTIN_META_KEY );

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

		$this->assertSame( 'administrator', $settings['userProperties']['userRole'] );
	}
}
