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
 * Class Database_Upgrader
 *
 * @coversDefaultClass \Google\Web_Stories\Database_Upgrader
 */
class Database_Upgrader extends DependencyInjectedTestCase {
	private \Google\Web_Stories\Database_Upgrader $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Database_Upgrader::class );

		delete_option( $this->instance::OPTION );
		delete_option( $this->instance::PREVIOUS_OPTION );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 5, has_action( 'admin_init', [ $this->instance, 'run_upgrades' ] ) );
	}

	/**
	 * @covers ::register
	 */
	public function test_register_does_not_set_missing_options_on_frontend(): void {
		$this->instance->register();
		$this->assertFalse( get_option( $this->instance::OPTION ) );
		$this->assertFalse( get_option( $this->instance::PREVIOUS_OPTION ) );
	}

	/**
	 * @covers ::register
	 */
	public function test_register_does_not_override_previous_version_if_there_was_no_update(): void {
		$GLOBALS['current_screen'] = convert_to_screen( 'post' );

		add_option( $this->instance::OPTION, WEBSTORIES_DB_VERSION );
		add_option( $this->instance::PREVIOUS_OPTION, '1.2.3' );

		$this->instance->register();
		$this->assertSame( WEBSTORIES_DB_VERSION, get_option( $this->instance::OPTION ) );
		$this->assertSame( '1.2.3', get_option( $this->instance::PREVIOUS_OPTION ) );
	}

	/**
	 * @covers ::on_plugin_uninstall
	 */
	public function test_on_plugin_uninstall(): void {

		add_option( $this->instance::OPTION, WEBSTORIES_DB_VERSION );
		add_option( $this->instance::PREVIOUS_OPTION, '1.2.3' );

		$this->instance->on_plugin_uninstall();
		$this->assertFalse( get_option( $this->instance::OPTION ) );
		$this->assertFalse( get_option( $this->instance::PREVIOUS_OPTION ) );
	}

	/**
	 * @group ms-required
	 * @covers ::on_site_initialization
	 */
	public function test_sets_missing_options_on_site_initialization(): void {
		$blog_id = self::factory()->blog->create();

		switch_to_blog( $blog_id );

		$db_version   = get_option( $this->instance::OPTION );
		$prev_version = get_option( $this->instance::PREVIOUS_OPTION );

		restore_current_blog();

		$this->assertSame( WEBSTORIES_DB_VERSION, $db_version );
		$this->assertSame( '0.0.0', $prev_version );
	}
}
