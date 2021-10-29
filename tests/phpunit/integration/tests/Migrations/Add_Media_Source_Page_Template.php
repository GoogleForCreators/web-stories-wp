<?php
/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Integration\Migrations;

use Google\Web_Stories\Media\Media_Source_Taxonomy;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * Class Add_Media_Source_Page_Template
 *
 * @coversDefaultClass \Google\Web_Stories\Migrations\Add_Media_Source_Page_Template
 */
class Add_Media_Source_Page_Template extends DependencyInjectedTestCase {
	/**
	 * @covers ::migrate
	 * @covers ::get_term
	 * @covers \Google\Web_Stories\Migrations\Add_Media_Source::migrate
	 */
	public function test_migrate() {
		$instance = $this->injector->make( \Google\Web_Stories\Migrations\Add_Media_Source_Page_Template::class );
		$instance->migrate();

		$term = $this->call_private_method( $instance, 'get_term' );

		$terms = get_terms(
			[
				'taxonomy'   => $this->container->get( 'media.media_source' )->get_taxonomy_slug(),
				'hide_empty' => false,
			]
		);

		$slugs = wp_list_pluck( $terms, 'slug' );
		$this->assertContains( $term, $slugs );
	}
}
