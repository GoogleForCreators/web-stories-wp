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

namespace Google\Web_Stories\Tests\Admin;

use Google\Web_Stories\Tests\Capabilities_Setup;
use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Editor
 */
class Editor extends Test_Case {
	use Capabilities_Setup;

	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Subscriber user for test.
	 *
	 * @var int
	 */
	protected static $subscriber_id;

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id      = $factory->user->create(
			[ 'role' => 'administrator' ]
		);
		self::$subscriber_id = $factory->user->create(
			[ 'role' => 'subscriber' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Story_Post_Type Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	public function setUp() {
		parent::setUp();
		$this->add_caps_to_roles();
	}

	public function tearDown() {
		$this->set_permalink_structure( '' );
		$_SERVER['REQUEST_URI'] = '';

		delete_post_meta( self::$story_id, '_edit_lock' );

		$this->remove_caps_from_roles();

		parent::tearDown();
	}

	/**
	 * @covers ::admin_enqueue_scripts
	 */
	public function test_admin_enqueue_scripts() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );
		$meta_boxes   = $this->createMock( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder      = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale       = $this->createMock( \Google\Web_Stories\Locale::class );
		$google_fonts = new \Google\Web_Stories\Admin\Google_Fonts();
		$assets       = $this->getMockBuilder( \Google\Web_Stories\Assets::class )->setMethods( [ 'get_asset_metadata' ] )->getMock();
		$assets->method( 'get_asset_metadata' )
			->willReturn(
				[
					'dependencies' => [],
					'version'      => '9.9.9',
					'js'           => [ 'fake_js_chunk' ],
					'css'          => [ 'fake_css_chunk' ],
				]
			);

		$editor = new \Google\Web_Stories\Admin\Editor( $experiments, $meta_boxes, $decoder, $locale, $google_fonts, $assets );

		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$editor->admin_enqueue_scripts( 'post.php' );

		unset( $GLOBALS['current_screen'] );

		$this->assertTrue( wp_script_is( \Google\Web_Stories\Admin\Editor::SCRIPT_HANDLE ) );
		$this->assertTrue( wp_script_is( 'fake_js_chunk', 'registered' ) );

		$this->assertTrue( wp_style_is( \Google\Web_Stories\Admin\Editor::SCRIPT_HANDLE ) );
		$this->assertTrue( wp_style_is( 'fake_css_chunk', 'registered' ) );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_admin() {
		wp_set_current_user( self::$admin_id );

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );
		$meta_boxes   = $this->createMock( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder      = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale       = $this->createMock( \Google\Web_Stories\Locale::class );
		$google_fonts = new \Google\Web_Stories\Admin\Google_Fonts();
		$assets       = new \Google\Web_Stories\Assets();

		$editor  = new \Google\Web_Stories\Admin\Editor( $experiments, $meta_boxes, $decoder, $locale, $google_fonts, $assets );
		$results = $editor->get_editor_settings();
		$this->assertTrue( $results['config']['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_subscriber() {
		wp_set_current_user( self::$subscriber_id );

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );
		$meta_boxes   = $this->createMock( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder      = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale       = $this->createMock( \Google\Web_Stories\Locale::class );
		$google_fonts = new \Google\Web_Stories\Admin\Google_Fonts();
		$assets       = new \Google\Web_Stories\Assets();


		$editor  = new \Google\Web_Stories\Admin\Editor( $experiments, $meta_boxes, $decoder, $locale, $google_fonts, $assets );
		$results = $editor->get_editor_settings();
		$this->assertFalse( $results['config']['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_admin() {
		wp_set_current_user( self::$admin_id );
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );
		$meta_boxes   = $this->createMock( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder      = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale       = $this->createMock( \Google\Web_Stories\Locale::class );
		$google_fonts = new \Google\Web_Stories\Admin\Google_Fonts();
		$assets       = new \Google\Web_Stories\Assets();


		$editor = new \Google\Web_Stories\Admin\Editor( $experiments, $meta_boxes, $decoder, $locale, $google_fonts, $assets );

		$this->call_private_method( $editor, 'setup_lock', [ self::$story_id ] );

		$value = get_post_meta( self::$story_id, '_edit_lock', true );

		$this->assertNotEmpty( $value );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_experiment_disabled() {
		wp_set_current_user( self::$admin_id );
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( false );
		$meta_boxes   = $this->createMock( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder      = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale       = $this->createMock( \Google\Web_Stories\Locale::class );
		$google_fonts = new \Google\Web_Stories\Admin\Google_Fonts();
		$assets       = new \Google\Web_Stories\Assets();
		$editor       = new \Google\Web_Stories\Admin\Editor( $experiments, $meta_boxes, $decoder, $locale, $google_fonts, $assets );

		$this->call_private_method( $editor, 'setup_lock', [ self::$story_id ] );

		$value = get_post_meta( self::$story_id, '_edit_lock', true );

		$this->assertEmpty( $value );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_subscriber() {
		wp_set_current_user( self::$subscriber_id );

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );
		$meta_boxes   = $this->createMock( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder      = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale       = $this->createMock( \Google\Web_Stories\Locale::class );
		$google_fonts = new \Google\Web_Stories\Admin\Google_Fonts();
		$assets       = new \Google\Web_Stories\Assets();


		$editor = new \Google\Web_Stories\Admin\Editor( $experiments, $meta_boxes, $decoder, $locale, $google_fonts, $assets );

		$this->call_private_method( $editor, 'setup_lock', [ self::$story_id ] );

		$value = get_post_meta( self::$story_id, '_edit_lock', true );

		$this->assertEmpty( $value );
	}

	/**
	 * @covers ::filter_use_block_editor_for_post_type
	 */
	public function test_filter_use_block_editor_for_post_type() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'get_experiment_statuses' )
					->willReturn( [] );
		$meta_boxes   = $this->createMock( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder      = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale       = $this->createMock( \Google\Web_Stories\Locale::class );
		$google_fonts = new \Google\Web_Stories\Admin\Google_Fonts();
		$assets       = new \Google\Web_Stories\Assets();


		$editor = new \Google\Web_Stories\Admin\Editor( $experiments, $meta_boxes, $decoder, $locale, $google_fonts, $assets );

		$use_block_editor = $editor->filter_use_block_editor_for_post_type( true, \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$this->assertFalse( $use_block_editor );
	}

}
