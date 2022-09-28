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

namespace Google\Web_Stories\Tests\Integration\Model;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Model\Video
 */
class Video extends TestCase {
	/**
	 * @covers ::load_from_array
	 */
	public function test_load_from_array(): void {
		$video_object = \Google\Web_Stories\Model\Video::load_from_array(
			[
				'length'       => 60,
				'src'          => 'http://www.example.com/test.mp4',
				'poster'       => 'http://www.example.com/test.jpg',
				'alt'          => 'Alt text',
				'creationDate' => '2022-09-28T15:44:54',
			]
		);
		$this->assertSame( 60, $video_object->get_duration() );
		$this->assertSame( 'Alt text', $video_object->get_title() );
		$this->assertSame( 'http://www.example.com/test.mp4', $video_object->get_url() );
		$this->assertSame( '2022-09-28T15:44:54', $video_object->get_date() );
		$this->assertSame( 'http://www.example.com/test.jpg', $video_object->get_poster() );
	}

	/**
	 * @covers ::load_from_array
	 */
	public function test_load_from_array_empty(): void {
		$video_object = \Google\Web_Stories\Model\Video::load_from_array( [] );
		$this->assertEmpty( $video_object->get_duration() );
		$this->assertEmpty( $video_object->get_title() );
		$this->assertEmpty( $video_object->get_url() );
		$this->assertEmpty( $video_object->get_date() );
		$this->assertEmpty( $video_object->get_poster() );
	}
}
