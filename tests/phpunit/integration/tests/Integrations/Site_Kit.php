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

namespace Google\Web_Stories\Tests\Integration\Integrations;

use Google\Web_Stories\Analytics;
use Google\Web_Stories\Context;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Site_Kit
 */
class Site_Kit extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Integrations\Site_Kit
	 */
	protected $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Integrations\Site_Kit::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$analytics = $this->container->get( 'analytics' );
		add_action( 'web_stories_print_analytics', [ $analytics, 'print_analytics_tag' ] );

		$this->instance->register();

		$this->assertSame( 10, has_filter( 'googlesitekit_amp_gtag_opt', [ $this->instance, 'filter_site_kit_gtag_opt' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_print_analytics', [ $analytics, 'print_analytics_tag' ] ) );
	}

	/**
	 * @covers ::register
	 * @covers ::is_analytics_module_active
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_init_analytics_module_active(): void {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );
		update_option( 'googlesitekit_active_modules', [ 'analytics' ], false );
		update_option( 'googlesitekit_analytics_settings', [ 'useSnippet' => true ], false );

		$analytics = $this->container->get( 'analytics' );
		add_action( 'web_stories_print_analytics', [ $analytics, 'print_analytics_tag' ] );

		$this->instance->register();

		$this->assertSame( 10, has_filter( 'googlesitekit_amp_gtag_opt', [ $this->instance, 'filter_site_kit_gtag_opt' ] ) );
		$this->assertFalse( has_action( 'web_stories_print_analytics', [ $analytics, 'print_analytics_tag' ] ) );
	}

	/**
	 * @covers ::filter_site_kit_gtag_opt
	 */
	public function test_filter_site_kit_gtag_opt(): void {
		$gtag = [
			'vars'     => [
				'gtag_id' => 'hello',
			],
			'triggers' => [],
		];

		$actual = $this->instance->filter_site_kit_gtag_opt( $gtag );

		$this->assertSame( $gtag, $actual );
	}

	/**
	 * @covers ::filter_site_kit_gtag_opt
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_filter_site_kit_gtag_opt_single_story(): void {
		$gtag = [
			'vars'     => [
				'gtag_id' => 'hello',
			],
			'triggers' => [],
		];

		$story_id = self::factory()->post->create(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Site Kit Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);

		$this->go_to( get_permalink( $story_id ) );

		$analytics = $this->createMock( Analytics::class );
		$analytics->method( 'get_default_configuration' )
				->willReturn(
					[
						'triggers' => [
							'storyProgress' => [],
							'storyEnd'      => [],
						],
					]
				);

		$this->instance = new \Google\Web_Stories\Integrations\Site_Kit(
			$analytics,
			$this->injector->make( Context::class )
		);
		$actual         = $this->instance->filter_site_kit_gtag_opt( $gtag );

		$this->assertArrayHasKey( 'storyProgress', $actual['triggers'] );
		$this->assertArrayHasKey( 'storyEnd', $actual['triggers'] );
	}

	/**
	 * @covers ::get_site_kit_active_modules_option
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_get_site_kit_active_modules_option(): void {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );

		$actual_before = $this->call_private_method( $this->instance, 'get_site_kit_active_modules_option' );

		update_option( 'googlesitekit_active_modules', [ 'analytics' ], false );
		update_option( 'googlesitekit_analytics_settings', [ 'useSnippet' => true ], false );

		$actual_after = $this->call_private_method( $this->instance, 'get_site_kit_active_modules_option' );

		delete_option( 'googlesitekit_active_modules' );
		delete_option( 'googlesitekit_analytics_settings' );

		update_option( 'googlesitekit-active-modules', [ 'analytics' ], false );
		update_option( 'googlesitekit_analytics_settings', [ 'useSnippet' => true ], false );

		$actual_after_legacy = $this->call_private_method( $this->instance, 'get_site_kit_active_modules_option' );

		$this->assertEmpty( $actual_before );
		$this->assertSame( [ 'analytics' ], $actual_after );
		$this->assertSame( [ 'analytics' ], $actual_after_legacy );
	}

	/**
	 * @covers ::get_plugin_status
	 */
	public function test_get_plugin_status(): void {
		$expected = [
			'installed'       => false,
			'active'          => false,
			'analyticsActive' => false,
			'adsenseActive'   => false,
			'analyticsLink'   => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
			'adsenseLink'     => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
		];

		$actual = $this->instance->get_plugin_status();

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::get_plugin_status
	 */
	public function test_get_plugin_status_plugin_installed(): void {
		wp_cache_set( 'plugins', [ 'google-site-kit/google-site-kit.php' ], 'plugins' );

		$expected = [
			'installed'       => false,
			'active'          => false,
			'analyticsActive' => false,
			'adsenseActive'   => false,
			'analyticsLink'   => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
			'adsenseLink'     => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
		];

		$actual = $this->instance->get_plugin_status();

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::get_plugin_status
	 * @covers ::is_plugin_active
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_get_plugin_status_plugin_active(): void {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );

		$expected = [
			'installed'       => true,
			'active'          => true,
			'analyticsActive' => false,
			'adsenseActive'   => false,
			'analyticsLink'   => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
			'adsenseLink'     => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
		];

		$actual = $this->instance->get_plugin_status();

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::get_plugin_status
	 * @covers ::is_analytics_module_active
	 * @covers ::is_adsense_module_active
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_get_plugin_status_analytics_module_active(): void {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );
		update_option( 'googlesitekit_active_modules', [ 'analytics' ], false );
		update_option( 'googlesitekit_analytics_settings', [ 'useSnippet' => true ], false );

		$expected = [
			'installed'       => true,
			'active'          => true,
			'analyticsActive' => true,
			'adsenseActive'   => false,
			'adsenseLink'     => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
			'analyticsLink'   => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
		];

		$actual = $this->instance->get_plugin_status();

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}


	/**
	 * @covers ::get_plugin_status
	 * @covers ::is_analytics_module_active
	 * @covers ::is_adsense_module_active
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_get_plugin_status_analytics_module_no_snippet(): void {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );
		update_option( 'googlesitekit_active_modules', [ 'analytics' ], false );

		$expected = [
			'installed'       => true,
			'active'          => true,
			'analyticsActive' => false,
			'adsenseActive'   => false,
			'adsenseLink'     => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
			'analyticsLink'   => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
		];

		$actual = $this->instance->get_plugin_status();

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @covers ::get_plugin_status
	 * @covers ::is_analytics_module_active
	 * @covers ::is_adsense_module_active
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_get_plugin_status_adsense_module_active(): void {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );
		update_option( 'googlesitekit_active_modules', [ 'adsense' ], false );
		update_option(
			'googlesitekit_adsense_settings',
			[
				'useSnippet'       => true,
				'webStoriesAdUnit' => '12345',
				'clientID'         => '98765',
			],
			false
		);

		$expected = [
			'installed'       => true,
			'active'          => true,
			'analyticsActive' => false,
			'adsenseActive'   => true,
			'adsenseLink'     => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
			'analyticsLink'   => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
		];

		$actual = $this->instance->get_plugin_status();

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}


	/**
	 * @covers ::get_plugin_status
	 * @covers ::is_analytics_module_active
	 * @covers ::is_adsense_module_active
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_get_plugin_status_adsense_module_no_snippet(): void {
		define( 'GOOGLESITEKIT_VERSION', '1.2.3' );
		update_option( 'googlesitekit_active_modules', [ 'adsense' ], false );

		$expected = [
			'installed'       => true,
			'active'          => true,
			'analyticsActive' => false,
			'adsenseActive'   => false,
			'adsenseLink'     => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
			'analyticsLink'   => __( 'https://wordpress.org/plugins/google-site-kit/', 'web-stories' ),
		];

		$actual = $this->instance->get_plugin_status();

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}
}
