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
 * Class Database_Upgrader
 *
 * @package Google\Web_Stories\Tests
 * @coversDefaultClass \Google\Web_Stories\Database_Upgrader
 *
 */
class Database_Upgrader extends Test_Case {

	public function setUp() {
		parent::setUp();
		delete_option( \Google\Web_Stories\Database_Upgrader::OPTION );
		delete_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION );
	}

	/**
	 * @covers ::register
	 */
	public function test_register_sets_missing_options() {
		$object = new \Google\Web_Stories\Database_Upgrader();
		$object->register();
		$this->assertSame( WEBSTORIES_DB_VERSION, get_option( $object::OPTION ) );
		$this->assertSame( '0.0.0', get_option( $object::PREVIOUS_OPTION ) );
	}

	/**
	 * @covers ::register
	 */
	public function test_register_does_not_override_previous_version_if_there_was_no_update() {
		add_option( \Google\Web_Stories\Database_Upgrader::OPTION, WEBSTORIES_DB_VERSION );
		add_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION, '1.2.3' );

		$object = new \Google\Web_Stories\Database_Upgrader();
		$object->register();
		$this->assertSame( WEBSTORIES_DB_VERSION, get_option( $object::OPTION ) );
		$this->assertSame( '1.2.3', get_option( $object::PREVIOUS_OPTION ) );
	}

	/**
	 * @group ms-required
	 */
	public function test_register_sets_missing_options_multisite() {
		$blog_id = (int) self::factory()->blog->create();

		switch_to_blog( $blog_id );

		$db_version   = get_option( \Google\Web_Stories\Database_Upgrader::OPTION );
		$prev_version = get_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION );

		restore_current_blog();

		$this->assertSame( WEBSTORIES_DB_VERSION, $db_version );
		$this->assertSame( '0.0.0', $prev_version );
	}
}
