<?php

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Interfaces\Product_Query;
use Google\Web_Stories\Product\Shopify_Query;
use Google\Web_Stories\Product\Woocommerce_Query;

class Shopping_Vendors {

	/**
	 * Array of vendors.
	 *
	 * @var array
	 */
	protected $vendors = [];

	/**
	 * Injector instance.
	 *
	 * @var Injector Injector instance.
	 */
	private $injector;

	/**
	 * @param Injector $injector Injector instance.
	 */
	public function __construct( Injector $injector ) {
		$this->injector = $injector;

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

		$this->vendors = $vendors;
	}

	/**
	 * @param string $name
	 */
	public function get_vendor_class( string $name ): ?Product_Query {
		if ( ! isset( $this->vendors[ $name ] ) || ! isset( $this->vendors[ $name ]['class'] ) ) {
			return null;
		}
		/**
		 * Product query
		 *
		 * @var Product_Query $query
		 */
		$query = $this->injector->make( $this->vendors[ $name ]['class'] );

		return $query;
	}

	/**
	 * @return array
	 */
	public function get_vender_labels(): array {
		$labels = [];
		foreach ( $this->vendors as $key => $vendor ) {
			$labels[ $key ] = $vendor['label'];
		}

		return $labels;
	}

	/**
	 * @return array
	 */
	public function get_vendors(): array {
		return $this->vendors;
	}
}
