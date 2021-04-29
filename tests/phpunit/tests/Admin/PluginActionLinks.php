<?php
/**
 * PluginActionLinks class.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Admin;

use Google\Web_Stories\Tests\Test_Case;

/**
 * Class PluginActionLinks
 * @package Google\Web_Stories\Tests\Admin
 *
 * @coversDefaultClass \Google\Web_Stories\Admin\PluginActionLinks
 *
 */
class PluginActionLinks extends Test_Case {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$instance = new \Google\Web_Stories\Admin\PluginActionLinks();
		$instance->register();

		$basename = plugin_basename( WEBSTORIES_PLUGIN_FILE );

		$this->assertSame( 10, has_filter( 'plugin_action_links_' . $basename, [ $instance, 'action_links' ] ) );
	}

	/**
	 * Test ::action_links().
	 *
	 * @covers ::action_links()
	 */
	public function test_action_links() {

		$initial_meta = [
			'Link 1',
			'Link 2',
		];

		$instance  = new \Google\Web_Stories\Admin\PluginActionLinks();
		$links     = $instance->action_links( $initial_meta );
		$last_link = end( $links );
		$this->assertContains( 'Settings', $last_link );
	}
}
