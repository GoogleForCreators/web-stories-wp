<?php

declare(strict_types = 1);

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

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use WP_Term;
use WP_Term_Query;

/**
 * @coversDefaultClass \Google\Web_Stories\Taxonomy\Taxonomy_Base
 */
class Taxonomy_Base extends DependencyInjectedTestCase {

	private \Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy::class );
		$this->instance->register_taxonomy();
		self::factory()->term->create_many( 5, [ 'taxonomy' => $this->instance->get_taxonomy_slug() ] );
		$this->instance->unregister_taxonomy();
	}

	/**
	 * @covers ::register_taxonomy
	 */
	public function test_register_taxonomy(): void {
		$this->instance->register_taxonomy();
		$slug = $this->instance->get_taxonomy_slug();
		$this->assertTrue( taxonomy_exists( $slug ) );
	}

	/**
	 * @covers ::unregister_taxonomy
	 */
	public function test_unregister_taxonomy(): void {
		$this->instance->register();
		$slug = $this->instance->get_taxonomy_slug();
		$this->assertTrue( taxonomy_exists( $slug ) );
		$this->instance->unregister_taxonomy();
		$this->assertFalse( taxonomy_exists( $slug ) );
	}

	/**
	 * @covers ::on_plugin_uninstall
	 */
	public function test_on_plugin_uninstall(): void {
		$this->instance->register();
		$term_query = new WP_Term_Query();

		/**
		 * @var WP_Term[] $terms
		 */
		$terms = $term_query->query(
			[
				'taxonomy'   => $this->instance->get_taxonomy_slug(),
				'hide_empty' => false,
			]
		);

		$this->assertCount( 5, $terms );
		$this->instance->on_plugin_uninstall();
		$term_query = new WP_Term_Query();

		/**
		 * @var WP_Term[] $terms
		 */
		$terms = $term_query->query(
			[
				'taxonomy'   => $this->instance->get_taxonomy_slug(),
				'hide_empty' => false,
			]
		);
		$this->assertEqualSets( [], $terms );
	}
}
