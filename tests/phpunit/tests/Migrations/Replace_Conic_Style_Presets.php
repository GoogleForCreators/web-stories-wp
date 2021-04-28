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
 * Class Replace_Conic_Style_Presets
 *
 * @covers Google\Web_Stories\Migrations\Replace_Conic_Style_Presets;
 *
 * @package phpunit\tests\Migrations
 */
class Replace_Conic_Style_Presets extends Test_Case {
	/**
	 * @covers ::migrate
	 */
	public function test_migrates() {
		$radial_preset = [
			[
				'color'              => [],
				'backgroundColor'    =>
					[
						'type'     => 'radial',
						'stops'    => [],
						'rotation' => 0.5,
					],
				'backgroundTextMode' => 'FILL',
			],
		];
		$presets       = [
			'fillColors' => [
				[
					'type'     => 'conic',
					'stops'    =>
						[
							[
								'color'    => [],
								'position' => 0,
							],
							[
								'color'    => [],
								'position' => 0.7,
							],
						],
					'rotation' => 0.5,
				],
			],
			'textColors' => [
				[
					'color' => [],
				],
			],
			'textStyles' => [
				[
					'color'              => [],
					'backgroundColor'    =>
						[
							'type'     => 'conic',
							'stops'    => [],
							'rotation' => 0.5,
						],
					'backgroundTextMode' => 'FILL',
					'font'               => [],
				],
				$radial_preset,
			],
		];
		add_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION, $presets );

		$object = new \Google\Web_Stories\Migrations\Replace_Conic_Style_Presets();
		$object->migrate();

		$style_presets = get_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
		$this->assertSame( $style_presets['textStyles'][1], $radial_preset );
		$this->assertSame( $style_presets['textStyles'][0]['backgroundColor']['type'], 'linear' );
		$this->assertSame( $style_presets['fillColors'][0]['type'], 'linear' );
		$this->assertSame(
			$style_presets['textColors'],
			[
				[
					'color' => [],
				],
			]
		);

		delete_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
	}
}
