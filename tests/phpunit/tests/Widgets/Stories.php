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

namespace Google\Web_Stories\Tests;

use Google\Web_Stories\Widgets\Stories as Testee;

/**
 * Class Stories
 *
 * @coversDefaultClass \Google\Web_Stories\Widgets\Stories
 *
 * @package Google\Web_Stories\Tests
 */
class Stories extends \WP_UnitTestCase {

	/**
	 * Object in test.
	 *
	 * @var Testee
	 */
	private static $testee;

	/**
	 * Runs before any method in class is run.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass() {
		self::$testee = new Testee();
	}

	/**
	 * Test that object is instance of WP_Widget.
	 */
	public function test_instance() {
		$this->assertInstanceOf( \WP_Widget::class, self::$testee );
	}

	/**
	 * Test ID Base is set.
	 */
	public function test_id_base() {
		$this->assertEquals( 'string', gettype( self::$testee->id_base ) );
		$this->assertNotEmpty( self::$testee->id_base );
	}

	/**
	 * Test name is set.
	 */
	public function test_name() {
		$this->assertEquals( 'string', gettype( self::$testee->name ) );
		$this->assertNotEmpty( self::$testee->name );
	}

	/**
	 * @covers ::_register
	 */
	public function test_register() {
		self::$testee->_register();
		$action = has_action( 'admin_enqueue_scripts', [ self::$testee, 'stories_widget_scripts' ] );
		$this->assertSame( 10, $action );
	}

	/**
	 * @covers ::stories_widget_scripts
	 */
	public function test_stories_widget_scripts() {
		self::$testee->stories_widget_scripts();
		$enqueued = wp_script_is( 'web-stories-widget' );

		$this->assertTrue( $enqueued );
	}

	/**
	 * @covers ::update
	 */
	public function test_update() {
		$new_instance = [
			'title'      => '<p>Test Stories</p>',
			'view-type'  => 'list',
			'show_title' => '',
			'number'     => 100,
		];

		$old_instance = [];

		$expected = [
			'title'             => 'Test Stories',
			'view-type'         => 'list',
			'show_title'        => 1,
			'show_author'       => '',
			'show_excerpt'      => '',
			'show_date'         => '',
			'archive_link'      => '',
			'image_align_right' => '',
			'number'            => 20,
		];

		$instance = self::$testee->update( $new_instance, $old_instance );

		$this->assertEqualSets( $expected, $instance );
	}

}
