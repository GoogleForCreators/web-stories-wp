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
 * @coversDefaultClass \Google\Web_Stories\Story_Post_Type
 */
class Story_Post_Type extends \WP_UnitTestCase {

	use Private_Access;

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
				'post_title'   => 'Example title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
			]
		);
	}

	public function setUp() {
		parent::setUp();

		do_action( 'init' );

		// Registered during init.
		unregister_block_type( 'web-stories/embed' );
	}

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$story_post_type = new \Google\Web_Stories\Story_Post_Type();
		$story_post_type->init();

		$this->assertSame( 10, has_filter( 'admin_enqueue_scripts', [ $story_post_type, 'admin_enqueue_scripts' ] ) );
		$this->assertSame( 10, has_filter( 'show_admin_bar', [ $story_post_type, 'show_admin_bar' ] ) );
		$this->assertSame( 10, has_filter( 'replace_editor', [ $story_post_type, 'replace_editor' ] ) );
		$this->assertSame( 10, has_filter( 'use_block_editor_for_post_type', [ $story_post_type, 'filter_use_block_editor_for_post_type' ] ) );
		$this->assertSame( 10, has_filter( 'template_include', [ $story_post_type, 'filter_template_include' ] ) );
		$this->assertSame( PHP_INT_MAX, has_filter( 'amp_skip_post', [ $story_post_type, 'skip_amp' ] ) );
		$this->assertSame( 10, has_filter( '_wp_post_revision_fields', [ $story_post_type, 'filter_revision_fields' ] ) );
		$this->assertSame( 10, has_filter( 'googlesitekit_amp_gtag_opt', [ $story_post_type, 'filter_site_kit_gtag_opt' ] ) );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_admin() {
		wp_set_current_user( self::$admin_id );
		$post_type = new \Google\Web_Stories\Story_Post_Type();
		$results   = $post_type->get_editor_settings();
		$this->assertTrue( $results['config']['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::get_editor_settings
	 */
	public function test_get_editor_settings_sub() {
		wp_set_current_user( self::$subscriber_id );
		$post_type = new \Google\Web_Stories\Story_Post_Type();
		$results   = $post_type->get_editor_settings();
		$this->assertFalse( $results['config']['capabilities']['hasUploadMediaAction'] );
	}

	/**
	 * @covers ::filter_rest_collection_params
	 */
	public function test_filter_rest_collection_params() {
		$query_params = [
			'foo',
			'orderby' => [
				'enum' => [],
			],
		];

		$post_type        = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$filtered_params  = $post_type_object->filter_rest_collection_params( $query_params, $post_type );
		$this->assertEquals(
			$filtered_params,
			[
				'foo',
				'orderby' => [
					'enum' => [ 'story_author' ],
				],
			]
		);
	}

	/**
	 * @covers ::filter_rest_collection_params
	 */
	public function test_filter_rest_collection_params_incorrect_post_type() {
		$query_params = [
			'foo',
			'orderby' => [
				'enum' => [],
			],
		];

		$post_type        = new \stdClass();
		$post_type->name  = 'post';
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$filtered_params  = $post_type_object->filter_rest_collection_params( $query_params, $post_type );
		$this->assertEquals( $filtered_params, $query_params );
	}

	/**
	 * @covers ::get_post_type_icon
	 */
	public function test_get_post_type_icon() {
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$valid            = $this->call_private_method( $post_type_object, 'get_post_type_icon' );
		$this->assertContains( 'data:image/svg+xml;base64', $valid );
	}

	/**
	 * @covers ::admin_enqueue_scripts
	 */
	public function test_admin_enqueue_scripts() {
		$post_type_object          = new \Google\Web_Stories\Story_Post_Type();
		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$post_type_object->admin_enqueue_scripts( 'post.php' );
		$this->assertTrue( wp_script_is( \Google\Web_Stories\Story_Post_Type::WEB_STORIES_SCRIPT_HANDLE, 'registered' ) );
		$this->assertTrue( wp_style_is( \Google\Web_Stories\Story_Post_Type::WEB_STORIES_SCRIPT_HANDLE, 'registered' ) );
	}

	/**
	 * @covers ::filter_site_kit_gtag_opt
	 */
	public function test_filter_site_kit_gtag_opt() {
		$this->go_to( get_permalink( self::$story_id ) );
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$gtag             = [
			'vars'     => [
				'gtag_id' => 'hello',
			],
			'triggers' => [],
		];
		$result           = $post_type_object->filter_site_kit_gtag_opt( $gtag );

		$this->assertArrayHasKey( 'storyProgress', $result['triggers'] );
		$this->assertArrayHasKey( 'storyEnd', $result['triggers'] );
		$this->assertSame( 'Example title', $result['triggers']['storyProgress']['vars']['event_category'] );
		$this->assertSame( 'Example title', $result['triggers']['storyEnd']['vars']['event_category'] );
	}

	/**
	 * @covers ::filter_use_block_editor_for_post_type
	 */
	public function test_filter_use_block_editor_for_post_type() {
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$use_block_editor = $post_type_object->filter_use_block_editor_for_post_type( true, $post_type_object::POST_TYPE_SLUG );
		$this->assertFalse( $use_block_editor );
	}

	/**
	 * @covers ::skip_amp
	 */
	public function test_skip_amp() {
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$skip_amp         = $post_type_object->skip_amp( true, get_post( self::$story_id ) );
		$this->assertTrue( $skip_amp );
	}


	/**
	 * @covers ::filter_template_include
	 */
	public function test_filter_template_include() {
		$this->go_to( get_permalink( self::$story_id ) );
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$template_include = $post_type_object->filter_template_include( 'current' );
		$this->assertContains( WEBSTORIES_PLUGIN_DIR_PATH, $template_include );
	}

	/**
	 * @covers ::show_admin_bar
	 */
	public function test_show_admin_bar() {
		$this->go_to( get_permalink( self::$story_id ) );
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$show_admin_bar   = $post_type_object->show_admin_bar( 'current' );
		$this->assertFalse( $show_admin_bar );
	}

	/**
	 * @covers ::replace_editor
	 */
	public function test_replace_editor() {
		$post_type_object = new \Google\Web_Stories\Story_Post_Type();
		$replace_editor   = $post_type_object->replace_editor( false, get_post( self::$story_id ) );
		$this->assertTrue( $replace_editor );
	}
}
