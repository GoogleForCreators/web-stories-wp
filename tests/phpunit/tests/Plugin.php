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

/**
 * @coversDefaultClass \Google\Web_Stories\Plugin
 */
class Plugin extends \WP_UnitTestCase {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$plugin = new \Google\Web_Stories\Plugin();
		$plugin->register();

		$this->assertSame( 10, has_action( 'init', [ $plugin->adsense, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->ad_manager, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->media, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->story, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->template, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->dashboard, 'init' ] ) );
		$this->assertSame( 10, has_action( 'admin_init', [ $plugin->admin, 'init' ] ) );
		$this->assertSame( 5, has_action( 'admin_init', [ $plugin->database_upgrader, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->embed_block, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->discovery, 'init' ] ) );
		$this->assertSame( 5, has_action( 'init', [ $plugin->settings, 'init' ] ) );
		$this->assertSame( 7, has_action( 'init', [ $plugin->experiments, 'init' ] ) );
		$this->assertSame( 100, has_action( 'rest_api_init', [ $plugin, 'register_rest_routes' ] ) );
	}

	/**
	 * @covers ::load_amp_plugin_compat
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_amp_endpoint_polyfill_on_wp_action() {
		$this->go_to( '/' );
		$this->assertTrue( function_exists( '\is_amp_endpoint' ) );
	}
}
