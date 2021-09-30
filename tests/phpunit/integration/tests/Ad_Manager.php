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
 * @coversDefaultClass \Google\Web_Stories\Ad_Manager
 */
class Ad_Manager extends DependencyInjectedTestCase {

	public function set_up() {
		parent::set_up();

		update_option( \Google\Web_Stories\Settings::SETTING_NAME_AD_NETWORK, 'admanager' );
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_AD_MANAGER_SLOT_ID, '123' );
	}

	public function tear_down() {
		parent::tear_down();

		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_AD_NETWORK );
		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_AD_MANAGER_SLOT_ID );
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$adsense = $this->injector->make( \Google\Web_Stories\Ad_Manager::class );
		$adsense->register();

		$this->assertSame( 10, has_action( 'web_stories_print_analytics', [ $adsense, 'print_ad_manager_tag' ] ) );
	}

	/**
	 * @covers ::get_slot_id
	 */
	public function test_get_slot_id() {
		$adsense = $this->injector->make( \Google\Web_Stories\Ad_Manager::class );
		$result  = $this->call_private_method( $adsense, 'get_slot_id' );
		$this->assertSame( '123', $result );
	}

	/**
	 * @covers ::is_enabled
	 */
	public function test_is_enabled() {
		$adsense = $this->injector->make( \Google\Web_Stories\Ad_Manager::class );
		$result  = $this->call_private_method( $adsense, 'is_enabled' );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::print_ad_manager_tag
	 */
	public function test_print_ad_manager_tag() {
		$adsense = $this->injector->make( \Google\Web_Stories\Ad_Manager::class );

		$output = get_echo( [ $adsense, 'print_ad_manager_tag' ] );
		$this->assertStringContainsString( '<amp-story-auto-ads>', $output );
	}
}
