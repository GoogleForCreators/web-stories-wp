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

use Spy_REST_Server;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\User_Preferences
 */
class User_Preferences extends \WP_Test_REST_TestCase {
	protected static $user_id;

	protected static $author_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
		self::delete_user( self::$author_id );
	}

	public function tearDown() {
		unregister_meta_key( 'user', \Google\Web_Stories\User_Preferences::OPTIN_META_KEY );
		parent::tearDown();
	}

	/**
	 * @covers ::init
	 * @covers ::can_edit_current_user
	 */
	public function test_add_optin_field_to_rest_api() {
		wp_set_current_user( self::$user_id );
		( new \Google\Web_Stories\User_Preferences() )->init();
		add_user_meta( get_current_user_id(), \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, true );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, sprintf( '/wp/v2/users/%d', self::$user_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'meta', $data );
		$this->assertArrayHasKey( \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY, $data['meta'] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User_Preferences::OPTIN_META_KEY ] );
		$this->assertEqualSets( [], $data['meta'][ \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY ] );
	}

	/**
	 * @covers ::init
	 * @covers ::can_edit_current_user
	 */
	public function test_add_optin_field_to_rest_api_for_author_user() {
		wp_set_current_user( self::$author_id );
		( new \Google\Web_Stories\User_Preferences() )->init();
		add_user_meta( get_current_user_id(), \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, true );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/wp/v2/users/me' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'meta', $data );
		$this->assertArrayHasKey( \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY, $data['meta'] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User_Preferences::OPTIN_META_KEY ] );
		$this->assertEqualSets( [], $data['meta'][ \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY ] );
	}

	/**
	 * @covers ::init
	 * @covers ::can_edit_current_user
	 */
	public function test_enables_author_user_to_update_meta_field() {
		wp_set_current_user( self::$author_id );
		( new \Google\Web_Stories\User_Preferences() )->init();
		add_user_meta( get_current_user_id(), \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, false );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/wp/v2/users/me' );
		$request->set_body_params(
			[
				'meta' => [
					\Google\Web_Stories\User_Preferences::OPTIN_META_KEY      => true,
					\Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY => [
						'hello' => 'world',
					],
				],
			]
		);
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'meta', $data );
		$this->assertArrayHasKey( \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY, $data['meta'] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User_Preferences::OPTIN_META_KEY ] );
		$this->assertArrayHasKey( 'hello', $data['meta'][ \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY ] );
		$this->assertEqualSets( [ 'hello' => 'world' ], $data['meta'][ \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY ] );
	}

	/**
	 * @covers ::init
	 * @covers ::can_edit_current_user
	 */
	public function test_enables_author_user_to_invalid_type() {
		wp_set_current_user( self::$author_id );
		( new \Google\Web_Stories\User_Preferences() )->init();
		add_user_meta( get_current_user_id(), \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, false );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/wp/v2/users/me' );
		$request->set_body_params(
			[
				'meta' => [
					\Google\Web_Stories\User_Preferences::OPTIN_META_KEY      => true,
					\Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY => false,
				],
			]
		);
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_invalid_type', $response, 400 );
	}
}
