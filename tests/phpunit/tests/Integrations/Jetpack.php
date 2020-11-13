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

namespace Google\Web_Stories\Tests\Integrations;

use Google\Web_Stories\Story_Post_Type;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\Jetpack
 */
class Jetpack extends \WP_UnitTestCase {
	/**
	 * @covers ::init
	 */
	public function test_init() {
		$jetpack = new \Google\Web_Stories\Integrations\Jetpack();
		$jetpack->init();

		$this->assertFalse( has_filter( 'wpcom_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );
		$this->assertSame( 10, has_filter( 'jetpack_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );

		remove_all_filters( 'jetpack_sitemap_post_types' );
	}

	/**
	 * @covers ::init
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_init_is_wpcom() {
		define( 'IS_WPCOM', true );

		$jetpack = new \Google\Web_Stories\Integrations\Jetpack();
		$jetpack->init();

		$this->assertSame( 10, has_filter( 'wpcom_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );
		$this->assertFalse( has_filter( 'jetpack_sitemap_post_types', [ $jetpack, 'add_to_jetpack_sitemap' ] ) );

		remove_all_filters( 'wpcom_sitemap_post_types' );
	}

	/**
	 * @covers ::add_to_jetpack_sitemap
	 */
	public function test_add_to_jetpack_sitemap() {
		$jetpack = new \Google\Web_Stories\Integrations\Jetpack();
		$this->assertEqualSets( [ Story_Post_Type::POST_TYPE_SLUG ], $jetpack->add_to_jetpack_sitemap( [] ) );
	}
}
