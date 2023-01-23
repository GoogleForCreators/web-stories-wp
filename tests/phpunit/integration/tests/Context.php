<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration;

use Google\Web_Stories\Story_Post_Type;

/**
 * @coversDefaultClass \Google\Web_Stories\Context
 */
class Context extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 */
	private \Google\Web_Stories\Context $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Context::class );
	}

	/**
	 * @covers ::is_story_editor
	 */
	public function test_is_story_editor(): void {
		$GLOBALS['current_screen'] = convert_to_screen( Story_Post_Type::POST_TYPE_SLUG );

		$this->assertTrue( $this->instance->is_story_editor() );
	}

	/**
	 * @covers ::is_block_editor
	 */
	public function test_is_block_editor(): void {
		$this->assertFalse( $this->instance->is_block_editor() );
	}
}
