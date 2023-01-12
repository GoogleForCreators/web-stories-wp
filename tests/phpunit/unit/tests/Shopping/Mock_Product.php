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

/**
 * Class Mock_Product.
 * Mocks WooCommerce product methods as needed unit tests.
 */
class Mock_Product {
	/**
	 * @var array<string, mixed> $data
	 */
	protected array $data;

	/**
	 * @param array<string, mixed> $product_data
	 */
	public function __construct( array $product_data ) {
		$this->data = $product_data;
	}

	/**
	 * handle calls for methods that haven't been mocked
	 */
	/**
	 * Pulls a prop from the data array if it exists
	 *
	 * @return mixed
	 */
	public function get_prop( string $prop ) {
		$value = null;

		if ( \array_key_exists( $prop, $this->data ) ) {
			$value = \array_key_exists( $prop, $this->data ) ? $this->data[ $prop ] : null;
		}

		return $value;
	}

	public function get_id(): ?int {
		/**
		 * ID
		 *
		 * @var int|null $id ID
		 */
		$id = $this->get_prop( 'id' );

		return $id;
	}

	public function get_image_id(): ?int {
		/**
		 * Image id.
		 *
		 * @var int|null $image_id Image id.
		 */
		$image_id = $this->get_prop( 'image_id' );

		return $image_id;
	}

	/**
	 * @return int[]|null
	 */
	public function get_gallery_image_ids(): ?array {
		/**
		 * Gallery image ids.
		 *
		 * @var int[]|null $gallery_image_ids Gallery image id.
		 */
		$gallery_image_ids = $this->get_prop( 'gallery_image_ids' );

		return $gallery_image_ids;
	}

	/**
	 * @param mixed $method_name
	 * @param mixed $method_args
	 */
	public function __call( $method_name, $method_args ): void {
		// no-op
	}
}
