<?php
/**
 * Copyright 202w Google LLC
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

namespace Google\Web_Stories\Tests\Integration\Product;

use Google\Web_Stories\Interfaces\Product_Query;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use Google\Web_Stories\Tests\Integration\Mock_Vendor_Setup;

/**
 * @coversDefaultClass \Google\Web_Stories\Product\Shopping_Vendors
 */
class Shopping_Vendors extends DependencyInjectedTestCase {
	use Mock_Vendor_Setup;
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Product\Shopping_Vendors
	 */
	private $shopping_vendors;


	public function set_up(): void {
		parent::set_up();
		$this->setup_vendors();

		$this->shopping_vendors = $this->injector->make( \Google\Web_Stories\Product\Shopping_Vendors::class );
	}

	public function tear_down(): void {
		$this->remove_vendors();
		parent::tear_down();
	}

	/**
	 * @covers ::get_vendors
	 */
	public function test_get_vendors(): void {
		$vendors = $this->shopping_vendors->get_vendors();
		$this->assertArrayHasKey( 'mock', $vendors );
		$this->assertArrayHasKey( 'error', $vendors );
		$this->assertArrayHasKey( 'invalid', $vendors );
	}

	/**
	 * @covers ::get_vendor_class
	 */
	public function test_get_vendor_class(): void {
		$query = $this->shopping_vendors->get_vendor_class( 'mock' );
		$this->assertInstanceOf( Product_Query::class, $query );
	}

	/**
	 * @covers ::get_vendor_class
	 */
	public function test_get_vendor_class_invalid(): void {
		$query = $this->shopping_vendors->get_vendor_class( 'invalid' );
		$this->assertNull( $query );
	}

	/**
	 * @covers ::get_vendor_class
	 */
	public function test_get_vendor_class_none_exist(): void {
		$query = $this->shopping_vendors->get_vendor_class( 'not_exists' );
		$this->assertNull( $query );
	}
}
