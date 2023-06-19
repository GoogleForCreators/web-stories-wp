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

namespace Google\Web_Stories\Tests\Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Settings
 */
class Settings extends DependencyInjectedTestCase {

	private \Google\Web_Stories\Settings $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Settings::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$options = get_registered_settings();
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_EXPERIMENTS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_TRACKING_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_USING_LEGACY_ANALYTICS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_AD_NETWORK, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_AD_MANAGER_SLOT_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ADSENSE_PUBLISHER_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ADSENSE_SLOT_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_MGID_WIDGET_ID, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_EXPERIMENTS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_PUBLISHER_LOGOS, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_VIDEO_CACHE, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_DATA_REMOVAL, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_ARCHIVE, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_AUTO_ADVANCE, $options );
		$this->assertArrayHasKey( $this->instance::SETTING_NAME_DEFAULT_PAGE_DURATION, $options );
	}

	/**
	 * @covers ::on_plugin_uninstall
	 */
	public function test_on_plugin_uninstall(): void {
		add_option( $this->instance::SETTING_NAME_EXPERIMENTS, [ 'foo' => 'bar' ] );
		add_option( $this->instance::SETTING_NAME_TRACKING_ID, 'bar' );
		add_option( $this->instance::SETTING_NAME_USING_LEGACY_ANALYTICS, true );
		add_option( $this->instance::SETTING_NAME_AD_NETWORK, 'bar' );
		add_option( $this->instance::SETTING_NAME_AD_MANAGER_SLOT_ID, 'baz' );
		add_option( $this->instance::SETTING_NAME_ADSENSE_PUBLISHER_ID, 'baz' );
		add_option( $this->instance::SETTING_NAME_ADSENSE_SLOT_ID, 'baz' );
		add_option( $this->instance::SETTING_NAME_MGID_WIDGET_ID, '1234567' );
		add_option( $this->instance::SETTING_NAME_EXPERIMENTS, [ 'foo' => 'bar' ] );
		add_option( $this->instance::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, 123 );
		add_option( $this->instance::SETTING_NAME_PUBLISHER_LOGOS, [ 123, 567 ] );
		add_option( $this->instance::SETTING_NAME_VIDEO_CACHE, true );
		add_option( $this->instance::SETTING_NAME_DATA_REMOVAL, true );
		add_option( $this->instance::SETTING_NAME_ARCHIVE, 'none' );
		add_option( $this->instance::SETTING_NAME_AUTO_ADVANCE, true );
		add_option( $this->instance::SETTING_NAME_DEFAULT_PAGE_DURATION, 7 );

		$this->instance->on_plugin_uninstall();

		$this->assertSame( [], get_option( $this->instance::SETTING_NAME_EXPERIMENTS ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_TRACKING_ID ) );
		$this->assertFalse( get_option( $this->instance::SETTING_NAME_USING_LEGACY_ANALYTICS ) );
		$this->assertSame( 'none', get_option( $this->instance::SETTING_NAME_AD_NETWORK ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_AD_MANAGER_SLOT_ID ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_ADSENSE_PUBLISHER_ID ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_ADSENSE_SLOT_ID ) );
		$this->assertSame( '', get_option( $this->instance::SETTING_NAME_MGID_WIDGET_ID ) );
		$this->assertSame( [], get_option( $this->instance::SETTING_NAME_EXPERIMENTS ) );
		$this->assertSame( 0, get_option( $this->instance::SETTING_NAME_ACTIVE_PUBLISHER_LOGO ) );
		$this->assertSame( [], get_option( $this->instance::SETTING_NAME_PUBLISHER_LOGOS ) );
		$this->assertFalse( get_option( $this->instance::SETTING_NAME_VIDEO_CACHE ) );
		$this->assertFalse( get_option( $this->instance::SETTING_NAME_DATA_REMOVAL ) );
		$this->assertSame( 'default', get_option( $this->instance::SETTING_NAME_ARCHIVE ) );
		$this->assertTrue( get_option( $this->instance::SETTING_NAME_AUTO_ADVANCE ) );
		$this->assertSame( 7, get_option( $this->instance::SETTING_NAME_DEFAULT_PAGE_DURATION ) );
	}

	/**
	 * @covers ::get_setting
	 */
	public function test_get_setting_uses_saved_option(): void {
		add_option( $this->instance::SETTING_NAME_AUTO_ADVANCE, false );
		$this->assertFalse( $this->instance->get_setting( $this->instance::SETTING_NAME_AUTO_ADVANCE, true ) );
	}

	/**
	 * @covers ::get_setting
	 */
	public function test_get_setting_uses_saved_option_type(): void {
		add_option( $this->instance::SETTING_NAME_AUTO_ADVANCE, 'no-boolean' );
		$this->assertTrue( $this->instance->get_setting( $this->instance::SETTING_NAME_AUTO_ADVANCE ) );
	}

	/**
	 * @param array{type?: string, description?: string, sanitize_callback?: callable, show_in_rest?: bool|array<mixed>, default?: mixed} $args
	 * @param mixed $value
	 * @param mixed $expected
	 *
	 * @covers ::get_setting
	 * @dataProvider data_test_types
	 */
	public function test_get_setting_uses_type( string $name, array $args, $value, $expected ): void {
		register_setting( 'test_group', $name, $args );
		add_option( $name, $value );
		$this->assertSame( $expected, $this->instance->get_setting( $name ) );
	}

	/**
	 * @return array<string, array<string, mixed>>
	 */
	public function data_test_types(): array {
		return [
			'array from string' => [
				'name'     => 'array_type',
				'args'     => [
					'type' => 'array',
				],
				'value'    => 'string',
				'expected' => [ 'string' ],
			],
			'array key value'   => [
				'name'     => 'array_key',
				'args'     => [
					'type' => 'array',
				],
				'value'    => [ 'key' => 'value' ],
				'expected' => [ 'value' ],
			],
			'array of ints'     => [
				'name'     => 'array_ints',
				'args'     => [
					'type'         => 'array',
					'default'      => [],
					'show_in_rest' => [
						'schema' => [
							'items' => [
								'type' => 'integer',
							],
						],
					],
				],
				'value'    => [ '1', '2', '3' ],
				'expected' => [ 1, 2, 3 ],
			],

			'array from object' => [
				'name'     => 'array_type',
				'args'     => [
					'type'         => 'object',
					'show_in_rest' => [
						'schema' => [
							'properties'           => [],
							'additionalProperties' => true,
						],
					],
				],
				'value'    => [ 'key' => 'value' ],
				'expected' => [ 'key' => 'value' ],
			],
			'string to int'     => [
				'name'     => 'array_int',
				'args'     => [
					'type' => 'integer',
				],
				'value'    => '3',
				'expected' => 3,
			],
			'int to string'     => [
				'name'     => 'array_int',
				'args'     => [
					'type' => 'string',
				],
				'value'    => 3,
				'expected' => '3',
			],
			'int to boolean'    => [
				'name'     => 'array_boolean',
				'args'     => [
					'type' => 'boolean',
				],
				'value'    => 1,
				'expected' => true,
			],
			'string to boolean' => [
				'name'     => 'array_boolean',
				'args'     => [
					'type' => 'boolean',
				],
				'value'    => 'string',
				'expected' => true,
			],
		];
	}

	/**
	 * @covers ::get_setting
	 */
	public function test_get_setting_uses_registered_default(): void {
		$this->assertTrue( $this->instance->get_setting( $this->instance::SETTING_NAME_AUTO_ADVANCE ) );
	}

	/**
	 * @covers ::get_setting
	 */
	public function test_get_setting_uses_explicit_default(): void {
		$this->assertFalse( $this->instance->get_setting( $this->instance::SETTING_NAME_AUTO_ADVANCE, false ) );
		$this->assertSame( 'foo', $this->instance->get_setting( $this->instance::SETTING_NAME_AUTO_ADVANCE, 'foo' ) );
	}
}
