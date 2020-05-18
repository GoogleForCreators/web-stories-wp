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

class Database_Upgrader extends \WP_UnitTestCase {
	public function setUp() {
		parent::setUp();
		$option_name = \Google\Web_Stories\Database_Upgrader::OPTION;
		delete_option( $option_name );
	}

	public function test_init() {
		$object = new \Google\Web_Stories\Database_Upgrader();
		$object->init();
		$this->assertSame( WEBSTORIES_DB_VERSION, get_option( $object::OPTION ) );
	}
}
