<?php

declare(strict_types = 1);

/**
 * Stories_Shortcode Unit Test class.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

namespace Google\Web_Stories\Tests\Integration\Shortcode;

use Google\Web_Stories\Shortcode\Stories_Shortcode as Testee;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\TestCase;
use WP_UnitTest_Factory;

/**
 * @coversDefaultClass \Google\Web_Stories\Shortcode\Stories_Shortcode
 */
class Stories_Shortcode extends TestCase {
	public static function wpSetUpBeforeClass( WP_UnitTest_Factory $factory ): void {
		// So there is an en existing story to be displayed by the shortcode.
		$factory->post->create(
			[
				'post_type'   => Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'publish',
				'post_title'  => 'Test Story',
			]
		);
	}

	public function tear_down(): void {
		remove_shortcode( Testee::SHORTCODE_NAME );

		parent::tear_down();
	}

	/**
	 * @covers ::render_stories
	 * @covers ::prepare_story_args
	 * @covers ::prepare_story_attrs
	 */
	public function test_render_carousel_view_in_shortcode(): void {
		$stories_shortcode = new Testee();
		$actual            = $stories_shortcode->render_stories(
			[
				'view' => 'carousel',
			]
		);

		$this->assertNotSame( false, strpos( $actual, 'is-view-type-carousel' ) );
	}

	/**
	 * @covers ::render_stories
	 * @covers ::prepare_story_attrs
	 * @covers ::prepare_story_args
	 */
	public function test_render_circles_view_in_shortcode(): void {
		$stories_shortcode = new Testee();
		$actual            = $stories_shortcode->render_stories(
			[
				'view' => 'circles',
			]
		);

		$this->assertNotSame( false, strpos( $actual, 'is-view-type-circles' ) );
	}

	/**
	 * Stories should not be greater than 100.
	 *
	 * @covers ::prepare_story_args
	 */
	public function test_max_number_for_stories(): void {
		$stories_shortcode = new Testee();
		$attributes        = [
			'number_of_stories'  => 1_000_000,
			'order'              => 'DESC',
			'orderby'            => 'post_title',
			'web_story_tag'      => '',
			'web_story_category' => ''
		];

		$args = $this->call_private_method( [ $stories_shortcode, 'prepare_story_args' ], [ $attributes ] );
		$this->assertArrayHasKey( 'posts_per_page', $args );
		$this->assertSame( 100, $args['posts_per_page'] );
	}

	/**
	 * @covers ::prepare_story_attrs
	 */
	public function test_prepare_story_attrs(): void {
		$shortcode = new Testee();

		$expected = [
			'view_type'               => 'grid',
			'number_of_columns'       => 2,
			'show_title'              => true,
			'show_author'             => true,
			'show_date'               => true,
			'show_excerpt'            => true,
			'show_story_archive_link' => false,
			'archive_link_label'      => 'Stories',
			'image_alignment'         => 'left',
			'class'                   => 'dummy',
			'circle_size'             => 200,
			'sharp_corners'           => false,
		];

		$attributes = [
			'view'               => 'grid',
			'number_of_columns'  => 2,
			'title'              => 'true',
			'author'             => 'true',
			'date'               => 'true',
			'excerpt'            => 'true',
			'archive_link'       => 'randomtext',
			'archive_link_label' => 'Stories',
			'image_alignment'    => 'left',
			'class'              => 'dummy',
			'circle_size'        => '200',
			'sharp_corners'      => 'false',
		];

		$actual = $this->call_private_method( [ $shortcode, 'prepare_story_attrs' ], [ $attributes ] );

		$this->assertEqualSets( $expected, $actual );
	}
}
