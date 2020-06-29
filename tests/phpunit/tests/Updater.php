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

class Updater extends \WP_UnitTestCase {
	use Private_Access;

	/**
	 * Count of the number of requests attempted.
	 *
	 * @var int
	 */
	protected $request_count = 0;

	public function setUp() {
		parent::setUp();

		add_filter( 'pre_http_request', [ $this, 'mock_http_request' ], 10, 3 );

		$this->request_count = 0;
	}

	public function tearDown() {
		parent::tearDown();

		remove_filter( 'pre_http_request', [ $this, 'mock_http_request' ] );
	}

	/**
	 * Intercept http requests and mock responses.
	 *
	 * @param mixed  $preempt Whether to preempt an HTTP request's return value. Default false.
	 * @param mixed  $r       HTTP request arguments.
	 * @param string $url     The request URL.
	 * @return array Response data.
	 */
	public function mock_http_request( $preempt, $r, $url ) {
		++ $this->request_count;

		if ( false !== strpos( $url, 'https://google.github.io/web-stories-wp/service/plugin-updates.json' ) ) {
			return [
				'response' => [
					'code' => 200,
				],
				'body'     => wp_json_encode(
					[
						'name'         => 'Web Stories',
						'slug'         => 'web-stories',
						'version'      => '99.99.999',
						'last_updated' => '2020-01-01 00:00:00',
						'url'          => 'https://example.com/web-stories',
						'download_url' => 'https://example.com/web-stories.zip',
						'tested'       => '9.9',
						'requires'     => '5.3',
						'requires_php' => '5.6',
					]
				),
			];
		}

		return [
			'response' => [
				'code' => 404,
			],
		];
	}

	public function test_init() {
		$updater = new \Google\Web_Stories\Updater();
		$updater->init();

		$this->assertSame( 10, has_filter( 'plugins_api', [ $updater, 'plugin_info' ] ) );
		$this->assertSame( 10, has_filter( 'pre_set_site_transient_update_plugins', [ $updater, 'updater_data' ] ) );
		$this->assertSame( 10, has_action( 'load-update-core.php', [ $updater, 'clear_plugin_data' ] ) );
		$this->assertSame( 10, has_action( 'upgrader_process_complete', [ $updater, 'upgrader_process_complete' ] ) );
	}

	public function test_plugin_info() {
		list( $plugin_slug ) = explode( '/', plugin_basename( WEBSTORIES_PLUGIN_FILE ) );
		$expected            = (object) [
			'slug'          => $plugin_slug,
			'name'          => 'Web Stories',
			'version'       => '99.99.999',
			'author'        => '<a href="https://opensource.google.com">Google</a>',
			'download_link' => 'https://example.com/web-stories.zip',
			'trunk'         => 'https://example.com/web-stories.zip',
			'tested'        => '9.9',
			'requires'      => '5.3',
			'requires_php'  => '5.6',
			'last_updated'  => '2020-01-01 00:00:00',
		];
		$actual              = ( new \Google\Web_Stories\Updater() )->plugin_info( false, 'plugin_information', (object) [ 'slug' => $plugin_slug ] );
		$this->assertEquals( $expected, $actual );
		$this->assertSame( 1, $this->request_count );
	}

	public function test_plugin_info_different_action() {
		list( $plugin_slug ) = explode( '/', plugin_basename( WEBSTORIES_PLUGIN_FILE ) );
		$actual              = ( new \Google\Web_Stories\Updater() )->plugin_info( false, 'theme_information', (object) [ 'slug' => $plugin_slug ] );
		$this->assertFalse( $actual );
		$this->assertSame( 0, $this->request_count );
	}

	public function test_plugin_info_different_plugin_slug() {
		$actual = ( new \Google\Web_Stories\Updater() )->plugin_info( false, 'plugin_information', (object) [ 'slug' => 'akismet' ] );
		$this->assertFalse( $actual );
		$this->assertSame( 0, $this->request_count );
	}

	public function test_updater_data() {
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$plugin              = plugin_basename( WEBSTORIES_PLUGIN_FILE );
		list( $plugin_slug ) = explode( '/', $plugin );
		$expected            = (object) [
			'id'           => 'https://github.com/google/web-stories-wp',
			'plugin'       => plugin_basename( WEBSTORIES_PLUGIN_FILE ),
			'slug'         => $plugin_slug,
			'new_version'  => '99.99.999',
			'package'      => 'https://example.com/web-stories.zip',
			'url'          => 'https://example.com/web-stories',
			'tested'       => '9.9',
			'requires'     => '5.3',
			'requires_php' => '5.6',
		];

		$actual = ( new \Google\Web_Stories\Updater() )->updater_data( (object) [ 'foo' => 'bar' ] );
		$this->assertObjectNotHasAttribute( 'no_update', $actual );
		$this->assertObjectHasAttribute( 'response', $actual );
		$this->assertArrayHasKey( plugin_basename( WEBSTORIES_PLUGIN_FILE ), $actual->response );
		$this->assertEquals(
			$expected,
			$actual->response[ plugin_basename( WEBSTORIES_PLUGIN_FILE ) ]
		);
		$this->assertSame( 1, $this->request_count );
	}

	public function test_updater_data_missing_capabilities() {
		$expected = (object) [ 'foo' => 'bar' ];
		$actual   = ( new \Google\Web_Stories\Updater() )->updater_data( $expected );
		$this->assertEquals( $expected, $actual );
		$this->assertSame( 0, $this->request_count );
	}

	public function test_fetch_plugin_data() {
		$updater = new \Google\Web_Stories\Updater();
		set_site_transient( 'web_stories_updater', 'foo' );
		$expected = 'foo';
		$actual   = $this->call_private_method( $updater, 'fetch_plugin_data' );
		$this->assertSame( $expected, $actual );
	}

	public function test_clear_plugin_data() {
		set_site_transient( 'web_stories_updater', 'foo' );
		$before = get_site_transient( 'web_stories_updater' );
		( new \Google\Web_Stories\Updater() )->clear_plugin_data();
		$after = get_site_transient( 'web_stories_updater' );
		$this->assertSame( 'foo', $before );
		$this->assertFalse( $after );
	}

	public function test_upgrader_process_complete() {
		set_site_transient( 'web_stories_updater', 'foo' );
		$before  = get_site_transient( 'web_stories_updater' );
		$options = [
			'action'  => 'update',
			'type'    => 'plugin',
			'plugins' => [
				plugin_basename( WEBSTORIES_PLUGIN_FILE ),
			],
		];
		( new \Google\Web_Stories\Updater() )->upgrader_process_complete( null, $options );
		$after = get_site_transient( 'web_stories_updater' );
		$this->assertSame( 'foo', $before );
		$this->assertFalse( $after );
	}

	public function test_upgrader_process_complete_install() {
		set_site_transient( 'web_stories_updater', 'foo' );
		$options = [
			'action'  => 'install',
			'type'    => 'plugin',
			'plugins' => [
				plugin_basename( WEBSTORIES_PLUGIN_FILE ),
			],
		];
		( new \Google\Web_Stories\Updater() )->upgrader_process_complete( null, $options );
		$after = get_site_transient( 'web_stories_updater' );
		$this->assertSame( 'foo', $after );
	}

	public function test_upgrader_process_complete_theme() {
		set_site_transient( 'web_stories_updater', 'foo' );
		$options = [
			'action' => 'update',
			'type'   => 'theme',
			'themes' => [
				'twentyseventeen',
			],
		];
		( new \Google\Web_Stories\Updater() )->upgrader_process_complete( null, $options );
		$after = get_site_transient( 'web_stories_updater' );
		$this->assertSame( 'foo', $after );
	}

	public function test_upgrader_process_complete_different_plugin() {
		set_site_transient( 'web_stories_updater', 'foo' );
		$options = [
			'action'  => 'update',
			'type'    => 'plugin',
			'plugins' => [
				'akismet/akismetp.php',
			],
		];
		( new \Google\Web_Stories\Updater() )->upgrader_process_complete( null, $options );
		$after = get_site_transient( 'web_stories_updater' );
		$this->assertSame( 'foo', $after );
	}
}
