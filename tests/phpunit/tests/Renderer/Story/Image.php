<?php

namespace Google\Web_Stories\Tests\Renderer\Story;

use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Renderer\Story\Image
 */
class Image extends Test_Case {

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'test title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => $admin_id,
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
		wp_maybe_generate_attachment_metadata( get_post( $poster_attachment_id ) );
		set_post_thumbnail( self::$story_id, $poster_attachment_id );
	}

	/**
	 * @covers ::render
	 */
	public function test_render() {
		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( self::$story_id );

		$image  = new \Google\Web_Stories\Renderer\Story\Image( $story );
		$args   = [
			'align'  => 'none',
			'height' => 300,
			'width'  => 300,
		];
		$render = $image->render( $args );
		$this->assertContains( 'test title', $render );
		$this->assertContains( 'src=', $render );
		$this->assertContains( 'srcset=', $render );
		$this->assertContains( 'sizes=', $render );
	}

	/**
	 * @covers ::render
	 */
	public function test_render_no_image() {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$image  = new \Google\Web_Stories\Renderer\Story\Image( $story );
		$args   = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render = $image->render( $args );
		$this->assertContains( 'test title', $render );
		$this->assertNotContains( 'src=', $render );
		$this->assertNotContains( 'srcset=', $render );
		$this->assertNotContains( 'sizes=', $render );
	}
}
