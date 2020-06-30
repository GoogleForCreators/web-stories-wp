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

class Plugin extends \WP_UnitTestCase {
	/**
	 * Test register()
	 */
	public function test_register() {
		$plugin = new \Google\Web_Stories\Plugin();
		$plugin->register();

		$this->assertSame( 9, has_action( 'init', [ $plugin->media, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->story, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->template, 'init' ] ) );
		$this->assertSame( 9, has_action( 'init', [ $plugin->updater, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->dashboard, 'init' ] ) );
		$this->assertSame( 10, has_action( 'admin_init', [ $plugin->admin, 'init' ] ) );
		$this->assertSame( 10, has_action( 'admin_init', [ $this->database_upgrader, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->embed_block, 'init' ] ) );
		$this->assertSame( 10, has_action( 'init', [ $plugin->discovery, 'init' ] ) );
		$this->assertSame( 100, has_action( 'rest_api_init', [ $plugin, 'register_rest_routes' ] ) );
	}
}
