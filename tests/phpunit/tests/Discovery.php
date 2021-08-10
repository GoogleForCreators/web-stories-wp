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

/**
 * @coversDefaultClass \Google\Web_Stories\Discovery
 */
class Discovery extends Test_Case {

	/**
	 * User ID.
	 *
	 * @var int
	 */
	protected static $user_id;

	/**
	 * Story ID.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * Image attachment id.
	 *
	 * @var int
	 */
	protected static $attachment_id;

	/**
	 * @param $factory
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		self::$story_id      = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Discovery Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$user_id,
			]
		);
		self::$attachment_id = $factory->attachment->create_object(
			DIR_TESTDATA . '/images/canola.jpg',
			self::$story_id,
			[
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		wp_maybe_generate_attachment_metadata( get_post( self::$attachment_id ) );
		set_post_thumbnail( self::$story_id, self::$attachment_id );

		add_theme_support( 'automatic-feed-links' );
	}

	public static function tear_down_after_class() {
		self::delete_user( self::$user_id );
		remove_theme_support( 'automatic-feed-links' );
	}

	public function set_up() {
		parent::set_up();

		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );
	}

	public function tear_down() {
		$this->set_permalink_structure( '' );
		// Set by go_to();
		$_SERVER['REQUEST_URI'] = '';

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$object = new \Google\Web_Stories\Discovery();
		$object->register();
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_schemaorg_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_open_graph_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_twitter_metadata' ] ) );
		$this->assertSame( 4, has_action( 'web_stories_story_head', [ $object, 'print_feed_link' ] ) );

	}

	/**
	 * @covers ::print_metadata
	 */
	public function test_print_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_metadata' ] );
		$this->assertStringContainsString( '<title>', $output );
	}

	/**
	 * @covers ::print_schemaorg_metadata
	 */
	public function test_print_schemaorg_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_schemaorg_metadata' ] );
		$this->assertStringContainsString( 'application/ld+json', $output );
	}

	/**
	 * @covers ::get_schemaorg_metadata
	 */
	public function test_get_schemaorg_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$result = $this->call_private_method( $object, 'get_schemaorg_metadata' );
		$this->assertArrayHasKey( 'mainEntityOfPage', $result );
		$this->assertArrayHasKey( 'headline', $result );
		$this->assertArrayHasKey( 'datePublished', $result );
		$this->assertArrayHasKey( 'dateModified', $result );
		$this->assertArrayHasKey( 'author', $result );
		$this->assertArrayHasKey( 'image', $result );
	}

	/**
	 * @covers ::print_open_graph_metadata
	 */
	public function test_print_open_graph_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_open_graph_metadata' ] );
		$this->assertStringContainsString( 'og:locale', $output );
		$this->assertStringContainsString( 'og:type', $output );
		$this->assertStringContainsString( 'og:description', $output );
		$this->assertStringContainsString( 'article:published_time', $output );
		$this->assertStringContainsString( 'article:modified_time', $output );
		$this->assertStringContainsString( 'og:image', $output );
	}

	/**
	 * @covers ::get_open_graph_metadata
	 */
	public function test_get_open_graph_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$result = $this->call_private_method( $object, 'get_open_graph_metadata' );
		$this->assertArrayHasKey( 'og:locale', $result );
		$this->assertArrayHasKey( 'og:type', $result );
		$this->assertArrayHasKey( 'og:description', $result );
		$this->assertArrayHasKey( 'article:published_time', $result );
		$this->assertArrayHasKey( 'article:modified_time', $result );
		$this->assertArrayHasKey( 'og:image', $result );
	}

	/**
	 * @covers ::print_feed_link
	 */
	public function test_print_feed_link() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_feed_link' ] );
		$this->assertStringContainsString( '<link rel="alternate"', $output );
		$this->assertStringContainsString( get_bloginfo( 'name' ), $output );
	}

	/**
	 * @covers ::print_twitter_metadata
	 */
	public function test_print_twitter_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_twitter_metadata' ] );
		$this->assertStringContainsString( 'twitter:card', $output );
		$this->assertStringContainsString( 'twitter:image', $output );
		$this->assertStringContainsString( 'twitter:image:alt', $output );
		$this->assertStringContainsString( 'Discovery Test Story', $output );
	}

	/**
	 * @covers ::get_twitter_metadata
	 */
	public function test_get_twitter_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$result = $this->call_private_method( $object, 'get_twitter_metadata' );
		$this->assertArrayHasKey( 'twitter:card', $result );
		$this->assertArrayHasKey( 'twitter:image', $result );
		$this->assertArrayHasKey( 'twitter:image:alt', $result );
		$this->assertSame( 'Discovery Test Story', $result['twitter:image:alt'] );
	}

	/**
	 * @covers ::get_poster
	 */
	public function test_get_poster() {
		$object = new \Google\Web_Stories\Discovery();
		$result = $this->call_private_method( $object, 'get_poster', [ self::$story_id ] );
		$this->assertArrayHasKey( 'src', $result );
		$this->assertArrayHasKey( 'height', $result );
		$this->assertArrayHasKey( 'width', $result );
	}

	/**
	 * @covers ::get_poster
	 */
	public function test_get_poster_no() {
		$object = new \Google\Web_Stories\Discovery();
		$result = $this->call_private_method( $object, 'get_poster', [ -99 ] );
		$this->assertFalse( $result );
	}
}
