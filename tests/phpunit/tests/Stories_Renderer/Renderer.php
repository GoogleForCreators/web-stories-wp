<?php
/**
 * Generic_Renderer class.
 *
 * @package   Google\Web_Stories
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

namespace Google\Web_Stories\Tests\Stories_Renderer;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Tests\Test_Renderer;
use Google\Web_Stories\Story_Query as Stories;
use Google\Web_Stories\Tests\Private_Access;
use Google\Web_Stories\Stories_Renderer\Renderer as AbstractRenderer;

/**
 * Generic_Renderer class.
 *
 * @coversDefaultClass \Google\Web_Stories\Stories_Renderer\Renderer
 */
class Renderer extends \WP_UnitTestCase_Base {

	use Private_Access;

	/**
	 * Story post ID.
	 *
	 * @var int
	 */
	private static $story_id;

	/**
	 * Stories mock object.
	 *
	 * @var Stories
	 */
	private $stories;

	/**
	 * Story Model Mock.
	 *
	 * @var Story
	 */
	private $story_model;

	/**
	 * Runs once before any test in the class run.
	 *
	 * @param \WP_UnitTest_Factory $factory Factory class object.
	 */
	public static function wpSetUpBeforeClass( $factory ) {

		self::$story_id = $factory->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
			]
		);

	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function setUp() {
		$this->story_model = $this->createMock( Story::class );

		$this->stories = $this->createMock( Stories::class );
		$this->stories->method( 'get_stories' )->willReturn( [ $this->story_model ] );
		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'         => 'grid',
				'show_title'        => false,
				'show_author'       => false,
				'show_date'         => false,
				'number_of_columns' => 3,
			]
		);
	}

	/**
	 * @covers ::assets
	 */
	public function test_assets() {

		$renderer = new Test_Renderer( $this->stories );

		$renderer->assets();

		$this->assertTrue( wp_style_is( \Google\Web_Stories\Stories_Renderer\Renderer::STYLE_HANDLE ) );
	}

	/**
	 * @covers ::is_view_type
	 */
	public function test_is_view_type() {

		$renderer = new Test_Renderer( $this->stories );

		$output = $this->call_private_method( $renderer, 'is_view_type', [ 'grid' ] );

		$this->assertTrue( $output );

		$output = $this->call_private_method( $renderer, 'is_view_type', [ 'list' ] );

		$this->assertFalse( $output );
	}

	/**
	 * @covers ::get_view_type
	 */
	public function test_get_view_type() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type' => 'grid',
			]
		);
		$renderer = new Test_Renderer( $this->stories );

		$output = $this->call_private_method( $renderer, 'get_view_type' );

		$this->assertEquals( 'grid', $output );

	}

	/**
	 * @covers ::render_story_with_poster
	 */
	public function test_render_story_with_poster() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'                 => 'list',
				'class'                     => '',
				'list_view_image_alignment' => 'left',
			]
		);

		$renderer = $this->getMockForAbstractClass( AbstractRenderer::class, [ $this->stories ] );
		$renderer->expects( $this->once() )->method( 'is_amp_request' )->willReturn( false );
		$this->set_private_property( $renderer, 'story_posts', [ $this->stories->get_stories() ] );

		ob_start();
		$this->call_private_method( $renderer, 'render_story_with_poster' );
		$output = ob_get_clean();

		$this->assertContains( 'web-stories-list__story-placeholder', $output );
		$this->assertContains( 'style="background-image: url(http://www.example.com/image.jpg);"', $output );
	}

	/**
	 * @covers ::get_content_overlay
	 */
	public function test_get_content_overlay() {

		$renderer = $this->getMockForAbstractClass( AbstractRenderer::class, [ $this->stories ] );
		$renderer->method( 'is_amp_request' )->willReturn( false );
		$this->set_private_property( $renderer, 'story_posts', [ $this->stories->get_stories() ] );

		ob_start();
		$this->call_private_method( $renderer, 'get_content_overlay' );
		$output = ob_get_clean();

		$this->assertEmpty( $output );

		$story_data = [
			'title'                => 'Story Title',
			'date'                 => 'November 11, 2020',
			'author'               => 'admin',
			'show_content_overlay' => true,
		];

		ob_start();
		$this->call_private_method( $renderer, 'get_content_overlay', [ $story_data ] );
		$output = ob_get_clean();

		$this->assertContains( 'By admin', $output );
		$this->assertContains( 'On November 11, 2020', $output );
		$this->assertContains( 'Story Title', $output );
	}

	/**
	 * @covers ::get_single_story_classes
	 */
	public function test_get_single_story_classes() {

		$this->stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type' => 'circles',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $this->stories );
		$expected = 'web-stories-list__story-wrapper';

		$output = $this->call_private_method( $renderer, 'get_single_story_classes' );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::get_container_classes
	 */
	public function test_get_container_classes() {
		$stories = $this->createMock( Stories::class );
		$stories->method( 'get_stories' )->willReturn( [ $this->story_model ] );
		$stories->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'  => 'circles',
				'show_title' => true,
				'class'      => 'test',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $stories );

		$expected = 'web-stories-list alignnone test is-view-type-circles has-title';

		$output = $this->call_private_method( $renderer, 'get_container_classes' );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::maybe_render_archive_link
	 */
	public function test_maybe_render_archive_link() {
		$stories = $this->createMock( Stories::class );
		$stories->method( 'get_stories' )->willReturn( [ $this->story_model ] );
		$stories->method( 'get_story_attributes' )->willReturn(
			[
				'show_title'                => true,
				'show_stories_archive_link' => true,
				'stories_archive_label'     => 'View All Stories',
			]
		);

		$renderer = new \Google\Web_Stories\Stories_Renderer\Generic_Renderer( $stories );

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		ob_start();
		$this->call_private_method( $renderer, 'maybe_render_archive_link' );
		$expected = ob_get_clean();

		$this->assertContains( 'web-stories-list__archive-link', $expected );
		$this->assertContains( $archive_link, $expected );
		$this->assertContains( 'View All Stories', $expected );

	}

	/**
	 * Test that content overlay property is set when any of title,
	 * date or author attribute is true.
	 */
	public function test_content_overlay_is_set() {
		$stories = $this->createMock( Stories::class );
		$stories->method( 'get_stories' )->willReturn( [ $this->story_model ] );
		$stories->method( 'get_story_attributes' )->willReturn(
			[
				'show_title' => false,
				'show_date'  => true,
			]
		);

		$renderer = new Test_Renderer( $stories );

		$overlay = $this->get_private_property( $renderer, 'content_overlay' );

		$this->assertTrue( $overlay );
	}
}
