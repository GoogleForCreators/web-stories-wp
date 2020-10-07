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
 * @coversDefaultClass \Google\Web_Stories\Dashboard
 */
class Dashboard extends \WP_UnitTestCase {
	protected static $user_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
	}

	/**
	 * @covers ::get_hook_suffix
	 */
	public function test_get_not_set_hook_suffix() {
		$dashboard = new \Google\Web_Stories\Dashboard( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$dashboard->add_menu_page();
		$this->assertFalse( $dashboard->get_hook_suffix( 'nothing' ) );
	}

	/**
	 * @covers ::add_menu_page
	 * @covers ::get_hook_suffix
	 */
	public function test_add_menu_page_no_user() {
		$dashboard = new \Google\Web_Stories\Dashboard( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$dashboard->add_menu_page();
		$this->assertFalse( $dashboard->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertFalse( $dashboard->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertFalse( $dashboard->get_hook_suffix( 'stories-dashboard-settings' ) );
	}

	/**
	 * @covers ::add_menu_page
	 * @covers ::get_hook_suffix
	 */
	public function test_add_menu_page_user_without_permission() {
		wp_set_current_user( self::$user_id );

		$dashboard = new \Google\Web_Stories\Dashboard( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$dashboard->add_menu_page();
		$this->assertFalse( $dashboard->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertFalse( $dashboard->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertFalse( $dashboard->get_hook_suffix( 'stories-dashboard-settings' ) );
	}

	/**
	 * @covers ::add_menu_page
	 * @covers ::get_hook_suffix
	 */
	public function test_add_menu_page() {
		wp_set_current_user( self::$user_id );
		wp_get_current_user()->add_cap( 'edit_web-stories' );

		$dashboard = new \Google\Web_Stories\Dashboard( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$dashboard->add_menu_page();
		$this->assertNotFalse( $dashboard->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertNotEmpty( $dashboard->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertNotFalse( $dashboard->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertNotEmpty( $dashboard->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertNotFalse( $dashboard->get_hook_suffix( 'stories-dashboard-settings' ) );
		$this->assertNotEmpty( $dashboard->get_hook_suffix( 'stories-dashboard-settings' ) );
	}

	/**
	 * @covers ::enqueue_assets
	 */
	public function test_enqueue_assets_wrong_page() {
		wp_set_current_user( self::$user_id );

		$dashboard = new \Google\Web_Stories\Dashboard( $this->createMock( \Google\Web_Stories\Experiments::class ) );
		$dashboard->add_menu_page();
		$dashboard->enqueue_assets( 'foo' );
		$this->assertFalse( wp_script_is( $dashboard::SCRIPT_HANDLE ) );
		$this->assertFalse( wp_style_is( $dashboard::SCRIPT_HANDLE ) );
	}

	/**
	 * @covers ::enqueue_assets
	 */
	public function test_enqueue_assets() {
		wp_set_current_user( self::$user_id );

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );

		$dashboard = new \Google\Web_Stories\Dashboard( $experiments );
		$dashboard->add_menu_page();
		$dashboard->enqueue_assets( $dashboard->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertTrue( wp_script_is( $dashboard::SCRIPT_HANDLE ) );
		$this->assertTrue( wp_style_is( $dashboard::SCRIPT_HANDLE ) );
		$this->assertSame( 'web-stories', wp_scripts()->registered[ $dashboard::SCRIPT_HANDLE ]->textdomain );
	}
}
