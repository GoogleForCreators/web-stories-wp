<?php
/*
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

namespace Google\Web_Stories\Tests\Unit\AMP;

use Google\Web_Stories\Tests\Unit\TestCase;
use Brain\Monkey;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Output_Buffer
 */
class Output_Buffer extends TestCase {
	public function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				'get_post' => static function () {
					return null;
				},
			]
		);
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->assertTrue( \Google\Web_Stories\AMP\Output_Buffer::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_needed_amp_lower_version() {
		define( 'AMP__VERSION', '0.0.1' );
		$this->assertTrue( \Google\Web_Stories\AMP\Output_Buffer::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_needed_amp_same_version() {
		define( 'AMP__VERSION', WEBSTORIES_AMP_VERSION );
		$this->assertTrue( \Google\Web_Stories\AMP\Output_Buffer::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_needed_amp_same_version_did_amp_init() {
		define( 'AMP__VERSION', WEBSTORIES_AMP_VERSION );
		do_action( 'amp_init' );
		$this->assertTrue( \Google\Web_Stories\AMP\Output_Buffer::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_needed_amp_higher_version() {
		define( 'AMP__VERSION', '99.9.9' );
		$this->assertTrue( \Google\Web_Stories\AMP\Output_Buffer::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_needed_amp_higher_version_did_amp_init() {
		define( 'AMP__VERSION', '99.9.9' );
		do_action( 'amp_init' );
		$this->assertTrue( \Google\Web_Stories\AMP\Output_Buffer::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_is_needed_amp_properly_initialized() {
		define( 'AMP__VERSION', WEBSTORIES_AMP_VERSION );
		do_action( 'amp_init' );

		Monkey\Functions\stubs(
			[
				'get_post'              => static function () {
					return null;
				},
				'amp_is_available'      => static function () {
					return true; },
				'amp_is_enabled'        => static function () {
					return true; },
				'amp_is_post_supported' => static function ( $post ) {
					return true;
				},
			]
		);

		$this->assertFalse( \Google\Web_Stories\AMP\Output_Buffer::is_needed() );
	}
}
