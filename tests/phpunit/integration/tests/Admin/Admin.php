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

use DateTime;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Admin
 */
class Admin extends DependencyInjectedTestCase {

	/**
	 * Settings for test.
	 * 
	 * @var \Google\Web_Stories\Settings
	 */
	private $settings;
	
	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Story ID.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * Post ID.
	 *
	 * @var int
	 */
	protected static $post_id;

	public static function wpSetUpBeforeClass( $factory ): void {
		
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id       = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Admin Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);
		self::$post_id        = $factory->post->create( [] );
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

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Admin\Admin
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();
		$this->settings = $this->injector->make( \Google\Web_Stories\Settings::class );
		$this->instance = $this->injector->make( \Google\Web_Stories\Admin\Admin::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 99, has_filter( 'admin_body_class', [ $this->instance, 'admin_body_class' ] ) );
		$this->assertSame( 10, has_filter( 'default_content', [ $this->instance, 'prefill_post_content' ] ) );
		$this->assertSame( 10, has_filter( 'default_title', [ $this->instance, 'prefill_post_title' ] ) );

	}

	/**
	 * @covers ::admin_body_class
	 */
	public function test_admin_body_class(): void {
		wp_set_current_user( self::$admin_id );
		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$result                    = $this->instance->admin_body_class( 'current' );
		$this->assertStringContainsString( 'folded', $result );
	}

	/**
	 * @covers ::prefill_post_content
	 */
	public function test_prefill_post_content(): void {
		wp_set_current_user( self::$admin_id );

		$_GET['from-web-story'] = self::$story_id;
		$result                 = $this->instance->prefill_post_content( 'current', get_post( self::$post_id ) );
		$poster                 = (string) wp_get_attachment_image_url( (int) get_post_thumbnail_id( self::$story_id ), \Google\Web_Stories\Media\Image_Sizes::POSTER_PORTRAIT_IMAGE_SIZE );
		$this->assertStringContainsString( 'wp-block-web-stories-embed', $result );
		$this->assertStringContainsString( $poster, $result );
	}

	/**
	 * @covers ::prefill_post_content
	 */
	public function test_prefill_post_content_url_scheduled(): void {
		wp_set_current_user( self::$admin_id );
	
		$story_id = self::factory()->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status'  => 'future',
				'post_date'    => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_title'   => 'Example',
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);
	
		$_GET['from-web-story'] = $story_id;
		$result                 = $this->instance->prefill_post_content( 'current', get_post( self::$post_id ) );
	
		$this->assertStringNotContainsString( sprintf( '"url":"http://example.org/?post_type=web-story&#038;p=%s', $story_id ), $result );
		$this->assertStringContainsString( sprintf( '"url":"http://example.org/?post_type=web-story&p=%s', $story_id ), $result );
	}

	/**
	 * @covers ::prefill_post_content
	 */
	public function test_prefill_post_content_invalid_user(): void {
		wp_set_current_user( 0 );

		$_GET['from-web-story'] = self::$story_id;
		$result                 = $this->instance->prefill_post_content( 'current', get_post( self::$post_id ) );
		$this->assertSame( 'current', $result );
	}


	/**
	 * @covers ::prefill_post_content
	 */
	public function test_prefill_post_content_shortcode(): void {
		add_filter( 'use_block_editor_for_post', '__return_false' );

		wp_set_current_user( self::$admin_id );

		$_GET['from-web-story'] = self::$story_id;
		$result                 = $this->instance->prefill_post_content( 'current', get_post( self::$post_id ) );
		$poster                 = (string) wp_get_attachment_image_url( (int) get_post_thumbnail_id( self::$story_id ), \Google\Web_Stories\Media\Image_Sizes::POSTER_PORTRAIT_IMAGE_SIZE );
		$this->assertStringContainsString( '[web_stories_embed', $result );
		$this->assertStringContainsString( $poster, $result );
		remove_filter( 'use_block_editor_for_post', '__return_false' );
	}

	/**
	 * @covers ::prefill_post_content
	 */
	public function test_prefill_post_content_invalid_id(): void {
		wp_set_current_user( self::$admin_id );

		$_GET['from-web-story'] = 999999999;
		$result                 = $this->instance->prefill_post_content( 'current', get_post( self::$post_id ) );
		$this->assertSame( 'current', $result );
	}

	/**
	 * @covers ::prefill_post_title
	 */
	public function test_prefill_post_title(): void {
		wp_set_current_user( self::$admin_id );

		$_GET['from-web-story'] = self::$story_id;
		$result                 = $this->instance->prefill_post_title( 'current' );
		$this->assertSame( 'Admin Test Story', $result );
	}

	/**
	 * @covers ::prefill_post_title
	 */
	public function test_prefill_post_title_no_texturize(): void {
		wp_set_current_user( self::$admin_id );

		$_GET['from-web-story'] = self::$story_id;

		$original_title = get_post( self::$story_id )->post_title;

		wp_update_post(
			[
				'ID'         => self::$story_id,
				// Not just a hyphen, but an en dash.
				'post_title' => 'Story - Test',
			]
		);

		$result = $this->instance->prefill_post_title( 'current' );

		// Cleanup.
		wp_update_post(
			[
				'ID'         => self::$story_id,
				'post_title' => $original_title,
			]
		);

		$this->assertSame( 'Story - Test', $result );
	}

	/**
	 * @covers ::media_states
	 */
	public function test_media_states_no_active_logo(): void {
		$post   = self::factory()->post->create_and_get( [] );
		$result = $this->instance->media_states( [], $post );
		$this->assertEqualSets( [], $result );
	}

	/**
	 * @covers ::media_states
	 */
	public function test_media_states_with_active_logo(): void {
		$post = self::factory()->post->create_and_get( [] );
		$this->settings->update_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $post->ID );
		$result = $this->instance->media_states( [], $post );
		$this->assertSame( 'Web Stories Publisher Logo', $result[0] );
	}
}
