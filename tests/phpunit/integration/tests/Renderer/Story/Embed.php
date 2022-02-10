<?php

namespace Google\Web_Stories\Tests\Integration\Renderer\Story;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Renderer\Story\Embed
 */
class Embed extends DependencyInjectedTestCase {

	/**
	 * @var \Google\Web_Stories\Context
	 */
	private $context;

	/**
	 * @var \Google\Web_Stories\Assets
	 */
	private $assets;

	/**
	 * @var \Google\Web_Stories\Model\Story
	 */
	private $story;

	public function set_up() {
		parent::set_up();

		$this->assets  = $this->injector->make( \Google\Web_Stories\Assets::class );
		$this->context = $this->injector->make( \Google\Web_Stories\Context::class );
		$this->story   = $this->injector->make( \Google\Web_Stories\Model\Story::class );
	}

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

		$this->story->load_from_post( $post );

		$embed  = $this->injector->make(
			\Google\Web_Stories\Renderer\Story\Embed::class,
			[
				$this->story,
				$this->assets,
				$this->context,
			] 
		);
		$args   = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render = $embed->render( $args );
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

		$this->story->load_from_post( $post );

		$this->assertNotEmpty( $this->story->get_poster_portrait() );
		$this->assertNotEmpty( $this->story->get_poster_sizes() );
		$this->assertNotEmpty( $this->story->get_poster_srcset() );

		$embed  = $this->injector->make(
			\Google\Web_Stories\Renderer\Story\Embed::class,
			[
				$this->story,
				$this->assets,
				$this->context,
			] 
		);
		$args   = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$render = $embed->render( $args );
		$this->assertStringContainsString( 'test title', $render );
		$this->assertStringContainsString( '<img', $render );
		$this->assertStringContainsString( 'srcset=', $render );
		$this->assertStringContainsString( 'sizes=', $render );
	}
}
