<?php

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Interfaces\Product_Query;
use Google\Web_Stories\Product\Shopify_Query;
use Google\Web_Stories\Product\Woocommerce_Query;

class Shopping_Vendors {

	/**
	 * @param Injector $injector Injector instance.
	 */
	public function __construct( Injector $injector ) {
		$this->injector = $injector;
	}

	/**
	 * @param string $name
	 */
	public function get_vendor_class( string $name ): ?Product_Query {
		$vendors = $this->get_vendors();
		if ( ! isset( $vendors[ $name ] ) || ! isset( $vendors[ $name ]['class'] ) ) {
			return null;
		}
		/**
		 * Product query
		 *
		 * @var Product_Query $query
		 */
		$query = $this->injector->make( $vendors[ $name ]['class'] );

		return $query;
	}

	/**
	 * @return array
	 */
	public function get_vendors(): array {
		$vendors = [
			'none'        => [
				'label' => __( 'None', 'web-stories' ),
			],
			'shopify'     => [
				'label' => __( 'Shopify', 'web-stories' ),
				'class' => Shopify_Query::class,
			],
			'woocommerce' => [
				'label' => __( 'WooCommerce', 'web-stories' ),
				'class' => Woocommerce_Query::class,
			],
		];

		$vendors = apply_filters( 'web_stories_shopping_vendors', $vendors );

		return $vendors;
	}
}
