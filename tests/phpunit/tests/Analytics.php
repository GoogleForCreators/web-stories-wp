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

use Google\Web_Stories\Settings;

/**
 * @coversDefaultClass \Google\Web_Stories\Analytics
 */
class Analytics extends \WP_UnitTestCase {
	use Private_Access;

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);
	}

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$analytics = new \Google\Web_Stories\Analytics();
		$analytics->init();

		$this->assertSame( 10, has_filter( 'googlesitekit_amp_gtag_opt', [ $analytics, 'filter_site_kit_gtag_opt' ] ) );
		$this->assertSame( 10, has_filter( 'web_stories_print_analytics', [ $analytics, 'print_analytics_tag' ] ) );
	}

	/**
	 * @covers ::filter_site_kit_gtag_opt
	 */
	public function test_filter_site_kit_gtag_opt() {
		$gtag = [
			'vars'     => [
				'gtag_id' => 'hello',
			],
			'triggers' => [],
		];

		$analytics = new \Google\Web_Stories\Analytics();


		$result = $analytics->filter_site_kit_gtag_opt( $gtag );
		$this->assertSame( $result, $gtag );

		$this->go_to( get_permalink( self::$story_id ) );

		$result = $analytics->filter_site_kit_gtag_opt( $gtag );

		$this->assertArrayHasKey( 'storyProgress', $result['triggers'] );
		$this->assertArrayHasKey( 'storyEnd', $result['triggers'] );
		$this->assertSame( '${title}', $result['triggers']['storyProgress']['vars']['eventCategory'] );
		$this->assertSame( '${title}', $result['triggers']['storyEnd']['vars']['eventCategory'] );
	}

	/**
	 * @covers ::get_tracking_id
	 */
	public function test_get_tracking_id_casts_to_string() {
		update_option( Settings::SETTING_NAME_TRACKING_ID, 123456789, false );
		$analytics = new \Google\Web_Stories\Analytics();
		$this->assertSame( '123456789', $analytics->get_tracking_id() );
	}

	/**
	 * @covers ::get_default_configuration
	 */
	public function test_get_default_configuration() {
		$tracking_id = 123456789;
		update_option( Settings::SETTING_NAME_TRACKING_ID, $tracking_id, false );
		$analytics = new \Google\Web_Stories\Analytics();
		$actual    = $analytics->get_default_configuration();
		$this->assertArrayHasKey( 'vars', $actual );
		$this->assertArrayHasKey( 'gtag_id', $actual['vars'] );
		$this->assertSame( (string) $tracking_id, $actual['vars']['gtag_id'] );
		$this->assertArrayHasKey( 'config', $actual['vars'] );
		$this->assertArrayHasKey( $tracking_id, $actual['vars']['config'] );
	}

	/**
	 * @covers ::print_analytics_tag
	 */
	public function test_print_analytics_tag() {
		$analytics     = new \Google\Web_Stories\Analytics();
		$actual_before = get_echo( [ $analytics, 'print_analytics_tag' ] );

		update_option( Settings::SETTING_NAME_TRACKING_ID, 123456789, false );

		$actual_after = get_echo( [ $analytics, 'print_analytics_tag' ] );

		$this->assertEmpty( $actual_before );
		$this->assertContains( '<amp-analytics', $actual_after );
	}

	/**
	 * @covers ::print_analytics_tag
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_print_analytics_tag_with_site_kit() {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );

		$analytics = new \Google\Web_Stories\Analytics();

		update_option( 'googlesitekit_active_modules', [ 'analytics' ], false );
		update_option( Settings::SETTING_NAME_TRACKING_ID, 123456789, false );

		$actual = get_echo( [ $analytics, 'print_analytics_tag' ] );

		$this->assertEmpty( $actual );
	}

	/**
	 * @covers ::is_site_kit_analytics_module_active
	 * @covers ::get_site_kit_active_modules_option
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_site_kit_analytics_module_active() {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );

		$analytics = new \Google\Web_Stories\Analytics();

		$actual_before = $this->call_private_method( $analytics, 'is_site_kit_analytics_module_active' );

		update_option( 'googlesitekit_active_modules', [ 'analytics' ], false );

		$actual_after = $this->call_private_method( $analytics, 'is_site_kit_analytics_module_active' );

		delete_option( 'googlesitekit_active_modules', [ 'analytics' ] );
		update_option( 'googlesitekit-active-modules', [ 'analytics' ], false );

		$actual_after_legacy = $this->call_private_method( $analytics, 'is_site_kit_analytics_module_active' );

		$this->assertFalse( $actual_before );
		$this->assertTrue( $actual_after );
		$this->assertTrue( $actual_after_legacy );
	}
}
