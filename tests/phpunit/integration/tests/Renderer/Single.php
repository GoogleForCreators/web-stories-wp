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

namespace Google\Web_Stories\Tests\Integration\Renderer;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class Single
 *
 * @package Google\Web_Stories\Tests
 * @coversDefaultClass \Google\Web_Stories\Renderer\Single
 */
class Single extends DependencyInjectedTestCase {

	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * @var \Google\Web_Stories\Renderer\Single
	 */
	private $instance;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Story_Post_Type Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	public function set_up() {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Renderer\Single::class );
	}

	/**
	 * @covers ::filter_template_include
	 */
	public function test_filter_template_include() {
		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );

		$template_include = $this->instance->filter_template_include( 'current' );
		$this->assertStringContainsString( WEBSTORIES_PLUGIN_DIR_PATH, $template_include );
	}

	/**
	 * @covers ::filter_template_include
	 */
	public function test_filter_template_include_with_password() {
		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );

		add_filter( 'post_password_required', '__return_true' );

		$template_include = $this->instance->filter_template_include( 'current' );

		remove_filter( 'post_password_required', '__return_true' );

		$this->assertStringContainsString( 'current', $template_include );
	}

	/**
	 * @covers ::show_admin_bar
	 */
	public function test_show_admin_bar() {
		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );

		$show_admin_bar = $this->instance->show_admin_bar( 'current' );

		$this->assertFalse( $show_admin_bar );
		$this->assertTrue( is_singular( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG ) );
	}
}
