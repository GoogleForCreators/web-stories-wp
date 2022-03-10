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
 * @coversDefaultClass \Google\Web_Stories\Admin\Editor
 */
class Editor extends DependencyInjectedTestCase {
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
	 * @var \Google\Web_Stories\Experiments
	 */
	private $experiments;

	/**
	 * @var \Google\Web_Stories\Assets
	 */
	private $assets;

	/**
	 * @var \Google\Web_Stories\Admin\Meta_Boxes
	 */
	private $meta_boxes;

	/**
	 * @var \Google\Web_Stories\Admin\Google_Fonts
	 */
	private $google_fonts;

	/**
	 * @var \Google\Web_Stories\Decoder
	 */
	private $decoder;

	/**
	 * @var \Google\Web_Stories\Locale
	 */
	private $locale;

	/**
	 * @var \Google\Web_Stories\Story_Post_Type
	 */
	private $story_post_type;

	/**
	 * @var \Google\Web_Stories\Page_Template_Post_Type
	 */
	private $page_template_post_type;

	/**
	 * @var \Google\Web_Stories\Font_Post_Type
	 */
	private $fonts_post_type;

	/**
	 * @var \Google\Web_Stories\Media\Types
	 */
	private $types;

	/**
	 * @var \Google\Web_Stories\Admin\Editor
	 */
	private $instance;

	/**
	 * @var \Google\Web_Stories\Context
	 */
	private $context;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ): void {
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

	public function set_up(): void {
		parent::set_up();

		$this->experiments             = $this->createMock( \Google\Web_Stories\Experiments::class );
		$this->meta_boxes              = $this->injector->make( \Google\Web_Stories\Admin\Meta_Boxes::class );
		$this->decoder                 = $this->injector->make( \Google\Web_Stories\Decoder::class );
		$this->locale                  = $this->injector->make( \Google\Web_Stories\Locale::class );
		$this->google_fonts            = $this->injector->make( \Google\Web_Stories\Admin\Google_Fonts::class );
		$this->assets                  = $this->createMock( \Google\Web_Stories\Assets::class );
		$this->story_post_type         = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$this->page_template_post_type = $this->injector->make( \Google\Web_Stories\Page_Template_Post_Type::class );
		$this->fonts_post_type         = $this->injector->make( \Google\Web_Stories\Font_Post_Type::class );
		$this->context                 = $this->injector->make( \Google\Web_Stories\Context::class );
		$this->types                   = $this->injector->make( \Google\Web_Stories\Media\Types::class );

		$this->instance = new \Google\Web_Stories\Admin\Editor(
			$this->experiments,
			$this->meta_boxes,
			$this->decoder,
			$this->locale,
			$this->google_fonts,
			$this->assets,
			$this->story_post_type,
			$this->page_template_post_type,
			$this->fonts_post_type,
			$this->context,
			$this->types
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

		$this->instance->replace_editor( true, get_post( self::$story_id ) );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_admin(): void {
		wp_set_current_user( self::$admin_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );

		$results = $this->instance->get_editor_settings();
		$this->assertTrue( $results['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_subscriber(): void {
		wp_set_current_user( self::$subscriber_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );

		$results = $this->instance->get_editor_settings();
		$this->assertFalse( $results['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_passes_publisher_name_without_quotes(): void {
		$blogname = get_option( 'blogname' );
		update_option( 'blogname', "S'mores" );

		$results = $this->instance->get_editor_settings();

		update_option( 'blogname', $blogname );

		$this->assertSame( "S'mores", $results['metadata']['publisher'] );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_admin(): void {
		wp_set_current_user( self::$admin_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );
		$this->experiments->method( 'is_experiment_enabled' )->willReturn( true );

		$this->call_private_method( $this->instance, 'setup_lock', [ self::$story_id ] );

		$value = get_post_meta( self::$story_id, '_edit_lock', true );

		$this->assertNotEmpty( $value );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_experiment_disabled(): void {
		wp_set_current_user( self::$admin_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );
		$this->experiments->method( 'is_experiment_enabled' )->willReturn( false );

		$this->call_private_method( $this->instance, 'setup_lock', [ self::$story_id ] );

		$value = get_post_meta( self::$story_id, '_edit_lock', true );

		$this->assertEmpty( $value );
	}

	/**
	 * @covers ::setup_lock
	 */
	public function test_setup_lock_subscriber(): void {
		wp_set_current_user( self::$subscriber_id );

		$this->experiments->method( 'get_experiment_statuses' )->willReturn( [] );
		$this->experiments->method( 'is_experiment_enabled' )->willReturn( true );

		$this->call_private_method( $this->instance, 'setup_lock', [ self::$story_id ] );

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
