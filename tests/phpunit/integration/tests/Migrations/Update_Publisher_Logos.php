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

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class Update_Publisher_Logos
 *
 * @coversDefaultClass \Google\Web_Stories\Migrations\Update_Publisher_Logos
 *
 */
class Update_Publisher_Logos extends DependencyInjectedTestCase {
	public function tear_down() {
		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_PUBLISHER_LOGOS );

		parent::tear_down();
	}

	/**
	 * @covers ::migrate
	 */
	public function test_migrate() {
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_PUBLISHER_LOGOS, [ 'active' => 123 ] );

		$instance = $this->injector->make( \Google\Web_Stories\Migrations\Update_Publisher_Logos::class );
		$instance->migrate();

		$all_publisher_logos   = get_option( \Google\Web_Stories\Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo = (int) get_option( \Google\Web_Stories\Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$this->assertEqualSets( [ 123 ], $all_publisher_logos );
		$this->assertSame( 123, $active_publisher_logo );
	}
}
