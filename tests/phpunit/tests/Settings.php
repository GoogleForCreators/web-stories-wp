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

/**
 * @coversDefaultClass \Google\Web_Stories\Settings
 */
class Settings extends Test_Case {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$settings = new \Google\Web_Stories\Settings();
		$settings->register();

		$this->assertSame( 10, has_action( 'init', [ $settings, 'register_settings' ] ) );
	}

	/**
	 * @covers ::register_settings
	 */
	public function test_register_settings() {
		$settings = new \Google\Web_Stories\Settings();
		$settings->register_settings();

		$options = get_registered_settings();
		$this->assertArrayHasKey( $settings::SETTING_NAME_TRACKING_ID, $options );
		$this->assertArrayHasKey( $settings::SETTING_NAME_AD_NETWORK, $options );
		$this->assertArrayHasKey( $settings::SETTING_NAME_AD_MANAGER_SLOT_ID, $options );
		$this->assertArrayHasKey( $settings::SETTING_NAME_ADSENSE_PUBLISHER_ID, $options );
		$this->assertArrayHasKey( $settings::SETTING_NAME_ADSENSE_SLOT_ID, $options );
	}
}
