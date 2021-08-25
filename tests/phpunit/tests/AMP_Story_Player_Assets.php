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

use Google\Web_Stories\AMP_Story_Player_Assets as Assets;

/**
 * @coversDefaultClass Assets
 */
class AMP_Story_Player_Assets extends TestCase {

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$instance = new Assets();
		$instance->register();

		has_action( 'wp_default_styles', [ $instance, 'register_style' ] );
		has_action( 'wp_default_scripts', [ $instance, 'register_script' ] );

		$this->assertSame( 10, has_action( 'wp_default_styles', [ $instance, 'register_style' ] ) );
		$this->assertSame( 10, has_action( 'wp_default_scripts', [ $instance, 'register_script' ] ) );
	}
}
