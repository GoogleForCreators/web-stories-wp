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

use DateTime;
use Google\Web_Stories\Media\Image_Sizes;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use WP_REST_Request;

/**
 * Class Stories_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Controller
 */
class Stories_Controller extends DependencyInjectedRestTestCase {

	protected $server;

	protected static $user_id;
	protected static $user2_id;
	protected static $user3_id;

	protected static $author_id;
	protected static $contributor_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Stories_Controller
	 */
	private $controller;

	public static function wpSetUpBeforeClass( $factory ): void {
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

		$factory->post->create_many(
			3,
			[
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
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
				'post_status' => 'pending',
				'post_author' => self::$user3_id,
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
				'post_author' => self::$author_id,
				'post_type'   => $post_type,
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$story_post_type = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );
		$story_post_type->register();
		$this->controller = new \Google\Web_Stories\REST_API\Stories_Controller( Story_Post_Type::POST_TYPE_SLUG );
	}

	public function tear_down(): void {
		$this->kses_remove_filters();

		parent::tear_down();
	}

	/**
	 * @covers ::register_routes
	 */
	public function test_register_routes(): void {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/web-story', $routes );
		$this->assertCount( 2, $routes['/web-stories/v1/web-story'] );
	}

	/**
	 * @covers ::get_items
	 * @covers ::add_response_headers
	 */
	public function test_get_items(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'status', [ 'draft' ] );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );
		$headers  = $response->get_headers();

		$this->assertFalse( $response->is_error() );
		$this->assertArrayHasKey( 'X-WP-TotalByStatus', $headers );
		$this->assertArrayHasKey( 'X-WP-Total', $headers );
		$this->assertArrayHasKey( 'X-WP-TotalPages', $headers );

		$statuses = json_decode( $headers['X-WP-TotalByStatus'], true );

		$this->assertArrayHasKey( 'all', $statuses );
		$this->assertArrayHasKey( 'publish', $statuses );
		$this->assertArrayHasKey( 'pending', $statuses );
		$this->assertArrayHasKey( 'draft', $statuses );
		$this->assertArrayHasKey( 'future', $statuses );
		$this->assertArrayHasKey( 'private', $statuses );

		$this->assertSame( 15, $statuses['all'] );
		$this->assertSame( 7, $statuses['publish'] );
		$this->assertSame( 2, $statuses['pending'] );
		$this->assertSame( 3, $statuses['future'] );
		$this->assertSame( 3, $statuses['draft'] );
		$this->assertSame( 0, $statuses['private'] );

		$this->assertSame( '3', $headers['X-WP-Total'] );
		$this->assertSame( '1', $headers['X-WP-TotalPages'] );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_no_permission(): void {
		$this->controller->register_routes();

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$response = rest_get_server()->dispatch( $request );
		$headers  = $response->get_headers();

		$this->assertFalse( $response->is_error() );
		$this->assertArrayNotHasKey( 'X-WP-TotalByStatus', $headers );
	}

	/**
	 * @covers ::get_items
	 * @covers ::add_response_headers
	 */
	public function test_get_items_contributor(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$contributor_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );
		$headers  = $response->get_headers();

		$this->assertFalse( $response->is_error() );
		$this->assertArrayHasKey( 'X-WP-TotalByStatus', $headers );
		$this->assertArrayHasKey( 'X-WP-Total', $headers );
		$this->assertArrayHasKey( 'X-WP-TotalPages', $headers );

		$statuses = json_decode( $headers['X-WP-TotalByStatus'], true );

		$this->assertArrayHasKey( 'all', $statuses );
		$this->assertArrayHasKey( 'publish', $statuses );
		$this->assertArrayHasKey( 'pending', $statuses );
		$this->assertArrayHasKey( 'draft', $statuses );
		$this->assertArrayHasKey( 'future', $statuses );
		$this->assertArrayNotHasKey( 'private', $statuses );

		$this->assertSame( 7, $statuses['all'] );
		$this->assertSame( 7, $statuses['publish'] );
		$this->assertSame( 0, $statuses['future'] );
		$this->assertSame( 0, $statuses['draft'] );

		$this->assertSame( '7', $headers['X-WP-Total'] );
		$this->assertSame( '1', $headers['X-WP-TotalPages'] );
	}

	/**
	 * @covers ::get_items
	 * @covers ::add_response_headers
	 */
	public function test_get_items_author(): void {
		wp_set_current_user( self::$author_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story' );
		$request->set_param( 'context', 'edit' );
		$response = rest_get_server()->dispatch( $request );
		$headers  = $response->get_headers();

		$this->assertFalse( $response->is_error() );
		$this->assertArrayHasKey( 'X-WP-TotalByStatus', $headers );
		$this->assertArrayHasKey( 'X-WP-Total', $headers );
		$this->assertArrayHasKey( 'X-WP-TotalPages', $headers );

		$statuses = json_decode( $headers['X-WP-TotalByStatus'], true );

		$this->assertArrayHasKey( 'all', $statuses );
		$this->assertArrayHasKey( 'publish', $statuses );
		$this->assertArrayHasKey( 'draft', $statuses );
		$this->assertArrayHasKey( 'future', $statuses );
		$this->assertArrayHasKey( 'private', $statuses );

		$this->assertSame( 10, $statuses['all'] );
		$this->assertSame( 7, $statuses['publish'] );
		$this->assertSame( 0, $statuses['pending'] );
		$this->assertSame( 0, $statuses['future'] );
		$this->assertSame( 0, $statuses['private'] );
		$this->assertSame( 3, $statuses['draft'] );

		$this->assertSame( '7', $headers['X-WP-Total'] );
		$this->assertSame( '1', $headers['X-WP-TotalPages'] );
	}
	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 */
	public function test_get_item(): void {
		$this->controller->register_routes();

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
		$this->assertStringContainsString( (string) $story, $data['embed_post_link'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_item_for_response
	 */
	public function test_get_item_no_user(): void {
		$this->controller->register_routes();

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
	public function test_get_item_future(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );
		$story   = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
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
	public function test_get_item_lock(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );

		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);
		$new_lock = ( time() - 100 ) . ':' . self::$user_id;
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
	public function test_get_available_actions(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );

		$story    = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);
		$new_lock = ( time() - 100 ) . ':' . self::$user_id;
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
	public function test_get_add_taxonomy_links(): void {
		$this->controller->register_routes();

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
			$this->assertStringContainsString( 'web-stories/v1', $taxonomy['href'] );
		}
	}

	/**
	 * @covers ::get_items
	 * @covers ::add_response_headers
	 */
	public function test_get_items_format(): void {
		$this->controller->register_routes();

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

		$this->assertSame( '3', $data['headers']['X-WP-Total'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::get_story_poster
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::prepare_links
	 */
	public function test_get_item_with_no_poster(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );

		$story = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayNotHasKey( 'story_poster', $data );
	}

	/**
	 * @covers ::get_item
	 * @covers ::get_story_poster
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::prepare_links
	 */
	public function test_get_item_with_featured_image(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );

		$story = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);

		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		set_post_thumbnail( $story, $attachment_id );

		$attachment_src = wp_get_attachment_image_src( $attachment_id, Image_Sizes::POSTER_PORTRAIT_IMAGE_SIZE );

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'story_poster', $data );
		$this->assertEqualSetsWithIndex(
			[
				'id'         => $attachment_id,
				'url'        => $attachment_src[0],
				'height'     => $attachment_src[1],
				'width'      => $attachment_src[2],
				'needsProxy' => false,
			],
			$data['story_poster']
		);
	}

	/**
	 * @covers ::get_item
	 * @covers ::get_story_poster
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::prepare_links
	 */
	public function test_get_item_with_hotlinked_poster(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );

		$story = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);

		add_post_meta(
			$story,
			\Google\Web_Stories\Story_Post_Type::POSTER_META_KEY,
			[
				'url'        => 'http://www.example.com/image.png',
				'height'     => 1000,
				'width'      => 1000,
				'needsProxy' => false,
			]
		);

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'story_poster', $data );
		$this->assertEqualSetsWithIndex(
			[
				'url'        => 'http://www.example.com/image.png',
				'height'     => 1000,
				'width'      => 1000,
				'needsProxy' => false,
			],
			$data['story_poster']
		);
	}

	/**
	 * @covers ::get_item
	 * @covers ::get_story_poster
	 * @covers \Google\Web_Stories\REST_API\Stories_Base_Controller::prepare_links
	 */
	public function test_get_item_with_featured_image_and_hotlinked_poster(): void {
		$this->controller->register_routes();

		wp_set_current_user( self::$user_id );

		$story = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'future',
				'post_date'   => ( new DateTime( '+1day' ) )->format( 'Y-m-d H:i:s' ),
				'post_author' => self::$user_id,
			]
		);

		$attachment_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		set_post_thumbnail( $story, $attachment_id );

		$attachment_src = wp_get_attachment_image_src( $attachment_id, Image_Sizes::POSTER_PORTRAIT_IMAGE_SIZE );

		add_post_meta(
			$story,
			\Google\Web_Stories\Story_Post_Type::POSTER_META_KEY,
			[
				'url'        => 'http://www.example.com/image.png',
				'height'     => 1000,
				'width'      => 1000,
				'needsProxy' => false,
			]
		);

		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/web-story/' . $story );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'story_poster', $data );
		$this->assertEqualSetsWithIndex(
			[
				'id'         => $attachment_id,
				'url'        => $attachment_src[0],
				'height'     => $attachment_src[1],
				'width'      => $attachment_src[2],
				'needsProxy' => false,
			],
			$data['story_poster']
		);
	}


	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema(): void {
		$this->controller->register_routes();

		$data = $this->controller->get_item_schema();

		$this->assertArrayHasKey( 'properties', $data );
		$this->assertArrayHasKey( 'story_data', $data['properties'] );
	}

	/**
	 * @covers ::filter_posts_clauses
	 */
	public function test_filter_posts_by_author_display_names(): void {
		$this->controller->register_routes();

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
	 * @covers ::get_attached_post_ids
	 */
	public function test_get_attached_post_ids(): void {
		$original_id = self::factory()->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_excerpt' => 'Example excerpt',
				'post_author'  => self::$user_id,
				'post_status'  => 'private',
			]
		);

		$attachment_id     = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		$publisher_logo_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		set_post_thumbnail( $original_id, $attachment_id );
		update_post_meta( $original_id, \Google\Web_Stories\Story_Post_Type::PUBLISHER_LOGO_META_KEY, $publisher_logo_id );

		$posts  = [ get_post( $original_id ) ];
		$result = $this->call_private_method( $this->controller, 'get_attached_post_ids', [ $posts ] );
		$this->assertEqualSets( [ $attachment_id, $publisher_logo_id ], $result );
	}

	/**
	 * @covers ::get_attached_post_ids
	 */
	public function test_get_attached_post_ids_empty(): void {
		$posts  = [];
		$result = $this->call_private_method( $this->controller, 'get_attached_post_ids', [ $posts ] );
		$this->assertEqualSets( [], $result );
	}


	/**
	 * @covers ::get_attached_user_ids
	 */
	public function test_get_attached_user_ids(): void {
		$original_id = self::factory()->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Example title',
				'post_excerpt' => 'Example excerpt',
				'post_author'  => self::$user_id,
				'post_status'  => 'private',
			]
		);

		$posts  = [ get_post( $original_id ) ];
		$result = $this->call_private_method( $this->controller, 'get_attached_user_ids', [ $posts ] );
		$this->assertEqualSets( [ self::$user_id ], $result );
	}

	/**
	 * @covers ::get_attached_user_ids
	 */
	public function test_get_attached_user_ids_empty(): void {
		$posts  = [];
		$result = $this->call_private_method( $this->controller, 'get_attached_user_ids', [ $posts ] );
		$this->assertEqualSets( [], $result );
	}

	/**
	 * @covers ::filter_posts_clauses
	 */
	public function test_filter_posts_clauses_irrelevant_query(): void {
		$this->controller->register_routes();

		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$initial_clauses = [
			'join'    => '',
			'orderby' => '',
		];

		$query = new \WP_Query();
		$query->set( 'post_type', 'post' );
		$query->set( 'orderby', 'story_author' );

		$orderby = $controller->filter_posts_clauses( $initial_clauses, $query );
		$this->assertSame( $orderby, $initial_clauses );

		$query = new \WP_Query();
		$query->set( 'post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$query->set( 'orderby', 'author' );

		$orderby = $controller->filter_posts_clauses( $initial_clauses, $query );
		$this->assertSame( $orderby, $initial_clauses );
	}

	/**
	 * @covers ::get_collection_params
	 */
	public function test_get_collection_params(): void {
		$this->controller->register_routes();

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
	public function test_create_item_as_author_should_not_strip_markup(): void {
		$this->controller->register_routes();

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
		$this->assertArrayHasKey( 'content', $new_data );
		$this->assertSame( $unsanitized_content, $new_data['content']['raw'] );
		$this->assertSame( $unsanitized_story_data, $new_data['story_data'] );
	}

	/**
	 * @covers ::create_item
	 * @covers ::get_registered_meta
	 */
	public function test_create_item_duplicate_id(): void {
		$this->controller->register_routes();

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

		$attachment_id     = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		$publisher_logo_id = self::factory()->attachment->create_upload_object( WEB_STORIES_TEST_DATA_DIR . '/attachment.jpg', 0 );
		$custom_poster     = [
			'url'        => 'http://www.example.com/image.png',
			'width'      => 1000,
			'height'     => 1000,
			'needsProxy' => false,
		];
		set_post_thumbnail( $original_id, $attachment_id );
		update_post_meta( $original_id, \Google\Web_Stories\Story_Post_Type::PUBLISHER_LOGO_META_KEY, $publisher_logo_id );
		update_post_meta( $original_id, \Google\Web_Stories\Story_Post_Type::POSTER_META_KEY, $custom_poster );

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
		$this->assertArrayHasKey( 'meta', $new_data );
		$this->assertArrayHasKey( \Google\Web_Stories\Story_Post_Type::PUBLISHER_LOGO_META_KEY, $new_data['meta'] );
		$this->assertArrayHasKey( \Google\Web_Stories\Story_Post_Type::POSTER_META_KEY, $new_data['meta'] );

		$this->assertSame( 'Example title (Copy)', $new_data['title']['raw'] );
		$this->assertSame( 'Example excerpt', $new_data['excerpt']['raw'] );
		$this->assertSame( $attachment_id, $new_data['featured_media'] );
		$this->assertSame( $publisher_logo_id, $new_data['meta'][ \Google\Web_Stories\Story_Post_Type::PUBLISHER_LOGO_META_KEY ] );
		$this->assertSame( $custom_poster, $new_data['meta'][ \Google\Web_Stories\Story_Post_Type::POSTER_META_KEY ] );
		$this->assertSame( [ 'pages' => [] ], $new_data['story_data'] );
	}

	/**
	 * @covers ::create_item
	 * @covers ::get_registered_meta
	 */
	public function test_create_item_duplicate_id_invalid_meta(): void {
		$this->controller->register_routes();

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


		update_post_meta( $original_id, \Google\Web_Stories\Story_Post_Type::PUBLISHER_LOGO_META_KEY, 'wibble' );
		update_post_meta( $original_id, \Google\Web_Stories\Story_Post_Type::POSTER_META_KEY, -1 );

		wp_set_current_user( self::$user_id );
		$this->kses_int();

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/web-story' );
		$request->set_body_params(
			[
				'original_id' => $original_id,
			]
		);

		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_invalid_type', $response, 400 );
	}

	/**
	 * @covers ::create_item
	 */
	public function test_create_item_duplicate_id_invalid_id(): void {
		$this->controller->register_routes();

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
	public function test_create_item_duplicate_id_permission(): void {
		$this->controller->register_routes();

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
	public function test_update_item_as_author_should_not_strip_markup(): void {
		$this->controller->register_routes();

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
		$this->assertSame( $unsanitized_content, $new_data['content']['raw'] );
		$this->assertSame( $unsanitized_story_data, $new_data['story_data'] );
	}
}
