<?php

namespace Google\Web_Stories\Tests\Integration;

use Google\Web_Stories\Interfaces\Product_Query;
use Google\Web_Stories\Product\Product;
use WP_Error;

/**
 *
 */
class Mock_Vender implements Product_Query {

	/**
	 * @inheritDoc
	 */
	public function get_search( string $search_term ) {

		if ( 'error' === $search_term ) {
			return new WP_Error( 'mock_error', 'Mock error', [ 'status' => 400 ] );
		}

		$products = [];
		for ( $x = 0; $x < 10; $x ++ ) {
			$products[] = new Product(
				[
					'id'             => uniqid(),
					'title'          => 'Product ' . $x,
					'brand'          => 'Google',
					'price'          => 1.00 * $x,
					'price_currency' => 'USD',
					'images'         => [],
					'details'        => 'Description',
					'url'            => 'http://www.google.com/product/' . $x,
				]
			);
		}

		return $products;
	}
}
