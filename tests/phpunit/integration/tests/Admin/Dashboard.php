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


namespace Google\Web_Stories\Tests\Integration\Admin;

use Google\Web_Stories\Tests\Integration\Capabilities_Setup;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Dashboard
 */
class Dashboard extends TestCase {
	use Capabilities_Setup;

	protected static $user_id;

	protected static $cpt_has_archive = 'cpt_has_archive';
	protected static $cpt_no_archive  = 'cpt_no_archive';

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		register_post_type(
			self::$cpt_has_archive,
			[
				'has_archive' => true,
			]
		);

		register_post_type(
			self::$cpt_no_archive,
			[
				'has_archive' => false,
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
		unregister_post_type( self::$cpt_no_archive );
		unregister_post_type( self::$cpt_has_archive );
	}

	public function setUp() {
		parent::setUp();
		$this->add_caps_to_roles();
	}

	public function tearDown() {
		$this->remove_caps_from_roles();

		wp_dequeue_script( \Google\Web_Stories\Admin\Dashboard::SCRIPT_HANDLE );
		wp_dequeue_style( \Google\Web_Stories\Admin\Dashboard::SCRIPT_HANDLE );

		parent::tearDown();
	}

	/**
	 * @covers ::get_hook_suffix
	 */
	public function test_get_not_set_hook_suffix() {
		$dashboard = new \Google\Web_Stories\Admin\Dashboard(
			$this->createMock( \Google\Web_Stories\Experiments::class ),
			$this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class ),
			$this->createMock( \Google\Web_Stories\Decoder::class ),
			$this->createMock( \Google\Web_Stories\Locale::class ),
			( new \Google\Web_Stories\Admin\Google_Fonts() ),
			( new \Google\Web_Stories\Assets() )
		);
		$dashboard->add_menu_page();
		$this->assertFalse( $dashboard->get_hook_suffix( 'nothing' ) );
	}

	/**
	 * @covers ::add_menu_page
	 * @covers ::get_hook_suffix
	 */
	public function test_add_menu_page_no_user() {
		$dashboard = new \Google\Web_Stories\Admin\Dashboard(
			$this->createMock( \Google\Web_Stories\Experiments::class ),
			$this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class ),
			$this->createMock( \Google\Web_Stories\Decoder::class ),
			$this->createMock( \Google\Web_Stories\Locale::class ),
			( new \Google\Web_Stories\Admin\Google_Fonts() ),
			( new \Google\Web_Stories\Assets() )
		);
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
		$this->remove_caps_from_roles();

		wp_set_current_user( self::$user_id );

		$dashboard = new \Google\Web_Stories\Admin\Dashboard(
			$this->createMock( \Google\Web_Stories\Experiments::class ),
			$this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class ),
			$this->createMock( \Google\Web_Stories\Decoder::class ),
			$this->createMock( \Google\Web_Stories\Locale::class ),
			( new \Google\Web_Stories\Admin\Google_Fonts() ),
			( new \Google\Web_Stories\Assets() )
		);
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

		$dashboard = new \Google\Web_Stories\Admin\Dashboard(
			$this->createMock( \Google\Web_Stories\Experiments::class ),
			$this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class ),
			$this->createMock( \Google\Web_Stories\Decoder::class ),
			$this->createMock( \Google\Web_Stories\Locale::class ),
			( new \Google\Web_Stories\Admin\Google_Fonts() ),
			( new \Google\Web_Stories\Assets() )
		);
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

		$dashboard = new \Google\Web_Stories\Admin\Dashboard(
			$this->createMock( \Google\Web_Stories\Experiments::class ),
			$this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class ),
			$this->createMock( \Google\Web_Stories\Decoder::class ),
			$this->createMock( \Google\Web_Stories\Locale::class ),
			( new \Google\Web_Stories\Admin\Google_Fonts() ),
			( new \Google\Web_Stories\Assets() )
		);
		$dashboard->add_menu_page();
		$dashboard->enqueue_assets( 'foo' );
		$this->assertFalse( wp_script_is( $dashboard::SCRIPT_HANDLE ) );
		$this->assertFalse( wp_style_is( $dashboard::SCRIPT_HANDLE ) );
	}

	/**
	 * @covers ::get_post_type_archive_link
	 * @covers \Google\Web_Stories\Traits\Post_Type::get_post_type_has_archive
	 */
	public function test_get_post_type_archive_link() {
		$dashboard = new \Google\Web_Stories\Admin\Dashboard(
			$this->createMock( \Google\Web_Stories\Experiments::class ),
			$this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class ),
			$this->createMock( \Google\Web_Stories\Decoder::class ),
			$this->createMock( \Google\Web_Stories\Locale::class ),
			( new \Google\Web_Stories\Admin\Google_Fonts() ),
			( new \Google\Web_Stories\Assets() )
		);


		$result = $this->call_private_method( $dashboard, 'get_post_type_archive_link', [ self::$cpt_has_archive ] );
		$this->assertSame( get_post_type_archive_link( self::$cpt_has_archive ), $result );

		$result = $this->call_private_method( $dashboard, 'get_post_type_archive_link', [ self::$cpt_no_archive ] );
		$this->assertNotSame( get_post_type_archive_link( self::$cpt_no_archive ), $result );
	}

	/**
	 * @covers ::enqueue_assets
	 */
	public function test_enqueue_assets() {
		wp_set_current_user( self::$user_id );

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );

		$assets = $this->getMockBuilder( \Google\Web_Stories\Assets::class )->setMethods( [ 'get_asset_metadata' ] )->getMock();
		$assets->method( 'get_asset_metadata' )
			->willReturn(
				[
					'dependencies' => [],
					'version'      => '9.9.9',
					'js'           => [ 'fake_js_chunk' ],
					'css'          => [ 'fake_css_chunk' ],
					'chunks'       => [],
				]
			);

		$dashboard = new \Google\Web_Stories\Admin\Dashboard(
			$experiments,
			$this->createMock( \Google\Web_Stories\Integrations\Site_Kit::class ),
			$this->createMock( \Google\Web_Stories\Decoder::class ),
			$this->createMock( \Google\Web_Stories\Locale::class ),
			( new \Google\Web_Stories\Admin\Google_Fonts() ),
			$assets
		);

		$dashboard->add_menu_page();
		$dashboard->enqueue_assets( $dashboard->get_hook_suffix( 'stories-dashboard' ) );

		$this->assertTrue( wp_script_is( $dashboard::SCRIPT_HANDLE ) );
		$this->assertTrue( wp_script_is( 'fake_js_chunk', 'registered' ) );

		$this->assertTrue( wp_style_is( $dashboard::SCRIPT_HANDLE ) );
		$this->assertTrue( wp_style_is( 'fake_css_chunk', 'registered' ) );

		$this->assertSame( 'web-stories', wp_scripts()->registered[ $dashboard::SCRIPT_HANDLE ]->textdomain );
	}
}
