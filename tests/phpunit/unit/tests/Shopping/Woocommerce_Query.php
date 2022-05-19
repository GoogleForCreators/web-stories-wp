<?php
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
use Google\Web_Stories\Shopping\Woocommerce_Query;
use Google\Web_Stories\Tests\Unit\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Shopping\Woocommerce_Query
 */
class Woocommerce_Query_Test extends TestCase {

	public function set_up(): void {
		parent::set_up();

		$this->stubEscapeFunctions();

		Monkey\Functions\stubs(
			[
				'_prime_post_caches',
				'get_post_meta',
				'wp_strip_all_tags',
				'get_woocommerce_currency' => static function() {
					return 'USD';
				},
			]
		);
	}

	/**
	 * @covers ::get_search
	 */
	public function test_products_image(): void {

		Monkey\Functions\stubs(
			[
				'wc_get_products'       => static function() {
					return [
						new Mock_Product(
							[
								'id'                => '1',
								'image_id'          => 50,
								'gallery_image_ids' => [
									51,
									59,
									60,
								],
							]
						),

						new Mock_Product(
							[
								'id'                => '2',
								'image_id'          => null,
								'gallery_image_ids' => [],
							]
						),

						new Mock_Product(
							[
								'id'                => '3',
								'image_id'          => null,
								'gallery_image_ids' => [
									72,
									null,
									76,

								],
							]
						),
					];
				},
				'wp_get_attachment_url' => static function( $id ) {

					if ( ! $id ) {
						// id was passed as null to simulate missing post / attachment
						return false;
					}

					return sprintf( 'http://example.com/%s', $id );
				},
			]
		);

		$product_query = new Woocommerce_Query();
		$results       = $product_query->get_search( 'hoodie' );

		$this->assertEquals( 'http://example.com/50', $results[0]->get_images()[0]['url'] );
		$this->assertEquals( 'http://example.com/60', $results[0]->get_images()[3]['url'] );
		$this->assertEquals( 'http://example.com/72', $results[2]->get_images()[1]['url'] );
		$this->assertEquals( 0, \count( $results[1]->get_images() ) );
	}

	/**
	 * @covers ::get_product_image_ids
	 */
	public function test_get_product_image_ids(): void {

		$product_query = new Woocommerce_Query();
		$product       = new Mock_Product(
			[
				'id'                => '1',
				'image_id'          => 50,
				'gallery_image_ids' => [
					51,
					59,
				],
			]
		);

		$ids = Util::call_method(
			$product_query,
			'get_product_image_ids', 
			[ $product ]
		);

		$this->assertEquals( [ 50, 51, 59 ], $ids );

		$product = new Mock_Product(
			[
				'id'                => '1',
				'image_id'          => null,
				'gallery_image_ids' => [
					null,
					27,
				],
			]
		);

		$ids = Util::call_method(
			$product_query,
			'get_product_image_ids', 
			[ $product ]
		);
		
		$this->assertEquals( 1, \count( $ids ) );
		$this->assertContains( 27, $ids );

	}

	/**
	 * @covers ::get_product_image
	 */
	
	public function test_get_product_image(): void {
		Monkey\Functions\stubs(
			[
				'wp_get_attachment_url' => static function( $id ) {
					return sprintf( 'http://example.com/%s', $id );
				},
				'get_post_meta'         => static function() {
					return 'image alt';
				},
				
			]
		);

		$product_query = new Woocommerce_Query();

		$results = Util::call_method(
			$product_query,
			'get_product_image', 
			[ 2 ]
		);

		$this->assertEquals(
			[
				'url' => 'http://example.com/2',
				'alt' => 'image alt',
			],
			$results 
		);
	}
}
