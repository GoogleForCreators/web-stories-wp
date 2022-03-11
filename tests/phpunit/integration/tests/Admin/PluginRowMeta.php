<?php
/**
 * PluginRowMeta class.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

namespace Google\Web_Stories\Tests\Integration\Admin;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class PluginRowMeta
 *
 * @coversDefaultClass \Google\Web_Stories\Admin\PluginRowMeta
 */
class PluginRowMeta extends TestCase {

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$instance = new \Google\Web_Stories\Admin\PluginRowMeta();
		$instance->register();

		$this->assertSame( 10, has_filter( 'plugin_row_meta', [ $instance, 'get_plugin_row_meta' ] ) );
	}

	/**
	 * Test ::get_plugin_row_meta().
	 *
	 * @covers ::get_plugin_row_meta()
	 */
	public function test_get_plugin_row_meta(): void {

		$initial_meta = [
			'Link 1',
			'Link 2',
		];

		$instance = new \Google\Web_Stories\Admin\PluginRowMeta();
		$this->assertEquals( $initial_meta, $instance->get_plugin_row_meta( $initial_meta, 'foo.php' ) );

		$expected_meta = array_merge(
			$initial_meta,
			[
				'<a href="https://wordpress.org/support/plugin/web-stories/" target="_blank">Contact support</a>',
				'<a href="https://wordpress.org/support/plugin/web-stories/reviews/#new-post" target="_blank">Leave review</a>',
			]
		);

		$plugin_file = plugin_basename( WEBSTORIES_PLUGIN_FILE );
		$this->assertEquals( $expected_meta, $instance->get_plugin_row_meta( $initial_meta, $plugin_file ) );
	}
}
