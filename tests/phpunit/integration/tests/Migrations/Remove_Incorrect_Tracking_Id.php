<?php

declare(strict_types = 1);

/**
 * Copyright 2023 Google LLC
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

use Google\Web_Stories\Settings;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use Google\Web_Stories\Tracking;

/**
 * Class Remove_Incorrect_Tracking_Id
 *
 * @coversDefaultClass \Google\Web_Stories\Migrations\Remove_Incorrect_Tracking_Id
 */
class Remove_Incorrect_Tracking_Id extends DependencyInjectedTestCase {
	private \Google\Web_Stories\Migrations\Remove_Incorrect_Tracking_Id $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Migrations\Remove_Incorrect_Tracking_Id::class );
	}

	public function tear_down(): void {
		delete_option( Settings::SETTING_NAME_TRACKING_ID );

		parent::tear_down();
	}

	/**
	 * @covers ::migrate
	 */
	public function test_migrate_unchanged(): void {
		$tracking_id = 'UA-12345678-9';
		update_option( Settings::SETTING_NAME_TRACKING_ID, $tracking_id );

		$this->instance->migrate();

		$this->assertSame( $tracking_id, get_option( Settings::SETTING_NAME_TRACKING_ID ) );
	}

	/**
	 * @covers ::migrate
	 */
	public function test_migrate_reset(): void {
		$tracking_id = Tracking::TRACKING_ID;
		update_option( Settings::SETTING_NAME_TRACKING_ID, $tracking_id );

		$this->instance->migrate();

		$this->assertSame( '', get_option( Settings::SETTING_NAME_TRACKING_ID ) );
	}
}
