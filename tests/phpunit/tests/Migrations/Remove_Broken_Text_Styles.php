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
 * Class Remove_Broken_Text_Styles
 *
 * @covers Google\Web_Stories\Migrations\Remove_Broken_Text_Styles;
 *
 * @package phpunit\tests\Migrations
 */
class Remove_Broken_Text_Styles extends Test_Case {
	/**
	 * @covers ::migrate
	 */
	public function test_migrates() {
		$presets = [
			'textStyles' => [
				[
					'color' => [
						'r' => 255,
						'g' => 255,
						'b' => 255,
					],
					'font'  => [],
				],
				[
					'color' => [
						'type'  => 'solid',
						'color' => [
							'r' => 255,
							'g' => 255,
							'b' => 255,
						],
					],
					'font'  => [],
				],
			],
			'textColors' => [],
			'fillColors' => [],
		];
		add_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION, $presets );

		$object = new \Google\Web_Stories\Migrations\Remove_Broken_Text_Styles();
		$object->migrate();

		$style_presets = get_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
		$this->assertSame(
			$style_presets['textStyles'],
			[
				[
					'color' => [
						'type'  => 'solid',
						'color' => [
							'r' => 255,
							'g' => 255,
							'b' => 255,
						],
					],
					'font'  => [],
				],
			]
		);

		delete_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
	}
}
