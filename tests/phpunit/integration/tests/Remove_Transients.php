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
 * @runInSeparateProcess
 * @preserveGlobalState disabled
 * @coversDefaultClass \Google\Web_Stories\Remove_Transients
 */
class Remove_Transients extends DependencyInjectedTestCase {
	protected static $attachment_ids;

	protected static $user_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Remove_Transients
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Remove_Transients::class );

		set_transient( 'web_stories_link_data_fdsf', 'hello' );
		set_site_transient( 'web_stories_updater', 'hello' );
	}

	/**
	 * @covers ::delete_transients
	 */
	public function test_delete_options(): void {
		$this->call_private_method( $this->instance, 'delete_transients' );
		$this->assertFalse( get_transient( 'web_stories_link_data_fdsf' ) );
	}

	/**
	 * @group ms-required
	 * @covers ::delete_network_transients
	 */
	public function test_delete_site_options(): void {
		$this->call_private_method( $this->instance, 'delete_network_transients' );
		$this->assertFalse( get_site_transient( 'web_stories_updater' ) );
	}
}
