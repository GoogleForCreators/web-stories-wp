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

namespace Google\Web_Stories\Tests\Story_Renderer;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Private_Access;
use WP_Post;
use WP_UnitTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Renderer\HTML
 */
class HTML extends WP_UnitTestCase {
	use Private_Access;

	public function setUp() {
		parent::setUp();

		// When running the tests, we don't have unfiltered_html capabilities.
		// This change avoids HTML in post_content being stripped in our test posts because of KSES.
		remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
		remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
	}

	public function tearDown() {
		add_filter( 'content_save_pre', 'wp_filter_post_kses' );
		add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

		parent::tearDown();
	}

	/**
	 * @covers ::render
	 */
	public function test_render() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<!DOCTYPE html><html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertStringStartsWith( '<!DOCTYPE html>', $actual );
		$this->assertStringEndsWith( '</html>', $actual );
	}

	/**
	 * @covers ::replace_html_head
	 * @covers ::get_html_head_markup
	 */
	public function test_replace_html_head() {
		$start_tag = '<meta name="web-stories-replace-head-start"/>';
		$end_tag   = '<meta name="web-stories-replace-head-end"/>';

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => "<html><head>FOO{$start_tag}BAR{$end_tag}BAZ</head><body><amp-story></amp-story></body></html>",
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertContains( 'FOO', $actual );
		$this->assertContains( 'BAZ', $actual );
		$this->assertNotContains( 'BAR', $actual );
		$this->assertNotContains( $start_tag, $actual );
		$this->assertNotContains( $end_tag, $actual );
		$this->assertContains( '<meta name="amp-story-generator-name" content="Web Stories for WordPress"', $actual );
		$this->assertContains( '<meta name="amp-story-generator-version" content="', $actual );
		$this->assertSame( 1, did_action( 'web_stories_story_head' ) );
	}

	/**
	 * Tests that publisher logo is correctly replaced.
	 *
	 * @covers \Google\Web_Stories\Traits\Publisher::get_publisher_logo_placeholder
	 * @covers \Google\Web_Stories\Traits\Publisher::get_publisher_logo
	 */
	public function test_add_publisher_logo() {
		$attachment_id = self::factory()->attachment->create_upload_object( __DIR__ . '/../../data/attachment.jpg', 0 );
		add_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $attachment_id );

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$story = new Story();
		$story->load_from_post( $post );
		$renderer    = new \Google\Web_Stories\Story_Renderer\HTML( $story );
		$placeholder = $renderer->get_publisher_logo_placeholder();
		$logo        = $renderer->get_publisher_logo();

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => '<html><head></head><body><amp-story publisher-logo-src="' . $placeholder . '"></amp-story></body></html>',
			]
		);

		$rendered = $renderer->render();

		$this->assertContains( 'publisher-logo-src="http', $rendered );
		$this->assertContains( $logo, $rendered );
		$this->assertNotContains( $placeholder, $rendered );

		delete_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );
		$rendered = $renderer->render();

		$this->assertContains( 'publisher-logo-src=""', $rendered );
		$this->assertNotContains( $placeholder, $rendered );
		$this->assertNotContains( 'amp=', $rendered );
	}

	/**
	 * @covers ::add_poster_images
	 * @covers ::get_poster_images
	 */
	public function test_add_poster_images() {
		$attachment_id = self::factory()->attachment->create_upload_object( __DIR__ . '/../../data/attachment.jpg', 0 );

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>',
			]
		);

		set_post_thumbnail( $post->ID, $attachment_id );

		$rendered = $this->setup_renderer( $post );

		$this->assertContains( 'poster-portrait-src=', $rendered );
		$this->assertContains( 'poster-square-src=', $rendered );
		$this->assertContains( 'poster-landscape-src=', $rendered );
	}

	/**
	 * @covers ::add_poster_images
	 * @covers ::get_poster_images
	 */
	public function test_add_poster_images_overrides_existing_poster() {
		$attachment_id = self::factory()->attachment->create_upload_object( __DIR__ . '/../../data/attachment.jpg', 0 );

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story poster-portrait-src="https://example.com/poster.jpg"></amp-story></body></html>',
			]
		);

		set_post_thumbnail( $post->ID, $attachment_id );

		$rendered = $this->setup_renderer( $post );

		$this->assertNotContains( 'https://example.com/poster.jpg', $rendered );
		$this->assertContains( 'poster-portrait-src=', $rendered );
	}

	/**
	 * @covers ::add_poster_images
	 * @covers ::get_poster_images
	 */
	public function test_add_poster_images_no_fallback_image_added() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>',
			]
		);

		$rendered = $this->setup_renderer( $post );

		$this->assertContains( 'poster-portrait-src=""', $rendered );
		$this->assertContains( 'poster-square-src=""', $rendered );
		$this->assertContains( 'poster-landscape-src=""', $rendered );
	}

	/**
	 * @covers ::add_poster_images
	 * @covers ::remove_amp_attr
	 */
	public function test_add_poster_images_no_poster_no_amp() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$rendered = $this->setup_renderer( $post );

		$this->assertNotContains( 'amp=', $rendered );
	}

	/**
	 * @covers ::sanitize_markup
	 * @covers ::optimize_markup
	 */
	public function test_sanitizes_and_optimizes_markup() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>',
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertContains( 'transformed="self;v=1"', $actual );
		$this->assertContains( 'AMP optimization could not be completed', $actual );
	}

	/**
	 * @covers ::replace_url_scheme
	 */
	public function test_replace_url_scheme() {
		unset( $_SERVER['HTTPS'] );
		$_SERVER['HTTPS'] = 'on';

		$link = get_home_url( null, 'web-storires/test' );
		$link = set_url_scheme( $link, 'http' );

		$link_https = set_url_scheme( $link, 'https' );

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Story_Renderer\HTML( $story );

		$result = $this->call_private_method( $renderer, 'replace_url_scheme', [ $link ] );
		$this->assertEquals( $result, $link_https );
		unset( $_SERVER['HTTPS'] );
	}


	/**
	 * @covers ::replace_url_scheme
	 */
	public function test_replace_url_scheme_different_host() {
		unset( $_SERVER['HTTPS'] );
		$_SERVER['HTTPS'] = 'on';
		$link             = 'https://www.google.com';

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Story_Renderer\HTML( $story );

		$result = $this->call_private_method( $renderer, 'replace_url_scheme', [ $link ] );
		$this->assertEquals( $result, $link );
		unset( $_SERVER['HTTPS'] );
	}

	/**
	 * @covers ::print_analytics
	 */
	public function test_print_analytics() {
		$source   = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>';
		$expected = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page><amp-analytics type="gtag" data-credentials="include"><script type="application/json">{}</script></amp-analytics></amp-story></body></html>';

		add_action(
			'web_stories_print_analytics',
			static function() {
				echo '<amp-analytics type="gtag" data-credentials="include"><script type="application/json">{}</script></amp-analytics>';
			}
		);

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Story_Renderer\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'print_analytics', [ $source ] );

		remove_all_actions( 'web_stories_print_analytics' );

		$this->assertContains( '<amp-analytics type="gtag" data-credentials="include"', $actual );
		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::print_analytics
	 */
	public function test_print_analytics_no_output() {
		$source = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>';

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Story_Renderer\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'print_analytics', [ $source ] );

		$this->assertNotContains( '<amp-analytics type="gtag" data-credentials="include"', $actual );
		$this->assertSame( $source, $actual );
	}

	/**
	 * Helper to setup renderer.
	 *
	 * @param WP_Post $post Post Object.
	 *
	 * @return string
	 */
	protected function setup_renderer( $post ) {
		$story = new Story();
		$story->load_from_post( $post );
		$renderer = new \Google\Web_Stories\Story_Renderer\HTML( $story );
		return $renderer->render();
	}
}
