<?php

namespace Google\Web_Stories\Tests\Story_Renderer;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Renderer\Image
 */
class Image extends \WP_UnitTestCase {

	/**
	 * @covers ::render
	 */
	public function test_render() {
		$post = self::factory()->post->create_and_get(
			[
				'title'        => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$image = new \Google\Web_Stories\Story_Renderer\Image( $story, 300, 600, 'none' );

		$this->assertContains( 'test title', $image );
	}
}
