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

namespace Google\Web_Stories\Tests\Integration\Renderer\Story;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\TestCase;
use WP_Post;

/**
 * @coversDefaultClass \Google\Web_Stories\Renderer\Story\HTML
 */
class HTML extends TestCase {
	public function set_up(): void {
		parent::set_up();

		// When running the tests, we don't have unfiltered_html capabilities.
		// This change avoids HTML in post_content being stripped in our test posts because of KSES.
		remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
		remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
	}

	public function tear_down(): void {
		add_filter( 'content_save_pre', 'wp_filter_post_kses' );
		add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

		parent::tear_down();
	}

	/**
	 * @covers ::render
	 */
	public function test_render(): void {
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
	public function test_replace_html_head(): void {
		$start_tag = '<meta name="web-stories-replace-head-start"/>';
		$end_tag   = '<meta name="web-stories-replace-head-end"/>';

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => "<html><head>FOO{$start_tag}BAR{$end_tag}BAZ</head><body><amp-story></amp-story></body></html>",
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertStringContainsString( 'FOO', $actual );
		$this->assertStringContainsString( 'BAZ', $actual );
		$this->assertStringNotContainsString( 'BAR', $actual );
		$this->assertStringNotContainsString( $start_tag, $actual );
		$this->assertStringNotContainsString( $end_tag, $actual );
		$this->assertStringContainsString( '<meta name="amp-story-generator-name" content="Web Stories for WordPress"', $actual );
		$this->assertStringContainsString( '<meta name="amp-story-generator-version" content="', $actual );
		$this->assertSame( 1, did_action( 'web_stories_story_head' ) );
	}

	/**
	 * @covers ::replace_html_head
	 * @covers ::get_html_head_markup
	 */
	public function test_replace_html_head_malformed(): void {
		$start_tag = '<meta name="web-stories-replace-head-start " />';
		$end_tag   = '<meta name="web-stories-replace-head-end" />';

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => "<html><head>FOO{$start_tag}BAR{$end_tag}BAZ</head><body><amp-story></amp-story></body></html>",
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertStringContainsString( 'FOO', $actual );
		$this->assertStringContainsString( 'BAZ', $actual );
		$this->assertStringNotContainsString( 'BAR', $actual );
		$this->assertStringNotContainsString( $start_tag, $actual );
		$this->assertStringNotContainsString( $end_tag, $actual );
		$this->assertStringContainsString( '<meta name="amp-story-generator-name" content="Web Stories for WordPress"', $actual );
		$this->assertStringContainsString( '<meta name="amp-story-generator-version" content="', $actual );
		$this->assertSame( 1, did_action( 'web_stories_story_head' ) );
	}

	/**
	 * @covers ::replace_html_head
	 * @covers ::get_html_head_markup
	 */
	public function test_replace_html_head_malformed_missing_slash(): void {
		$start_tag = '<meta name="web-stories-replace-head-start">';
		$end_tag   = '<meta name="web-stories-replace-head-end">';

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => "<html><head>FOO{$start_tag}BAR{$end_tag}BAZ</head><body><amp-story></amp-story></body></html>",
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertStringContainsString( 'FOO', $actual );
		$this->assertStringContainsString( 'BAZ', $actual );
		$this->assertStringNotContainsString( 'BAR', $actual );
		$this->assertStringNotContainsString( $start_tag, $actual );
		$this->assertStringNotContainsString( $end_tag, $actual );
		$this->assertStringContainsString( '<meta name="amp-story-generator-name" content="Web Stories for WordPress"', $actual );
		$this->assertStringContainsString( '<meta name="amp-story-generator-version" content="', $actual );
		$this->assertSame( 1, did_action( 'web_stories_story_head' ) );
	}

	/**
	 * @covers ::print_analytics
	 */
	public function test_print_analytics(): void {
		$source   = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>';
		$expected = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page><amp-analytics type="gtag" data-credentials="include"><script type="application/json">{}</script></amp-analytics></amp-story></body></html>';

		add_action(
			'web_stories_print_analytics',
			static function(): void {
				echo '<amp-analytics type="gtag" data-credentials="include"><script type="application/json">{}</script></amp-analytics>';
			}
		);

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Renderer\Story\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'print_analytics', [ $source ] );

		remove_all_actions( 'web_stories_print_analytics' );

		$this->assertStringContainsString( '<amp-analytics type="gtag" data-credentials="include"', $actual );
		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::print_analytics
	 */
	public function test_print_analytics_no_output(): void {
		$source = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>';

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Renderer\Story\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'print_analytics', [ $source ] );

		$this->assertStringNotContainsString( '<amp-analytics type="gtag" data-credentials="include"', $actual );
		$this->assertSame( $source, $actual );
	}

	/**
	 * @covers ::print_social_share
	 */
	public function test_print_social_share(): void {
		$source   = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>';
		$expected = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page><amp-story-social-share layout="nodisplay"><script type="application/json">{"shareProviders":[{"provider":"twitter"},{"provider":"linkedin"},{"provider":"email"},{"provider":"system"}]}</script></amp-story-social-share></amp-story></body></html>';

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Renderer\Story\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'print_social_share', [ $source ] );

		$this->assertStringContainsString( '<amp-story-social-share layout="nodisplay"><script type="application/json">', $actual );
		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers ::print_social_share
	 */
	public function test_print_social_share_filter(): void {
		add_filter( 'web_stories_share_providers', '__return_empty_array' );

		$source = '<html><head></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"><amp-story-page id="example"><amp-story-grid-layer template="fill"></amp-story-grid-layer></amp-story-page></amp-story></body></html>';

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Renderer\Story\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'print_social_share', [ $source ] );

		remove_filter( 'web_stories_share_providers', '__return_empty_array' );

		$this->assertStringNotContainsString( '<amp-story-social-share layout="nodisplay"><script type="application/json">', $actual );
		$this->assertSame( $source, $actual );
	}

	/**
	 * @covers ::fix_malformed_script_link_tags
	 */
	public function test_fix_malformed_script_link_tags(): void {
		$source = '<html><head><a href="https://cdn.ampproject.org/v0.js">https://cdn.ampproject.org/v0.js</a><a href="https://cdn.ampproject.org/v0/amp-story-1.0.js">https://cdn.ampproject.org/v0/amp-story-1.0.js</a><link href="https://fonts.googleapis.com/css2?display=swap&amp;family=Roboto%3Awght%40700" rel="stylesheet" /></head><body><amp-story></amp-story></body></html>';

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Renderer\Story\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'fix_malformed_script_link_tags', [ $source ] );

		$this->assertStringNotContainsString( '<a ', $actual );
		$this->assertStringContainsString( '<script async src="https://cdn.ampproject.org/v0.js">', $actual );
		$this->assertStringContainsString( '<script async src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>', $actual );
	}

	/**
	 * @covers ::fix_malformed_script_link_tags
	 */
	public function test_fix_malformed_script_link_tags_keeps_other_links(): void {
		$source = '<html><head></head><body><amp-story><amp-story-page><amp-story-page-outlink layout="nodisplay"><a href="https://example.com">Learn more</a></amp-story-page-outlink></amp-story-page></amp-story></body></html>';

		$story    = new Story();
		$renderer = new \Google\Web_Stories\Renderer\Story\HTML( $story );

		$actual = $this->call_private_method( $renderer, 'fix_malformed_script_link_tags', [ $source ] );

		$this->assertStringContainsString( '<amp-story-page-outlink layout="nodisplay"><a href="https://example.com">Learn more</a></amp-story-page-outlink>', $actual );
	}

	/**
	 * Helper to setup renderer.
	 *
	 * @param WP_Post $post Post Object.
	 */
	protected function setup_renderer( $post ): string {
		$story = new Story();
		$story->load_from_post( $post );
		$renderer = new \Google\Web_Stories\Renderer\Story\HTML( $story );
		return $renderer->render();
	}
}
