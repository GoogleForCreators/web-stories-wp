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

namespace Google\Web_Stories\Tests\Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Experiments
 */
class Experiments extends DependencyInjectedTestCase {

	/**
	 * @var int
	 */
	protected static $user_id;

	/**
	 * @var \Google\Web_Stories\Experiments
	 */
	private $instance;

	/**
	 * @param $factory
	 */
	public static function wpSetUpBeforeClass( $factory ): void {
		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Experiments::class );
	}

	public function tear_down(): void {
		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_EXPERIMENTS );

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		// Because WEBSTORIES_DEV_MODE is false by default.
		$this->assertFalse( has_action( 'admin_menu', [ $this->instance, 'add_menu_page' ] ) );
		$this->assertFalse( has_action( 'admin_init', [ $this->instance, 'initialize_settings' ] ) );
	}

	/**
	 * @covers ::initialize_settings
	 */
	public function test_initialize_settings(): void {
		global $wp_settings_fields, $wp_settings_sections;

		$this->instance->initialize_settings();

		$this->assertArrayHasKey( \Google\Web_Stories\Experiments::PAGE_NAME, $wp_settings_fields );
		$this->assertArrayHasKey( \Google\Web_Stories\Experiments::PAGE_NAME, $wp_settings_sections );
		$this->assertArrayHasKey( 'web_stories_experiments_section', $wp_settings_sections[ \Google\Web_Stories\Experiments::PAGE_NAME ] );
	}

	/**
	 * @covers ::display_experiment_field
	 */
	public function test_display_experiment_field(): void {
		$this->instance = $this->createTestProxy(
			\Google\Web_Stories\Experiments::class,
			[ $this->injector->make( \Google\Web_Stories\Settings::class ) ]
		);
		$this->instance->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
						]
					);
		$this->instance->method( 'is_experiment_enabled' )
					->willReturn( false );

		$output = get_echo(
			[ $this->instance, 'display_experiment_field' ],
			[
				[
					'label' => 'Foo Label',
					'id'    => 'foo',
				],
			]
		);

		$this->assertStringNotContainsString( "checked='checked'", $output );
	}

	/**
	 * @covers ::display_experiment_field
	 */
	public function test_display_experiment_field_enabled(): void {
		$this->instance = $this->getMockBuilder( \Google\Web_Stories\Experiments::class )
			->setConstructorArgs( [ $this->injector->make( \Google\Web_Stories\Settings::class ) ] )
			->setMethods( [ 'get_experiments', 'is_experiment_enabled' ] )
			->getMock();

		$this->instance->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
							],
						]
					);
		$this->instance->method( 'is_experiment_enabled' )
					->willReturn( true );

		$output = get_echo(
			[ $this->instance, 'display_experiment_field' ],
			[
				[
					'label' => 'Foo Label',
					'id'    => 'foo',
				],
			]
		);
		$this->assertStringContainsString( "checked='checked'", $output );
	}

	/**
	 * @covers ::display_experiment_field
	 */
	public function test_display_experiment_field_enabled_by_default(): void {
		$this->instance = $this->getMockBuilder( \Google\Web_Stories\Experiments::class )
							->setConstructorArgs( [ $this->injector->make( \Google\Web_Stories\Settings::class ) ] )
							->setMethods( [ 'get_experiments' ] )
							->getMock();

		$this->instance->method( 'get_experiments' )
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
			[ $this->instance, 'display_experiment_field' ],
			[
				[
					'label'   => 'Foo Label',
					'id'      => 'foo',
					'default' => true,
				],
			]
		);

		$this->assertStringContainsString( "checked='checked'", $output );
		$this->assertStringContainsString( 'disabled', $output );
	}

	/**
	 * @covers ::get_experiment_groups
	 */
	public function test_get_experiment_groups(): void {
		$groups = $this->instance->get_experiment_groups();
		$this->assertCount( 3, $groups );
	}

	/**
	 * @covers ::get_experiments
	 */
	public function test_get_experiments(): void {
		$all_experiments       = $this->instance->get_experiments();
		$all_experiment_groups = array_keys( $this->instance->get_experiment_groups() );

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
	public function test_get_experiment_statuses(): void {
		$this->assertEmpty( $this->instance->get_experiment_statuses( 'foo-bar-baz' ) );
		$this->assertNotEmpty( $this->instance->get_experiment_statuses( 'dashboard' ) );
		$this->assertNotEmpty( $this->instance->get_experiment_statuses( 'editor' ) );

		foreach ( $this->instance->get_experiment_statuses( 'editor' ) as $key => $status ) {
			$this->assertIsString( $key );
			$this->assertIsBool( $status );
		}
	}

	/**
	 * @covers ::is_experiment_enabled
	 */
	public function test_is_experiment_enabled(): void {
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_EXPERIMENTS, [ 'enableInProgressTemplateActions' => true ], false );

		$this->assertTrue( $this->instance->is_experiment_enabled( 'enableInProgressTemplateActions' ) );
	}

	/**
	 * @covers ::is_experiment_enabled
	 * @covers ::get_experiment
	 */
	public function test_is_experiment_enabled_default_experiment(): void {
		$this->instance = $this->getMockBuilder( \Google\Web_Stories\Experiments::class )
							->setConstructorArgs( [ $this->injector->make( \Google\Web_Stories\Settings::class ) ] )
							->setMethods( [ 'get_experiments' ] )
							->getMock();

		$this->instance->method( 'get_experiments' )
					->willReturn(
						[
							[
								'name'        => 'foo',
								'label'       => 'Foo Label',
								'description' => 'Foo Desc',
								'default'     => false,
							],
							[
								'name'        => 'bar',
								'label'       => 'Bar Label',
								'description' => 'Bar Desc',
								'default'     => true,
							],
						]
					);

		$this->assertFalse( $this->instance->is_experiment_enabled( 'foo' ) );
		$this->assertTrue( $this->instance->is_experiment_enabled( 'bar' ) );
	}

	/**
	 * @covers ::is_experiment_enabled
	 * @covers ::get_experiment
	 */
	public function test_is_experiment_enabled_unknown_experiment(): void {
		$this->assertFalse( $this->instance->is_experiment_enabled( 'baz' ) );
	}

	/**
	 * @cover ::get_enabled_experiments
	 */
	public function test_get_enabled_experiments(): void {
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_EXPERIMENTS, [ 'baz' => true ], false );

		$this->instance = $this->getMockBuilder( \Google\Web_Stories\Experiments::class )
							->setConstructorArgs( [ $this->injector->make( \Google\Web_Stories\Settings::class ) ] )
							->setMethods( [ 'get_experiments', 'is_experiment_enabled' ] )
							->getMock();

		$this->instance->method( 'get_experiments' )
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
		$this->instance->method( 'is_experiment_enabled' )
					->willReturnMap(
						[
							[ 'foo', false ],
							[ 'bar', true ],
							[ 'baz', true ],
						]
					);

		$expected = [
			'bar',
			'baz',
		];

		$this->assertEqualSets( $expected, $this->instance->get_enabled_experiments() );
	}
}
