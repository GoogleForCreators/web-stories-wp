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

use Google\Web_Stories\Tests\Integration\DependencyInjectedRestTestCase;
use Google\Web_Stories\Tests\Integration\Fixture\DummyTaxonomy;
use WP_REST_Request;

/**
 * Class Stories_Media_Controller
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Stories_Media_Controller
 */
class Stories_Media_Controller extends DependencyInjectedRestTestCase {
	/**
	 * @var int
	 */
	protected static $user_id;

	/**
	 * @var int
	 */
	protected static $poster_attachment_id;

	/**
	 * @var int
	 */
	protected static $mp4_attachment_id;

	/**
	 * @var int
	 */
	protected static $mov_attachment_id;

	/**
	 * @var int
	 */
	protected static $post_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\REST_API\Stories_Media_Controller
	 */
	private $controller;

	/**
	 * @param $factory
	 */
	public static function wpSetUpBeforeClass( $factory ): void {

		self::$user_id = $factory->user->create(
			[
				'role'         => 'administrator',
				'display_name' => 'Andrea Adams',
			]
		);

		self::$post_id = self::factory()->post->create(
			[
				'post_type'   => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_status' => 'publish',
				'post_author' => self::$user_id,
			]
		);

		$factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		self::$mp4_attachment_id = $factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => self::$post_id,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		self::$poster_attachment_id = $factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Poster',
			]
		);

		set_post_thumbnail( self::$mp4_attachment_id, self::$poster_attachment_id );

		self::$mov_attachment_id = $factory->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mov',
				'post_parent'    => self::$post_id,
				'post_mime_type' => 'video/mov',
				'post_title'     => 'Test Video Move',
			]
		);
	}

	public function set_up(): void {
		parent::set_up();

		$this->controller = $this->injector->make( \Google\Web_Stories\REST_API\Stories_Media_Controller::class );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_format(): void {
		$this->controller->register();

		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media' );
		$request->set_param( 'context', 'edit' );
		$request->set_param( '_web_stories_envelope', true );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		// Body of request.
		$this->assertArrayHasKey( 'headers', $data );
		$this->assertArrayHasKey( 'body', $data );
		$this->assertArrayHasKey( 'status', $data );
	}

	/**
	 * @covers ::get_items
	 * @covers ::prepare_items_query
	 */
	public function test_get_items_filter_mime(): void {
		$this->controller->register();

		wp_set_current_user( self::$user_id );
		$request  = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertCount( 2, $data );
		$mime_type = wp_list_pluck( $data, 'mime_type' );
		$this->assertNotContains( 'video/mov', $mime_type );
		$this->assertContains( 'image/jpeg', $mime_type );
		$this->assertContains( 'video/mp4', $mime_type );
	}

	/**
	 * @covers ::get_items
	 * @covers ::get_media_types
	 */
	public function test_get_items_filter_video(): void {
		$this->controller->register();

		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media' );
		$request->set_param( 'media_type', 'video' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertCount( 1, $data );
		$mime_type = wp_list_pluck( $data, 'mime_type' );
		$this->assertNotContains( 'video/mov', $mime_type );
		$this->assertContains( 'video/mp4', $mime_type );
	}

	/**
	 * @covers ::get_attached_post_ids
	 */
	public function test_get_attached_post_ids(): void {
		$posts  = [ get_post( self::$mov_attachment_id ), get_post( self::$mp4_attachment_id ) ];
		$result = $this->call_private_method( $this->controller, 'get_attached_post_ids', [ $posts ] );
		$this->assertContains( self::$post_id, $result );
		$this->assertContains( self::$poster_attachment_id, $result );
	}

	/**
	 * @covers ::create_item
	 * @covers ::process_post
	 */
	public function test_create_item(): void {
		$this->controller->register();

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		wp_set_current_user( self::$user_id );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/media' );
		$request->set_header( 'Content-Type', 'image/jpeg' );
		$request->set_header( 'Content-Disposition', 'attachment; filename=canola.jpg' );
		$request->set_param( 'title', 'My title is very cool' );
		$request->set_param( 'caption', 'This is a better caption.' );
		$request->set_param( 'description', 'Without a description, my attachment is descriptionless.' );
		$request->set_param( 'alt_text', 'Alt text is stored outside post schema.' );
		$request->set_param( 'post', $poster_attachment_id );

		$request->set_body( file_get_contents( DIR_TESTDATA . '/images/canola.jpg' ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 201, $response->get_status() );
		$this->assertEquals( 'image', $data['media_type'] );

		$this->assertArrayHasKey( 'post', $data );
		$this->assertSame( $data['post'], $poster_attachment_id );
	}

	/**
	 * @covers ::create_item
	 * @covers ::process_post
	 */
	public function test_create_item_with_revision(): void {
		$this->controller->register();

		$revision_id = self::factory()->post->create_object(
			[
				'post_type'   => 'revision',
				'post_author' => self::$user_id,
			]
		);
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/media' );
		$request->set_header( 'Content-Type', 'image/jpeg' );
		$request->set_header( 'Content-Disposition', 'attachment; filename=canola.jpg' );
		$request->set_param( 'title', 'My title is very cool' );
		$request->set_param( 'caption', 'This is a better caption.' );
		$request->set_param( 'description', 'Without a description, my attachment is descriptionless.' );
		$request->set_param( 'alt_text', 'Alt text is stored outside post schema.' );
		$request->set_param( 'post', $revision_id );

		$request->set_body( file_get_contents( DIR_TESTDATA . '/images/canola.jpg' ) );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_cannot_edit', $response, 403 );
	}


	/**
	 * @covers ::create_item
	 * @covers ::process_post
	 */
	public function test_create_item_migrate_data(): void {
		$this->controller->register();

		$original_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
				'post_content'   => 'Test content',
				'post_excerpt'   => 'Test excerpt',
			]
		);

		update_post_meta( $original_attachment_id, '_wp_attachment_image_alt', 'Test alt' );
		$color = '#0f0f0f';
		update_post_meta( $original_attachment_id, \Google\Web_Stories\Media\Base_Color::BASE_COLOR_POST_META_KEY, $color );

		wp_set_current_user( self::$user_id );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/media' );
		$request->set_header( 'Content-Type', 'image/jpeg' );
		$request->set_header( 'Content-Disposition', 'attachment; filename=canola.jpg' );
		$request->set_param( 'original_id', $original_attachment_id );
		$request->set_body( file_get_contents( DIR_TESTDATA . '/images/canola.jpg' ) );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertEquals( 201, $response->get_status() );
		$this->assertEquals( 'image', $data['media_type'] );

		$attachment = get_post( $data['id'] );

		$this->assertSame( 'Test Video', $data['title']['raw'] );
		$this->assertSame( 'Test Video', $attachment->post_title );
		$this->assertSame( 'Test excerpt', $data['caption']['raw'] );
		$this->assertSame( 'Test excerpt', $attachment->post_excerpt );
		$this->assertSame( 'Test content', $attachment->post_content );
		$this->assertSame( 'Test alt', $data['alt_text'] );
		$this->assertSame( 'Test alt', get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true ) );

		$this->assertArrayHasKey( 'meta', $data );
		$this->assertArrayHasKey( 'web_stories_base_color', $data['meta'] );
		$this->assertSame( $color, $data['meta']['web_stories_base_color'] );
	}

	/**
	 * @covers ::get_item
	 * @covers ::prepare_links
	 * @covers ::add_taxonomy_links
	 */
	public function test_get_add_taxonomy_links(): void {
		$this->controller->register();

		$object = new DummyTaxonomy();
		$this->set_private_property( $object, 'taxonomy_post_type', 'attachment' );
		$object->register_taxonomy();

		wp_set_current_user( self::$user_id );

		$original_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
				'post_content'   => 'Test content',
				'post_excerpt'   => 'Test excerpt',
			]
		);

		$request = new WP_REST_Request( \WP_REST_Server::READABLE, '/web-stories/v1/media/' . $original_attachment_id );
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
	 * @covers ::create_item
	 * @covers ::process_post
	 */
	public function test_create_item_migrate_data_invalid(): void {
		$this->controller->register();

		wp_set_current_user( self::$user_id );

		$request = new WP_REST_Request( \WP_REST_Server::CREATABLE, '/web-stories/v1/media' );
		$request->set_header( 'Content-Type', 'image/jpeg' );
		$request->set_header( 'Content-Disposition', 'attachment; filename=canola.jpg' );
		$request->set_param( 'title', 'My title is very cool' );
		$request->set_param( 'caption', 'This is a better caption.' );
		$request->set_param( 'description', 'Without a description, my attachment is descriptionless.' );
		$request->set_param( 'alt_text', 'Alt text is stored outside post schema.' );
		$request->set_param( 'original_id', 999 );

		$request->set_body( file_get_contents( DIR_TESTDATA . '/images/canola.jpg' ) );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_post_invalid_id', $response, 404 );
	}

	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema(): void {
		$this->controller->register();

		$request  = new WP_REST_Request( 'OPTIONS', '/web-stories/v1/media' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );

		$this->assertArrayHasKey( 'schema', $data );
		$this->assertArrayHasKey( 'properties', $data['schema'] );
		$properties = $data['schema']['properties'];
		$this->assertArrayNotHasKey( 'permalink_template', $properties );
		$this->assertArrayNotHasKey( 'generated_slug', $properties );
		$this->assertArrayHasKey( 'original_id', $properties );
	}
}
