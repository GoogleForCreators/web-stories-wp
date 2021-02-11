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
	use Private_Access;

	protected $activation_flag;

	public function setUp() {
		parent::setUp();
		$this->activation_flag = new \Google\Web_Stories\Activation_Flag();
		$this->activation_flag->set_activation_flag();
	}

	public function tearDown() {
		$this->activation_flag->delete_activation_flag();

		parent::tearDown();
	}

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$activation_notice = new \Google\Web_Stories\Activation_Notice( $this->activation_flag );
		$activation_notice->init();

		$this->assertSame( 10, has_action( 'admin_enqueue_scripts', [ $activation_notice, 'enqueue_assets' ] ) );
		$this->assertSame( 10, has_action( 'admin_notices', [ $activation_notice, 'render_notice' ] ) );
		$this->assertSame( 10, has_action( 'network_admin_notices', [ $activation_notice, 'render_notice' ] ) );
	}

	/**
	 * @covers ::render_notice
	 */
	public function test_render_notice() {
		$GLOBALS['hook_suffix'] = 'plugins.php';

		$activation_notice = new \Google\Web_Stories\Activation_Notice( $this->activation_flag );
		$flag_before       = $this->activation_flag->get_activation_flag();
		$output            = get_echo( [ $activation_notice, 'render_notice' ] );
		$flag_after        = $this->activation_flag->get_activation_flag();
		$this->assertContains( 'web-stories-plugin-activation-notice', $output );
		$this->assertTrue( $flag_before );
		$this->assertFalse( $flag_after );
	}

	/**
	 * @covers ::is_plugins_page
	 */
	public function test_is_plugins_page() {
		$activation_notice = new \Google\Web_Stories\Activation_Notice( $this->activation_flag );
		$result            = $this->call_private_method( $activation_notice, 'is_plugins_page', [ 'themes.php' ] );
		$this->assertFalse( $result );
	}
}
