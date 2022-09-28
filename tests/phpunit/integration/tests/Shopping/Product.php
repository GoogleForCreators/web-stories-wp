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

namespace Google\Web_Stories\Tests\Integration\Shopping;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Shopping\Product
 */
class Product extends TestCase {
	/**
	 * @covers ::load_from_array
	 */
	public function test_load_from_array(): void {
		$product_object = \Google\Web_Stories\Shopping\Product::load_from_array(
			[
				'aggregateRating'      => [
					'ratingValue' => 5,
					'reviewCount' => 1,
					'reviewUrl'   => 'http://www.example.com/product/t-shirt-with-logo',
				],
				'ratingValue'          => 0,
				'reviewCount'          => 0,
				'reviewUrl'            => 'http://www.example.com/product/t-shirt-with-logo',
				'productBrand'         => 'Google',
				'productDetails'       => 'This is a simple product.',
				'productId'            => 'wc-36',
				'productImages'        => [
					[
						'url' => 'http://www.example.com/wp-content/uploads/2019/01/t-shirt-with-logo-1-4.jpg',
						'alt' => '',
					],
				],
				'productPrice'         => 18,
				'productPriceCurrency' => 'USD',
				'productTitle'         => 'T-Shirt with Logo',
				'productUrl'           => 'http://www.example.com/product/t-shirt-with-logo',
			]
		);
		$this->assertSame( 'USD', $product_object->get_price_currency() );
		$this->assertSame( 18.0, $product_object->get_price() );
		$this->assertSame( 'wc-36', $product_object->get_id() );
		$this->assertSame( 'http://www.example.com/product/t-shirt-with-logo', $product_object->get_url() );
		$this->assertSame( 'Google', $product_object->get_brand() );
		$this->assertSame( 'This is a simple product.', $product_object->get_details() );
	}

	/**
	 * @covers ::load_from_array
	 */
	public function test_load_from_array_empty(): void {
		$product_object = \Google\Web_Stories\Shopping\Product::load_from_array( [] );
		$this->assertEmpty( $product_object->get_price_currency() );
		$this->assertEmpty( $product_object->get_price() );
		$this->assertEmpty( $product_object->get_id() );
		$this->assertEmpty( $product_object->get_url() );
		$this->assertEmpty( $product_object->get_brand() );
		$this->assertEmpty( $product_object->get_details() );
	}
}
