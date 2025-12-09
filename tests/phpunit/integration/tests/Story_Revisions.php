<?php

declare(strict_types = 1);

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

use Google\Web_Stories\Story_Post_Type;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Revisions
 */
class Story_Revisions extends DependencyInjectedTestCase {

	/**
	 * Test instance.
	 */
	private \Google\Web_Stories\Story_Revisions $instance;

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
	 * @param int|bool|string $num      Number of revisions
	 * @param int             $expected Expected string of CSS rules.
	 *
	 * @dataProvider data_test_revisions_to_keep
	 * @covers ::revisions_to_keep
	 */
	public function test_revisions_to_keep( $num, int $expected ): void {
		$this->assertSame( $expected, $this->instance->revisions_to_keep( $num ) );
	}

	/**
	 * @return array<array{num: mixed, expected: int}>
	 */
	public static function data_test_revisions_to_keep(): array {
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

	/**
	 * @covers ::filter_revision_fields
	 */
	public function test_filter_revision_fields_not_an_array(): void {
		$this->assertSame(
			'foo',
			$this->instance->filter_revision_fields(
				'foo',
				[
					'post_type'   => 'post',
					'post_parent' => 0,
				]
			)
		);
	}

	/**
	 * @covers ::filter_revision_fields
	 */
	public function test_filter_revision_fields_wrong_post_type(): void {
		$fields = [
			'post_title' => 'Post title',
		];

		$this->assertSame(
			$fields,
			$this->instance->filter_revision_fields(
				$fields,
				[
					'post_type'   => 'post',
					'post_parent' => 0,
				]
			)
		);
	}

	/**
	 * @covers ::filter_revision_fields
	 */
	public function test_filter_revision_fields_story_post_type(): void {
		$fields = [
			'post_title' => 'Post title',
		];

		$actual = $this->instance->filter_revision_fields(
			$fields,
			[
				'post_type'   => Story_Post_Type::POST_TYPE_SLUG,
				'post_parent' => 0,
			]
		);

		$this->assertArrayHasKey( 'post_content_filtered', $actual );
	}

	/**
	 * @covers ::filter_revision_fields
	 */
	public function test_filter_revision_fields_story_post_type_revision(): void {
		$fields = [
			'post_title' => 'Post title',
		];

		$story = self::factory()->post->create(
			[
				'post_type' => Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$this->assertNotWPError( $story );

		$actual = $this->instance->filter_revision_fields(
			$fields,
			[
				'post_type'   => 'revision',
				'post_parent' => $story,
			]
		);

		$this->assertArrayHasKey( 'post_content_filtered', $actual );
	}
}
