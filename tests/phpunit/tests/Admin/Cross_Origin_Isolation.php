<?php
/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Admin;

use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Cross_Origin_Isolation
 */
class Cross_Origin_Isolation extends Test_Case {
	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);
	}

	public static function wpTearDownAfterClass() {
		self::delete_user( self::$admin_id );
	}

	public function setUp() {
		parent::setUp();

		$user_perferences = new \Google\Web_Stories\User_Preferences();
		$user_perferences->register();
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		wp_set_current_user( self::$admin_id );
		update_user_meta( self::$admin_id, \Google\Web_Stories\User_Preferences::MEDIA_OPTIMIZATION_META_KEY, true );

		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$coi = $this->get_coi_object();

		$coi->register();

		$this->assertSame( 10, has_action( 'admin_footer-post.php', [ $coi, 'admin_footer' ] ) );
		$this->assertSame( 10, has_action( 'admin_footer-post-new.php', [ $coi, 'admin_footer' ] ) );
		$this->assertSame( 10, has_action( 'load-post.php', [ $coi, 'admin_header' ] ) );
		$this->assertSame( 10, has_action( 'load-post-new.php', [ $coi, 'admin_header' ] ) );

		$this->assertSame( 10, has_filter( 'style_loader_tag', [ $coi, 'style_loader_tag' ] ) );
		$this->assertSame( 10, has_filter( 'script_loader_tag', [ $coi, 'script_loader_tag' ] ) );
		$this->assertSame( 10, has_filter( 'get_avatar', [ $coi, 'get_avatar' ] ) );

		unset( $GLOBALS['current_screen'] );
		delete_user_meta( self::$admin_id, \Google\Web_Stories\User_Preferences::MEDIA_OPTIMIZATION_META_KEY );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		wp_set_current_user( self::$admin_id );
		update_user_meta( self::$admin_id, \Google\Web_Stories\User_Preferences::MEDIA_OPTIMIZATION_META_KEY, true );
		$object = $this->get_coi_object();
		$result = $this->call_private_method( $object, 'is_needed' );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_user() {
		$object = $this->get_coi_object();
		$result = $this->call_private_method( $object, 'is_needed' );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed_opt_out() {
		wp_set_current_user( self::$admin_id );
		update_user_meta( self::$admin_id, \Google\Web_Stories\User_Preferences::MEDIA_OPTIMIZATION_META_KEY, false );
		$object = $this->get_coi_object();
		$result = $this->call_private_method( $object, 'is_needed' );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::add_attribute
	 * @covers ::starts_with
	 */
	public function test_add_attribute() {
		$object    = $this->get_coi_object();
		$html      = "<img src='http://www.google.com/test.jpg' alt='test' />";
		$attribute = 'src';
		$url       = 'http://www.google.com/test.jpg';
		$result    = $this->call_private_method( $object, 'add_attribute', [ $html, $attribute, $url ] );
		$this->assertContains( 'crossorigin', $result );
	}
	/**
	 * @covers ::add_attribute
	 * @covers ::starts_with
	 */
	public function test_add_attribute_local_image() {
		$object    = $this->get_coi_object();
		$url       = site_url( '/test.jpg' );
		$html      = sprintf( "<img src='%s' alt='test' />", $url );
		$attribute = 'src';
		$result    = $this->call_private_method( $object, 'add_attribute', [ $html, $attribute, $url ] );
		$this->assertNotContains( 'crossorigin', $result );
	}

	/**
	 * @covers ::add_attribute
	 * @covers ::starts_with
	 */
	public function test_add_attribute_relative_image() {
		$object    = $this->get_coi_object();
		$html      = "<img src='/test.jpg' alt='test' />";
		$attribute = 'src';
		$url       = '/test.jpg';
		$result    = $this->call_private_method( $object, 'add_attribute', [ $html, $attribute, $url ] );
		$this->assertNotContains( 'crossorigin', $result );
	}

	/**
	 * @covers ::starts_with
	 */
	public function test_starts_with() {
		$object       = $this->get_coi_object();
		$string       = 'hello world';
		$start_string = 'hello';
		$result       = $this->call_private_method( $object, 'starts_with', [ $string, $start_string ] );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::starts_with
	 */
	public function test_starts_with_fail() {
		$object       = $this->get_coi_object();
		$string       = 'hello world';
		$start_string = 'world';
		$result       = $this->call_private_method( $object, 'starts_with', [ $string, $start_string ] );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::is_edit_screen
	 * @covers ::get_current_screen
	 * @covers \Google\Web_Stories\Traits\Screen::is_edit_screen
	 * @covers \Google\Web_Stories\Traits\Screen::get_current_screen
	 */
	public function test_is_edit_screen() {
		$object                    = $this->get_coi_object();
		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$result                    = $this->call_private_method( $object, 'is_edit_screen' );
		$this->assertTrue( $result );

		unset( $GLOBALS['current_screen'] );
	}

	/**
	 * @covers ::get_current_screen
	 * @covers \Google\Web_Stories\Traits\Screen::get_current_screen
	 */
	public function test_get_current_screen() {
		$object = $this->get_coi_object();
		$result = $this->call_private_method( $object, 'get_current_screen' );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::replace_in_dom
	 */
	public function test_replace_in_dom() {
		$html   = file_get_contents( __DIR__ . '/../../data/cross_origin_content.html' );
		$html   = str_replace( '--SITE_URL--', site_url(), $html );
		$object = $this->get_coi_object();
		$result = $this->call_private_method( $object, 'replace_in_dom', [ $html ] );
		$this->assertContains( '<script async="" crossorigin="anonymous" src="https://cdn.ampproject.org/v0.js"></script>', $result );
		$this->assertContains( '<script async="" crossorigin="anonymous" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>', $result );
		$this->assertContains( '<link crossorigin="anonymous" href="https://fonts.googleapis.com/css2?display=swap&#038;family=Roboto" rel="stylesheet" />', $result );
		$this->assertContains( '<img alt="test" crossorigin="anonymous" src="http://www.example.com/test1.jpg" loading="eager" />', $result );
		$this->assertContains( "<img crossorigin='anonymous' src='http://www.example.com/test2.jpg' alt='test' />", $result );
		$this->assertContains( '<iframe crossorigin="anonymous" src="http://www.example.com"></iframe>', $result );
		$this->assertContains( 'crossorigin="use-credentials"', $result );
		$this->assertContains( '<a href="http://www.example.com/test1.jpg">Test</a>', $result );
	}

	/**
	 * @covers ::replace_in_dom
	 */
	public function test_replace_in_dom_invalid() {
		$html   = '<html><img src="http://www.example.com/test1.jpg" /><invalid /</html';
		$object = $this->get_coi_object();
		$result = $this->call_private_method( $object, 'replace_in_dom', [ $html ] );
		$this->assertContains( '<img crossorigin="anonymous" src="http://www.example.com/test1.jpg" />', $result );
	}

	/**
	 * @return \Google\Web_Stories\Admin\Cross_Origin_Isolation
	 */
	protected function get_coi_object() {
		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );

		return new \Google\Web_Stories\Admin\Cross_Origin_Isolation( $experiments );
	}
}
