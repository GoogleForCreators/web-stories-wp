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

use Google\Web_Stories\Settings;
use Google\Web_Stories\Tests\Capabilities_Setup;
use Google\Web_Stories\Tests\Kses_Setup;
use Spy_REST_Server;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Page_Template_Controller
 */
class Stories_Page_Template_Controller extends \WP_Test_REST_TestCase {
	use Capabilities_Setup;

	protected $server;

	protected static $author_id;
	protected static $subscriber;
	protected static $editor;


	public static function wpSetUpBeforeClass( $factory ) {
		self::$subscriber = $factory->user->create(
			[
				'role' => 'subscriber',
			]
		);
		self::$author_id  = $factory->user->create(
			[
				'role' => 'author',
			]
		);
		self::$editor     = $factory->user->create(
			[
				'role'       => 'editor',
				'user_email' => 'editor@example.com',
			]
		);

		$factory->post->create_many(
			2,
			[
				'post_status' => 'publish',
				'post_author' => self::$editor,
				'post_type'   => \Google\Web_Stories\Page_Template_Post_Type::POST_TYPE_SLUG,
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$author_id );
		self::delete_user( self::$subscriber );
		self::delete_user( self::$editor );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->add_caps_to_roles();

		$this->set_permalink_structure( '/%postname%/' );
	}

	public function tearDown() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$this->remove_caps_from_roles();

		$this->set_permalink_structure( '' );

		parent::tearDown();
	}

	/**
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/web-story-page', $routes );
		$this->assertCount( 2, $routes['/web-stories/v1/web-story-page'] );
	}

	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema() {
		$request  = new WP_REST_Request( 'OPTIONS', '/web-stories/v1/web-story-page' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );

		$properties = $data['schema']['properties'];
		$this->assertArrayHasKey( 'page_data', $properties );
	}

	/**
	 * @covers ::prepare_item_for_database
	 * @covers ::prepare_item_for_response
	 */
	public function test_prepare_item_for_response() {
		wp_set_current_user( self::$author_id );
		$unsanitized_page_data = json_decode( file_get_contents( __DIR__ . '/../../data/page_post_content_filtered.json' ), true );
		$request               = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story-page' );
		$request->set_body_params(
			[
				'page_data' => $unsanitized_page_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertArrayHasKey( 'page_data', $new_data );
		$this->assertArrayHasKey( 'elements', $new_data['page_data'] );
	}

	/**
	 * @covers ::delete_item
	 * @covers ::prepare_item_for_response
	 */
	public function test_delete_item() {
		wp_set_current_user( self::$editor );
		$unsanitized_page_data = json_decode( file_get_contents( __DIR__ . '/../../data/page_post_content_filtered.json' ), true );
		$request               = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story-page' );
		$request->set_body_params(
			[
				'page_data' => $unsanitized_page_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertArrayHasKey( 'page_data', $new_data );
		$this->assertArrayHasKey( 'elements', $new_data['page_data'] );
		$this->assertArrayHasKey( 'id', $new_data );
		$id = $new_data['id'];

		wp_set_current_user( self::$author_id );
		$request = new WP_REST_Request( \WP_REST_Server::DELETABLE, '/web-stories/v1/web-story-page/' . $id );
		$request->set_body_params(
			[
				'force' => 'false',
			]
		);
		$response = rest_get_server()->dispatch( $request );
		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'page_data', $data );
	}

	/**
	 * @covers ::prepare_item_for_database
	 */
	public function test_prepare_item_for_response_invalid() {
		wp_set_current_user( self::$author_id );
		$unsanitized_page_data = '-1';
		$request               = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story-page' );
		$request->set_body_params(
			[
				'page_data' => $unsanitized_page_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_invalid_param', $response, 400 );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_item() {
		wp_set_current_user( self::$author_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story-page' );

		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertCount( 2, $data );
	}
}
