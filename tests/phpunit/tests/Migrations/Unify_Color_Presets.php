<?php
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

namespace phpunit\tests\Migrations;

use Google\Web_Stories\Tests\Test_Case;

/**
 * Class Unify_Color_Presets
 *
 * @covers Google\Web_Stories\Migrations\Unify_Color_Presets;
 *
 * @package phpunit\tests\Migrations
 */
class Unify_Color_Presets extends Test_Case {
	/**
	 * @covers ::migrate
	 */
	public function test_migrate() {
		$presets = [
			'textStyles' => [],
			'textColors' => [
				[
					'color' => [
						'r' => 255,
						'g' => 255,
						'b' => 255,
					],
				],
			],
			'fillColors' => [
				[
					'color' => [
						'r' => 1,
						'g' => 1,
						'b' => 1,
					],
				],
			],
		];
		add_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION, $presets );

		$object = new \Google\Web_Stories\Migrations\Unify_Color_Presets();
		$object->migrate();

		$style_presets = get_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
		$this->assertSame(
			$style_presets['colors'],
			[
				[
					'color' => [
						'r' => 1,
						'g' => 1,
						'b' => 1,
					],
				],
				[
					'color' => [
						'r' => 255,
						'g' => 255,
						'b' => 255,
					],
				],
			]
		);
		delete_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
	}
}
