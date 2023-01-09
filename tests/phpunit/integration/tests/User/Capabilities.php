<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\User;

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\Capabilities_Setup;
use Google\Web_Stories\Tests\Integration\TestCase;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;


/**
 * @coversDefaultClass \Google\Web_Stories\User\Capabilities
 */
class Capabilities extends DependencyInjectedTestCase {
	private \Google\Web_Stories\User\Capabilities $instance;

	public function set_up(): void {
		parent::set_up();
		$this->instance = $this->injector->make( \Google\Web_Stories\User\Capabilities::class );
	}

	/**
	 * @covers ::add_caps_to_roles
	 */
	public function test_add_caps_to_roles(): void {
		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );

		$this->assertNotNull( $post_type_object );

		$all_capabilities = array_values( (array) $post_type_object->cap );

		$this->instance->add_caps_to_roles();

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );

		$this->assertNotNull( $administrator );
		$this->assertNotNull( $editor );

		foreach ( $all_capabilities as $cap ) {
			$this->assertTrue( $administrator->has_cap( $cap ) );
			$this->assertTrue( $editor->has_cap( $cap ) );
		}
	}

	/**
	 * @covers ::remove_caps_from_roles
	 */
	public function test_remove_caps_from_roles(): void {
		$this->instance->remove_caps_from_roles();

		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );
		$this->assertNotNull( $post_type_object );
		$all_capabilities = array_values( (array) $post_type_object->cap );
		$all_capabilities = array_filter(
			$all_capabilities,
			static fn( $value ) => 'read' !== $value
		);
		$all_roles        = wp_roles();
		$roles            = array_values( (array) $all_roles->role_objects );

		foreach ( $roles as $role ) {
			foreach ( $all_capabilities as $cap ) {
				$this->assertFalse( $role->has_cap( $cap ) );
			}
			$this->assertTrue( $role->has_cap( 'read' ) );
		}
	}

	/**
	 * @covers ::add_caps_to_roles
	 * @group ms-required
	 */
	public function test_add_caps_to_roles_multisite(): void {
		$blog_id = self::factory()->blog->create();
		switch_to_blog( $blog_id );

		$this->instance->add_caps_to_roles();

		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );
		$this->assertNotNull( $post_type_object );
		$all_capabilities = array_values( (array) $post_type_object->cap );

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );

		$this->assertNotNull( $administrator );
		$this->assertNotNull( $editor );

		restore_current_blog();

		foreach ( $all_capabilities as $cap ) {
			$this->assertTrue( $administrator->has_cap( $cap ) );
			$this->assertTrue( $editor->has_cap( $cap ) );
		}
	}
}
