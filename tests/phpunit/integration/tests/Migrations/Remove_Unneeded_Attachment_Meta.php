<?php

declare(strict_types = 1);

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

use Google\Web_Stories\Media\Video\Poster;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class Remove_Unneeded_Attachment_Meta
 *
 * @coversDefaultClass \Google\Web_Stories\Migrations\Remove_Unneeded_Attachment_Meta
 */
class Remove_Unneeded_Attachment_Meta extends TestCase {
	/**
	 * @covers ::migrate
	 */
	public function test_migrate(): void {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
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

		$this->assertNotWPError( $video_attachment_id );
		$this->assertNotWPError( $poster_attachment_id );

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );
		add_post_meta( $poster_attachment_id, Poster::POSTER_POST_META_KEY, 'true' );
		add_post_meta( $video_attachment_id, Poster::POSTER_ID_POST_META_KEY, $poster_attachment_id );

		$object = new \Google\Web_Stories\Migrations\Remove_Unneeded_Attachment_Meta();
		$object->migrate();

		$meta = get_post_meta( $poster_attachment_id, Poster::POSTER_POST_META_KEY, true );

		$this->assertSame( '', $meta );
	}
}
