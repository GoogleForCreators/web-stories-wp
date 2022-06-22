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
	 *
	 * @var string
	 */
	protected $id = '';
	/**
	 * Product title.
	 *
	 * @var string
	 */
	protected $title = '';
	/**
	 * Product brand.
	 *
	 * @var string
	 */
	protected $brand = '';
	/**
	 * Product Price.
	 *
	 * @var float
	 */
	protected $price = 0.0;
	/**
	 * Product's price currency.
	 *
	 * @var string
	 */
	protected $price_currency = '';

	/**
	 * Product images as an array.
	 *
	 * @var array{url: string, alt: string}[]
	 * @phpstan-var ProductImage[]
	 */
	protected $images = [];

	/**
	 * Product Details.
	 *
	 * @var string
	 */
	protected $details = '';

	/**
	 * Product url.
	 *
	 * @var string
	 */
	protected $url = '';

	/**
	 * Product rating.
	 *
	 * @var array{rating_value: float, review_count: int, review_url: string}
	 */
	protected $aggregate_rating;

	/**
	 * Product constructor.
	 *
	 * @since 1.21.0
	 *
	 * @param array<string,mixed> $product Array of attributes.
	 */
	public function __construct( array $product = [] ) {
		foreach ( $product as $key => $value ) {
			if ( property_exists( $this, $key ) ) {
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
	 * @return array{rating_value: float, review_count: int, review_url: string}
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
}
