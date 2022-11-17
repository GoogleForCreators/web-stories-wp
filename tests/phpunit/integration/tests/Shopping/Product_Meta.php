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

namespace Google\Web_Stories\Tests\Integration\Media;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Shopping\Product_Meta
 */
class Product_Meta extends DependencyInjectedTestCase {
	/**
	 * Test instance.
	 */
	protected \Google\Web_Stories\Shopping\Product_Meta $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Shopping\Product_Meta::class );
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta(): void {
		$this->instance->register_meta();

		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::PRODUCTS_POST_META_KEY, \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG ) );
	}

	/**
	 * @covers ::on_plugin_uninstall
	 */
	public function test_on_plugin_uninstall(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);
		update_post_meta( $post->ID, $this->instance::PRODUCTS_POST_META_KEY, [ 'foo' => 'bar' ] );
		$this->instance->on_plugin_uninstall();
		$this->assertSameSets( [], get_post_meta( $post->ID, $this->instance::PRODUCTS_POST_META_KEY, true ) );
	}
}
