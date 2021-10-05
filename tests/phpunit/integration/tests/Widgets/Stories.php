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

namespace Google\Web_Stories\Tests\Integration\Widgets;

use WP_Widget;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class Stories
 *
 * @coversDefaultClass \Google\Web_Stories\Widgets\Stories
 */
class Stories extends TestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Widgets\Stories
	 */
	private $instance;

	/**
	 * Runs before any method in class is run.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$assets         = new \Google\Web_Stories\Assets();
		$this->instance = new \Google\Web_Stories\Widgets\Stories( $assets );
	}

	/**
	 * Test that object is instance of WP_Widget.
	 */
	public function test_instance() {
		$this->assertInstanceOf( WP_Widget::class, $this->instance );
	}

	/**
	 * Test ID Base is set.
	 */
	public function test_id_base() {
		$this->assertEquals( 'string', gettype( $this->instance->id_base ) );
		$this->assertNotEmpty( $this->instance->id_base );
	}

	/**
	 * Test name is set.
	 */
	public function test_name() {
		$this->assertEquals( 'string', gettype( $this->instance->name ) );
		$this->assertNotEmpty( $this->instance->name );
	}

	/**
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts() {
		$this->instance->enqueue_scripts();
		$this->assertTrue( wp_script_is( 'web-stories-widget' ) );
	}

	/**
	 * @covers ::update
	 */
	public function test_update() {
		$new_instance = [
			'title'              => '<p>Test Stories</p>',
			'view_type'          => 'list',
			'show_title'         => '1',
			'number_of_stories'  => 100,
			'circle_size'        => 150,
			'archive_link_label' => 'View Stories',
			'number_of_columns'  => 2,
			'sharp_corners'      => 1,
		];

		$old_instance = [];

		$expected = [
			'title'              => 'Test Stories',
			'view_type'          => 'list',
			'show_title'         => 1,
			'show_author'        => '',
			'show_excerpt'       => '',
			'show_date'          => '',
			'show_archive_link'  => '',
			'image_alignment'    => 'left',
			'number_of_stories'  => 20,
			'circle_size'        => 150,
			'archive_link_label' => 'View Stories',
			'number_of_columns'  => 2,
			'sharp_corners'      => 1,
			'orderby'            => 'post_date',
			'order'              => 'DESC',
		];

		$instance = $this->instance->update( $new_instance, $old_instance );

		$this->assertEqualSetsWithIndex( $expected, $instance );
	}

	/**
	 * @covers ::update
	 * @covers ::default_values
	 */
	public function test_update_default() {
		$new_instance = [];

		$old_instance = [];

		$expected = $this->call_private_method( $this->instance, 'default_values' );


		$instance = $this->instance->update( $new_instance, $old_instance );

		$this->assertEqualSetsWithIndex( $expected, $instance );
	}

	/**
	 * @covers ::input
	 * @covers ::label
	 */
	public function test_input() {
		$function = function () {
			$args = [
				'label' => 'Test input',
				'value' => 3,
			];
			$this->call_private_method( $this->instance, 'input', [ $args ] );
		};

		$dropdown = get_echo( $function );

		$this->assertStringContainsString( 'Test input', $dropdown );
		$this->assertStringContainsString( '<input', $dropdown );
		$this->assertStringContainsString( '<label', $dropdown );
	}

	/**
	 * @covers ::dropdown
	 * @covers ::label
	 */
	public function test_dropdown() {
		$function = function () {
			$args = [
				'label'    => 'Test input',
				'options'  => range( 'A', 'Z' ),
				'selected' => 3,
			];
			$this->call_private_method( $this->instance, 'dropdown', [ $args ] );
		};

		$dropdown = get_echo( $function );

		$this->assertStringContainsString( 'Test input', $dropdown );
		$this->assertStringContainsString( 'selected=', $dropdown );
		$this->assertStringContainsString( '<select', $dropdown );
		$this->assertStringContainsString( '<label', $dropdown );
	}

	/**
	 * @covers ::radio
	 * @covers ::label
	 */
	public function test_radio() {
		$function = function () {
			$args = [
				'label'    => 'Test input',
				'options'  => range( 'A', 'Z' ),
				'selected' => 3,
			];
			$this->call_private_method( $this->instance, 'radio', [ $args ] );
		};

		$radio = get_echo( $function );

		$this->assertStringContainsString( 'Test input', $radio );
		$this->assertStringContainsString( 'checked=', $radio );
		$this->assertStringContainsString( '<input', $radio );
		$this->assertStringContainsString( '<label', $radio );
	}

	/**
	 * @covers ::label
	 */
	public function test_label() {
		$args = [
			'label' => 'Test input',
			'id'    => '123',
		];

		$label = $this->call_private_method( $this->instance, 'label', [ $args ] );

		$this->assertStringContainsString( 'Test input', $label );
		$this->assertStringContainsString( '<label', $label );
	}
}
