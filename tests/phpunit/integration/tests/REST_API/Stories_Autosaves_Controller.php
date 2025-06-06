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

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use WP_REST_Request;
use WP_UnitTest_Factory;

/**
 * Class Stories_Autosaves_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Autosaves_Controller
 */
class Stories_Autosaves_Controller extends DependencyInjectedRestTestCase {

	/**
	 * Author user ID.
	 */
	protected static int $author_id;

	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ): void {
		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);
	}

	public function test_create_item_as_author_should_not_strip_markup(): void {

		wp_set_current_user( self::$author_id );

		$this->kses_int();

		$unsanitized_content    = (string) file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content.html' );
		$unsanitized_story_data = json_decode( (string) file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content_filtered.json' ), true );
		$sanitized_content      = trim( (string) file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content_sanitized.html' ) );

		$story = self::factory()->post->create(
			[
				'post_type' => Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$this->assertNotWPError( $story );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story/' . $story . '/autosaves' );
		$request->set_body_params(
			[
				'content'    => $unsanitized_content,
				'story_data' => $unsanitized_story_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();

		$this->assertIsArray( $new_data );
		$this->assertArrayHasKey( 'content', $new_data );
		$this->assertEquals( $sanitized_content, trim( $new_data['content']['raw'] ) );
		$this->assertEquals( $unsanitized_story_data, $new_data['story_data'] );

		$this->kses_remove_filters();
	}
}
