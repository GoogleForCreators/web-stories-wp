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

namespace Google\Web_Stories\Tests;

use Google\Web_Stories\REST_API\Stories_Controller;

class Story_Renderer extends \WP_UnitTestCase {
	protected static $user;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user = $factory->user->create( [ 'role' => 'administrator' ] );
	}

	public function setUp() {
		// Avoids HTML in post_content being stripped because of lacking capabilities.
		wp_set_current_user( self::$user );
	}

	public function test_replace_html_start_tag() {
		$expected = '<html amp lang="en-US"><head></head><body></body></html>';
		$post     = self::factory()->post->create_and_get(
			[
				'post_content' => '<html><head></head><body></body></html>',
			]
		);

		$renderer = new \Google\Web_Stories\Story_Renderer( $post );
		$actual   = $renderer->render();

		$this->assertSame( $expected, $actual );
	}

	public function test_replace_html_head() {
		$start_tag = '<meta name="web-stories-replace-head-start"/>';
		$end_tag   = '<meta name="web-stories-replace-head-end"/>';

		$post = self::factory()->post->create_and_get(
			[
				'post_content' => "<html><head>FOO{$start_tag}BAR{$end_tag}BAZ</head><body></body></html>",
			]
		);

		$renderer = new \Google\Web_Stories\Story_Renderer( $post );
		$actual   = $renderer->render();

		$this->assertContains( 'FOO', $actual );
		$this->assertNotContains( 'BAR', $actual );
		$this->assertNotContains( $start_tag, $actual );
		$this->assertNotContains( $end_tag, $actual );
		$this->assertContains( '<meta name="generator" content="Web Stories', $actual );
		$this->assertSame( 1, did_action( 'web_stories_story_head' ) );
	}

	public function test_replace_body_start_tag() {
		$expected = '<html amp lang="en-US"><head></head><body>Hello World<span>Foo</span></body></html>';
		$post     = self::factory()->post->create_and_get(
			[
				'post_content' => '<html><head></head><body><span>Foo</span></body></html>',
			]
		);

		$function = static function() {
			echo 'Hello World';
		};

		add_action( 'web_stories_body_open', $function );

		$renderer = new \Google\Web_Stories\Story_Renderer( $post );
		$actual   = $renderer->render();

		remove_action( 'web_stories_body_open', $function );

		$this->assertSame( $expected, $actual );
	}

	public function test_replace_body_end_tag() {
		$expected = '<html amp lang="en-US"><head></head><body><span>Foo</span>Hello World</body></html>';
		$post     = self::factory()->post->create_and_get(
			[
				'post_content' => '<html><head></head><body><span>Foo</span></body></html>',
			]
		);

		$function = static function() {
			echo 'Hello World';
		};

		add_action( 'web_stories_footer', $function );

		$renderer = new \Google\Web_Stories\Story_Renderer( $post );
		$actual   = $renderer->render();

		remove_action( 'web_stories_footer', $function );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests that analytics tag is not added if tracking ID is missing.
	 *
	 * @covers \Google\Web_Stories\Story_Renderer::maybe_add_analytics
	 */
	public function test_maybe_add_analytics_empty_tracking_id() {
		$post = self::factory()->post->create_and_get(
			[
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$options  = [
			'accountID'             => '',
			'adsenseLinked'         => false,
			'anonymizeIP'           => true,
			'internalWebPropertyID' => '',
			'profileID'             => '',
			'propertyID'            => '',
			'trackingDisabled'      => [ 'loggedinUsers' ],
			'useSnippet'            => true,
		];
		$renderer = new \Google\Web_Stories\Story_Renderer( $post );
		$option   = 'googlesitekit_analytics_settings';

		add_option( $option, $options );
		$expected                  = '<html amp lang="en-US"><head></head><body><amp-story></amp-story></body></html>';
		$actual_with_empty_options = $renderer->render();
		$this->assertSame( $expected, $actual_with_empty_options );

		delete_option( $option );
	}

	/**
	 * Tests that analytics tag is added properly if tracking ID is added.
	 *
	 * @covers \Google\Web_Stories\Story_Renderer::maybe_add_analytics
	 */
	public function test_maybe_add_analytics_with_configuration() {
		// Test content with amp-analytics tag and script if config set.
		$post_with_meta_tag = self::factory()->post->create_and_get(
			[
				'post_content' => '<html><head><meta name="web-stories-replace-head-start"/><meta name="web-stories-replace-head-end"/></head><body><amp-story></amp-story></body></html>',
			]
		);

		$options = [
			'propertyID'       => '123foo',
			'trackingDisabled' => [],
			'useSnippet'       => true,
		];

		$option = 'googlesitekit_analytics_settings';
		add_option( $option, $options );

		$renderer            = new \Google\Web_Stories\Story_Renderer( $post_with_meta_tag );
		$actual_with_options = $renderer->render();
		delete_option( $option );

		$this->assertContains( '<amp-analytics', $actual_with_options );
		$this->assertContains( '"gtag_id":"123foo"', $actual_with_options );
		$this->assertContains( 'https://cdn.ampproject.org/v0/amp-analytics-0.1.js', $actual_with_options );
	}

	/**
	 * Tests that analytics tag is correctly removed via filter.
	 *
	 * @covers \Google\Web_Stories\Story_Renderer::maybe_add_analytics
	 */
	public function test_maybe_add_analytics_remove_with_filter() {
		// Test content with amp-analytics tag and script if config set.
		$post_with_meta_tag = self::factory()->post->create_and_get(
			[
				'post_content' => '<html><head><meta name="web-stories-replace-head-start"/><meta name="web-stories-replace-head-end"/></head><body><amp-story></amp-story></body></html>',
			]
		);

		$options = [
			'propertyID'       => '123foo',
			'trackingDisabled' => [],
			'useSnippet'       => true,
		];

		$option = 'googlesitekit_analytics_settings';
		add_option( $option, $options );

		add_filter( 'web_stories_gtag', '__return_false' );

		$renderer = new \Google\Web_Stories\Story_Renderer( $post_with_meta_tag );
		$actual   = $renderer->render();

		delete_option( $option );

		$this->assertNotContains( '<amp-analytics', $actual );
		$this->assertNotContains( '"gtag_id":"123foo"', $actual );
		$this->assertNotContains( 'https://cdn.ampproject.org/v0/amp-analytics-0.1.js', $actual );
	}

	/**
	 * Tests that publisher logo is correctly replaced.
	 *
	 * @covers \Google\Web_Stories\Story_Renderer::add_publisher_logo
	 */
	public function test_add_publisher_logo() {
		$post_with_publisher_logo = self::factory()->post->create_and_get(
			[
				'post_content' => '<html><head></head><body><amp-story publisher-logo-src=""' . \Google\Web_Stories\Story_Post_Type::PUBLISHER_LOGO_PLACEHOLDER . '"></amp-story></body></html>',
			]
		);

		$attachment_id = self::factory()->attachment->create_upload_object( __DIR__ . '/../data/attachment.jpg', 0 );
		add_option( Stories_Controller::PUBLISHER_LOGOS_OPTION, [ 'active' => $attachment_id ] );
		$renderer = new \Google\Web_Stories\Story_Renderer( $post_with_publisher_logo );
		$rendered = $renderer->render();

		delete_option( Stories_Controller::PUBLISHER_LOGOS_OPTION );

		$this->assertContains( 'attachment', $rendered );
		$this->assertNotContains( \Google\Web_Stories\Story_Post_Type::PUBLISHER_LOGO_PLACEHOLDER, $rendered );
	}
}
