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

namespace Google\Web_Stories\Tests\Integration\Integrations;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Conditional_Featured_Image
 */
class Conditional_Featured_Image extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 */
	protected \Google\Web_Stories\Integrations\Conditional_Featured_Image $instance;

	/**
	 * Runs prior to each test and sets up the testee object.
	 */
	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Integrations\Conditional_Featured_Image::class );
	}

	/**
	 * Tests register with core theme.
	 *
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertEquals(
			99,
			has_filter(
				'cybocfi_enabled_for_post_type',
				[
					$this->instance,
					'cybocfi_enabled_for_post_type',
				]
			)
		);
	}

	/**
	 * @covers ::cybocfi_enabled_for_post_type
	 */
	public function test_cybocfi_enabled_for_post_type(): void {
		$result = $this->instance->cybocfi_enabled_for_post_type( true, \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->assertFalse( $result );
	}
}
