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

namespace Google\Web_Stories\Tests\Integration;

use Google\Web_Stories\Tests\Integration\Vendors\Mock_Vendor;
use Google\Web_Stories\Tests\Integration\Vendors\Mock_Vendor_Error;
use Google\Web_Stories\Tests\Integration\Vendors\Mock_Vendor_Invalid;

/**
 * Trait Mock_Vendor_Setup
 */
trait Mock_Vendor_Setup {

	/**
	 * Add filter to add vendor.
	 */
	protected function setup_vendors(): void {
		add_filter( 'web_stories_shopping_vendors', [ $this, 'add_mock_vendor' ] );
	}

	/**
	 * Remove filter to remove vendor.
	 */
	protected function remove_vendors(): void {
		remove_filter( 'web_stories_shopping_vendors', [ $this, 'add_mock_vendor' ] );
	}

	/**
	 * Add mock vendor to array with filter.
	 *
	 * @param array $vendors
	 * @return array
	 */
	public function add_mock_vendor( $vendors ): array {
		return [
			'none'    => [
				'label' => 'None',
			],
			'mock'    => [
				'label' => 'Mock',
				'class' => Mock_Vendor::class,
			],
			'error'   => [
				'label' => 'Error',
				'class' => Mock_Vendor_Error::class,
			],
			'invalid' => [
				'label' => 'invalid',
				'class' => Mock_Vendor_Invalid::class,
			],
		];
	}
}
