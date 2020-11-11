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
class Discovery extends \WP_UnitTestCase {
	use Private_Access;

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
			DIR_TESTDATA . '/images/test-image.jpg',
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

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
		remove_theme_support( 'automatic-feed-links' );
	}

	public function setUp() {
		parent::setUp();
		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );
	}

	public function tearDown() {
		// Set by go_to();
		$_SERVER['REQUEST_URI'] = '';
		parent::tearDown();
	}

	/**
	 * @covers ::init
	 */
	public function test_init() {
		$object = new \Google\Web_Stories\Discovery();
		$object->init();
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
		$this->assertContains( '<title>', $output );
	}

	/**
	 * @covers ::print_schemaorg_metadata
	 */
	public function test_print_schemaorg_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_schemaorg_metadata' ] );
		$this->assertContains( 'application/ld+json', $output );
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
		$this->assertContains( 'og:locale', $output );
		$this->assertContains( 'og:type', $output );
		$this->assertContains( 'og:description', $output );
		$this->assertContains( 'article:published_time', $output );
		$this->assertContains( 'article:modified_time', $output );
		$this->assertContains( 'og:image', $output );
	}

	/**
	 * @covers ::print_feed_link
	 */
	public function test_print_feed_link() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_feed_link' ] );
		$this->assertContains( '<link rel="alternate"', $output );
		$this->assertContains( get_bloginfo( 'name' ), $output );
	}

	/**
	 * @covers ::print_twitter_metadata
	 */
	public function test_print_twitter_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$output = get_echo( [ $object, 'print_twitter_metadata' ] );
		$this->assertContains( 'twitter:card', $output );
		$this->assertContains( 'twitter:image', $output );
	}
}
