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
 * @coversDefaultClass \Google\Web_Stories\Media\Blurhash
 */
class Blurhash extends TestCase {
	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Media\Blurhash
	 */
	protected $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = new \Google\Web_Stories\Media\Blurhash();
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame(
			10,
			has_filter(
				'wp_prepare_attachment_for_js',
				[
					$this->instance,
					'wp_prepare_attachment_for_js',
				] 
			) 
		);
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta(): void {
		$this->instance->register_meta();

		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::BLURHASH_POST_META_KEY, 'attachment' ) );
	}

	/**
	 * @covers ::wp_prepare_attachment_for_js
	 */
	public function test_wp_prepare_attachment_for_js(): void {
		$attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		$blurhash = '000000';

		update_post_meta( $attachment_id, $this->instance::BLURHASH_POST_META_KEY, $blurhash );

		$image = $this->instance->wp_prepare_attachment_for_js(
			[
				'id'   => $attachment_id,
				'type' => 'image',
				'url'  => wp_get_attachment_url( $attachment_id ),
			]
		);


		$this->assertArrayHasKey( $this->instance::BLURHASH_POST_META_KEY, $image );
		$this->assertSame( $blurhash, $image[ $this->instance::BLURHASH_POST_META_KEY ] );
	}
}
