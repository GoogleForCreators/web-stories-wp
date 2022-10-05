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
 * @runInSeparateProcess
 * @preserveGlobalState disabled
 * @coversDefaultClass \Google\Web_Stories\Uninstaller
 */
class Uninstall extends TestCase {
	protected static $attachment_ids;

	protected static $user_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Uninstaller
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = new \Google\Web_Stories\Uninstaller();

		update_option( \Google\Web_Stories\Database_Upgrader::OPTION, '2.0.0' );
		update_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION, '1.0.0' );

		set_transient( 'web_stories_link_data_fdsf', 'hello' );
		set_site_transient( 'web_stories_updater', 'hello' );
	}

	/**
	 * @covers ::delete_options
	 */
	public function test_delete_options(): void {
		$this->assertSame( '2.0.0', get_option( \Google\Web_Stories\Database_Upgrader::OPTION ) );
		$this->assertSame( '1.0.0', get_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION ) );
		$this->call_private_method( $this->instance, 'delete_options' );
		$this->assertFalse( get_option( \Google\Web_Stories\Database_Upgrader::OPTION ) );
		$this->assertFalse( get_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION ) );
		$this->assertFalse( get_transient( 'web_stories_link_data_fdsf' ) );
	}

	/**
	 * @group ms-required
	 * @covers ::delete_site_options
	 */
	public function test_delete_site_options(): void {
		$this->call_private_method( $this->instance, 'delete_site_options' );
		$this->assertFalse( get_site_transient( 'web_stories_updater' ) );
	}
}
