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

namespace Google\Web_Stories\Tests;

use Spy_REST_Server;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\Tracking
 */
class Tracking extends Test_Case {
	protected static $user_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
	}

	/**
	 * @covers ::register
	 */
	public function test_register_tracking_script() {
		$site_kit = $this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class );
		$site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_enabled_experiments' )
					->willReturn( [ 'enableFoo', 'enableBar' ] );

		$tracking = new \Google\Web_Stories\Tracking( $experiments, $site_kit );
		$tracking->register();
		$this->assertTrue( wp_script_is( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, 'registered' ) );
		$this->assertFalse( wp_scripts()->registered[ \Google\Web_Stories\Tracking::SCRIPT_HANDLE ]->src );
		$after = wp_scripts()->get_data( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, 'after' );
		$this->assertNotEmpty( $after );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings() {
		wp_set_current_user( self::$user_id );

		$site_kit = $this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class );
		$site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_enabled_experiments' )
					->willReturn( [ 'enableFoo', 'enableBar' ] );

		$settings = ( new \Google\Web_Stories\Tracking( $experiments, $site_kit ) )->get_settings();

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
		$this->assertArrayHasKey( 'activePlugins', $settings['userProperties'] );
		$this->assertSame( get_locale(), $settings['userProperties']['siteLocale'] );
		$this->assertSame( get_user_locale(), $settings['userProperties']['userLocale'] );
		$this->assertSame( PHP_VERSION, $settings['userProperties']['phpVersion'] );
		$this->assertSame( get_bloginfo( 'version' ), $settings['userProperties']['wpVersion'] );
		$this->assertSame( 'administrator', $settings['userProperties']['userRole'] );
		$this->assertSame( 'enableFoo,enableBar', $settings['userProperties']['enabledExperiments'] );
		$this->assertInternalType( 'string', $settings['userProperties']['wpVersion'] );
		$this->assertInternalType( 'string', $settings['userProperties']['phpVersion'] );
		$this->assertInternalType( 'int', $settings['userProperties']['isMultisite'] );
		$this->assertInternalType( 'string', $settings['userProperties']['adNetwork'] );
		$this->assertInternalType( 'string', $settings['userProperties']['analytics'] );
		$this->assertInternalType( 'string', $settings['userProperties']['activePlugins'] );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings_with_optin() {
		wp_set_current_user( self::$user_id );
		add_user_meta( get_current_user_id(), \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, true );

		$site_kit = $this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class );
		$site_kit->method( 'get_plugin_status' )->willReturn(
			[
				'installed'       => true,
				'active'          => true,
				'analyticsActive' => true,
				'link'            => 'https://example.com',
			]
		);

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_enabled_experiments' )
					->willReturn( [ 'enableFoo', 'enableBar' ] );

		$settings         = ( new \Google\Web_Stories\Tracking( $experiments, $site_kit ) )->get_settings();
		$tracking_allowed = $settings['trackingAllowed'];

		delete_user_meta( get_current_user_id(), \Google\Web_Stories\User_Preferences::OPTIN_META_KEY );

		$this->assertTrue( $tracking_allowed );
	}
}
