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
 * @coversDefaultClass \Google\Web_Stories\Activation_Notice
 */
class Activation_Notice extends \WP_UnitTestCase {

	protected $activatoin_flag;

	public function setUp() {
		$this->activatoin_flag = new \Google\Web_Stories\Activation_Flag();
		$this->activatoin_flag->set_activation_flag();
	}

	public function tearDown() {
		$this->activatoin_flag->delete_activation_flag();
	}

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$activatoin_notice = new \Google\Web_Stories\Activation_Notice( $this->activatoin_flag );
		$activatoin_notice->init();

		$this->assertSame( 10, has_action( 'admin_enqueue_scripts', [ $activatoin_notice, 'enqueue_assets' ] ) );
		$this->assertSame( 10, has_action( 'admin_notices', [ $activatoin_notice, 'render_notice' ] ) );
		$this->assertSame( 10, has_action( 'network_admin_notices', [ $activatoin_notice, 'render_notice' ] ) );
	}

	/**
	 * @covers ::render_notice
	 */
	public function test_render_notice() {
		$GLOBALS['hook_suffix'] = 'plugin.php';
		$activatoin_notice      = new \Google\Web_Stories\Activation_Notice( $this->activatoin_flag );
		$output                 = get_echo( [ $activatoin_notice, 'render_notice' ] );
		$this->assertContains( 'web-stories-plugin-activation-notice', $output );
	}
}
