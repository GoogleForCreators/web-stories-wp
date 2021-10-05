<?php
/*
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Integration\AMP;

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\HTML;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\AMP\Sanitization;
use Google\Web_Stories\AMP\Optimization;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Output_Buffer
 */
class Output_Buffer extends DependencyInjectedTestCase {
	public function set_up() {
		parent::set_up();

		// When running the tests, we don't have unfiltered_html capabilities.
		// This change avoids HTML in post_content being stripped in our test posts because of KSES.
		remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
		remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
	}

	public function tear_down() {
		add_filter( 'content_save_pre', 'wp_filter_post_kses' );
		add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

		parent::tear_down();
	}

	protected function prepare_response( $post ): string {
		$instance = $this->injector->make( \Google\Web_Stories\AMP\Output_Buffer::class );
		$story    = new Story();
		$story->load_from_post( $post );

		return $instance->prepare_response( ( new HTML( $story ) )->render() );
	}

	/**
	 * @covers ::prepare_response
	 */
	public function test_sanitizes_and_optimizes_markup() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'transformed="self;v=1"', $actual );
		$this->assertStringNotContainsString( 'AMP optimization could not be completed', $actual );
	}

	/**
	 * Tests that publisher name is correctly replaced.
	 *
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher
	 */
	public function test_add_publisher() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" title="Example Story"  poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);

		$this->go_to( get_permalink( $post ) );

		$name = get_bloginfo( 'name' );

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'publisher=', $actual );
		$this->assertStringContainsString( $name, $actual );
	}

	/**
	 * Tests that publisher logo is correctly replaced.
	 *
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher_logo
	 */
	public function test_add_publisher_logo() {

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story"  poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);

		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		add_post_meta( $post->ID, Story_Post_Type::PUBLISHER_LOGO_META_KEY, $attachment_id );

		$this->go_to( get_permalink( $post ) );

		$logo = wp_get_attachment_url( $attachment_id );
		$name = get_bloginfo( 'name' );

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'publisher-logo-src="http', $actual );
		$this->assertStringContainsString( $name, $actual );
		$this->assertStringContainsString( $logo, $actual );

		delete_post_meta( $post->ID, Story_Post_Type::PUBLISHER_LOGO_META_KEY );

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'publisher-logo-src=""', $actual );
		$this->assertStringContainsString( 'amp=', $actual );
	}

	/**
	 * Tests that publisher logo is correctly replaced.
	 *
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher_logo
	 */
	public function test_add_publisher_logo_missing() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story"  poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);

		$this->go_to( get_permalink( $post ) );

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'publisher-logo-src=""', $actual );
		$this->assertStringContainsString( 'amp=', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_poster_images
	 */
	public function test_add_poster_images() {
		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);

		$this->go_to( get_permalink( $post ) );

		set_post_thumbnail( $post->ID, $attachment_id );

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'poster-portrait-src=', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher_logo
	 */
	public function test_add_poster_images_overrides_existing_poster() {
		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story"  publisher-logo="https://example.com/image.png" poster-portrait-src="https://example.com/poster.jpg"></amp-story></body></html>',
			]
		);

		$this->go_to( get_permalink( $post ) );

		set_post_thumbnail( $post->ID, $attachment_id );

		$actual = $this->prepare_response( $post );

		$this->assertStringNotContainsString( 'https://example.com/poster.jpg', $actual );
		$this->assertStringContainsString( 'poster-portrait-src=', $actual );
		$this->assertStringContainsString( wp_get_attachment_url( $attachment_id ), $actual );
		$this->assertStringNotContainsString( 'poster-portrait-src=""', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher_logo
	 */
	public function test_add_poster_images_no_fallback_image_added() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);

		$this->go_to( get_permalink( $post ) );

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'poster-portrait-src=""', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher_logo
	 */
	public function test_add_poster_images_no_poster_no_amp() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"></amp-story></body></html>',
			]
		);

		$this->go_to( get_permalink( $post ) );

		$actual = $this->prepare_response( $post );

		$this->assertStringContainsString( 'amp=', $actual );
	}
}
