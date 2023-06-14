<?php

declare(strict_types = 1);

/**
 * Copyright 2023 Google LLC
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
 * @coversDefaultClass \Google\Web_Stories\Mgid
 */
class Mgid extends DependencyInjectedTestCase {
	private \Google\Web_Stories\Mgid $instance;

	public function set_up(): void {
		parent::set_up();

		update_option( Settings::SETTING_NAME_AD_NETWORK, 'mgid' );
		update_option( Settings::SETTING_NAME_MGID_WIDGET_ID, 123456789 );

		$this->instance = $this->injector->make( \Google\Web_Stories\Mgid::class );
	}

	public function tear_down(): void {
		parent::tear_down();

		delete_option( Settings::SETTING_NAME_AD_NETWORK );
		delete_option( Settings::SETTING_NAME_MGID_WIDGET_ID );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 10, has_action( 'web_stories_print_analytics', [ $this->instance, 'print_mgid_tag' ] ) );
	}

	/**
	 * @covers ::get_widget_id
	 */
	public function test_get_widget_id(): void {
		$result = $this->call_private_method( [ $this->instance, 'get_widget_id' ] );
		$this->assertSame( 123456789, $result );
	}

	/**
	 * @covers ::is_enabled
	 */
	public function test_is_enabled(): void {
		$result = $this->call_private_method( [ $this->instance, 'is_enabled' ] );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::print_mgid_tag
	 */
	public function test_print_mgid_tag(): void {
		$output = get_echo( [ $this->instance, 'print_mgid_tag' ] );
		$this->assertStringContainsString( '<amp-story-auto-ads>', $output );
	}
}
