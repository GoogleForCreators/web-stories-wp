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

namespace Google\Web_Stories\Tests\Integration\Renderer\Stories;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Renderer\Stories\Generic_Renderer
 */
class Generic_Renderer extends TestCase {

	/**
	 * Stories mock object.
	 *
	 * @var Story_Query
	 */
	private $story_query;

	/**
	 * Story post ID.
	 *
	 * @var int
	 */
	private static $story_id;

	/**
	 * Story model.
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
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);

	}

	/**
	 * Runs once before any test in the class run.
	 */
	public function set_up() {
		parent::set_up();

		$this->story_model = $this->createMock( Story::class );
		$this->story_query = $this->createMock( Story_Query::class );
		$this->story_query->method( 'get_stories' )->willReturn( [ get_post( self::$story_id ) ] );
	}

	public function tear_down() {
		wp_dequeue_script( AMP_Story_Player_Assets::SCRIPT_HANDLE );
		wp_deregister_script( AMP_Story_Player_Assets::SCRIPT_HANDLE );

		wp_dequeue_style( AMP_Story_Player_Assets::SCRIPT_HANDLE );
		wp_deregister_style( AMP_Story_Player_Assets::SCRIPT_HANDLE );

		parent::tear_down();
	}

	/**
	 * @covers ::load_assets
	 */
	public function test_load_assets() {

		$this->story_query->method( 'get_story_attributes' )->willReturn(
			[
				'class'      => '',
				'view_type'  => 'grid',
				'show_title' => true,
			]
		);

		$renderer = new \Google\Web_Stories\Renderer\Stories\Generic_Renderer( $this->story_query );
		$renderer->init();

		$this->assertTrue( wp_script_is( \Google\Web_Stories\Renderer\Stories\Renderer::LIGHTBOX_SCRIPT_HANDLE, 'registered' ) );
		$this->assertTrue( wp_style_is( \Google\Web_Stories\Renderer\Stories\Renderer::STYLE_HANDLE, 'registered' ) );
	}

	/**
	 * @covers ::render
	 */
	public function test_render() {

		$this->story_query->method( 'get_story_attributes' )->willReturn(
			[
				'view_type'          => 'grid',
				'number_of_columns'  => 2,
				'image_alignment'    => 'left',
				'show_title'         => false,
				'show_author'        => false,
				'show_date'          => false,
				'show_excerpt'       => false,
				'show_archive_link'  => false,
				'sharp_corners'      => false,
				'archive_link_label' => 'View all stories',
				'class'              => '',
				'circle_size'        => 150,
			]
		);

		$renderer = new \Google\Web_Stories\Renderer\Stories\Generic_Renderer( $this->story_query );
		$renderer->init();

		$output = $renderer->render();

		$this->assertStringContainsString( 'web-stories-list alignnone is-view-type-grid', $output );
		$this->assertStringContainsString( 'web-stories-list__story', $output );
		$this->assertStringContainsString( 'web-stories-list__story-poster', $output );

		$this->assertTrue( wp_script_is( \Google\Web_Stories\Renderer\Stories\Renderer::LIGHTBOX_SCRIPT_HANDLE ) );
	}
}
