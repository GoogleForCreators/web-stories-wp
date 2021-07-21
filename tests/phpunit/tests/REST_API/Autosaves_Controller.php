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

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Test_REST_TestCase;
use Spy_REST_Server;
use WP_REST_Request;

/**
 * Class Stories_Autosaves_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass  Google\Web_Stories\REST_API\Autosaves_Controller
 */
class Autosaves_Controller extends Test_REST_TestCase {
	protected $server;

	protected static $author_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$author_id );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->add_caps_to_roles();
	}

	public function tearDown() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$this->remove_caps_from_roles();

		parent::tearDown();
	}

	public function test_create_item_as_author_should_not_strip_markup() {
		wp_set_current_user( self::$author_id );

		$this->kses_int();

		$unsanitized_content    = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content.html' );
		$unsanitized_story_data = json_decode( file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content_filtered.json' ), true );

		$story = self::factory()->post->create(
			[
				'post_type' => Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story/' . $story . '/autosaves' );
		$request->set_body_params(
			[
				'content'    => $unsanitized_content,
				'story_data' => $unsanitized_story_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();

		$this->assertEquals( $unsanitized_content, $new_data['content']['raw'] );
		$this->assertEquals( $unsanitized_story_data, $new_data['story_data'] );

		$this->kses_remove_filters();
	}
}
