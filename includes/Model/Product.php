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

namespace Google\Web_Stories\Model;

/**
 * Class Product
 */
class Product {
	/**
	 * Product id.
	 *
	 * @var string
	 */
	protected $id;
	/**
	 * Product title.
	 *
	 * @var string
	 */
	protected $title;
	/**
	 * Product brand.
	 *
	 * @var string
	 */
	protected $brand;
	/**
	 * Product Price.
	 *
	 * @var float
	 */
	protected $price;
	/**
	 * Product's price currency.
	 *
	 * @var string
	 */
	protected $price_currency;
	/**
	 * Product images as an array of Image objects.
	 *
	 * @var Image[]
	 */
	protected $images;
	/**
	 * Product Details.
	 *
	 * @var string
	 */
	protected $details;
	/**
	 * Product url.
	 *
	 * @var string
	 */
	protected $url;
	/**
	 * Product rating.
	 *
	 * @var Rating
	 */
	protected $aggregate_rating;

	/**
	 * Product constructor.
	 *
	 * @since 1.20.0
	 *
	 * @param array $product Array of attributes.
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
	 */
	public function get_id(): string {
		return $this->id;
	}

	/**
	 * Get title.
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Get brand.
	 */
	public function get_brand(): string {
		return $this->brand;
	}

	/**
	 * Get price.
	 */
	public function get_price(): float {
		return $this->price;
	}

	/**
	 * Get currency.
	 */
	public function get_price_currency(): string {
		return $this->price_currency;
	}

	/**
	 * Get images property.
	 *
	 * @return Image[]
	 */
	public function get_images(): array {
		return $this->images;
	}

	/**
	 * Get details.
	 */
	public function get_details(): string {
		return $this->details;
	}

	/**
	 * Get url.
	 */
	public function get_url(): string {
		return $this->url;
	}

	/**
	 * Get rating.
	 */
	public function get_aggregate_rating(): Rating {
		return $this->aggregate_rating;
	}
}
