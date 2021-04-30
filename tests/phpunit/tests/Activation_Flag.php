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
 * @coversDefaultClass \Google\Web_Stories\Activation_Flag
 */
class Activation_Flag extends Test_Case {
	/**
	 * @covers ::register
	 */
	public function test_register() {
		$activation_flag = new \Google\Web_Stories\Activation_Flag();
		$activation_flag->register();

		$this->assertSame( 10, has_action( 'web_stories_activation', [ $activation_flag, 'set_activation_flag' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_deactivation', [ $activation_flag, 'delete_activation_flag' ] ) );
	}

	/**
	 * @covers ::set_activation_flag
	 * @covers ::get_activation_flag
	 */
	public function test_set_activation_flag() {
		$activation_flag = new \Google\Web_Stories\Activation_Flag();
		$activation_flag->set_activation_flag( true );
		$this->assertTrue( $activation_flag->get_activation_flag( true ) );
	}

	/**
	 * @covers ::delete_activation_flag
	 * @covers ::get_activation_flag
	 */
	public function test_delete_activation_flag() {
		$activation_flag = new \Google\Web_Stories\Activation_Flag();
		$activation_flag->delete_activation_flag( true );
		$this->assertFalse( $activation_flag->get_activation_flag( true ) );
	}
}
