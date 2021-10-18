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

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use WP_REST_Request;
use Google\Web_Stories\Tests\Integration\Test_REST_TestCase;

/**
 * Class Status_Check_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Status_Check_Controller
 */
class Status_Check_Controller extends Test_REST_TestCase {
	/**
	 * @var \WP_REST_Server
	 */
	protected $server;

	protected static $editor;
	protected static $subscriber;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Status_Check_Controller
	 */
	private $controller;

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

	public function set_up() {
		parent::set_up();

		$settings         = new Settings();
		$this->controller = new \Google\Web_Stories\REST_API\Status_Check_Controller(
			new Story_Post_Type( $settings, new Experiments( $settings ) )
		);
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$this->controller->register();

		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/status-check', $routes );
	}

	/**
	 * @covers ::status_check_permissions_check
	 * @covers ::status_check
	 */
	public function test_no_user() {
		$this->controller->register();

		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/status-check' );
		$request->set_param( 'content', '<a href="#">Test</a>' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	/**
	 * @covers ::status_check_permissions_check
	 * @covers ::status_check
	 */
	public function test_without_permission() {
		$this->controller->register();

		wp_set_current_user( self::$subscriber );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/status-check' );
		$request->set_param( 'content', '<a href="#">Test</a>' );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_forbidden', $response, 403 );
	}

	/**
	 * @covers ::status_check_permissions_check
	 * @covers ::status_check
	 */
	public function test_status_check() {
		$this->controller->register();

		wp_set_current_user( self::$editor );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/status-check' );
		$request->set_param( 'content', '<a href="#">Test</a>' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertEquals( 200, $response->get_status() );
		$data = $response->get_data();
		$this->assertArrayHasKey( 'success', $data );
		$this->assertTrue( $data['success'] );
	}
}
