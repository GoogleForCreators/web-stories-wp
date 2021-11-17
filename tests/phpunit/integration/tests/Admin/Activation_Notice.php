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

namespace Google\Web_Stories\Tests\Integration\Admin;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Activation_Notice
 */
class Activation_Notice extends DependencyInjectedTestCase {
	protected $instance;

	public function set_up() {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Admin\Activation_Notice::class );
		$this->call_private_method( $this->instance, 'set_activation_flag' );
	}

	public function tear_down() {
		$this->call_private_method( $this->instance, 'delete_activation_flag' );

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$this->instance->register();

		$this->assertSame( 10, has_action( 'admin_enqueue_scripts', [ $this->instance, 'enqueue_assets' ] ) );
		$this->assertSame( 10, has_action( 'admin_notices', [ $this->instance, 'render_notice' ] ) );
		$this->assertSame( 10, has_action( 'network_admin_notices', [ $this->instance, 'render_notice' ] ) );
	}

	/**
	 * @covers ::render_notice
	 */
	public function test_render_notice() {
		$GLOBALS['hook_suffix'] = 'plugins.php';

		$flag_before = $this->call_private_method( $this->instance, 'get_activation_flag' );
		$output      = get_echo( [ $this->instance, 'render_notice' ] );
		$flag_after  = $this->call_private_method( $this->instance, 'get_activation_flag' );
		$this->assertStringContainsString( 'web-stories-plugin-activation-notice', $output );
		$this->assertTrue( $flag_before );
		$this->assertFalse( $flag_after );
	}

	/**
	 * @covers ::is_plugins_page
	 */
	public function test_is_plugins_page() {
		$result = $this->call_private_method( $this->instance, 'is_plugins_page', [ 'themes.php' ] );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::set_activation_flag
	 * @covers ::get_activation_flag
	 */
	public function test_set_activation_flag() {
		$this->call_private_method( $this->instance, 'set_activation_flag', [ true ] );
		$flag = $this->call_private_method( $this->instance, 'get_activation_flag', [ true ] );
		$this->assertTrue( $flag );
	}

	/**
	 * @covers ::delete_activation_flag
	 * @covers ::get_activation_flag
	 */
	public function test_delete_activation_flag() {
		$this->call_private_method( $this->instance, 'delete_activation_flag', [ true ] );
		$flag = $this->call_private_method( $this->instance, 'get_activation_flag', [ true ] );
		$this->assertFalse( $flag );
	}
}
