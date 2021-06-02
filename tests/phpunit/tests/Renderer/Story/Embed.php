<?php

namespace Google\Web_Stories\Tests\Renderer\Story;

use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Renderer\Story\Embed
 */
class Embed extends Test_Case {

	/**
	 * @covers ::render
	 */
	public function test_render() {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );
		$amp_story_player_assets = new \Google\Web_Stories\AMP_Story_Player_Assets();
		$assets                  = new \Google\Web_Stories\Assets();

		$embed  = new \Google\Web_Stories\Renderer\Story\Embed( $story, $assets, $amp_story_player_assets );
		$args   = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render = $embed->render( $args );
		$this->assertContains( 'test title', $render );
	}
}
