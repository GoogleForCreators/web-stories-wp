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

namespace Google\Web_Stories\Tests;

use Google\Web_Stories\Story_Query as Testee;
use Google\Web_Stories\Stories_Renderer\Generic_Renderer;
use Google\Web_Stories\Story_Post_Type as Story_CPT;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Query
 */
class Story_Query extends \WP_UnitTestCase {

	/**
	 * Class in test.
	 *
	 * @var Testee
	 */
	private static $testee;

	/**
	 * Story ID.
	 *
	 * @var int
	 */
	private static $story_id;

	/**
	 * Default story arguments.
	 *
	 * @var array
	 */
	private static $default_story_args;

	/**
	 * Default query arguments.
	 *
	 * @var array
	 */
	private static $default_query_args;

	/**
	 * Runs once before any test in the class run.
	 *
	 * @param \WP_UnitTest_Factory $factory Factory class object.
	 */
	public static function wpSetUpBeforeClass( $factory ) {

		self::$testee = new Testee();

		self::$story_id = $factory->post->create(
			[
				'post_type'    => Story_CPT::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);

		self::$default_story_args = [
			'view_type'                 => 'circles',
			'number_of_columns'         => 2,
			'show_title'                => false,
			'show_author'               => false,
			'show_date'                 => false,
			'show_stories_archive_link' => false,
			'stories_archive_label'     => 'View all stories',
			'list_view_image_alignment' => 'left',
			'class'                     => '',
			'circle_size'               => 150,
		];

		self::$default_query_args = [
			'post_type'        => Story_CPT::POST_TYPE_SLUG,
			'posts_per_page'   => 10,
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
		];

	}

	/**
	 * Test the instance.
	 *
	 * @covers ::render
	 */
	public function test_render() {
		$this->assertInstanceOf( Generic_Renderer::class, self::$testee->get_renderer() );
	}

	/**
	 * Test that get_stories method returns valid story.
	 *
	 * @covers ::get_stories
	 */
	public function test_get_stories_returns_valid_story() {

		$story_posts = self::$testee->get_stories();
		$this->assertSame( self::$story_id, $story_posts[0]->ID );
	}

	/**
	 * Test count of number of stories.
	 */
	public function test_get_stories_count() {
		$story_posts = self::$testee->get_stories();
		$this->assertCount( 1, $story_posts );
	}

	/**
	 * Test that get_stories method returns valid story.
	 *
	 * @covers ::get_stories
	 */
	public function test_get_stories_returns_empty_array() {

		$stories_obj = new Testee( [], [ 'post_type' => 'draft' ] );
		$story_posts = $stories_obj->get_stories();
		$this->assertEmpty( $story_posts );
	}

	/**
	 * Test story arguments are equal.
	 *
	 * @covers ::get_story_attributes
	 */
	public function test_default_story_args_equality() {

		$story_args = self::$testee->get_story_attributes();
		$this->assertSame( self::$default_story_args, $story_args );
	}

}
