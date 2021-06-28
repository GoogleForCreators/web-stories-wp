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

namespace Google\Web_Stories\Tests\Renderer\Stories;

use Google\Web_Stories\Assets;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Tests\Test_Case;
use Google\Web_Stories\Tests\Test_Renderer;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Renderer\Stories\Renderer as AbstractRenderer;

/**
 * Generic_Renderer class.
 *
 * @coversDefaultClass \Google\Web_Stories\Renderer\Stories\Renderer
 */
class Renderer extends Test_Case {

	/**
	 * Story post ID.
	 *
	 * @var int
	 */
	private static $story_id;

	/**
	 * Stories mock object.
	 *
	 * @var Story_Query
	 */
	private $story_query;

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
				'post_type'  => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title' => 'Story Title',
			]
		);

		$poster_attachment_id = $factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		wp_maybe_generate_attachment_metadata( get_post( $poster_attachment_id ) );
		set_post_thumbnail( self::$story_id, $poster_attachment_id );

	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function setUp() {
		parent::setUp();

		$this->story_model = new \Google\Web_Stories\Model\Story();
		$this->story_model->load_from_post( self::$story_id );

		$this->story_query = $this->createMock( Story_Query::class );
		$this->story_query->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'         => 'grid',
				'show_title'        => true,
				'show_excerpt'      => false,
				'show_author'       => false,
				'show_date'         => false,
				'number_of_columns' => 3,
			]
		);
	}

	/**
	 * @covers ::load_assets
	 */
	public function test_assets() {
		$renderer = new Test_Renderer( $this->story_query );

		$renderer->load_assets();

		$this->assertTrue( wp_style_is( \Google\Web_Stories\Renderer\Stories\Renderer::STYLE_HANDLE, 'registered' ) );
	}

	/**
	 * @covers ::is_view_type
	 */
	public function test_is_view_type() {

		$renderer = new Test_Renderer( $this->story_query );

		$output = $this->call_private_method( $renderer, 'is_view_type', [ 'grid' ] );

		$this->assertTrue( $output );

		$output = $this->call_private_method( $renderer, 'is_view_type', [ 'list' ] );

		$this->assertFalse( $output );
	}

	/**
	 * @covers ::get_view_type
	 */
	public function test_get_view_type() {

		$this->story_query->method( 'get_story_attributes' )->willReturn(
			[
				'view_type' => 'grid',
			]
		);
		$renderer = new Test_Renderer( $this->story_query );

		$output = $this->call_private_method( $renderer, 'get_view_type' );

		$this->assertEquals( 'grid', $output );

	}

	/**
	 * @covers ::render_story_with_poster
	 */
	public function test_render_story_with_poster() {

		$this->story_query->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'       => 'list',
				'class'           => '',
				'image_alignment' => 'left',
			]
		);

		$this->story_query->method( 'get_stories' )->willReturn(
			[ $this->story_model ]
		);

		$renderer = $this->getMockForAbstractClass( AbstractRenderer::class, [ $this->story_query, $this->assets, $this->register_global_assets ], '', true, true, true, [ 'is_amp_request' ] );
		$renderer->expects( $this->any() )->method( 'is_amp_request' )->willReturn( false );
		$this->call_private_method( $renderer, 'init' );
		$this->set_private_property( $renderer, 'stories', [ $this->story_model ] );
		$this->set_private_property( $renderer, 'height', 300 );
		$this->set_private_property( $renderer, 'width', 300 );

		$function = function () use ( $renderer ) {
			$this->call_private_method( $renderer, 'render_story_with_poster' );
		};

		$output = get_echo( $function );

		$this->assertContains( 'web-stories-list__story-poster', $output );
		$this->assertContains( '<img', $output );
		$this->assertContains( 'src=', $output );
		$this->assertContains( 'srcset=', $output );
		$this->assertContains( 'sizes=', $output );
	}

	/**
	 * @covers ::get_content_overlay
	 */
	public function test_get_content_overlay() {
		$renderer = $this->getMockForAbstractClass( AbstractRenderer::class, [ $this->story_query, $this->assets, $this->register_global_assets ], '', true, true, true, [ 'is_amp_request' ] );
		$renderer->method( 'is_amp_request' )->willReturn( false );
		$this->set_private_property( $renderer, 'stories', [ $this->story_model ] );
		$this->set_private_property( $renderer, 'content_overlay', false );

		ob_start();
		$this->call_private_method( $renderer, 'get_content_overlay' );
		$output = ob_get_clean();

		$this->assertEmpty( $output );

		// When content_overlay is set.
		$this->set_private_property( $renderer, 'content_overlay', true );

		ob_start();
		$this->call_private_method( $renderer, 'get_content_overlay' );
		$output = ob_get_clean();

		$this->assertContains( 'story-content-overlay__title', $output );
	}

	/**
	 * @covers ::get_single_story_classes
	 */
	public function test_get_single_story_classes() {
		$this->story_query->method( 'get_story_attributes' )->willReturn(
			[
				'view_type' => 'circles',
			]
		);

		$renderer = new \Google\Web_Stories\Renderer\Stories\Generic_Renderer( $this->story_query, $this->assets, $this->register_global_assets );
		$expected = 'web-stories-list__story';

		$output = $this->call_private_method( $renderer, 'get_single_story_classes' );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::get_container_classes
	 */
	public function test_get_container_classes() {
		$story_query = $this->createMock( Story_Query::class );
		$story_query->method( 'get_stories' )->willReturn( [ $this->story_model ] );
		$story_query->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'  => 'circles',
				'show_title' => true,
				'class'      => 'test',
			]
		);

		$renderer = new \Google\Web_Stories\Renderer\Stories\Generic_Renderer( $story_query, $this->assets, $this->register_global_assets );

		$expected = 'web-stories-list alignnone test is-view-type-circles is-style-default has-title is-carousel';

		$output = $this->call_private_method( $renderer, 'get_container_classes' );

		$this->assertEquals( $expected, $output );
	}

	/**
	 * @covers ::maybe_render_archive_link
	 */
	public function test_maybe_render_archive_link() {
		$story_query = $this->createMock( Story_Query::class );
		$story_query->method( 'get_stories' )->willReturn( [ $this->story_model ] );
		$story_query->method( 'get_story_attributes' )->willReturn(
			[
				'show_title'         => true,
				'show_archive_link'  => true,
				'archive_link_label' => 'View all stories',
			]
		);

		$renderer = new \Google\Web_Stories\Renderer\Stories\Generic_Renderer( $story_query, $this->assets, $this->register_global_assets );

		$archive_link = get_post_type_archive_link( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		ob_start();
		$this->call_private_method( $renderer, 'maybe_render_archive_link' );
		$expected = ob_get_clean();

		$this->assertContains( 'web-stories-list__archive-link', $expected );
		$this->assertContains( $archive_link, $expected );
		$this->assertContains( 'View all stories', $expected );

	}

	/**
	 * Test that content overlay property is set when any of title,
	 * date or author attribute is true.
	 */
	public function test_content_overlay_is_set() {
		$story_query = $this->createMock( Story_Query::class );
		$story_query->method( 'get_stories' )->willReturn( [ $this->story_model ] );
		$story_query->method( 'get_story_attributes' )->willReturn(
			[
				'show_title' => false,
				'show_date'  => true,
			]
		);

		$renderer = new Test_Renderer( $story_query, $this->assets, $this->register_global_assets );

		$overlay = $this->get_private_property( $renderer, 'content_overlay' );

		$this->assertTrue( $overlay );
	}
}
