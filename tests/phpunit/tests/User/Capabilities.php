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

namespace Google\Web_Stories\Tests\User;

use Google\Web_Stories\Tests\Test_Case;
use Google\Web_Stories\Tests\Capabilities_Setup;

/**
 * @coversDefaultClass \Google\Web_Stories\User\Capabilities
 */
class Capabilities extends Test_Case {
	use Capabilities_Setup;

	public function setUp() {
		parent::setUp();
		$this->add_caps_to_roles();
	}

	public function tearDown() {
		$this->set_permalink_structure( '' );
		$_SERVER['REQUEST_URI'] = '';

		$this->remove_caps_from_roles();

		parent::tearDown();
	}

	/**
	 * @covers ::add_caps_to_roles
	 */
	public function test_add_caps_to_roles() {
		$post_type_object = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$all_capabilities = array_values( (array) $post_type_object->cap );

		$capability = $this->get_capability_object();
		$capability->add_caps_to_roles();

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );

		foreach ( $all_capabilities as $cap ) {
			$this->assertTrue( $administrator->has_cap( $cap ) );
			$this->assertTrue( $editor->has_cap( $cap ) );
		}
	}

	/**
	 * @covers ::remove_caps_from_roles
	 */
	public function test_remove_caps_from_roles() {
		$capability = $this->get_capability_object();
		$capability->remove_caps_from_roles();

		$post_type_object = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$all_capabilities = array_values( (array) $post_type_object->cap );
		$all_capabilities = array_filter(
			$all_capabilities,
			function ( $value ) {
				return 'read' !== $value;
			}
		);
		$all_roles        = wp_roles();
		$roles            = array_values( (array) $all_roles->role_objects );

		foreach ( $roles as $role ) {
			foreach ( $all_capabilities as $cap ) {
				$this->assertFalse( $role->has_cap( $cap ) );
			}
			$this->assertTrue( $role->has_cap( 'read' ) );
		}
		// Add back roles after test.
		$capability->add_caps_to_roles();
	}

	/**
	 * @covers ::add_caps_to_roles
	 * @group ms-required
	 */
	public function test_add_caps_to_roles_multisite() {
		$blog_id = $this->factory->blog->create();
		switch_to_blog( $blog_id );

		$post_type_object = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$all_capabilities = array_values( (array) $post_type_object->cap );

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );

		foreach ( $all_capabilities as $cap ) {
			$this->assertTrue( $administrator->has_cap( $cap ) );
			$this->assertTrue( $editor->has_cap( $cap ) );
		}

		restore_current_blog();
	}
}
