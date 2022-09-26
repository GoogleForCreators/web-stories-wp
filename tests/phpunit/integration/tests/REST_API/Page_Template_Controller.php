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

namespace Google\Web_Stories\Tests\Integration\REST_API;

use DateTime;
use Google\Web_Stories\Tests\Integration\RestTestCase;
use WP_REST_Request;

/**
 * Class Page_Template_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Page_Template_Controller
 */
class Page_Template_Controller extends RestTestCase {

	protected $server;

	protected static $user_id;
	protected static $user2_id;
	protected static $user3_id;

	protected static $author_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Page_Template_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);

		self::$user2_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Jane Doe',
			]
		);

		self::$user3_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Zane Doe',
			]
		);

		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);

		$factory->post->create_many(
			3,
			[
				'post_status' => 'publish',
				'post_author' => self::$user_id,
			]
		);

		$factory->post->create_many(
			3,
			[
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);

		$factory->post->create_many(
			2,
			[
				'post_status' => 'publish',
				'post_author' => self::$user2_id,
			]
		);

		$factory->post->create_many(
			2,
			[
				'post_status' => 'publish',
				'post_author' => self::$user3_id,
			]
		);

		$factory->post->create_many(
			3,
			[
				'post_status' => 'draft',
				'post_author' => self::$user_id,
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$this->controller = new \Google\Web_Stories\REST_API\Page_Template_Controller( 'post' );
	}

	/**
	 * @covers ::get_collection_params
	 */
	public function test_get_collection_params(): void {
		$actual = $this->controller->get_collection_params();

		$this->assertArrayHasKey( '_web_stories_envelope', $actual );
	}

	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema(): void {
		$actual = $this->controller->get_item_schema();

		$this->assertArrayNotHasKey( 'permalink_template', $actual['properties'] );
		$this->assertArrayNotHasKey( 'generated_slug', $actual['properties'] );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_format(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );

		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/wp/v2/posts' );
		$request->set_param( 'status', [ 'draft' ] );
		$request->set_param( 'context', 'edit' );
		$request->set_param( 'page', '1' );
		$request->set_param( '_web_stories_envelope', true );

		$response = $this->controller->get_items( $request );

		$data = $response->get_data();

		// Body of request.
		$this->assertArrayHasKey( 'headers', $data );
		$this->assertArrayHasKey( 'body', $data );
		$this->assertArrayHasKey( 'status', $data );

		$this->assertEquals( 3, $data['headers']['X-WP-Total'] );
	}

	/**
	 * @covers ::create_item
	 */
	public function test_create_item_as_author_should_not_strip_markup(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$author_id );

		$this->kses_int();

		$unsanitized_story_data = json_decode( file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content_filtered.json' ), true );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story-page' );
		$request->set_body_params(
			[
				'story_data' => $unsanitized_story_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertArrayHasKey( 'story_data', $new_data );
		$this->assertSame( $unsanitized_story_data, $new_data['story_data'] );
	}
}
