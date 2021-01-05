<?php
/**
 * Stories_Shortcode Unit Test class.
 *
 * @package   Google\Web_Stories\Tests
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

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

namespace Google\Web_Stories\Tests\Shortcode;

use Google\Web_Stories\Shortcode\Stories_Shortcode as Testee;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Private_Access;

/**
 * @coversDefaultClass \Google\Web_Stories\Shortcode\Stories_Shortcode
 */
class Stories_Shortcode extends \WP_UnitTestCase {

	use Private_Access;

	/**
	 * Story ID.
	 *
	 * @var int
	 */
	private static $story_id;

	/**
	 * Run before any test is run and class is being setup.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		require dirname( dirname( dirname( dirname( __DIR__ ) ) ) ) . '/includes/compat/amp.php';

		self::$story_id = $factory->post->create(
			[
				'post_type'   => Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'publish',
				'post_title'  => 'Test Story',
			]
		);
	}

	/**
	 * Runs after all tests are run.
	 */
	public function tearDown() {
		remove_shortcode( Testee::SHORTCODE_NAME );

		parent::tearDown();
	}

	/**
	 * @covers ::render_stories
	 * @covers ::prepare_story_args
	 * @covers ::prepare_story_attrs
	 */
	public function test_render_carousel_view_in_shortcode() {
		$stories_shortcode = new Testee();
		$actual            = $stories_shortcode->render_stories(
			[
				'view' => 'carousel',
			]
		);

		$this->assertTrue( false !== strpos( $actual, '<amp-carousel' ) );
	}

	/**
	 * @covers ::render_stories
	 * @covers ::prepare_story_attrs
	 * @covers ::prepare_story_args
	 */
	public function test_render_circles_view_in_shortcode() {
		$stories_shortcode = new Testee();
		$actual            = $stories_shortcode->render_stories(
			[
				'view' => 'circles',
			]
		);

		$this->assertTrue( false !== strpos( $actual, 'is-view-type-circles' ) );
	}

	/**
	 * Stories should not be greater than 100.
	 *
	 * @covers ::prepare_story_args
	 */
	public function test_max_number_for_stories() {
		$stories_shortcode = new Testee();
		$attributes        = [
			'number' => 1000000,
			'order'  => 'DESC',
		];

		$args = $this->call_private_method( $stories_shortcode, 'prepare_story_args', [ $attributes ] );
		$this->assertArrayHasKey( 'posts_per_page', $args );
		$this->assertSame( 100, $args['posts_per_page'] );
	}

	/**
	 * @covers ::prepare_story_attrs
	 */
	public function test_prepare_story_attrs() {
		$shortcode = new Testee();

		$expected = [
			'view_type'                 => 'grid',
			'number_of_columns'         => 2,
			'show_title'                => true,
			'show_author'               => true,
			'show_date'                 => true,
			'show_story_archive_link'   => false,
			'show_story_archive_label'  => true,
			'list_view_image_alignment' => 'left',
			'class'                     => 'dummy',
			'circle_size'               => 200,
		];

		$attributes = [
			'view'                      => 'grid',
			'columns'                   => 2,
			'title'                     => 'true',
			'author'                    => 'true',
			'date'                      => 'true',
			'archive_link'              => 'randomtext',
			'archive_label'             => 'true',
			'list_view_image_alignment' => 'left',
			'class'                     => 'dummy',
			'circle_size'               => '200',
		];

		$actual = $this->call_private_method( $shortcode, 'prepare_story_attrs', [ $attributes ] );

		$this->assertEqualSets( $expected, $actual );
	}
}
