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

namespace phpunit\tests\Migrations;

use Google\Web_Stories\Tests\Test_Case;

/**
 * Class Add_Poster_Generation_Media_Source
 *
 * @covers Google\Web_Stories\Migrations\Add_Poster_Generation_Media_Source;
 *
 * @package phpunit\tests\Migrations
 */
class Add_Poster_Generation_Media_Source extends Test_Case {
	/**
	 * @covers ::migrate
	 */
	public function test_migrate() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );
		add_post_meta( $poster_attachment_id, \Google\Web_Stories\Media::POSTER_POST_META_KEY, 'true' );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media::POSTER_ID_POST_META_KEY, $poster_attachment_id );

		$object = new \Google\Web_Stories\Migrations\Add_Poster_Generation_Media_Source();

		$object->migrate();

		$terms = wp_get_post_terms( $poster_attachment_id, \Google\Web_Stories\Media::STORY_MEDIA_TAXONOMY );
		$slugs = wp_list_pluck( $terms, 'slug' );
		$this->assertCount( 1, $terms );
		$this->assertEqualSets( [ 'poster-generation' ], $slugs );
	}
}
