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

/**
 * @coversDefaultClass \Google\Web_Stories\Settings
 */
class Settings extends DependencyInjectedTestCase {

	/**
	 * @var \Google\Web_Stories\Settings
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Settings::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$options = get_registered_settings();
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_EXPERIMENTS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_TRACKING_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_USING_LEGACY_ANALYTICS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_AD_NETWORK, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_AD_MANAGER_SLOT_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ADSENSE_PUBLISHER_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ADSENSE_SLOT_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_EXPERIMENTS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_PUBLISHER_LOGOS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_VIDEO_CACHE, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_DATA_REMOVAL, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ARCHIVE, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_AUTO_ADVANCE, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_DEFAULT_PAGE_DURATION, $options );
	}

	/**
	 * @covers ::on_plugin_uninstall
	 */
	public function test_on_plugin_uninstall(): void {
		add_option( $this->instance::SETTING_NAME_EXPERIMENTS, [ 'foo' => 'bar' ] );
		add_option( $this->instance::SETTING_NAME_TRACKING_ID, 'bar' );
		add_option( $this->instance::SETTING_NAME_USING_LEGACY_ANALYTICS, true );
		add_option( $this->instance::SETTING_NAME_AD_NETWORK, 'bar' );
		add_option( $this->instance::SETTING_NAME_AD_MANAGER_SLOT_ID, 'baz' );
		add_option( $this->instance::SETTING_NAME_ADSENSE_PUBLISHER_ID, 'baz' );
		add_option( $this->instance::SETTING_NAME_ADSENSE_SLOT_ID, 'baz' );
		add_option( $this->instance::SETTING_NAME_EXPERIMENTS, [ 'foo' => 'bar' ] );
		add_option( $this->instance::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, 123 );
		add_option( $this->instance::SETTING_NAME_PUBLISHER_LOGOS, [ 123, 567 ] );
		add_option( $this->instance::SETTING_NAME_VIDEO_CACHE, true );
		add_option( $this->instance::SETTING_NAME_DATA_REMOVAL, true );
		add_option( $this->instance::SETTING_NAME_ARCHIVE, 'none' );
		add_option( $this->instance::SETTING_NAME_AUTO_ADVANCE, true );
		add_option( $this->instance::SETTING_NAME_DEFAULT_PAGE_DURATION, 7 );

		$this->instance->on_plugin_uninstall();

		$this->assertSame( [], get_option( $this->instance::SETTING_NAME_EXPERIMENTS ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_TRACKING_ID ) );
		$this->assertFalse( get_option( $this->instance::SETTING_NAME_USING_LEGACY_ANALYTICS ) );
		$this->assertSame( 'none', get_option( $this->instance::SETTING_NAME_AD_NETWORK ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_AD_MANAGER_SLOT_ID ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_ADSENSE_PUBLISHER_ID ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_ADSENSE_SLOT_ID ) );
		$this->assertSame( [], get_option( $this->instance::SETTING_NAME_EXPERIMENTS ) );
		$this->assertSame( 0, get_option( $this->instance::SETTING_NAME_ACTIVE_PUBLISHER_LOGO ) );
		$this->assertSame( [], get_option( $this->instance::SETTING_NAME_PUBLISHER_LOGOS ) );
		$this->assertFalse( get_option( $this->instance::SETTING_NAME_VIDEO_CACHE ) );
		$this->assertFalse( get_option( $this->instance::SETTING_NAME_DATA_REMOVAL ) );
		$this->assertSame( 'default', get_option( $this->instance::SETTING_NAME_ARCHIVE ) );
		$this->assertTrue( get_option( $this->instance::SETTING_NAME_AUTO_ADVANCE ) );
		$this->assertSame( 0, get_option( $this->instance::SETTING_NAME_DEFAULT_PAGE_DURATION ) );
	}
}
