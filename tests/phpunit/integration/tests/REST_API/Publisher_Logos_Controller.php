<?php

namespace Google\Web_Stories\Tests\Integration\REST_API;

use Google\Web_Stories\Settings;
use Google\Web_Stories\Tests\Integration\Test_REST_TestCase;
use Spy_REST_Server;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class Publisher_Logos_Controller
 *
 * @package Google\Web_Stories\Tests\REST_API
 *
 * @coversDefaultClass \Google\Web_Stories\REST_API\Publisher_Logos_Controller
 */
class Publisher_Logos_Controller extends Test_REST_TestCase {
	/**
	 * @var WP_REST_Server
	 */
	protected $server;

	/**
	 * @var int
	 */
	protected static $admin;

	/**
	 * @var int
	 */
	protected static $editor;

	/**
	 * @var int
	 */
	protected static $attachment_id_1;

	/**
	 * @var int
	 */
	protected static $attachment_id_2;

	/**
	 * Count of the number of requests attempted.
	 *
	 * @var int
	 */
	protected $request_count = 0;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		self::$editor = $factory->user->create(
			[
				'role'       => 'editor',
				'user_email' => 'editor@example.com',
			]
		);

		self::$attachment_id_1 = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		self::$attachment_id_2 = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$admin );
		self::delete_user( self::$editor );
	}

	public function setUp() {
		parent::setUp();

		/** @var WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->add_caps_to_roles();
	}

	public function tearDown() {
		/** @var WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$this->remove_caps_from_roles();

		delete_option( Settings::SETTING_NAME_PUBLISHER_LOGOS );
		delete_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		parent::tearDown();
	}

	/**
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/web-stories/v1/publisher-logos', $routes );

		$route = $routes['/web-stories/v1/publisher-logos'];
		$this->assertCount( 2, $route );
		$this->assertArrayHasKey( 'callback', $route[0] );
		$this->assertArrayHasKey( 'permission_callback', $route[0] );
		$this->assertArrayHasKey( 'methods', $route[0] );
		$this->assertArrayHasKey( 'args', $route[0] );
		$this->assertArrayHasKey( 'callback', $route[1] );
		$this->assertArrayHasKey( 'permission_callback', $route[1] );
		$this->assertArrayHasKey( 'methods', $route[1] );
		$this->assertArrayHasKey( 'args', $route[1] );
	}

	/**
	 * @covers ::get_item_schema
	 */
	public function test_get_item_schema() {
		$controller = new \Google\Web_Stories\REST_API\Publisher_Logos_Controller();
		$data       = $controller->get_item_schema();

		$properties = $data['properties'];
		$this->assertArrayHasKey( 'id', $properties );
		$this->assertArrayHasKey( 'title', $properties );
		$this->assertArrayHasKey( 'url', $properties );
		$this->assertArrayHasKey( 'active', $properties );
	}

	/**
	 * @covers ::permissions_check
	 */
	public function test_get_items_no_permission() {
		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/publisher-logos' );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	/**
	 * @covers ::get_items
	 */
	public function test_get_items_no_items() {
		wp_set_current_user( self::$admin );

		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/publisher-logos' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertSame( [], $data );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::get_items
	 */
	public function test_get_items_editor() {
		wp_set_current_user( self::$editor );

		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/publisher-logos' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertSame( [], $data );
	}

	/**
	 * @covers ::prepare_item_for_response
	 * @covers ::get_items
	 */
	public function test_get_items() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_2, 0, -1, PHP_INT_MAX, self::$attachment_id_1 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request  = new WP_REST_Request( WP_REST_Server::READABLE, '/web-stories/v1/publisher-logos' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertCount( 2, $data );
		$this->assertArraySubset(
			[
				'id'     => self::$attachment_id_1,
				'title'  => get_the_title( self::$attachment_id_1 ),
				'url'    => wp_get_attachment_url( self::$attachment_id_1 ),
				'active' => true,
			],
			$data[0]
		);
		$this->assertArraySubset(
			[
				'id'     => self::$attachment_id_2,
				'title'  => get_the_title( self::$attachment_id_2 ),
				'url'    => wp_get_attachment_url( self::$attachment_id_2 ),
				'active' => false,
			],
			$data[1]
		);
	}

	/**
	 * @covers ::permissions_check
	 */
	public function test_create_item_no_permission() {
		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos' );
		$request->set_body_params(
			[
				'id' => self::$attachment_id_1,
			]
		);
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::create_item
	 */
	public function test_create_item_editor() {
		wp_set_current_user( self::$editor );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos' );
		$request->set_body_params(
			[
				'id' => self::$attachment_id_1,
			]
		);
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'id'     => self::$attachment_id_1,
				'title'  => get_the_title( self::$attachment_id_1 ),
				'url'    => wp_get_attachment_url( self::$attachment_id_1 ),
				'active' => true,
			],
			$data
		);
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::create_item
	 */
	public function test_create_item() {
		wp_set_current_user( self::$admin );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos' );
		$request->set_body_params(
			[
				'id' => self::$attachment_id_1,
			]
		);
		$response = rest_get_server()->dispatch( $request );

		$publisher_logos          = get_option( Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo_id = (int) get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$data = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'id'     => self::$attachment_id_1,
				'title'  => get_the_title( self::$attachment_id_1 ),
				'url'    => wp_get_attachment_url( self::$attachment_id_1 ),
				'active' => true,
			],
			$data
		);
		$this->assertEqualSets( [ self::$attachment_id_1 ], $publisher_logos );
		$this->assertSame( self::$attachment_id_1, $active_publisher_logo_id );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::create_item
	 */
	public function test_create_item_existing_ones() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos' );
		$request->set_body_params(
			[
				'id' => self::$attachment_id_2,
			]
		);
		$response = rest_get_server()->dispatch( $request );

		$publisher_logos          = get_option( Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo_id = (int) get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$data = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'id'     => self::$attachment_id_2,
				'title'  => get_the_title( self::$attachment_id_2 ),
				'url'    => wp_get_attachment_url( self::$attachment_id_2 ),
				'active' => false,
			],
			$data
		);
		$this->assertEqualSets( [ self::$attachment_id_1, self::$attachment_id_2 ], $publisher_logos );
		$this->assertSame( self::$attachment_id_1, $active_publisher_logo_id );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::create_item
	 */
	public function test_create_item_updates_incorrect_active_publisher_logo() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, 0 );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos' );
		$request->set_body_params(
			[
				'id' => self::$attachment_id_2,
			]
		);
		$response = rest_get_server()->dispatch( $request );

		$publisher_logos          = get_option( Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo_id = (int) get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$data = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'id'     => self::$attachment_id_2,
				'title'  => get_the_title( self::$attachment_id_2 ),
				'url'    => wp_get_attachment_url( self::$attachment_id_2 ),
				'active' => true,
			],
			$data
		);
		$this->assertEqualSets( [ self::$attachment_id_1, self::$attachment_id_2 ], $publisher_logos );
		$this->assertSame( self::$attachment_id_2, $active_publisher_logo_id );
	}

	/**
	 * @covers ::permissions_check
	 */
	public function test_delete_item_no_permission() {
		$request  = new WP_REST_Request( WP_REST_Server::DELETABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_1 );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::delete_item
	 */
	public function test_delete_item_editor() {
		wp_set_current_user( self::$editor );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1, self::$attachment_id_2 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request  = new WP_REST_Request( WP_REST_Server::DELETABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_2 );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'deleted'  => true,
				'previous' => [
					'id'     => self::$attachment_id_2,
					'title'  => get_the_title( self::$attachment_id_2 ),
					'url'    => wp_get_attachment_url( self::$attachment_id_2 ),
					'active' => false,
				],
			],
			$data
		);
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::delete_item
	 */
	public function test_delete_item() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1, self::$attachment_id_2 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request  = new WP_REST_Request( WP_REST_Server::DELETABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_1 );
		$response = rest_get_server()->dispatch( $request );

		$publisher_logos          = get_option( Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo_id = (int) get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$data = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'deleted'  => true,
				'previous' => [
					'id'     => self::$attachment_id_1,
					'title'  => get_the_title( self::$attachment_id_1 ),
					'url'    => wp_get_attachment_url( self::$attachment_id_1 ),
					'active' => true,
				],
			],
			$data
		);
		$this->assertEqualSets( [ self::$attachment_id_2 ], $publisher_logos );
		$this->assertSame( self::$attachment_id_2, $active_publisher_logo_id );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::delete_item
	 */
	public function test_delete_item_incorrect_active_publisher_logo() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1, self::$attachment_id_2 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, 0 );

		$request  = new WP_REST_Request( WP_REST_Server::DELETABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_1 );
		$response = rest_get_server()->dispatch( $request );

		$publisher_logos          = get_option( Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo_id = (int) get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$data = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'deleted'  => true,
				'previous' => [
					'id'     => self::$attachment_id_1,
					'title'  => get_the_title( self::$attachment_id_1 ),
					'url'    => wp_get_attachment_url( self::$attachment_id_1 ),
					'active' => false,
				],
			],
			$data
		);
		$this->assertEqualSets( [ self::$attachment_id_2 ], $publisher_logos );
		$this->assertSame( self::$attachment_id_2, $active_publisher_logo_id );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::delete_item
	 */
	public function test_delete_item_non_existent_logo() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request  = new WP_REST_Request( WP_REST_Server::DELETABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_2 );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_invalid_id', $response, 400 );
	}

	/**
	 * @covers ::permissions_check
	 */
	public function test_update_item_no_permission() {
		$request  = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_1 );
		$response = rest_get_server()->dispatch( $request );
		$this->assertErrorResponse( 'rest_forbidden', $response, 401 );
	}

	/**
	 * @covers ::permissions_check
	 * @covers ::update_item
	 */
	public function test_update_item_editor() {
		wp_set_current_user( self::$editor );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1, self::$attachment_id_2 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_2 );
		$request->set_body_params(
			[
				'active' => true,
			]
		);
		$response = rest_get_server()->dispatch( $request );

		$active_publisher_logo_id = (int) get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$this->assertErrorResponse( 'rest_forbidden', $response, 403 );
		$this->assertSame( self::$attachment_id_1, $active_publisher_logo_id );
	}

	/**
	 * @covers ::update_item_permissions_check
	 * @covers ::update_item
	 */
	public function test_update_item() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1, self::$attachment_id_2 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_2 );
		$request->set_body_params(
			[
				'active' => true,
			]
		);
		$response = rest_get_server()->dispatch( $request );

		$active_publisher_logo_id = (int) get_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$data = $response->get_data();
		$this->assertEqualSetsWithIndex(
			[
				'id'     => self::$attachment_id_2,
				'title'  => get_the_title( self::$attachment_id_2 ),
				'url'    => wp_get_attachment_url( self::$attachment_id_2 ),
				'active' => true,
			],
			$data
		);
		$this->assertSame( self::$attachment_id_2, $active_publisher_logo_id );
	}

	/**
	 * @covers ::update_item_permissions_check
	 * @covers ::update_item
	 */
	public function test_update_item_non_existent_logo() {
		wp_set_current_user( self::$admin );

		update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, [ self::$attachment_id_1 ] );
		update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, self::$attachment_id_1 );

		$request  = new WP_REST_Request( WP_REST_Server::CREATABLE, '/web-stories/v1/publisher-logos/' . self::$attachment_id_2 );
		$response = rest_get_server()->dispatch( $request );

		$this->assertErrorResponse( 'rest_invalid_id', $response, 400 );
	}
}
