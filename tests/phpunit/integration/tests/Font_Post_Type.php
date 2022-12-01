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

/**
 * @coversDefaultClass \Google\Web_Stories\Font_Post_Type
 */
class Font_Post_Type extends DependencyInjectedTestCase {
	use Capabilities_Setup;

	private \Google\Web_Stories\Font_Post_Type $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Font_Post_Type::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$post_type_object = get_post_type_object( \Google\Web_Stories\Font_Post_Type::POST_TYPE_SLUG );
		$this->assertNotNull( $post_type_object );
		$this->assertSame( 'edit_web-stories', $post_type_object->cap->read_post );
		$this->assertSame( 'manage_options', $post_type_object->cap->edit_posts );
		$this->assertSame( 'manage_options', $post_type_object->cap->delete_posts );
	}
}
