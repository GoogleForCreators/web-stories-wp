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

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\Test_REST_TestCase;
use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use Spy_REST_Server;
use WP_REST_Request;

/**
 * Class Stories_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Controller
 */
class Stories_Controller extends Test_REST_TestCase {

	protected $server;

	protected static $user_id;
	protected static $user2_id;
	protected static $user3_id;

	protected static $author_id;
	protected static $contributor_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);

		self::$user2_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Jane Doe',
			]
		);

		self::$user3_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Zane Doe',
			]
		);

		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);

		self::$contributor_id = $factory->user->create(
			[
				'role' => 'contributor',
			]
		);

		$post_type = \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG;

		$factory->post->create_many(
			3,
			[
				'post_status' => 'publish',
				'post_author' => self::$user_id,
				'post_type'   => $post_type,
			]
		);

		$future_date = strtotime( '+1 day' );

		$factory->post->create_many(
			3,
			[
				'post_status' => 'future',
				'post_date'   => strftime( '%Y-%m-%d %H:%M:%S', $future_date ),
				'post_author' => self::$user_id,
				'post_type'   => $post_type,
			]
		);

		$factory->post->create_many(
			2,
			[
				'post_status' => 'publish',
				'post_author' => self::$user2_id,
				'post_type'   => $post_type,
			]
		);

		$factory->post->create_many(
			2,
			[
				'post_status' => 'publish',
				'post_author' => self::$user3_id,
				'post_type'   => $post_type,
			]
		);

		$factory->post->create_many(
			3,
			[
				'post_status' => 'draft',
				'post_author' => self::$user_id,
				'post_type'   => $post_type,
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$user_id );
		self::delete_user( self::$user2_id );
		self::delete_user( self::$user3_id );
		self::delete_user( self::$author_id );
		self::delete_user( self::$contributor_id );
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->add_caps_to_roles();

		$this->set_permalink_structure( '/%postname%/' );
	}

	public function tearDown() {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$this->remove_caps_from_roles();

		$this->set_permalink_structure( '' );

		$this->kses_remove_filters();

		parent::tearDown();
	}

	/**
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/web-story', $routes );
		$this->assertCount( 2, $routes['/web-stories/v1/web-story'] );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items() {
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'status', [ 'draft' ] );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );
		$headers  = $response->get_headers();

		$this->assertFalse( $response->is_error() );
		$this->assertArrayHasKey( 'X-WP-TotalByStatus', $headers );

		$statuses = json_decode( $headers['X-WP-TotalByStatus'], true );

		$this->assertArrayHasKey( 'all', $statuses );
		$this->assertArrayHasKey( 'publish', $statuses );
		$this->assertArrayHasKey( 'draft', $statuses );
		$this->assertArrayHasKey( 'future', $statuses );
		$this->assertArrayHasKey( 'private', $statuses );

		$this->assertEquals( 13, $statuses['all'] );
		$this->assertEquals( 7, $statuses['publish'] );
		$this->assertEquals( 3, $statuses['future'] );
		$this->assertEquals( 3, $statuses['draft'] );
		$this->assertEquals( 0, $statuses['private'] );

		$this->assertEquals( 3, $headers['X-WP-Total'] );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_no_perm() {
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$response = rest_get_server()->dispatch( $request );
		$headers  = $response->get_headers();

		$this->assertFalse( $response->is_error() );
		$this->assertArrayNotHasKey( 'X-WP-TotalByStatus', $headers );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_contributor() {
		wp_set_current_user( self::$contributor_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );
		$headers  = $response->get_headers();

		$this->assertFalse( $response->is_error() );
		$this->assertArrayHasKey( 'X-WP-TotalByStatus', $headers );

		$statuses = json_decode( $headers['X-WP-TotalByStatus'], true );

		$this->assertArrayHasKey( 'all', $statuses );
		$this->assertArrayHasKey( 'publish', $statuses );
		$this->assertArrayHasKey( 'draft', $statuses );
		$this->assertArrayHasKey( 'future', $statuses );
		$this->assertArrayNotHasKey( 'private', $statuses );

		$this->assertEquals( 13, $statuses['all'] );
		$this->assertEquals( 7, $statuses['publish'] );
		$this->assertEquals( 3, $statuses['future'] );
		$this->assertEquals( 3, $statuses['draft'] );

		$this->assertEquals( 7, $headers['X-WP-Total'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 */
	public function test_get_item() {
		wp_set_current_user( self::$user_id );
		$story   = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'draft',
				'post_author' => self::$user_id,
			]
		);
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertArrayHasKey( 'preview_link', $data );
		$view_link = get_preview_post_link( $story );
		$this->assertSame( $view_link, $data['preview_link'] );
		$this->assertArrayHasKey( 'edit_link', $data );
		$edit_link = get_edit_post_link( $story, 'rest-api' );
		$this->assertSame( $edit_link, $data['edit_link'] );
		$this->assertArrayHasKey( 'embed_post_link', $data );
		$this->assertContains( (string) $story, $data['embed_post_link'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 */
	public function test_get_item_no_user() {
		$story = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'publish',
				'post_author' => self::$user_id,
			]
		);
		wp_set_current_user( 0 );
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertArrayNotHasKey( 'edit_link', $data );
		$this->assertArrayNotHasKey( 'preview_link', $data );
		$this->assertArrayNotHasKey( 'embed_post_link', $data );
	}


	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 */
	public function test_get_item_future() {
		wp_set_current_user( self::$user_id );
		$future_date = strtotime( '+1 day' );
		$story       = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => strftime( '%Y-%m-%d %H:%M:%S', $future_date ),
				'post_author' => self::$user_id,
			]
		);
		$request     = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );

		$post               = get_post( $story );
		list ( $permalink ) = get_sample_permalink( $post->ID, $post->post_title, '' );
		$permalink          = str_replace( [ '%pagename%', '%postname%' ], $post->post_name, $permalink );

		$data = $response->get_data();
		$this->assertArrayHasKey( 'preview_link', $data );
		$this->assertNotEmpty( $data['preview_link'] );
		$this->assertSame( $permalink, $data['preview_link'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::prepare_links
	 */
	public function test_get_item_lock() {
		wp_set_current_user( self::$user_id );
		$future_date = strtotime( '+1 day' );
		$story       = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => strftime( '%Y-%m-%d %H:%M:%S', $future_date ),
				'post_author' => self::$user_id,
			]
		);
		$new_lock    = ( time() - 100 ) . ':' . self::$user_id;
		update_post_meta( $story, '_edit_lock', $new_lock );
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$response = rest_get_server()->dispatch( $request );
		$links    = $response->get_links();

		$this->assertArrayHasKey( 'https://api.w.org/lockuser', $links );
		$this->assertArrayHasKey( 'https://api.w.org/lock', $links );
	}

	/**
	 * @covers ::get_item
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::get_available_actions
	 */
	public function test_get_available_actions() {
		wp_set_current_user( self::$user_id );
		$future_date = strtotime( '+1 day' );
		$story       = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => strftime( '%Y-%m-%d %H:%M:%S', $future_date ),
				'post_author' => self::$user_id,
			]
		);
		$new_lock    = ( time() - 100 ) . ':' . self::$user_id;
		update_post_meta( $story, '_edit_lock', $new_lock );
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$response = rest_get_server()->dispatch( $request );
		$links    = $response->get_links();

		$this->assertArrayHasKey( 'https://api.w.org/action-delete', $links );
		$this->assertArrayHasKey( 'https://api.w.org/action-edit', $links );
	}

	/**
	 * @covers ::get_item
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::add_taxonomy_links
	 */
	public function test_get_add_taxonomy_links() {
		$object = new DummyTaxonomy();
		$this->set_private_property( $object, 'taxonomy_post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$object->register_taxonomy();

		wp_set_current_user( self::$user_id );
		$story   = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'publish',
				'post_author' => self::$user_id,
			]
		);
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );
		$links    = $response->get_links();

		$this->assertArrayHasKey( 'https://api.w.org/term', $links );
		foreach ( $links['https://api.w.org/term'] as $taxonomy ) {
			$this->assertArrayHasKey( 'href', $taxonomy );
			$this->assertContains( 'web-stories/v1', $taxonomy['href'] );
		}
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_format() {
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'status', [ 'draft' ] );
		$request->set_param( 'context', 'edit' );
		$request->set_param( '_web_stories_envelope', true );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		// Body of request.
		$this->assertArrayHasKey( 'headers', $data );
		$this->assertArrayHasKey( 'body', $data );
		$this->assertArrayHasKey( 'status', $data );

		$statues  = $data['headers']['X-WP-TotalByStatus'];
		$statuses = json_decode( $statues, true );

		// Headers.
		$this->assertArrayHasKey( 'all', $statuses );
		$this->assertArrayHasKey( 'publish', $statuses );
		$this->assertArrayHasKey( 'future', $statuses );
		$this->assertArrayHasKey( 'draft', $statuses );
		$this->assertArrayHasKey( 'private', $statuses );

		$this->assertEquals( 3, $data['headers']['X-WP-Total'] );
	}

	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema() {
		$request  = new WP_REST_Request( 'OPTIONS', '/web-stories/v1/web-story' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );

		$properties = $data['schema']['properties'];
		$this->assertArrayHasKey( 'story_data', $properties );
	}

	/**
	 * @covers ::filter_posts_clauses
	 */
	public function test_filter_posts_by_author_display_names() {
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'order', 'asc' );
		$request->set_param( 'orderby', 'story_author' );

		$response = rest_get_server()->dispatch( $request );
		$results  = wp_list_pluck( $response->get_data(), 'author' );

		$this->assertSame(
			[
				self::$user_id,
				self::$user_id,
				self::$user_id,
				self::$user2_id,
				self::$user2_id,
				self::$user3_id,
				self::$user3_id,
			],
			$results,
			'Expected posts ordered by author display names'
		);

		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'order', 'desc' );
		$request->set_param( 'orderby', 'story_author' );

		$response = rest_get_server()->dispatch( $request );
		$results  = wp_list_pluck( $response->get_data(), 'author' );

		$this->assertSame(
			[
				self::$user3_id,
				self::$user3_id,
				self::$user2_id,
				self::$user2_id,
				self::$user_id,
				self::$user_id,
				self::$user_id,
			],
			$results,
			'Expected posts ordered by author display names'
		);
	}

	/**
	 * @covers ::filter_posts_clauses
	 */
	public function test_filter_posts_clauses_irrelevant_query() {
		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$initial_clauses = [
			'join'    => '',
			'orderby' => '',
		];

		$query = new \WP_Query();
		$query->set( 'post_type', 'post' );
		$query->set( 'orderby', 'story_author' );

		$orderby = $controller->filter_posts_clauses( $initial_clauses, $query );
		$this->assertEquals( $orderby, $initial_clauses );

		$query = new \WP_Query();
		$query->set( 'post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$query->set( 'orderby', 'author' );

		$orderby = $controller->filter_posts_clauses( $initial_clauses, $query );
		$this->assertEquals( $orderby, $initial_clauses );
	}

	/**
	 * @covers ::get_collection_params
	 */
	public function test_get_collection_params() {
		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$collection_params = $controller->get_collection_params();
		$this->assertArrayHasKey( '_web_stories_envelope', $collection_params );
		$this->assertArrayHasKey( 'web_stories_demo', $collection_params );
		$this->assertArrayHasKey( 'orderby', $collection_params );
		$this->assertArrayHasKey( 'enum', $collection_params['orderby'] );
		$this->assertContains( 'story_author', $collection_params['orderby']['enum'] );
	}

	/**
	 * @covers ::create_item
	 */
	public function test_create_item_as_author_should_not_strip_markup() {
		wp_set_current_user( self::$author_id );

		$this->kses_int();

		$unsanitized_content    = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content.html' );
		$unsanitized_story_data = json_decode( file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content_filtered.json' ), true );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story' );
		$request->set_body_params(
			[
				'content'    => $unsanitized_content,
				'story_data' => $unsanitized_story_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertEquals( $unsanitized_content, $new_data['content']['raw'] );
		$this->assertEquals( $unsanitized_story_data, $new_data['story_data'] );
	}

	/**
	 * @covers ::create_item
	 */
	public function test_create_item_duplicate_id() {

		$unsanitized_content    = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content.html' );
		$unsanitized_story_data = wp_json_encode( [ 'pages' => [] ] );
		$original_id            = self::factory()->post->create(
			[
				'post_type'             => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content'          => $unsanitized_content,
				'post_title'            => 'Example title',
				'post_excerpt'          => 'Example excerpt',
				'post_author'           => self::$user_id,
				'post_content_filtered' => $unsanitized_story_data,
			]
		);

		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		set_post_thumbnail( $original_id, $attachment_id );

		wp_set_current_user( self::$user_id );
		$this->kses_int();

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story' );
		$request->set_body_params(
			[
				'original_id' => $original_id,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertArrayHasKey( 'content', $new_data );
		$this->assertArrayHasKey( 'raw', $new_data['content'] );
		$this->assertArrayHasKey( 'title', $new_data );
		$this->assertArrayHasKey( 'raw', $new_data['title'] );
		$this->assertArrayHasKey( 'excerpt', $new_data );
		$this->assertArrayHasKey( 'raw', $new_data['excerpt'] );
		$this->assertArrayHasKey( 'story_data', $new_data );
		$this->assertArrayHasKey( 'featured_media', $new_data );

		$this->assertEquals( 'Example title (Copy)', $new_data['title']['raw'] );
		$this->assertEquals( 'Example excerpt', $new_data['excerpt']['raw'] );
		$this->assertEquals( $attachment_id, $new_data['featured_media'] );
		$this->assertEqualSets( [ 'pages' => [] ], $new_data['story_data'] );
	}

	/**
	 * @covers ::create_item
	 */
	public function test_create_item_duplicate_id_invalid_id() {
		wp_set_current_user( self::$user_id );
		$this->kses_int();

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story' );
		$request->set_body_params(
			[
				'original_id' => 9999,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_post_invalid_id', $response, 404 );
	}

	/**
	 * @covers ::create_item
	 */
	public function test_create_item_duplicate_id_permission() {

		$unsanitized_content    = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content.html' );
		$unsanitized_story_data = wp_json_encode( [ 'pages' => [] ] );
		$original_id            = self::factory()->post->create(
			[
				'post_type'             => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content'          => $unsanitized_content,
				'post_title'            => 'Example title',
				'post_excerpt'          => 'Example excerpt',
				'post_author'           => self::$user_id,
				'post_status'           => 'private',
				'post_content_filtered' => $unsanitized_story_data,
			]
		);

		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		set_post_thumbnail( $original_id, $attachment_id );

		wp_set_current_user( self::$contributor_id );
		$this->kses_int();

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story' );
		$request->set_body_params(
			[
				'original_id' => $original_id,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_cannot_create', $response, 403 );
	}

	/**
	 * @covers ::update_item
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::update_item
	 */
	public function test_update_item_as_author_should_not_strip_markup() {
		wp_set_current_user( self::$author_id );
		$this->kses_int();

		$unsanitized_content    = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content.html' );
		$unsanitized_story_data = json_decode( file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/story_post_content_filtered.json' ), true );

		$story = self::factory()->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story/' . $story );
		$request->set_body_params(
			[
				'content'    => $unsanitized_content,
				'story_data' => $unsanitized_story_data,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$new_data = $response->get_data();
		$this->assertEquals( $unsanitized_content, $new_data['content']['raw'] );
		$this->assertEquals( $unsanitized_story_data, $new_data['story_data'] );
	}
}
