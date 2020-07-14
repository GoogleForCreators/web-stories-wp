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
 * @coversDefaultClass \Google\Web_Stories\Tracking
 */
class Tracking extends \WP_UnitTestCase {
	protected static $user_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
	}

	/**
	 * @covers ::init
	 */
	public function test_add_optin_field_to_rest_api() {
		wp_set_current_user( self::$user_id );
		( new \Google\Web_Stories\Tracking() )->init();
		add_user_meta( get_current_user_id(), \Google\Web_Stories\Tracking::OPTIN_META_KEY, true );

		$request  = new WP_REST_Request( 'GET', sprintf( '/wp/v2/users/%d', self::$user_id ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertArrayHasKey( \Google\Web_Stories\Tracking::OPTIN_META_KEY, $data['meta'] );
		$this->assertTrue( $data['meta'][ \Google\Web_Stories\Tracking::OPTIN_META_KEY ] );
	}

	/**
	 * @covers ::init
	 */
	public function test_register_tracking_script() {
		$this->assertTrue( wp_script_is( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, 'registered' ) );
		$this->assertFalse( wp_scripts()->registered[ \Google\Web_Stories\Tracking::SCRIPT_HANDLE ]->src );
		$after = wp_scripts()->get_data( \Google\Web_Stories\Tracking::SCRIPT_HANDLE, 'after' );
		$this->assertNotEmpty( $after );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings() {
		wp_set_current_user( self::$user_id );

		add_filter( 'site_url', [ $this, 'filter_site_url' ] );
		$settings = ( new \Google\Web_Stories\Tracking() )->get_settings();
		remove_filter( 'site_url', [ $this, 'filter_site_url' ] );

		$expected = [
			'trackingAllowed' => false,
			'trackingId'      => \Google\Web_Stories\Tracking::TRACKING_ID,
			'siteUrl'         => 'https://example.com/with/trailing/slash',
			'userIdHash'      => md5( 'https://example.com/with/trailing/slash|' . self::$user_id ),
		];

		$this->assertEqualSetsWithIndex( $expected, $settings );
	}

	/**
	 * @covers ::get_settings
	 */
	public function test_get_settings_with_optin() {
		wp_set_current_user( self::$user_id );
		add_user_meta( get_current_user_id(), \Google\Web_Stories\Tracking::OPTIN_META_KEY, true );

		add_filter( 'site_url', [ $this, 'filter_site_url' ] );
		$settings = ( new \Google\Web_Stories\Tracking() )->get_settings();
		remove_filter( 'site_url', [ $this, 'filter_site_url' ] );

		$expected = [
			'trackingAllowed' => true,
			'trackingId'      => \Google\Web_Stories\Tracking::TRACKING_ID,
			'siteUrl'         => 'https://example.com/with/trailing/slash',
			'userIdHash'      => md5( 'https://example.com/with/trailing/slash|' . self::$user_id ),
		];

		$this->assertEqualSetsWithIndex( $expected, $settings );
	}

	public function filter_site_url() {
		return 'https://example.com/with/trailing/slash/';
	}
}
