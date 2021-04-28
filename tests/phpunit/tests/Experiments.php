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

/**
 * @coversDefaultClass \Google\Web_Stories\Experiments
 */
class Experiments extends Test_Case {

	/**
	 * @var int
	 */
	protected static $user_id;

	/**
	 * @param $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$experiments = new \Google\Web_Stories\Experiments();
		$experiments->register();

		// Because WEBSTORIES_DEV_MODE is false by default.
		$this->assertFalse( has_action( 'admin_menu', [ $experiments, 'add_menu_page' ] ) );
		$this->assertFalse( has_action( 'admin_init', [ $experiments, 'initialize_settings' ] ) );
	}

	/**
	 * @covers ::add_menu_page
	 */
	public function test_add_menu_page_no_capabilities() {
		$experiments = new \Google\Web_Stories\Experiments();
		$before      = $this->get_private_property( $experiments, 'hook_suffix' );
		$experiments->add_menu_page();
		$after = $this->get_private_property( $experiments, 'hook_suffix' );
		$this->assertNull( $before );
		$this->assertFalse( $after );
	}

	/**
	 * @covers ::add_menu_page
	 */
	public function test_add_menu_page() {
		wp_set_current_user( self::$user_id );
		$experiments = new \Google\Web_Stories\Experiments();
		$before      = $this->get_private_property( $experiments, 'hook_suffix' );
		$experiments->add_menu_page();
		$after = $this->get_private_property( $experiments, 'hook_suffix' );
		$this->assertNull( $before );
		$this->assertSame( 'admin_page_web-stories-experiments', $after );
	}

	/**
	 * @covers ::initialize_settings
	 */
	public function test_initialize_settings() {
		$experiments = new \Google\Web_Stories\Experiments();
		$experiments->initialize_settings();

		$options = get_registered_settings();
		$this->assertArrayHasKey( \Google\Web_Stories\Settings::SETTING_NAME_EXPERIMENTS, $options );
	}

	/**
	 * @covers ::display_experiment_field
	 */
	public function test_display_experiment_field() {
		$experiments = $this->createPartialMock(
			\Google\Web_Stories\Experiments::class,
			[ 'get_experiments' ]
		);
		$experiments->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
						]
					);

		$output = get_echo(
			[ $experiments, 'display_experiment_field' ],
			[
				[
					'label' => 'Foo Label',
					'id'    => 'foo',
				],
			]
		);

		$this->assertNotContains( "checked='checked'", $output );
	}

	/**
	 * @covers ::display_experiment_field
	 */
	public function test_display_experiment_field_enabled() {
		$experiments = $this->createPartialMock(
			\Google\Web_Stories\Experiments::class,
			[ 'get_experiments' ]
		);
		$experiments->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
						]
					);

		update_option( \Google\Web_Stories\Settings::SETTING_NAME_EXPERIMENTS, [ 'foo' => true ], false );

		$output = get_echo(
			[ $experiments, 'display_experiment_field' ],
			[
				[
					'label' => 'Foo Label',
					'id'    => 'foo',
				],
			]
		);
		$this->assertContains( "checked='checked'", $output );
	}

	/**
	 * @covers ::display_experiment_field
	 */
	public function test_display_experiment_field_enabled_by_default() {
		$experiments = $this->createPartialMock(
			\Google\Web_Stories\Experiments::class,
			[ 'get_experiments' ]
		);
		$experiments->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
						]
					);

		$output = get_echo(
			[ $experiments, 'display_experiment_field' ],
			[
				[
					'label'   => 'Foo Label',
					'id'      => 'foo',
					'default' => true,
				],
			]
		);

		$this->assertContains( "checked='checked'", $output );
		$this->assertContains( 'disabled', $output );
	}

	/**
	 * @covers ::get_experiment_groups
	 */
	public function test_get_experiment_groups() {
		$experiments = new \Google\Web_Stories\Experiments();
		$groups      = $experiments->get_experiment_groups();
		$this->assertCount( 3, $groups );
	}

	/**
	 * @covers ::get_experiments
	 */
	public function test_get_experiments() {
		$experiments           = new \Google\Web_Stories\Experiments();
		$all_experiments       = $experiments->get_experiments();
		$all_experiment_groups = array_keys( $experiments->get_experiment_groups() );

		$experiment_names  = wp_list_pluck( $all_experiments, 'name' );
		$experiment_groups = wp_list_pluck( $all_experiments, 'group' );

		foreach ( $experiment_groups as $group ) {
			$this->assertContains( $group, $all_experiment_groups, sprintf( 'Invalid experiment group %s', $group ) );
		}

		$duplicates = array_unique( array_diff_assoc( $experiment_names, array_unique( $experiment_names ) ) );

		$this->assertEmpty( $duplicates, sprintf( 'Duplicate experiments definition: %s', implode( ',', $duplicates ) ) );
	}

	/**
	 * @covers ::get_experiment_statuses
	 */
	public function test_get_experiment_statuses() {
		$experiments = new \Google\Web_Stories\Experiments();
		$this->assertEmpty( $experiments->get_experiment_statuses( 'foo-bar-baz' ) );
		$this->assertNotEmpty( $experiments->get_experiment_statuses( 'dashboard' ) );
		$this->assertNotEmpty( $experiments->get_experiment_statuses( 'editor' ) );

		foreach ( $experiments->get_experiment_statuses( 'editor' ) as $key => $status ) {
			$this->assertInternalType( 'string', $key );
			$this->assertInternalType( 'bool', $status );
		}
	}

	/**
	 * @covers ::is_experiment_enabled
	 */
	public function test_is_experiment_enabled() {
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_EXPERIMENTS, [ 'enableBookmarkActions' => true ], false );
		$experiments = new \Google\Web_Stories\Experiments();
		$this->assertTrue( $experiments->is_experiment_enabled( 'enableBookmarkActions' ) );
	}

	/**
	 * @covers ::is_experiment_enabled
	 * @covers ::get_experiment
	 */
	public function test_is_experiment_enabled_default_experiment() {
		$experiments = $this->createPartialMock(
			\Google\Web_Stories\Experiments::class,
			[ 'get_experiments' ]
		);
		$experiments->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
							[
								'name'        => 'bar',
								'label'       => 'Bar Label',
								'description' => 'Bar Desc',
								'default'     => true,
							],
						]
					);

		$this->assertFalse( $experiments->is_experiment_enabled( 'foo' ) );
		$this->assertTrue( $experiments->is_experiment_enabled( 'bar' ) );
		$this->assertFalse( $experiments->is_experiment_enabled( 'baz' ) );
	}

	/**
	 * @cover ::get_enabled_experiments
	 */
	public function test_get_enabled_experiments() {
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_EXPERIMENTS, [ 'baz' => true ], false );

		$experiments = $this->createPartialMock(
			\Google\Web_Stories\Experiments::class,
			[ 'get_experiments' ]
		);
		$experiments->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
							[
								'name'        => 'bar',
								'label'       => 'Bar Label',
								'description' => 'Bar Desc',
								'default'     => true,
							],
							[
								'name'        => 'baz',
								'label'       => 'Baz Label',
								'description' => 'Baz Desc',
								'default'     => true,
							],
						]
					);

		$expected = [
			'bar',
			'baz',
		];

		$this->assertEqualSets( $expected, $experiments->get_enabled_experiments() );
	}
}
