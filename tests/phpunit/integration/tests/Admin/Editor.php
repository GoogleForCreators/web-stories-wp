<?php

declare(strict_types = 1);

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

use Google\Web_Stories\Admin\Google_Fonts;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Decoder;
use Google\Web_Stories\Experiments;
use Google\Web_Stories\Font_Post_Type;
use Google\Web_Stories\Locale;
use Google\Web_Stories\Media\Types;
use Google\Web_Stories\Page_Template_Post_Type;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\Capabilities_Setup;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use PHPUnit\Framework\MockObject\MockObject;
use WP_UnitTest_Factory;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Editor
 */
class Editor extends DependencyInjectedTestCase {
	use Capabilities_Setup;

	/**
	 * Admin user for test.
	 */
	protected static int $admin_id;

	/**
	 * Subscriber user for test.
	 */
	protected static int $subscriber_id;

	/**
	 * Story id.
	 */
	protected static int $story_id;

	/**
	 * @var Experiments & MockObject
	 */
	private $experiments;

	/**
	 * @var Assets & MockObject
	 */
	private $assets;

	private Story_Post_Type $story_post_type;

	private \Google\Web_Stories\Admin\Editor $instance;

	/**
	 * @param WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ): void {
		self::$admin_id      = $factory->user->create(
			[ 'role' => 'administrator' ]
		);
		self::$subscriber_id = $factory->user->create(
			[ 'role' => 'subscriber' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Story_Post_Type Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
			]
		);

		/**
		 * @var int $poster_attachment_id
		 */
		$poster_attachment_id = $factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	public function set_up(): void {
		parent::set_up();

		$this->experiments       = $this->createMock( Experiments::class );
		$meta_boxes              = $this->injector->make( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$decoder                 = $this->injector->make( Decoder::class );
		$locale                  = $this->injector->make( Locale::class );
		$google_fonts            = $this->injector->make( Google_Fonts::class );
		$this->assets            = $this->createMock( Assets::class );
		$this->story_post_type   = $this->injector->make( Story_Post_Type::class );
		$page_template_post_type = $this->injector->make( Page_Template_Post_Type::class );
		$fonts_post_type         = $this->injector->make( Font_Post_Type::class );
		$context                 = $this->injector->make( Context::class );
		$types                   = $this->injector->make( Types::class );
		$settings                = $this->injector->make( Settings::class );

		$this->instance = new \Google\Web_Stories\Admin\Editor(
			$this->experiments,
			$meta_boxes,
			$decoder,
			$locale,
			$google_fonts,
			$this->assets,
			$this->story_post_type,
			$page_template_post_type,
			$fonts_post_type,
			$context,
			$types,
			$settings
		);

		$this->add_caps_to_roles();
	}

	public function tear_down(): void {
		delete_post_meta( self::$story_id, '_edit_lock' );

		$this->remove_caps_from_roles();

		parent::tear_down();
	}

	/**
	 * @covers ::admin_enqueue_scripts
	 */
	public function test_admin_enqueue_scripts(): void {
		$this->assets->expects( $this->once() )->method( 'remove_admin_style' )->with( [ 'forms' ] );

		$GLOBALS['current_screen'] = convert_to_screen( $this->story_post_type->get_slug() );

		$this->instance->admin_enqueue_scripts( 'post.php' );
	}

	/**
	 * @covers ::replace_editor
	 */
	public function test_replace_editor(): void {
		$this->assets->expects( $this->once() )->method( 'register_script_asset' )->with(
			\Google\Web_Stories\Admin\Editor::SCRIPT_HANDLE
		);
		$current_post = get_post( self::$story_id );
		$this->assertNotNull( $current_post );

		$this->instance->replace_editor( true, $current_post );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_admin(): void {
		wp_set_current_user( self::$admin_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );

		$results = $this->instance->get_editor_settings();
		$this->assertIsArray( $results );
		$this->assertArrayHasKey( 'capabilities', $results );
		$this->assertIsArray( $results['capabilities'] );
		$this->assertArrayHasKey( 'hasUploadMediaAction', $results['capabilities'] );
		$this->assertTrue( $results['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_subscriber(): void {
		wp_set_current_user( self::$subscriber_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );

		$results = $this->instance->get_editor_settings();
		$this->assertIsArray( $results );
		$this->assertArrayHasKey( 'capabilities', $results );
		$this->assertIsArray( $results['capabilities'] );
		$this->assertArrayHasKey( 'hasUploadMediaAction', $results['capabilities'] );
		$this->assertFalse( $results['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_passes_publisher_name_without_quotes(): void {
		$blogname = get_option( 'blogname' );
		update_option( 'blogname', "S'mores" );

		$results = $this->instance->get_editor_settings();
		$this->assertIsArray( $results );
		$this->assertArrayHasKey( 'metadata', $results );
		$this->assertIsArray( $results['metadata'] );
		$this->assertArrayHasKey( 'publisher', $results['metadata'] );

		update_option( 'blogname', $blogname );

		$this->assertSame( "S'mores", $results['metadata']['publisher'] );
	}

	/**
	 * @link https://github.com/GoogleForCreators/web-stories-wp/issues/12601
	 *
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_uses_correct_default_value(): void {
		$results = $this->instance->get_editor_settings();

		$this->assertTrue( $results['globalAutoAdvance'] );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_admin(): void {
		wp_set_current_user( self::$admin_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );
		$this->experiments->method( 'is_experiment_enabled' )->willReturn( true );

		$this->call_private_method( [ $this->instance, 'setup_lock' ], [ self::$story_id ] );

		$value = get_post_meta( self::$story_id, '_edit_lock', true );

		$this->assertNotEmpty( $value );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_subscriber(): void {
		wp_set_current_user( self::$subscriber_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );
		$this->experiments->method( 'is_experiment_enabled' )->willReturn( true );

		$this->call_private_method( [ $this->instance, 'setup_lock' ], [ self::$story_id ] );

		$value = get_post_meta( self::$story_id, '_edit_lock', true );

		$this->assertEmpty( $value );
	}

	/**
	 * @covers ::filter_use_block_editor_for_post_type
	 */
	public function test_filter_use_block_editor_for_post_type(): void {
		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );

		$use_block_editor = $this->instance->filter_use_block_editor_for_post_type( true, $this->story_post_type->get_slug() );
		$this->assertFalse( $use_block_editor );
	}

}
