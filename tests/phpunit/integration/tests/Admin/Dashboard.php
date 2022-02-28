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
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Dashboard
 */
class Dashboard extends DependencyInjectedTestCase {
	use Capabilities_Setup;

	/**
	 * @var \Google\Web_Stories\Admin\Dashboard
	 */
	private $instance;

	protected static $user_id;

	protected static $cpt_has_archive = 'cpt_has_archive';
	protected static $cpt_no_archive  = 'cpt_no_archive';

	public static function wpSetUpBeforeClass( $factory ): void {
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

	public static function wpTearDownAfterClass(): void {
		unregister_post_type( self::$cpt_no_archive );
		unregister_post_type( self::$cpt_has_archive );
	}

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Admin\Dashboard::class );

		$this->add_caps_to_roles();
	}

	public function tear_down(): void {
		$this->remove_caps_from_roles();

		wp_dequeue_script( \Google\Web_Stories\Admin\Dashboard::SCRIPT_HANDLE );
		wp_dequeue_style( \Google\Web_Stories\Admin\Dashboard::SCRIPT_HANDLE );

		parent::tear_down();
	}

	/**
	 * @covers ::get_hook_suffix
	 */
	public function test_get_not_set_hook_suffix(): void {
		$this->instance->add_menu_page();
		$this->assertFalse( $this->instance->get_hook_suffix( 'nothing' ) );
	}

	/**
	 * @covers ::add_menu_page
	 * @covers ::get_hook_suffix
	 */
	public function test_add_menu_page_no_user(): void {
		$this->instance->add_menu_page();
		$this->assertFalse( $this->instance->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertFalse( $this->instance->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertFalse( $this->instance->get_hook_suffix( 'stories-dashboard-settings' ) );
	}

	/**
	 * @covers ::add_menu_page
	 * @covers ::get_hook_suffix
	 */
	public function test_add_menu_page_user_without_permission(): void {
		$this->remove_caps_from_roles();

		wp_set_current_user( self::$user_id );

		$this->instance->add_menu_page();
		$this->assertFalse( $this->instance->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertFalse( $this->instance->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertFalse( $this->instance->get_hook_suffix( 'stories-dashboard-settings' ) );
	}

	/**
	 * @covers ::add_menu_page
	 * @covers ::get_hook_suffix
	 */
	public function test_add_menu_page(): void {
		wp_set_current_user( self::$user_id );
		wp_get_current_user()->add_cap( 'edit_web-stories' );

		$this->instance->add_menu_page();
		$this->assertNotFalse( $this->instance->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertNotEmpty( $this->instance->get_hook_suffix( 'stories-dashboard' ) );
		$this->assertNotFalse( $this->instance->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertNotEmpty( $this->instance->get_hook_suffix( 'stories-dashboard-explore' ) );
		$this->assertNotFalse( $this->instance->get_hook_suffix( 'stories-dashboard-settings' ) );
		$this->assertNotEmpty( $this->instance->get_hook_suffix( 'stories-dashboard-settings' ) );
	}

	/**
	 * @covers ::enqueue_assets
	 */
	public function test_enqueue_assets_wrong_page(): void {
		wp_set_current_user( self::$user_id );

		$this->instance->add_menu_page();
		$this->instance->enqueue_assets( 'foo' );
		$this->assertFalse( wp_script_is( $this->instance::SCRIPT_HANDLE ) );
		$this->assertFalse( wp_style_is( $this->instance::SCRIPT_HANDLE ) );
	}

	/**
	 * @covers ::enqueue_assets
	 */
	public function test_enqueue_assets(): void {
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

		$site_kit       = $this->injector->make( \Google\Web_Stories\Integrations\Site_Kit::class );
		$decoder        = $this->injector->make( \Google\Web_Stories\Decoder::class );
		$locale         = $this->injector->make( \Google\Web_Stories\Locale::class );
		$google_fonts   = $this->injector->make( \Google\Web_Stories\Admin\Google_Fonts::class );
		$font_post_type = $this->injector->make( \Google\Web_Stories\Font_Post_Type::class );
		$post_type      = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$context        = $this->injector->make( \Google\Web_Stories\Context::class );
		$types          = $this->injector->make( \Google\Web_Stories\Media\Types::class );

		$this->instance = new \Google\Web_Stories\Admin\Dashboard(
			$experiments,
			$site_kit,
			$decoder,
			$locale,
			$google_fonts,
			$assets,
			$font_post_type,
			$post_type,
			$context,
			$types
		);

		$this->instance->add_menu_page();
		$this->instance->enqueue_assets( $this->instance->get_hook_suffix( 'stories-dashboard' ) );

		$this->assertTrue( wp_script_is( $this->instance::SCRIPT_HANDLE ) );
		$this->assertTrue( wp_script_is( 'fake_js_chunk', 'registered' ) );

		$this->assertTrue( wp_style_is( $this->instance::SCRIPT_HANDLE ) );
		$this->assertTrue( wp_style_is( 'fake_css_chunk', 'registered' ) );
	}
}
