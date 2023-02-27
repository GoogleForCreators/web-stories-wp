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

use Google\Web_Stories\Settings;

/**
 * @coversDefaultClass \Google\Web_Stories\Analytics
 */
class Analytics extends DependencyInjectedTestCase {
	private \Google\Web_Stories\Analytics $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Analytics::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 10, has_filter( 'web_stories_print_analytics', [ $this->instance, 'print_analytics_tag' ] ) );
	}

	/**
	 * @covers ::get_tracking_id
	 */
	public function test_get_tracking_id_casts_to_string(): void {
		update_option( Settings::SETTING_NAME_TRACKING_ID, 123_456_789, false );

		$this->assertSame( '123456789', $this->instance->get_tracking_id() );
	}

	/**
	 * @covers ::get_default_configuration
	 */
	public function test_get_default_configuration(): void {
		$tracking_id = '123456789';
		$actual      = $this->instance->get_default_configuration( $tracking_id );

		$this->assertArrayHasKey( 'vars', $actual );
		$this->assertArrayHasKey( 'gtag_id', $actual['vars'] );
		$this->assertSame( (string) $tracking_id, $actual['vars']['gtag_id'] );
		$this->assertArrayHasKey( 'config', $actual['vars'] );
		$this->assertIsArray( $actual['vars']['config'] );
		$this->assertArrayHasKey( $tracking_id, $actual['vars']['config'] );
		$this->assertArrayHasKey( 'triggers', $actual );
		foreach ( $actual['triggers'] as $trigger_config ) {
			$this->assertIsArray( $trigger_config );
			$this->assertArrayHasKey( 'vars', $trigger_config );
			$this->assertArrayHasKey( 'send_to', $trigger_config['vars'] );
			$this->assertSame( $tracking_id, $trigger_config['vars']['send_to'] );

			foreach ( $trigger_config['vars'] as $value ) {
				// Catch typos like ${foo) instead of ${foo}.
				if ( false !== strpos( $value, '$' ) ) {
					$this->assertMatchesRegularExpression( '/^\${[^}]+}$/', $value, 'Invalid variable declaration present' );
				}
			}
		}
	}

	/**
	 * @covers ::print_analytics_tag
	 */
	public function test_print_analytics_tag(): void {
		$actual_before = get_echo( [ $this->instance, 'print_analytics_tag' ] );

		update_option( Settings::SETTING_NAME_TRACKING_ID, 123_456_789, false );
		update_option( Settings::SETTING_NAME_USING_LEGACY_ANALYTICS, false );

		$actual_after = get_echo( [ $this->instance, 'print_analytics_tag' ] );

		$this->assertEmpty( $actual_before );
		$this->assertStringContainsString( '<amp-story-auto-analytics', $actual_after );
	}

	/**
	 * @covers ::print_analytics_tag
	 */
	public function test_print_analytics_tag_legacy(): void {
		$actual_before = get_echo( [ $this->instance, 'print_analytics_tag' ] );

		update_option( Settings::SETTING_NAME_TRACKING_ID, 123_456_789, false );
		update_option( Settings::SETTING_NAME_USING_LEGACY_ANALYTICS, true );

		$actual_after = get_echo( [ $this->instance, 'print_analytics_tag' ] );

		$this->assertEmpty( $actual_before );
		$this->assertStringContainsString( '<amp-analytics', $actual_after );
	}
}
