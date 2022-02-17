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

use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Class Embed_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Embed_Controller
 */
class Embed_Controller extends DependencyInjectedRestTestCase {

	protected static $story_id;
	protected static $subscriber;
	protected static $editor;
	protected static $admin;

	public const INVALID_URL              = 'https://www.notreallyawebsite.com/foobar.html';
	public const VALID_URL_EMPTY_DOCUMENT = 'https://empty.example.com';
	public const VALID_URL                = 'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp';

	/**
	 * Count of the number of requests attempted.
	 *
	 * @var int
	 */
	protected $request_count = 0;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Embed_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
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
		self::$admin      = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		// When running the tests, we don't have unfiltered_html capabilities.
		// This change avoids HTML in post_content being stripped in our test posts because of KSES.
		remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
		remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

		$story_content  = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content.html' );
		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Embed Controller Test Story',
				'post_status'  => 'publish',
				'post_content' => $story_content,
			]
		);

		add_filter( 'content_save_pre', 'wp_filter_post_kses' );
		add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
	}

	public function set_up(): void {
		parent::set_up();

		add_filter( 'pre_http_request', [ $this, 'mock_http_request' ], 10, 3 );
		$this->request_count = 0;

		$this->controller = $this->injector->make( \Google\Web_Stories\REST_API\Embed_Controller::class );
	}

	public function tear_down(): void {
		remove_filter( 'pre_http_request', [ $this, 'mock_http_request' ] );

		parent::tear_down();
	}

	/**
	 * Intercept link processing requests and mock responses.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @param string $url     The request URL.
	 * @return array Response data.
	 */
	public function mock_http_request( $preempt, $r, $url ): array {
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
				'body'     => file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/stories_in_amp.html' ),
			];
		}

		return [
			'response' => [
				'code' => 404,
			],
		];
	}

	/**
	 * @covers ::register_routes
	 */
	public function test_register_routes(): void {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/embed', $routes );

		$route = $routes['/web-stories/v1/embed'];
		$this->assertCount( 1, $route );
		$this->assertArrayHasKey( 'callback', $route[0] );
		$this->assertArrayHasKey( 'permission_callback', $route[0] );
		$this->assertArrayHasKey( 'methods', $route[0] );
		$this->assertArrayHasKey( 'args', $route[0] );
	}

	protected function dispatch_request( $url = null ): WP_REST_Response {
		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		if ( null !== $url ) {
			$request->set_param( 'url', $url );
		}
		return rest_get_server()->dispatch( $request );
	}

	public function test_missing_param(): void {
		$this->controller->register();

		$response = $this->dispatch_request();

		$this->assertErrorResponse( 'rest_missing_callback_param', $response, 400 );
	}

	public function test_not_logged_in(): void {
		$this->controller->register();


		$response = $this->dispatch_request( '' );

		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	public function test_without_permission(): void {
		$this->controller->register();

		wp_set_current_user( self::$subscriber );

		$response = $this->dispatch_request( self::VALID_URL );

		$this->assertEquals( 0, $this->request_count );
		$this->assertErrorResponse( 'rest_forbidden', $response, 403 );
	}

	public function test_url_empty_string(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );

		$response = $this->dispatch_request( '' );

		$this->assertEquals( 0, $this->request_count );
		$this->assertErrorResponse( 'rest_invalid_url', $response, 404 );
	}

	public function test_invalid_url(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );

		$response = $this->dispatch_request( self::INVALID_URL );

		$this->assertErrorResponse( 'rest_invalid_url', $response, 404 );
	}

	public function test_empty_url(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );

		$response = $this->dispatch_request( self::VALID_URL_EMPTY_DOCUMENT );

		$this->assertErrorResponse( 'rest_invalid_story', $response, 404 );
	}

	public function test_valid_url(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$response = $this->dispatch_request( self::VALID_URL );
		$data     = $response->get_data();

		$expected = [
			'title'  => 'Stories in AMP - Hello World',
			'poster' => 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg',
		];

		// Subsequent requests are cached, so it should not perform another HTTP request.
		$this->dispatch_request( self::VALID_URL );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	public function test_removes_trailing_slashes(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$response = $this->dispatch_request( self::VALID_URL );
		$data     = $response->get_data();

		$expected = [
			'title'  => 'Stories in AMP - Hello World',
			'poster' => 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg',
		];

		$request = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/embed' );
		$request->set_param( 'url', self::VALID_URL . '/' );
		rest_get_server()->dispatch( $request );
		$this->assertEquals( 1, $this->request_count );

		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	public function test_local_url(): void {
		$this->controller->register();

		wp_set_current_user( self::$editor );

		$this->set_permalink_structure( '' );

		$response = $this->dispatch_request( get_permalink( self::$story_id ) );
		$data     = $response->get_data();

		$expected = [
			'title'  => '',
			'poster' => 'https:/example.com/poster.png',
		];

		$this->assertEquals( 0, $this->request_count );
		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	public function test_local_url_pretty_permalinks(): void {
		$this->controller->register();

		$this->set_permalink_structure( '/%postname%/' );

		// Without (re-)registering the post type here there won't be any rewrite rules for it
		// and get_permalink() will return "http://example.org/?web-story=embed-controller-test-story"
		// instead of "http://example.org/web-stories/embed-controller-test-story/".
		// @todo Investigate why this is  needed (leakage between tests?)
		$story_post_type = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$story_post_type->register();

		flush_rewrite_rules( false );

		wp_set_current_user( self::$editor );

		$response = $this->dispatch_request( get_permalink( self::$story_id ) );
		$data     = $response->get_data();

		$expected = [
			'title'  => '',
			'poster' => 'https:/example.com/poster.png',
		];

		$this->assertEquals( 0, $this->request_count );
		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}

	/**
	 * @group ms-required
	 */
	public function test_local_url_pretty_permalinks_multisite(): void {
		$this->controller->register();

		$this->set_permalink_structure( '/%postname%/' );

		// Without (re-)registering the post type here there won't be any rewrite rules for it
		// and get_permalink() will return "http://example.org/?web-story=embed-controller-test-story"
		// instead of "http://example.org/web-stories/embed-controller-test-story/".
		// @todo Investigate why this is  needed (leakage between tests?).
		$story_post_type = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$story_post_type->register();

		flush_rewrite_rules( false );

		wp_set_current_user( self::$admin );

		$permalink = get_permalink( self::$story_id );

		$blog_id = (int) self::factory()->blog->create();
		add_user_to_blog( $blog_id, self::$admin, 'administrator' );
		switch_to_blog( $blog_id );

		$this->set_permalink_structure( '/%postname%/' );

		$response = $this->dispatch_request( $permalink );
		$data     = $response->get_data();

		restore_current_blog();

		$expected = [
			'title'  => '',
			'poster' => 'https:/example.com/poster.png',
		];

		$this->assertEquals( 0, $this->request_count );
		$this->assertNotEmpty( $data );
		$this->assertEqualSetsWithIndex( $expected, $data );
	}
}
