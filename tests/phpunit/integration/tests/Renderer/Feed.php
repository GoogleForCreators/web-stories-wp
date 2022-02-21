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

namespace Google\Web_Stories\Tests\Integration\Renderer;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class Feed
 *
 * @coversDefaultClass \Google\Web_Stories\Renderer\Feed
 */
class Feed extends TestCase {

	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ): void {
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Story_Post_Type Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
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
		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	/**
	 * @throws \Exception
	 *
	 * @covers ::embed_image
	 */
	public function test_the_content_feed(): void {
		$this->go_to( '/?feed=rss2&post_type=' . \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$feed = $this->do_rss2();

		$this->assertStringContainsString( '<img', $feed );
		$this->assertStringContainsString( 'images/canola.jpg', $feed );
		$this->assertStringContainsString( 'wp-block-web-stories-embed', $feed );
	}

	/**
	 * This is a bit of a hack used to buffer feed content.
	 *
	 * @link https://github.com/WordPress/wordpress-develop/blob/ab9aee8af474ac512b31b012f3c7c44fab31a990/tests/phpunit/tests/feed/rss2.php#L78-L94
	 */
	protected function do_rss2(): string {
		ob_start();
		// Nasty hack! In the future it would better to leverage do_feed( 'rss2' ).
		try {
			// phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
			@require ABSPATH . 'wp-includes/feed-rss2.php';
			$out = ob_get_clean();
		} catch ( \Google\Web_Stories\Tests\Integration\Renderer\Exception $e ) {
			$out = ob_get_clean();
			throw($e);
		}
		return $out;
	}
}
