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

class Admin extends \WP_UnitTestCase {
	
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

	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id       = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);
		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	public function test_init() {
		$admin = new \Google\Web_Stories\Admin();
		$admin->init();

		$this->assertSame( 99, has_filter( 'admin_body_class', [ $admin, 'admin_body_class' ] ) );
		$this->assertSame( 10, has_filter( 'default_content', [ $admin, 'prefill_post_content' ] ) );
		$this->assertSame( 10, has_filter( 'default_title', [ $admin, 'prefill_post_title' ] ) );

	}

	public function test_admin_body_class() {
		$admin = new \Google\Web_Stories\Admin();
		wp_set_current_user( self::$admin_id );
		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$result                    = $admin->admin_body_class( 'current' );
		$this->assertContains( 'folded', $result );
	}

	public function test_prefill_post_content() {
		$admin = new \Google\Web_Stories\Admin();
		wp_set_current_user( self::$admin_id );
		$_GET['from-web-story'] = self::$story_id;
		$result                 = $admin->prefill_post_content( 'current' );
		$poster                 = (string) wp_get_attachment_image_url( (int) get_post_thumbnail_id( self::$story_id ), \Google\Web_Stories\Media::STORY_POSTER_IMAGE_SIZE );
		$this->assertContains( 'wp-block-web-stories-embed', $result );
		$this->assertContains( $poster, $result );
	}

	public function test_prefill_post_content_invalid_user() {
		$admin = new \Google\Web_Stories\Admin();
		wp_set_current_user( 0 );
		$_GET['from-web-story'] = self::$story_id;
		$result                 = $admin->prefill_post_content( 'current' );
		$this->assertSame( 'current', $result );
	}

	public function test_prefill_post_content_invalid_id() {
		$admin = new \Google\Web_Stories\Admin();
		wp_set_current_user( self::$admin_id );
		$_GET['from-web-story'] = 999999999;
		$result                 = $admin->prefill_post_content( 'current' );
		$this->assertSame( 'current', $result );
	}

	public function test_prefill_post_title() {
		$admin = new \Google\Web_Stories\Admin();
		wp_set_current_user( self::$admin_id );
		$_GET['from-web-story'] = self::$story_id;
		$result                 = $admin->prefill_post_title( 'current' );
		$this->assertSame( 'Example title', $result );
	}

}
