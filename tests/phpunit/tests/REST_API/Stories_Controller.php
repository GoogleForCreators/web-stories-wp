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

namespace Google\Web_Stories\Tests\REST_API;

use Google\Web_Stories\Tests\Story_Post_Type;
use Spy_REST_Server;
use WP_REST_Request;

class Stories_Controller extends \WP_Test_REST_TestCase {
	protected $server;

	protected static $user_id;

	protected static $author_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		self::$author_id = $factory->user->create(
			[
				'role' => 'author',
			]
		);

		$post_type = \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG;

		$factory->post->create_many(
			7,
			[
				'post_status' => 'publish',
				'post_author' => self::$user_id,
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
	}

	public function setUp() {
		parent::setUp();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );
	}

	public function tearDown() {
		parent::tearDown();

		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;
	}

	public function test_register_routes() {
		$routes = rest_get_server()->get_routes();

		$this->assertArrayHasKey( '/wp/v2/web-story', $routes );
		$this->assertCount( 2, $routes['/wp/v2/web-story'] );
	}

	public function test_get_items() {
		wp_set_current_user( self::$user_id );
		$request = new WP_REST_Request( 'GET', '/wp/v2/web-story' );
		$request->set_param( 'author', self::$user_id );
		$request->set_param( 'status', [ 'draft' ] );
		$request->set_param( 'context', 'edit' );
		$response       = rest_get_server()->dispatch( $request );
		$headers        = $response->get_headers();
		$statues        = $headers['X-WP-TotalByStatus'];
		$statues_decode = json_decode( $statues, true );

		$this->assertArrayHasKey( 'all', $statues_decode );
		$this->assertArrayHasKey( 'publish', $statues_decode );
		$this->assertArrayHasKey( 'draft', $statues_decode );

		$this->assertEquals( 10, $statues_decode['all'] );
		$this->assertEquals( 7, $statues_decode['publish'] );
		$this->assertEquals( 3, $statues_decode['draft'] );

		$this->assertEquals( 3, $headers['X-WP-Total'] );
	}

	public function test_get_item_schema() {
		$request  = new WP_REST_Request( 'OPTIONS', '/wp/v2/web-story' );
		$response = rest_get_server()->dispatch( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );

		$properties = $data['schema']['properties'];
		$this->assertArrayHasKey( 'story_data', $properties );
		$this->assertArrayHasKey( 'featured_media_url', $properties );
	}

	public function test_filter_posts_orderby() {
		wp_set_current_user( self::$user_id );
		do_action( 'init' );
		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$initial_orderby = 'foo bar';

		$query = new \WP_Query();
		$query->set( 'post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$query->set( 'orderby', 'story_author' );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );

		$this->assertEquals( $orderby, "wp_posts.post_author = '" . self::$user_id . "' DESC, wp_posts.post_author DESC, wp_posts.post_modified DESC" );

		// Registered during init.
		unregister_block_type( 'web-stories/embed' );
	}

	public function test_filter_posts_orderby_irrelevant_query() {
		do_action( 'init' );
		$controller = new \Google\Web_Stories\REST_API\Stories_Controller( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$initial_orderby = 'foo bar';

		$query = new \WP_Query();
		$query->set( 'post_type', 'foo' );
		$query->set( 'orderby', 'story_author' );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );
		$this->assertEquals( $orderby, $initial_orderby );

		$query->set( 'post_type', \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$query->set( 'orderby', 'author' );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );
		$this->assertEquals( $orderby, $initial_orderby );

		$query->set( 'orderby', 'story_author' );
		wp_set_current_user( 0 );

		$orderby = $controller->filter_posts_orderby( $initial_orderby, $query );
		$this->assertEquals( $orderby, $initial_orderby );

		// Registered during init.
		unregister_block_type( 'web-stories/embed' );
	}

	public function test_create_item_as_author_should_not_strip_markup() {
		wp_set_current_user( self::$author_id );

		$unsanitized_content    = <<<HTML
<html amp="" lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" /><script async="" src="https://cdn.ampproject.org/v0.js"></script><script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script><link href="https://fonts.googleapis.com/css2?display=swap&amp;family=Roboto" rel="stylesheet" /><style amp-boilerplate="">body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript><style amp-custom="">
              amp-story-grid-layer {
                overflow: visible;
              }

              .page-fullbleed-area {
                position: absolute;
                overflow: hidden;
                width: 100%;
                left: 0;
                height: calc(1.1851851851851851 * 100%);
                top: calc((1 - 1.1851851851851851) * 100% / 2);
              }

              .page-safe-area {
                overflow: visible;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: calc(0.84375 * 100%);
                margin: auto 0;
              }

              .wrapper {
                position: absolute;
                overflow: hidden;
              }

              .fill {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0;
              }
              </style><meta name="web-stories-replace-head-start" /><link rel="canonical" href="https://web-stories.local/?post_type=web-story&amp;p=1052" /><meta name="web-stories-replace-head-end" /></head><body><amp-story standalone="standalone" publisher="Web Stories" publisher-logo-src="https://web-stories.local/wp-content/plugins/web-stories-wp/assets/images/fallback-wordpress-publisher-logo.png" title="Auto Draft" poster-portrait-src="https://web-stories.local/wp-content/plugins/web-stories-wp/assets/images/fallback-poster.jpg"><amp-story-page id="a3f18c09-3f10-43c4-9446-794f0541ea1e" auto-advance-after="7s"><amp-story-grid-layer template="vertical" aspect-ratio="440:660"><div class="page-fullbleed-area" style="background-color:#fff"><div class="page-safe-area"><div style="left:0%;top:-9.25926%;width:100%;height:118.51852%;opacity:1" id="el-d58c2be2-f8a0-4e00-b21a-ddd32d1ac04b" class="wrapper"><div class="fill"></div></div></div></div></amp-story-grid-layer><amp-story-grid-layer template="vertical" aspect-ratio="440:660"><div class="page-fullbleed-area"><div class="page-safe-area"><div style="left:16.59091%;top:20.90909%;width:36.36364%;height:2.72727%;opacity:1" id="el-e781bc30-4ebe-416f-bf1d-b509dc3ef6ce" class="wrapper"><p class="fill" style="white-space:pre-wrap;margin:0;font-family:'Roboto','Helvetica Neue','Helvetica',sans-serif;font-size:0.212121em;line-height:1.3;text-align:initial;padding:0% 0%;color:#000000"><span style="font-weight: 700">Fill in some text</span></p></div></div></div></amp-story-grid-layer></amp-story-page></amp-story></body></html>
HTML;
		$unsanitized_story_data = json_decode( '{"version":21,"pages":[{"elements":[{"opacity":100,"flip":{"vertical":false,"horizontal":false},"rotationAngle":0,"lockAspectRatio":true,"backgroundColor":{"color":{"r":255,"g":255,"b":255}},"x":1,"y":1,"width":1,"height":1,"mask":{"type":"rectangle"},"isBackground":true,"isDefaultBackground":true,"type":"shape","id":"d58c2be2-f8a0-4e00-b21a-ddd32d1ac04b"},{"opacity":100,"flip":{"vertical":false,"horizontal":false},"rotationAngle":0,"lockAspectRatio":true,"backgroundTextMode":"NONE","font":{"family":"Roboto","weights":[100,300,400,500,700,900],"styles":["italic","regular"],"variants":[[0,100],[1,100],[0,300],[1,300],[0,400],[1,400],[0,500],[1,500],[0,700],[1,700],[0,900],[1,900]],"fallbacks":["Helvetica Neue","Helvetica","sans-serif"],"service":"fonts.google.com"},"fontSize":14,"backgroundColor":{"color":{"r":196,"g":196,"b":196}},"lineHeight":1.3,"textAlign":"initial","padding":{"vertical":0,"horizontal":0,"locked":true},"type":"text","id":"e781bc30-4ebe-416f-bf1d-b509dc3ef6ce","content":"<span style=\"font-weight: 700\">Fill in some text<\/span>","x":73,"y":138,"width":160,"height":18,"scale":100,"focalX":50,"focalY":50}],"backgroundColor":{"color":{"r":255,"g":255,"b":255}},"type":"page","id":"a3f18c09-3f10-43c4-9446-794f0541ea1e"}],"autoAdvance":true,"defaultPageDuration":7}', true );

		$request = new WP_REST_Request( 'POST', '/wp/v2/web-story' );
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

	public function test_update_item_as_author_should_not_strip_markup() {
		wp_set_current_user( self::$author_id );

		$unsanitized_content    = <<<HTML
<html amp="" lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" /><script async="" src="https://cdn.ampproject.org/v0.js"></script><script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script><link href="https://fonts.googleapis.com/css2?display=swap&amp;family=Roboto" rel="stylesheet" /><style amp-boilerplate="">body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript><style amp-custom="">
              amp-story-grid-layer {
                overflow: visible;
              }

              .page-fullbleed-area {
                position: absolute;
                overflow: hidden;
                width: 100%;
                left: 0;
                height: calc(1.1851851851851851 * 100%);
                top: calc((1 - 1.1851851851851851) * 100% / 2);
              }

              .page-safe-area {
                overflow: visible;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: calc(0.84375 * 100%);
                margin: auto 0;
              }

              .wrapper {
                position: absolute;
                overflow: hidden;
              }

              .fill {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0;
              }
              </style><meta name="web-stories-replace-head-start" /><link rel="canonical" href="https://web-stories.local/?post_type=web-story&amp;p=1052" /><meta name="web-stories-replace-head-end" /></head><body><amp-story standalone="standalone" publisher="Web Stories" publisher-logo-src="https://web-stories.local/wp-content/plugins/web-stories-wp/assets/images/fallback-wordpress-publisher-logo.png" title="Auto Draft" poster-portrait-src="https://web-stories.local/wp-content/plugins/web-stories-wp/assets/images/fallback-poster.jpg"><amp-story-page id="a3f18c09-3f10-43c4-9446-794f0541ea1e" auto-advance-after="7s"><amp-story-grid-layer template="vertical" aspect-ratio="440:660"><div class="page-fullbleed-area" style="background-color:#fff"><div class="page-safe-area"><div style="left:0%;top:-9.25926%;width:100%;height:118.51852%;opacity:1" id="el-d58c2be2-f8a0-4e00-b21a-ddd32d1ac04b" class="wrapper"><div class="fill"></div></div></div></div></amp-story-grid-layer><amp-story-grid-layer template="vertical" aspect-ratio="440:660"><div class="page-fullbleed-area"><div class="page-safe-area"><div style="left:16.59091%;top:20.90909%;width:36.36364%;height:2.72727%;opacity:1" id="el-e781bc30-4ebe-416f-bf1d-b509dc3ef6ce" class="wrapper"><p class="fill" style="white-space:pre-wrap;margin:0;font-family:'Roboto','Helvetica Neue','Helvetica',sans-serif;font-size:0.212121em;line-height:1.3;text-align:initial;padding:0% 0%;color:#000000"><span style="font-weight: 700">Fill in some text</span></p></div></div></div></amp-story-grid-layer></amp-story-page></amp-story></body></html>
HTML;
		$unsanitized_story_data = json_decode( '{"version":21,"pages":[{"elements":[{"opacity":100,"flip":{"vertical":false,"horizontal":false},"rotationAngle":0,"lockAspectRatio":true,"backgroundColor":{"color":{"r":255,"g":255,"b":255}},"x":1,"y":1,"width":1,"height":1,"mask":{"type":"rectangle"},"isBackground":true,"isDefaultBackground":true,"type":"shape","id":"d58c2be2-f8a0-4e00-b21a-ddd32d1ac04b"},{"opacity":100,"flip":{"vertical":false,"horizontal":false},"rotationAngle":0,"lockAspectRatio":true,"backgroundTextMode":"NONE","font":{"family":"Roboto","weights":[100,300,400,500,700,900],"styles":["italic","regular"],"variants":[[0,100],[1,100],[0,300],[1,300],[0,400],[1,400],[0,500],[1,500],[0,700],[1,700],[0,900],[1,900]],"fallbacks":["Helvetica Neue","Helvetica","sans-serif"],"service":"fonts.google.com"},"fontSize":14,"backgroundColor":{"color":{"r":196,"g":196,"b":196}},"lineHeight":1.3,"textAlign":"initial","padding":{"vertical":0,"horizontal":0,"locked":true},"type":"text","id":"e781bc30-4ebe-416f-bf1d-b509dc3ef6ce","content":"<span style=\"font-weight: 700\">Fill in some text<\/span>","x":73,"y":138,"width":160,"height":18,"scale":100,"focalX":50,"focalY":50}],"backgroundColor":{"color":{"r":255,"g":255,"b":255}},"type":"page","id":"a3f18c09-3f10-43c4-9446-794f0541ea1e"}],"autoAdvance":true,"defaultPageDuration":7}', true );

		$story = self::factory()->post->create(
			[
				'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
			]
		);

		$request = new WP_REST_Request( 'PUT', '/wp/v2/web-story/' . $story );
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
