<?php
/**
 * Copyright 2020 Google LLC
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

namespace Google\Web_Stories\Tests\Integration\Taxonomy;

use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Taxonomy\Taxonomy_Base
 */
class Taxonomy_Base extends TestCase {
	/**
	 * @covers ::register_taxonomy
	 */
	public function test_register_taxonomy() {
		$object = new DummyTaxonomy();
		$object->register_taxonomy();
		$slug = $this->get_private_property( $object, 'taxonomy_slug' );
		$this->assertTrue( taxonomy_exists( $slug ) );
	}

	/**
	 * @covers ::unregister_taxonomy
	 */
	public function test_unregister_taxonomy() {
		$object = new DummyTaxonomy();
		$object->register();
		$slug = $this->get_private_property( $object, 'taxonomy_slug' );
		$this->assertTrue( taxonomy_exists( $slug ) );
		$object->unregister_taxonomy();
		$this->assertFalse( taxonomy_exists( $slug ) );
	}
}
