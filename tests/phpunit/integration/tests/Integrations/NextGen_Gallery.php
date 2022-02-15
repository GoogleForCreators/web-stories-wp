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

namespace Google\Web_Stories\Tests\Integration\Integrations;

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\NextGen_Gallery
 */
class NextGen_Gallery extends TestCase {
	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$nextgen_gallery = new \Google\Web_Stories\Integrations\NextGen_Gallery();
		$nextgen_gallery->register();

		$this->assertSame( PHP_INT_MAX, has_filter( 'run_ngg_resource_manager', [ $nextgen_gallery, 'filter_run_ngg_resource_manager' ] ) );
	}

	/**
	 * @covers ::filter_run_ngg_resource_manager
	 */
	public function test_filter_run_ngg_resource_manager(): void {
		$nextgen_gallery = new \Google\Web_Stories\Integrations\NextGen_Gallery();

		$before = $nextgen_gallery->filter_run_ngg_resource_manager( true );

		$_GET[ Story_Post_Type::POST_TYPE_SLUG ] = 123;

		$after = $nextgen_gallery->filter_run_ngg_resource_manager( true );

		$this->assertTrue( $before );
		$this->assertFalse( $after );
	}

	/**
	 * @covers ::filter_run_ngg_resource_manager
	 */
	public function test_filter_run_ngg_resource_manager_pretty_permalinks(): void {
		$nextgen_gallery = new \Google\Web_Stories\Integrations\NextGen_Gallery();

		$before = $nextgen_gallery->filter_run_ngg_resource_manager( true );

		$_SERVER['REQUEST_URI'] = '/' . Story_Post_Type::REWRITE_SLUG . '/foo-bar/';

		$after = $nextgen_gallery->filter_run_ngg_resource_manager( true );

		$this->assertTrue( $before );
		$this->assertFalse( $after );
	}
}
