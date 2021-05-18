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

use Google\Web_Stories\Assets;

/**
 * @coversDefaultClass \Google\Web_Stories\Register_Global_Assets
 */
class Register_Global_Assets extends Test_Case {

	/**
	 * @covers ::get_font_handle
	 */
	public function test_get_handle() {
		$actual = ( new \Google\Web_Stories\Register_Global_Assets(new Assets()) )->get_font_handle();

		$this->assertSame( 'web-stories-fonts', $actual );
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$register_font   = new \Google\Web_Stories\Register_Global_Assets(new Assets());
		$register_font->register();

		$this->assertTrue( wp_style_is( $register_font->get_font_handle(), 'registered' ) );
		$this->assertTrue( wp_style_is( $register_font->get_player_handle(), 'registered' ) );
		$this->assertTrue( wp_script_is( $register_font->get_player_handle(), 'registered' ) );
	}
}
