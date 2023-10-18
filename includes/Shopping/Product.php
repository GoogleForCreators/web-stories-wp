<?php
/**
 * Class Product
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

use JsonSerializable;

/**
 * Class Product
 *
 * @phpstan-type ProductImage array{
 *   url: string,
 *   alt: string
 * }
 * @phpstan-type ProductData array{
 *   productId?: string,
 *   productTitle?: string,
 *   productDetails?: string,
 *   productBrand?: string,
 *   productUrl?: string,
 *   productImages?: ProductImage[],
 *   productPrice?: float,
 *   productPriceCurrency?: string,
 *   aggregateRating?: array{
 *     ratingValue?: float,
 *     reviewCount?: int,
 *     reviewUrl?: string
 *   }
 * }
 */
class Product implements JsonSerializable {
	/**
	 * Product id.
	 */
	protected string $id = '';
	/**
	 * Product title.
	 */
	protected string $title = '';
	/**
	 * Product brand.
	 */
	protected string $brand = '';
	/**
	 * Product Price.
	 */
	protected float $price = 0.0;
	/**
	 * Product's price currency.
	 */
	protected string $price_currency = '';

	/**
	 * Product images as an array.
	 *
	 * @var array{url: string, alt: string}[]
	 * @phpstan-var ProductImage[]
	 */
	protected array $images = [];

	/**
	 * Product Details.
	 */
	protected string $details = '';

	/**
	 * Product url.
	 */
	protected string $url = '';

	/**
	 * Product rating.
	 *
	 * @var array{rating_value?: float, review_count?: int, review_url?: string}
	 */
	protected array $aggregate_rating = [];

	/**
	 * Product constructor.
	 *
	 * @since 1.21.0
	 *
	 * @param array<string,mixed> $product Array of attributes.
	 */
	public function __construct( array $product = [] ) {
		foreach ( $product as $key => $value ) {
			if ( property_exists( $this, $key ) && ! \is_null( $value ) ) {
				$this->$key = $value;
			}
		}
	}

	/**
	 * Get id.
	 *
	 * @since 1.21.0
	 */
	public function get_id(): string {
		return $this->id;
	}

	/**
	 * Get title.
	 *
	 * @since 1.21.0
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Get brand.
	 *
	 * @since 1.21.0
	 */
	public function get_brand(): string {
		return $this->brand;
	}

	/**
	 * Get price.
	 *
	 * @since 1.21.0
	 */
	public function get_price(): float {
		return $this->price;
	}

	/**
	 * Get currency.
	 *
	 * @since 1.21.0
	 */
	public function get_price_currency(): string {
		return $this->price_currency;
	}

	/**
	 * Get images property.
	 *
	 * @since 1.21.0
	 *
	 * @return array{url: string, alt: string}[]
	 */
	public function get_images(): array {
		return $this->images;
	}

	/**
	 * Get details.
	 *
	 * @since 1.21.0
	 */
	public function get_details(): string {
		return $this->details;
	}

	/**
	 * Get url.
	 *
	 * @since 1.21.0
	 */
	public function get_url(): string {
		return $this->url;
	}

	/**
	 * Get rating.
	 *
	 * @since 1.21.0
	 *
	 * @return array{rating_value?: float, review_count?: int, review_url?: string}
	 */
	public function get_aggregate_rating(): ?array {
		return $this->aggregate_rating;
	}

	/**
	 * Retrieves the response data for JSON serialization.
	 *
	 * @since 1.21.0
	 *
	 * @return mixed Any JSON-serializable value.
	 */
	#[\ReturnTypeWillChange]
	public function jsonSerialize() { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
		$rating = $this->get_aggregate_rating();

		$data = [
			'productId'            => $this->get_id(),
			'productTitle'         => $this->get_title(),
			'productDetails'       => $this->get_details(),
			'productBrand'         => $this->get_brand(),
			'productUrl'           => $this->get_url(),
			'productImages'        => $this->get_images(),
			'productPrice'         => $this->get_price(),
			'productPriceCurrency' => $this->get_price_currency(),
		];

		if ( $rating ) {
			$data['aggregateRating'] = [
				'ratingValue' => $rating['rating_value'],
				'reviewCount' => $rating['review_count'],
				'reviewUrl'   => $rating['review_url'],
			];
		}

		return $data;
	}

	/**
	 * Convert array to object properties.
	 *
	 * @since 1.26.0
	 *
	 * @param array<string, mixed> $product Array of product.
	 * @return Product Product.
	 *
	 * @phpstan-param ProductData $product
	 */
	public static function load_from_array( array $product ): Product {
		$product_object = new self();
		$product_object->set_id( $product['productId'] ?? '' );
		$product_object->set_title( $product['productTitle'] ?? '' );
		$product_object->set_details( $product['productDetails'] ?? '' );
		$product_object->set_brand( $product['productBrand'] ?? '' );
		$product_object->set_url( $product['productUrl'] ?? '' );
		$product_object->set_images( $product['productImages'] ?? [] );
		$product_object->set_price( $product['productPrice'] ?? 0 );
		$product_object->set_price_currency( $product['productPriceCurrency'] ?? '' );


		if ( isset( $product['aggregateRating'] ) ) {
			$product_object->set_aggregate_rating(
				[
					'rating_value' => $product['aggregateRating']['ratingValue'] ?? 0,
					'review_count' => $product['aggregateRating']['reviewCount'] ?? 0,
					'review_url'   => $product['aggregateRating']['reviewUrl'] ?? '',
				]
			);
		}

		return $product_object;
	}

	/**
	 * Set id.
	 *
	 * @since 1.26.0
	 *
	 * @param string $id ID.
	 */
	protected function set_id( string $id ): void {
		$this->id = $id;
	}

	/**
	 * Set title.
	 *
	 * @since 1.26.0
	 *
	 * @param string $title Title.
	 */
	protected function set_title( string $title ): void {
		$this->title = $title;
	}

	/**
	 * Set brand.
	 *
	 * @since 1.26.0
	 *
	 * @param string $brand Brand.
	 */
	protected function set_brand( string $brand ): void {
		$this->brand = $brand;
	}

	/**
	 * Set price.
	 *
	 * @since 1.26.0
	 *
	 * @param float $price Price.
	 */
	protected function set_price( float $price ): void {
		$this->price = $price;
	}

	/**
	 * Set Price currency.
	 *
	 * @since 1.26.0
	 *
	 * @param string $price_currency Price Currency.
	 */
	protected function set_price_currency( string $price_currency ): void {
		$this->price_currency = $price_currency;
	}

	/**
	 * Set Images.
	 *
	 * @since 1.26.0
	 *
	 * @param array{url: string, alt: string}[] $images Images.
	 */
	protected function set_images( array $images ): void {
		$this->images = $images;
	}

	/**
	 * Set Details.
	 *
	 * @since 1.26.0
	 *
	 * @param string $details Details.
	 */
	protected function set_details( string $details ): void {
		$this->details = $details;
	}

	/**
	 * Set url.
	 *
	 * @since 1.26.0
	 *
	 * @param string $url URL.
	 */
	protected function set_url( string $url ): void {
		$this->url = $url;
	}

	/**
	 * Set aggregate rating.
	 *
	 * @since 1.26.0
	 *
	 * @param array{rating_value: float, review_count: int, review_url: string} $aggregate_rating Rating data in array.
	 */
	protected function set_aggregate_rating( array $aggregate_rating ): void {
		$this->aggregate_rating = $aggregate_rating;
	}
}
