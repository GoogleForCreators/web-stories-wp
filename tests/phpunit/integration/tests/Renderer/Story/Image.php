<?php

namespace Google\Web_Stories\Tests\Integration\Renderer\Story;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Renderer\Story\Image
 */
class Image extends TestCase {
	/**
	 * @covers ::render
	 */
	public function test_render(): void {
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
		$this->assertStringContainsString( 'test title', $render );
	}

	/**
	 * @covers ::render
	 */
	public function test_render_with_image(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
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
		set_post_thumbnail( $post->ID, $poster_attachment_id );

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertNotEmpty( $story->get_poster_portrait() );
		$this->assertNotEmpty( $story->get_poster_sizes() );
		$this->assertNotEmpty( $story->get_poster_srcset() );

		$image  = new \Google\Web_Stories\Renderer\Story\Image( $story );
		$args   = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render = $image->render( $args );
		$this->assertStringContainsString( '<img', $render );
		$this->assertStringContainsString( 'srcset=', $render );
		$this->assertStringContainsString( 'sizes=', $render );
		$this->assertStringContainsString( 'loading=', $render );
		$this->assertStringContainsString( 'decoding=', $render );
	}

	/**
	 * @covers ::render
	 */
	public function test_render_with_image_missing_srcset_and_sizes(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
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

		set_post_thumbnail( $post->ID, $poster_attachment_id );

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertNotEmpty( $story->get_poster_portrait() );
		$this->assertEmpty( $story->get_poster_sizes() );
		$this->assertEmpty( $story->get_poster_srcset() );

		$image  = new \Google\Web_Stories\Renderer\Story\Image( $story );
		$args   = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render = $image->render( $args );
		$this->assertStringContainsString( '<img', $render );
		$this->assertStringNotContainsString( 'srcset=', $render );
		$this->assertStringNotContainsString( 'sizes=', $render );
	}
}
