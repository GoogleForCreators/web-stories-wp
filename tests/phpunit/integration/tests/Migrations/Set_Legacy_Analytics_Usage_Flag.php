<?php
/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Integration\Migrations;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class Set_Legacy_Analytics_Usage_Flag
 *
 * @coversDefaultClass \Google\Web_Stories\Migrations\Set_Legacy_Analytics_Usage_Flag
 *
 */
class Set_Legacy_Analytics_Usage_Flag extends TestCase {
	/**
	 * @covers ::migrate
	 */
	public function test_migrate_true() {
		$instance = new \Google\Web_Stories\Migrations\Set_Legacy_Analytics_Usage_Flag();

		update_option( \Google\Web_Stories\Settings::SETTING_NAME_TRACKING_ID, 'UA-12345678-9' );

		$instance->migrate();

		$this->assertTrue( get_option( \Google\Web_Stories\Settings::SETTING_NAME_USING_LEGACY_ANALYTICS ) );
	}

	/**
	 * @covers ::migrate
	 */
	public function test_migrate_false() {
		$instance = new \Google\Web_Stories\Migrations\Set_Legacy_Analytics_Usage_Flag();

		update_option( \Google\Web_Stories\Settings::SETTING_NAME_TRACKING_ID, '' );

		$instance->migrate();

		$this->assertFalse( get_option( \Google\Web_Stories\Settings::SETTING_NAME_USING_LEGACY_ANALYTICS ) );
	}
}
