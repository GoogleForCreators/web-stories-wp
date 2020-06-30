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

class Discovery extends \WP_UnitTestCase {
	use Private_Access;

	protected static $user_id;
	protected static $story_id;
	protected static $poster_attachment_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		self::$story_id             = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);
		self::$poster_attachment_id = $factory->attachment->create_object(
			DIR_TESTDATA . '/images/test-image.jpg',
			self::$story_id,
			[
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		wp_maybe_generate_attachment_metadata( get_post( self::$poster_attachment_id ) );
		set_post_thumbnail( self::$story_id, self::$poster_attachment_id );
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
	}

	public function setUp() {
		parent::setUp();
		global $wp_query, $post;
		$post = get_post( self::$story_id );
		$wp_query->queried_object = $post;
	}

	public function tearDown() {
		global $wp_query, $post;
		unset( $wp_query->queried_object );
		unset( $post );
		parent::tearDown();
	}

	public function test_init() {
		$object = new \Google\Web_Stories\Discovery();
		$object->init();
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_schemaorg_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_open_graph_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $object, 'print_twitter_metadata' ] ) );

	}

	public function test_print_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		ob_start();
		$object->print_metadata();
		$page = ob_get_clean();
		$this->assertContains( '<title>', $page );
	}

	public function test_print_schemaorg_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		ob_start();
		$object->print_schemaorg_metadata();
		$page = ob_get_clean();
		$this->assertContains( 'application/ld+json', $page );
	}

	public function test_get_schemaorg_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		$result = $this->call_private_method( $object, 'get_schemaorg_metadata' );
		$this->assertArrayHasKey( 'mainEntityOfPage', $result );
		$this->assertArrayHasKey( 'headline', $result );
		$this->assertArrayHasKey( 'datePublished', $result );
		$this->assertArrayHasKey( 'dateModified', $result );
	}

	public function test_print_open_graph_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		ob_start();
		$object->print_open_graph_metadata();
		$page = ob_get_clean();
		$this->assertContains( 'og:locale', $page );
		$this->assertContains( 'og:type', $page );
		$this->assertContains( 'og:description', $page );
		$this->assertContains( 'article:published_time', $page );
		$this->assertContains( 'article:modified_time', $page );
		$this->assertContains( 'og:image', $page );
	}

	public function test_print_twitter_metadata() {
		$object = new \Google\Web_Stories\Discovery();
		ob_start();
		$object->print_twitter_metadata();
		$page = ob_get_clean();
		$this->assertContains( 'twitter:card', $page );
		$this->assertContains( 'twtter:image', $page );
	}

	public function test_get_valid_publisher_image() {
		$object = new \Google\Web_Stories\Discovery();
		$result = $this->call_private_method( $object, 'get_valid_publisher_image', [ self::$poster_attachment_id ] );
		$this->assertNotFalse( $result );
	}
}
