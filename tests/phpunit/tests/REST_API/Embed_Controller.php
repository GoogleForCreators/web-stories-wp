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

class Embed_Controller extends \WP_Test_REST_TestCase {
	/**
	 * @var \WP_REST_Server
	 */
	protected $server;

	protected static $editor;
	protected static $subscriber;

	const INVALID_URL              = 'https://www.notreallyawebsite.com/foobar.html';
	const VALID_URL_EMPTY_DOCUMENT = 'https://empty.example.com';
	const VALID_URL                = 'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp';

	/**
	 * Count of the number of requests attempted.
	 *
	 * @var int
	 */
	protected $request_count = 0;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$subscriber = $factory->user->create(
			[
				'role' => 'subscriber',
			]
		);
		self::$editor     = $factory->user->create(
			[
				'role'       => 'editor',
				'user_email' => 'editor@example.com',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$subscriber );
		self::delete_user( self::$editor );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		add_filter( 'pre_http_request', [ $this, 'mock_http_request' ], 10, 3 );

		$this->request_count = 0;

		$story_post_type = new Story_Post_Type( new Experiments() );
		$story_post_type->add_caps_to_roles();
	}

	public function tearDown() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		remove_filter( 'pre_http_request', [ $this, 'mock_http_request' ] );

		$story_post_type = new Story_Post_Type( new Experiments() );
		$story_post_type->remove_caps_from_roles();

		parent::tearDown();
	}

	/**
	 * Intercept link processing requests and mock responses.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @param string $url     The request URL.
	 * @return array Response data.
	 */
	public function mock_http_request( $preempt, $r, $url ) {
		++ $this->request_count;

		if ( false !== strpos( $url, self::VALID_URL_EMPTY_DOCUMENT ) ) {
			return [
				'response' => [
					'code' => 200,
				],
				'body'     => '<html></html>',
			];
		}

		if ( false !== strpos( $url, self::VALID_URL ) ) {
			return [
				'response' => [
					'code' => 200,
				],
				'body'     => file_get_contents( __DIR__ . '/../../data/stories_in_amp.html' ),
			];
		}

		return [
			'response' => [
				'code' => 404,
			],
		];
	}

	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/embed', $routes );

		$route = $routes['/web-stories/v1/embed'];
		$this->assertCount( 1, $route );
		$this->assertArrayHasKey( 'callback', $route[0] );
		$this->assertArrayHasKey( 'permission_callback', $route[0] );
		$this->assertArrayHasKey( 'methods', $route[0] );
		$this->assertArrayHasKey( 'args', $route[0] );
	}

	public function test_without_permission() {
		// Test without a login.
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertEquals( 400, $response->get_status() );

		// Test with a user that does not have edit_posts capability.
		wp_set_current_user( self::$subscriber );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', self::VALID_URL );
		$response = rest_get_server()->dispatch( $request );

		$this->assertEquals( 403, $response->get_status() );
		$data = $response->get_data();
		$this->assertEquals( $data['code'], 'rest_forbidden' );
	}

	public function test_url_empty_string() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', '' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 0, $this->request_count );
		$this->assertEquals( 404, $response->get_status() );
		$this->assertEquals( $data['code'], 'rest_invalid_url' );
	}

	public function test_invalid_url() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', self::INVALID_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 404, $response->get_status() );
		$this->assertEquals( $data['code'], 'rest_invalid_url' );
	}

	public function test_empty_url() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', self::VALID_URL_EMPTY_DOCUMENT );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 404, $response->get_status() );
		$this->assertEquals( $data['code'], 'rest_invalid_story' );
	}

	public function test_valid_url() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', self::VALID_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$expected = [
			'title'  => 'Stories in AMP - Hello World',
			'poster' => 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg',
		];

		// Subsequent requests are cached, so it should not perform another HTTP request.
		rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	public function test_removes_trailing_slashes() {
		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', self::VALID_URL );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$expected = [
			'title'  => 'Stories in AMP - Hello World',
			'poster' => 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg',
		];

		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', self::VALID_URL . '/' );
		rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}
}
