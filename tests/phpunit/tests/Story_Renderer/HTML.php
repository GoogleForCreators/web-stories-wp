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

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Renderer\HTML
 */
class HTML extends \WP_UnitTestCase {
	public function setUp() {
		// When running the tests, we don't have unfiltered_html capabilities.
		// This change avoids HTML in post_content being stripped in our test posts because of KSES.
		remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
		remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
	}

	public function tearDown() {
		add_filter( 'content_save_pre', 'wp_filter_post_kses' );
		add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
	}

	/**
	 * @covers ::render
	 * @covers ::__construct
	 * @covers ::string_to_doc
	 */
	public function test_render() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<!DOCTYPE html><html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertStringStartsWith( '<!DOCTYPE html>', $actual );
		$this->assertStringEndsWith( '</html>', $actual );
	}

	/**
	 * @covers ::transform_html_start_tag
	 */
	public function test_transform_html_start_tag() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertContains( '<html amp="" lang="en-US">', $actual );
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
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => "<html><head>FOO{$start_tag}BAR{$end_tag}BAZ</head><body><amp-story></amp-story></body></html>",
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertContains( 'FOO', $actual );
		$this->assertContains( 'BAZ', $actual );
		$this->assertNotContains( 'BAR', $actual );
		$this->assertNotContains( $start_tag, $actual );
		$this->assertNotContains( $end_tag, $actual );
		$this->assertContains( '<meta name="generator" content="Web Stories', $actual );
		$this->assertSame( 1, did_action( 'web_stories_story_head' ) );
	}

	/**
	 * @covers ::insert_content_after_opening_body
	 */
	public function test_insert_content_after_opening_body() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$function = static function() {
			echo '<p>Hello World</p>';
		};

		add_action( 'web_stories_body_open', $function );

		$actual = $this->setup_renderer( $post );

		remove_action( 'web_stories_body_open', $function );

		$this->assertContains( '<body><p>Hello World</p><amp-story', $actual );
	}

	/**
	 * @covers ::insert_content_before_closing_body
	 */
	public function test_insert_content_before_closing_body() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$function = static function() {
			echo '<p>Hello World</p>';
		};

		add_action( 'web_stories_footer', $function );

		$actual = $this->setup_renderer( $post );

		remove_action( 'web_stories_footer', $function );

		$this->assertContains( '</amp-story><p>Hello World</p></body>', $actual );
	}

	/**
	 * Tests that publisher logo is correctly replaced.
	 *
	 * @covers \Google\Web_Stories\Story_Renderer\HTML::add_publisher_logo
	 * @covers \Google\Web_Stories\Traits\Publisher::get_publisher_logo_placeholder
	 * @covers \Google\Web_Stories\Traits\Publisher::get_publisher_logo
	 * @covers ::add_publisher_logo
	 */
	public function test_add_publisher_logo() {
		$attachment_id = self::factory()->attachment->create_upload_object( __DIR__ . '/../../data/attachment.jpg', 0 );
		add_option( \Google\Web_Stories\Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $attachment_id );

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$renderer    = $this->setup_renderer( $post );
		$placeholder = $renderer->get_publisher_logo_placeholder();

		wp_update_post(
			[
				'ID'           => $post->ID,
				'post_content' => '<html><head></head><body><amp-story publisher-logo-src="' . $placeholder . '"></amp-story></body></html>',
			]
		);

		$rendered = $renderer->render();

		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$this->assertContains( 'attachment', $rendered );
		$this->assertNotContains( $placeholder, $rendered );
	}

	/**
	 * @covers ::add_poster_images
	 * @covers ::get_poster_images
	 */
	public function test_add_poster_images() {
		$attachment_id = self::factory()->attachment->create_upload_object( __DIR__ . '/../../data/attachment.jpg', 0 );

		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
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
	public function test_add_poster_images_no_featured_image() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$rendered = $this->setup_renderer( $post );

		$this->assertContains( 'poster-portrait-src=', $rendered );
		$this->assertNotContains( 'poster-square-src=', $rendered );
		$this->assertNotContains( 'poster-landscape-src=', $rendered );
	}

	/**
	 * @covers ::insert_analytics_configuration
	 * @covers ::insert_amp_analytics_extension
	 */
	public function test_insert_analytics_configuration() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$function = static function() {
			echo '<amp-analytics type="gtag" data-credentials="include"><script type="application/json"></script></amp-analytics>';
		};

		add_action( 'web_stories_insert_analytics_configuration', $function );

		$actual = $this->setup_renderer( $post );

		remove_action( 'web_stories_insert_analytics_configuration', $function );

		$this->assertContains( '<script src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" async="async" custom-element="amp-analytics">', $actual );
		$this->assertContains( '<amp-analytics type="gtag" data-credentials="include"><script type="application/json"></script></amp-analytics></amp-story></body>', $actual );
	}

	/**
	 * @covers ::insert_analytics_configuration
	 * @covers ::insert_amp_analytics_extension
	 */
	public function test_insert_analytics_configuration_no_output() {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$actual = $this->setup_renderer( $post );

		$this->assertNotContains( '<script src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" async="async" custom-element="amp-analytics">', $actual );
	}

	/**
	 * Helper to setup rendered.
	 *
	 * @param \WP_Post $post Post Object.
	 *
	 * @return string
	 */
	protected function setup_renderer( $post ) {
		$story = new \Google\Web_Stories\Model\Story();
		$story->setup_default_poster();
		$story->load_from_post( $post );
		$renderer = new \Google\Web_Stories\Story_Renderer\HTML( $story );
		return $renderer->render();
	}
}
