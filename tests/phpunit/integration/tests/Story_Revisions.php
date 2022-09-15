<?php
/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\Tests\Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Admin
 */
class Story_Revisions extends DependencyInjectedTestCase {

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Story_Revisions
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();
		$this->instance = $this->injector->make( \Google\Web_Stories\Story_Revisions::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame(
			10,
			has_filter(
				'_wp_post_revision_fields',
				[
					$this->instance,
					'filter_revision_fields',
				]
			)
		);
		$this->assertSame( 10, has_filter( 'wp_web-story_revisions_to_keep', [ $this->instance, 'revisions_to_keep' ] ) );
	}

	/**
	 * Testing the revisions_to_keep() method.
	 *
	 * @param int|bool $num      Number of revisions
	 * @param int $expected Expected string of CSS rules.
	 *
	 * @dataProvider data_test_revisions_to_keep
	 * @covers ::revisions_to_keep
	 */
	public function test_revisions_to_keep( $num, int $expected ): void {
		$this->assertSame( $expected, $this->instance->revisions_to_keep( $num ) );
	}

	public function data_test_revisions_to_keep(): array {
		return [
			[
				'num'      => 0,
				'expected' => 0,
			],
			[
				'num'      => 10,
				'expected' => 10,
			],
			[
				'num'      => 6,
				'expected' => 6,
			],
			[
				'num'      => -1,
				'expected' => 10,
			],
			[
				'num'      => '10',
				'expected' => 10,
			],
			[
				'num'      => 'ten',
				'expected' => 0,
			],
			[
				'num'      => true,
				'expected' => 1,
			],
			[
				'num'      => false,
				'expected' => 0,
			],
		];
	}
}
