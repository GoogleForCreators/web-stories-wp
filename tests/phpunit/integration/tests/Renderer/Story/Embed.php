<?php

namespace Google\Web_Stories\Tests\Integration\Renderer\Story;

use Google\Web_Stories\Context;
use Google\Web_Stories\Experiments;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Renderer\Story\Embed
 */
class Embed extends TestCase {

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
		$assets   = new \Google\Web_Stories\Assets();
		$settings = new Settings();
		$context  = new Context( new Story_Post_Type( $settings, new Experiments( $settings ) ) );
		$embed    = new \Google\Web_Stories\Renderer\Story\Embed( $story, $assets, $context );
		$args     = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render   = $embed->render( $args );
		$this->assertStringContainsString( 'test title', $render );
		$this->assertStringNotContainsString( '<img', $render );
	}

	/**
	 * @covers ::render
	 */
	public function test_render_with_image() {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );

		set_post_thumbnail( $post->ID, $attachment_id );

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );
		$assets   = new \Google\Web_Stories\Assets();
		$settings = new Settings();
		$context  = new Context( new Story_Post_Type( $settings, new Experiments( $settings ) ) );
		$embed    = new \Google\Web_Stories\Renderer\Story\Embed( $story, $assets, $context );
		$args     = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render   = $embed->render( $args );
		$this->assertStringContainsString( 'test title', $render );
		$this->assertStringContainsString( '<img', $render );
	}
}
