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

namespace Google\Web_Stories\Tests\REST_API;

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Story_Post_Type;
use Spy_REST_Server;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Media_Controller
 */
class Stories_Media_Controller extends \WP_Test_REST_TestCase {
	/**
	 * @var int
	 */
	protected static $user_id;

	/**
	 * @param $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		$factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-videeo.mov',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mov',
				'post_title'     => 'Test Video Move',
			]
		);

		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$story_post_type = new Story_Post_Type( new Experiments() );
		$story_post_type->add_caps_to_roles();
	}

	public function tearDown() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$story_post_type = new Story_Post_Type( new Experiments() );
		$story_post_type->remove_caps_from_roles();

		parent::tearDown();
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_format() {
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media' );
		$request->set_param( 'context', 'edit' );
		$request->set_param( '_web_stories_envelope', true );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		// Body of request.
		$this->assertArrayHasKey( 'headers', $data );
		$this->assertArrayHasKey( 'body', $data );
		$this->assertArrayHasKey( 'status', $data );
	}

	/**
	 * @covers ::get_items
	 * @covers ::prepare_items_query
	 */
	public function test_get_items_filter_mime() {
		wp_set_current_user( self::$user_id );
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertCount( 2, $data );
		$mime_type = wp_list_pluck( $data, 'mime_type' );
		$this->assertNotContains( 'video/mov', $mime_type );
		$this->assertContains( 'image/jpeg', $mime_type );
		$this->assertContains( 'video/mp4', $mime_type );
	}

	/**
	 * @covers ::get_items
	 * @covers ::get_media_types
	 */
	public function test_get_items_filter_video() {
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media' );
		$request->set_param( 'media_type', 'video' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertCount( 1, $data );
		$mime_type = wp_list_pluck( $data, 'mime_type' );
		$this->assertNotContains( 'video/mov', $mime_type );
		$this->assertContains( 'video/mp4', $mime_type );
	}
}
