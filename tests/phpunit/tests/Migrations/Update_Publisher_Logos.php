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

namespace phpunit\tests\Migrations;

use Google\Web_Stories\Tests\Test_Case;

/**
 * Class Update_Publisher_Logos
 *
 * @covers Google\Web_Stories\Migrations\Update_Publisher_Logos;
 *
 * @package phpunit\tests\Migrations
 */
class Update_Publisher_Logos extends Test_Case {
	/**
	 * @covers ::migrate
	 */
	public function test_migrate() {
		$object = new \Google\Web_Stories\Migrations\Update_Publisher_Logos();

		update_option( \Google\Web_Stories\Settings::SETTING_NAME_PUBLISHER_LOGOS, [ 'active' => 123 ] );

		$object->migrate();

		$all_publisher_logos   = get_option( \Google\Web_Stories\Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo = (int) get_option( \Google\Web_Stories\Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$this->assertEqualSets( [ 123 ], $all_publisher_logos );
		$this->assertSame( 123, $active_publisher_logo );
	}
}
