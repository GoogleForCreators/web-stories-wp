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

namespace Google\Web_Stories\Tests\Integration\Migrations;

use Google\Web_Stories\Media\Media_Source_Taxonomy;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class Add_Media_Source_Source_Image
 *
 * @coversDefaultClass \Google\Web_Stories\Migrations\Add_Media_Source_Source_Image
 */
class Add_Media_Source_Source_Image extends TestCase {
	/**
	 * @covers ::migrate
	 * @covers ::get_term
	 * @covers \Google\Web_Stories\Migrations\Add_Media_Source::migrate
	 */
	public function test_migrate() {
		$media_source = new Media_Source_Taxonomy();
		$object       = new \Google\Web_Stories\Migrations\Add_Media_Source_Source_Image( $media_source );
		$object->migrate();
		$term = $this->call_private_method( $object, 'get_term' );

		$terms = get_terms(
			[
				'taxonomy'   => $media_source->get_taxonomy_slug(),
				'hide_empty' => false,
			]
		);

		$slugs = wp_list_pluck( $terms, 'slug' );
		$this->assertContains( $term, $slugs );
	}
}
