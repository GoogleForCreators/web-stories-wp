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

namespace phpunit\tests\Migrations;

/**
 * Class Add_Media_Source_Source_Video
 * @coversDefaultClass \Google\Web_Stories\Migrations\Add_Media_Source_Source_Video
 * @package phpunit\tests\Migrations
 */
class Add_Media_Source_Source_Video extends \WP_UnitTestCase {
	/**
	 * @covers ::migrate
	 */
	public function test_migrate() {
		$object = new \Google\Web_Stories\Migrations\Add_Media_Source_Source_Video();
		$object->migrate();

		$terms = get_terms(
			[
				'taxonomy'   => \Google\Web_Stories\Media::STORY_MEDIA_TAXONOMY,
				'hide_empty' => false,
			]
		);

		$slugs = wp_list_pluck( $terms, 'slug' );
		$this->assertContains( 'source-video', $slugs );
	}
}
