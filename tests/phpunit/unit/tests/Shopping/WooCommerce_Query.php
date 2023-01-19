<?php

declare(strict_types = 1);

/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\Tests\Unit\Shopping;

use Brain\Monkey;
use Google\Web_Stories\Integrations\WooCommerce;
use Google\Web_Stories\Tests\Shared\Private_Access;
use Google\Web_Stories\Tests\Unit\TestCase;
use Mockery;

/**
 * @coversDefaultClass \Google\Web_Stories\Shopping\WooCommerce_Query
 */
class WooCommerce_Query extends TestCase {
	use Private_Access;

	private \Google\Web_Stories\Shopping\WooCommerce_Query $instance;

	public function set_up(): void {
		parent::set_up();

		$this->stubEscapeFunctions();

		Monkey\Functions\stubs(
			[
				'_prime_post_caches',
				'get_post_meta',
				'wp_strip_all_tags',
				'get_woocommerce_currency' => static fn() => 'USD',
			]
		);

		$woocommerce = $this->createMock( WooCommerce::class );
		$woocommerce->method( 'get_plugin_status' )->willReturn(
			[
				'installed' => true,
				'active'    => true,
				'canManage' => true,
				'link'      => 'https://example.com',
			]
		);
		$this->instance = new \Google\Web_Stories\Shopping\WooCommerce_Query( $woocommerce );
	}

	/**
	 * @covers ::get_search
	 */
	public function test_products_image(): void {
		Monkey\Functions\stubs(
			[
				'wc_get_products'             => static function () {
					$object   = new \stdClass();
					$products = [
						Mockery::mock(
							\WC_Product::class,
							[
								'get_id'                => 1,
								'get_title'             => '',
								'get_price'             => 0,
								'get_average_rating'    => 0.0,
								'get_rating_count'      => 0,
								'get_permalink'         => '',
								'get_short_description' => '',
								'get_image_id'          => 50,
								'get_gallery_image_ids' => [
									51,
									59,
									60,
								],
							]
						),

						Mockery::mock(
							\WC_Product::class,
							[
								'get_id'                => 2,
								'get_title'             => '',
								'get_price'             => 0,
								'get_average_rating'    => 0.0,
								'get_rating_count'      => 0,
								'get_permalink'         => '',
								'get_short_description' => '',
								'get_image_id'          => null,
								'get_gallery_image_ids' => [],
							]
						),

						Mockery::mock(
							\WC_Product::class,
							[
								'get_id'                => 3,
								'get_title'             => '',
								'get_price'             => 0,
								'get_average_rating'    => 0.0,
								'get_rating_count'      => 0,
								'get_permalink'         => '',
								'get_short_description' => '',
								'get_image_id'          => null,
								'get_gallery_image_ids' => [
									72,
									null,
									76,
								],
							]
						),
					];
					$object->products      = $products;
					$object->max_num_pages = 1;
					return $object;
				},
				'wp_get_attachment_image_url' => static function ( $id ) {
					if ( ! $id ) {
						// id was passed as null to simulate missing post / attachment
						return false;
					}

					return sprintf( 'http://example.com/%s', $id );
				},
			]
		);

		$results = $this->instance->get_search( 'hoodie' );
		$this->assertIsArray( $results );
		$this->assertArrayHasKey( 'products', $results );
		$this->assertIsArray( $results['products'] );
		$this->assertEquals( 'http://example.com/50', $results['products'][0]->get_images()[0]['url'] );
		$this->assertEquals( 'http://example.com/60', $results['products'][0]->get_images()[3]['url'] );
		$this->assertEquals( 'http://example.com/72', $results['products'][2]->get_images()[1]['url'] );
		$this->assertEquals( 0, \count( $results['products'][1]->get_images() ) );
	}

	/**
	 * @covers ::get_product_image_ids
	 */
	public function test_get_product_image_ids(): void {
		$product = Mockery::mock(
			\WC_Product::class,
			[
				'get_id'                => 1,
				'get_title'             => '',
				'get_price'             => 0,
				'get_average_rating'    => 0.0,
				'get_rating_count'      => 0,
				'get_permalink'         => '',
				'get_short_description' => '',
				'get_image_id'          => 50,
				'get_gallery_image_ids' => [
					51,
					59,
				],
			]
		);

		$ids = $this->call_private_method( [ $this->instance, 'get_product_image_ids' ], [ $product ] );

		$this->assertEquals( [ 50, 51, 59 ], $ids );
	}

	/**
	 * @covers ::get_product_image_ids
	 */
	public function test_get_product_image_ids_invalid(): void {
		$product = Mockery::mock(
			\WC_Product::class,
			[
				'get_id'                => 1,
				'get_title'             => '',
				'get_price'             => 0,
				'get_average_rating'    => 0.0,
				'get_rating_count'      => 0,
				'get_permalink'         => '',
				'get_short_description' => '',
				'get_image_id'          => null,
				'get_gallery_image_ids' => [
					null,
					27,
				],
			]
		);

		$ids = $this->call_private_method( [ $this->instance, 'get_product_image_ids' ], [ $product ] );

		$this->assertIsArray( $ids );
		$this->assertCount( 1, $ids );
		$this->assertContains( 27, $ids );
	}

	/**
	 * @covers ::get_product_image
	 */
	public function test_get_product_image(): void {
		Monkey\Functions\stubs(
			[
				'wp_get_attachment_image_url' => static fn( $id ) => sprintf( 'http://example.com/%s', $id ),
				'get_post_meta'               => static fn() => 'image alt',

			]
		);

		$results = $this->call_private_method( [ $this->instance, 'get_product_image' ], [ 2 ] );

		$this->assertEquals(
			[
				'url' => 'http://example.com/2',
				'alt' => 'image alt',
			],
			$results
		);
	}
}
