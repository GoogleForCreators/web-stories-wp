<?php
/**
 * Shopping vendors class.
 *
 * A central class to register shopping vendors.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

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

declare(strict_types = 1);

namespace Google\Web_Stories\Shopping;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Interfaces\Product_Query;

/**
 * Class Shopping_Vendors.
 */
class Shopping_Vendors {

	/**
	 * Injector instance.
	 *
	 * @var Injector Injector instance.
	 */
	private Injector $injector;

	/**
	 * Shopping_Vendors constructor.
	 *
	 * @since 1.21.0
	 *
	 * @param Injector $injector Injector instance.
	 */
	public function __construct( Injector $injector ) {
		$this->injector = $injector;
	}

	/**
	 * Get an instance of product query class by vendor's name.
	 *
	 * @since 1.21.0
	 *
	 * @param string $name Name of vendor.
	 */
	public function get_vendor_class( string $name ): ?Product_Query {
		$vendors = $this->get_vendors();

		if ( ! isset( $vendors[ $name ]['class'] ) || ! class_exists( $vendors[ $name ]['class'] ) ) {
			return null;
		}

		$query = $this->injector->make( $vendors[ $name ]['class'] );

		if ( ! $query instanceof Product_Query ) {
			return null;
		}

		return $query;
	}

	/**
	 * Get an array of registered vendors.
	 *
	 * @since 1.21.0
	 *
	 * @return array<string,array{label: string, class?: class-string}> Array of vendors.
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
				'class' => WooCommerce_Query::class,
			],
		];

		/**
		 * Filter the array of vendors.
		 *
		 * @since 1.21.0
		 *
		 * @param array $vendors Associative array of vendor, including label and class.
		 */
		$vendors = apply_filters( 'web_stories_shopping_vendors', $vendors );

		return $vendors;
	}
}
