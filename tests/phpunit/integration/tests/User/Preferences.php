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

namespace Google\Web_Stories\Tests\Integration\User;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use WP_REST_Request;

/**
 * @coversDefaultClass \Google\Web_Stories\User\Preferences
 */
class Preferences extends DependencyInjectedTestCase {
	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Author user for test.
	 *
	 * @var int
	 */
	protected static $author_id;

	/**
	 * @var \Google\Web_Stories\User\Preferences
	 */
	private $instance;

	public static function wpSetUpBeforeClass( $factory ): void {
		self::$admin_id = $factory->user->create(
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

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\User\Preferences::class );
	}

	public function tear_down(): void {
		delete_user_meta( self::$admin_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY );
		delete_user_meta( self::$admin_id, \Google\Web_Stories\User\Preferences::OPTIN_META_KEY );
		delete_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY );
		delete_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::OPTIN_META_KEY );

		unregister_meta_key( 'user', \Google\Web_Stories\User\Preferences::OPTIN_META_KEY );
		unregister_meta_key( 'user', \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY );
		unregister_meta_key( 'user', \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY );

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 * @covers ::can_edit_current_user
	 */
	public function test_add_optin_field_to_rest_api(): void {
		$this->instance->register();

		wp_set_current_user( self::$admin_id );

		add_user_meta( self::$admin_id, \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, true );
		add_user_meta( self::$admin_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, true );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, sprintf( '/wp/v2/users/%d', self::$admin_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'meta', $data );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, $data['meta'] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User\Preferences::OPTIN_META_KEY ] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY ] );
		$this->assertEqualSets( [], $data['meta'][ \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY ] );
	}

	/**
	 * @covers ::register
	 * @covers ::can_edit_current_user
	 */
	public function test_add_optin_field_to_rest_api_for_author_user(): void {
		$this->instance->register();

		wp_set_current_user( self::$author_id );

		add_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, true );
		add_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, true );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/wp/v2/users/me' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'meta', $data );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY, $data['meta'] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User\Preferences::OPTIN_META_KEY ] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY ] );
		$this->assertEqualSets( [], $data['meta'][ \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY ] );
	}

	/**
	 * @covers ::register
	 * @covers ::can_edit_current_user
	 */
	public function test_enables_author_user_to_update_meta_field(): void {
		$this->instance->register();

		wp_set_current_user( self::$author_id );

		add_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, false );
		add_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, false );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/wp/v2/users/me' );
		$request->set_body_params(
			[
				'meta' => [
					\Google\Web_Stories\User\Preferences::OPTIN_META_KEY              => true,
					\Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY => true,
					\Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY         => [
						'hello' => 'world',
					],
				],
			]
		);
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'meta', $data );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, $data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY, $data['meta'] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User\Preferences::OPTIN_META_KEY ] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY ] );
		$this->assertArrayHasKey( 'hello', $data['meta'][ \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY ] );
		$this->assertEqualSets( [ 'hello' => 'world' ], $data['meta'][ \Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY ] );
	}

	/**
	 * @covers ::register
	 * @covers ::can_edit_current_user
	 */
	public function test_permission_check_for_authors(): void {
		$this->instance->register();

		wp_set_current_user( self::$author_id );

		add_user_meta( self::$admin_id, \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, false );
		add_user_meta( self::$admin_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, false );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/wp/v2/users/' . self::$admin_id );
		$request->set_body_params(
			[
				'meta' => [
					\Google\Web_Stories\User\Preferences::OPTIN_META_KEY              => true,
					\Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY => true,
					\Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY         => [
						'hello' => 'world',
					],
				],
			]
		);

		$response = rest_get_server()->dispatch( $request );
		if ( is_a( $response, 'WP_REST_Response' ) ) {
			$response = $response->as_error();
		}

		$this->assertWPError( $response );
		$this->assertSame( 'rest_cannot_edit', $response->get_error_code() );
		$data = $response->get_error_data();
		$this->assertArrayHasKey( 'status', $data );
		$this->assertEquals( 403, $data['status'] );
	}

	/**
	 * @covers ::register
	 * @covers ::can_edit_current_user
	 */
	public function test_enables_author_user_to_invalid_type(): void {
		$this->instance->register();

		wp_set_current_user( self::$author_id );

		add_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::OPTIN_META_KEY, false );
		add_user_meta( self::$author_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, false );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/wp/v2/users/me' );
		$request->set_body_params(
			[
				'meta' => [
					\Google\Web_Stories\User\Preferences::OPTIN_META_KEY              => true,
					\Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY => true,
					\Google\Web_Stories\User\Preferences::ONBOARDING_META_KEY         => false,
				],
			]
		);

		$response = rest_get_server()->dispatch( $request );
		if ( $response instanceof \WP_REST_Response ) {
			$response = $response->as_error();
		}

		$this->assertWPError( $response );
		$data = $response->get_error_data();
		$this->assertArrayHasKey( 'status', $data );
		$this->assertEquals( 400, $data['status'] );
	}
}
