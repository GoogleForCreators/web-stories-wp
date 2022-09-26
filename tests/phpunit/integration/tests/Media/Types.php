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

namespace Google\Web_Stories\Tests\Integration\Media;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Types
 */
class Types extends TestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Media\Types
	 */
	protected $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = new \Google\Web_Stories\Media\Types();
	}

	/**
	 * @covers ::get_allowed_mime_types
	 * @group ms-excluded
	 */
	public function test_get_allowed_mime_types(): void {
		if ( $this->supportsWebP() ) {
			$expected = [
				'image'   => [
					'image/webp',
					'image/png',
					'image/jpeg',
					'image/gif',
				],
				'audio'   => [
					'audio/mpeg',
					'audio/aac',
					'audio/wav',
					'audio/ogg',
				],
				'caption' => [ 'text/vtt' ],
				'vector'  => [],
				'video'   => [
					'video/mp4',
					'video/webm',
				],
			];
		} else {
			$expected = [
				'image'   => [
					'image/png',
					'image/jpeg',
					'image/gif',
				],
				'audio'   => [
					'audio/mpeg',
					'audio/aac',
					'audio/wav',
					'audio/ogg',
				],
				'caption' => [ 'text/vtt' ],
				'vector'  => [],
				'video'   => [
					'video/mp4',
					'video/webm',
				],
			];
		}

		$actual = $this->instance->get_allowed_mime_types();

		$this->assertEqualSets( $expected, $actual );
	}

	/**
	 * @group ms-required
	 * @covers ::get_allowed_mime_types
	 */
	public function test_get_allowed_mime_types_multisite(): void {
		if ( $this->supportsWebP() ) {
			$expected = [
				'image'   => [
					'image/webp',
					'image/png',
					'image/jpeg',
					'image/gif',
				],
				'audio'   => [
					'audio/mpeg',
					'audio/wav',
					'audio/ogg',
				],
				'caption' => [ 'text/vtt' ],
				'vector'  => [],
				'video'   => [
					'video/mp4',
					'video/webm',
				],
			];
		} else {
			$expected = [
				'image'   => [
					'image/png',
					'image/jpeg',
					'image/gif',
				],
				'audio'   => [
					'audio/mpeg',
					'audio/wav',
					'audio/ogg',
				],
				'caption' => [ 'text/vtt' ],
				'vector'  => [],
				'video'   => [
					'video/mp4',
					'video/webm',
				],
			];
		}

		$actual = $this->instance->get_allowed_mime_types();

		$this->assertEqualSets( $expected, $actual );
	}

	/**
	 * @covers ::get_file_type_exts
	 */
	public function test_get_file_type_exts(): void {
		$actual = $this->instance->get_file_type_exts( [ 'video/webm' ] );

		$this->assertEqualSets( [ 'webm' ], $actual );
	}

	protected function supportsWebP(): bool {
		$mime_type = array_values( wp_get_mime_types() );

		return \in_array( 'image/webp', $mime_type, true );
	}
}
