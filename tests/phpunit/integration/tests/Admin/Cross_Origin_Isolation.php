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

namespace Google\Web_Stories\Tests\Integration\Admin;

use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Admin\Cross_Origin_Isolation
 */
class Cross_Origin_Isolation extends DependencyInjectedTestCase {
	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	private $admin_id;

	/**
	 * Contributor user for test.
	 *
	 * @var int
	 */
	private $contributor_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Admin\Cross_Origin_Isolation
	 */
	private $instance;

	public function set_up() {
		parent::set_up();

		// Deliberately NOT created in wpSetUpBeforeClass() because this class contains running
		// in separate processes, which means tearDownAfterClass() (which deletes all WP data)
		// is run multiple times, causing the story not to be available anymore.
		$this->admin_id = self::factory()->user->create(
			[ 'role' => 'administrator' ]
		);

		$this->contributor_id = self::factory()->user->create(
			[ 'role' => 'contributor' ]
		);

		$this->instance = $this->injector->make( \Google\Web_Stories\Admin\Cross_Origin_Isolation::class );
	}

	public function tear_down() {
		delete_user_meta( $this->admin_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY );
		delete_user_meta( $this->contributor_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY );

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		wp_set_current_user( $this->admin_id );
		update_user_meta( $this->admin_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, true );

		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$this->instance->register();

		$this->assertSame( 10, has_action( 'load-post.php', [ $this->instance, 'admin_header' ] ) );
		$this->assertSame( 10, has_action( 'load-post-new.php', [ $this->instance, 'admin_header' ] ) );

		$this->assertSame( 10, has_filter( 'style_loader_tag', [ $this->instance, 'style_loader_tag' ] ) );
		$this->assertSame( 10, has_filter( 'script_loader_tag', [ $this->instance, 'script_loader_tag' ] ) );
		$this->assertSame( 10, has_filter( 'get_avatar', [ $this->instance, 'get_avatar' ] ) );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		wp_set_current_user( $this->admin_id );
		update_user_meta( $this->admin_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, true );

		$this->assertTrue( \Google\Web_Stories\Admin\Cross_Origin_Isolation::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed_default_user_meta_value() {
		wp_set_current_user( $this->admin_id );

		$this->assertTrue( \Google\Web_Stories\Admin\Cross_Origin_Isolation::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_user() {
		$this->assertFalse( \Google\Web_Stories\Admin\Cross_Origin_Isolation::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed_opt_out() {
		wp_set_current_user( $this->admin_id );
		update_user_meta( $this->admin_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, false );

		$this->assertFalse( \Google\Web_Stories\Admin\Cross_Origin_Isolation::is_needed() );
	}

	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_upload_caps() {
		wp_set_current_user( $this->contributor_id );
		update_user_meta( $this->contributor_id, \Google\Web_Stories\User\Preferences::MEDIA_OPTIMIZATION_META_KEY, true );

		$this->assertFalse( \Google\Web_Stories\Admin\Cross_Origin_Isolation::is_needed() );
	}

	/**
	 * @covers ::add_attribute
	 * @covers ::starts_with
	 */
	public function test_add_attribute() {
		$html      = "<img src='http://www.google.com/test.jpg' alt='test' />";
		$attribute = 'src';
		$url       = 'http://www.google.com/test.jpg';
		$result    = $this->call_private_method( $this->instance, 'add_attribute', [ $html, $attribute, $url ] );
		$this->assertStringContainsString( 'crossorigin', $result );
	}
	/**
	 * @covers ::add_attribute
	 * @covers ::starts_with
	 */
	public function test_add_attribute_local_image() {
		$url       = site_url( '/test.jpg' );
		$html      = sprintf( "<img src='%s' alt='test' />", $url );
		$attribute = 'src';
		$result    = $this->call_private_method( $this->instance, 'add_attribute', [ $html, $attribute, $url ] );
		$this->assertStringNotContainsString( 'crossorigin', $result );
	}

	/**
	 * @covers ::add_attribute
	 * @covers ::starts_with
	 */
	public function test_add_attribute_relative_image() {
		$html      = "<img src='/test.jpg' alt='test' />";
		$attribute = 'src';
		$url       = '/test.jpg';
		$result    = $this->call_private_method( $this->instance, 'add_attribute', [ $html, $attribute, $url ] );
		$this->assertStringNotContainsString( 'crossorigin', $result );
	}

	/**
	 * @covers ::starts_with
	 */
	public function test_starts_with() {
		$string       = 'hello world';
		$start_string = 'hello';
		$result       = $this->call_private_method( $this->instance, 'starts_with', [ $string, $start_string ] );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::starts_with
	 */
	public function test_starts_with_fail() {
		$string       = 'hello world';
		$start_string = 'world';
		$result       = $this->call_private_method( $this->instance, 'starts_with', [ $string, $start_string ] );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::is_edit_screen
	 * @covers ::get_current_screen
	 * @covers \Google\Web_Stories\Traits\Screen::is_edit_screen
	 * @covers \Google\Web_Stories\Traits\Screen::get_current_screen
	 */
	public function test_is_edit_screen() {
		$GLOBALS['current_screen'] = convert_to_screen( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );

		$result = $this->call_private_method( $this->instance, 'is_edit_screen' );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::get_current_screen
	 * @covers \Google\Web_Stories\Traits\Screen::get_current_screen
	 */
	public function test_get_current_screen() {
		$result = $this->call_private_method( $this->instance, 'get_current_screen' );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::replace_in_dom
	 */
	public function test_replace_in_dom() {
		$site_url = site_url();

		$html   = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/cross_origin_content.html' );
		$html   = str_replace( '--SITE_URL--', $site_url, $html );
		$result = $this->call_private_method( $this->instance, 'replace_in_dom', [ $html ] );

		$this->assertStringContainsString( '<script async="" crossorigin="anonymous" src="https://cdn.ampproject.org/v0.js"></script>', $result );
		$this->assertStringContainsString( '<script async="" crossorigin="anonymous" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>', $result );
		$this->assertStringContainsString( '<link crossorigin="anonymous" href="https://fonts.googleapis.com/css2?display=swap&#038;family=Roboto" rel="stylesheet" />', $result );
		$this->assertStringContainsString( '<img alt="test" crossorigin="anonymous" src="http://www.example.com/test1.jpg" loading="eager" />', $result );
		$this->assertStringContainsString( "<img crossorigin='anonymous' src='http://www.example.com/test2.jpg' alt='test' />", $result );
		$this->assertStringContainsString( '<iframe src="http://www.example.com"></iframe>', $result );
		$this->assertStringContainsString( 'crossorigin="use-credentials"', $result );
		$this->assertStringContainsString( '<a href="http://www.example.com/test1.jpg">Test</a>', $result );
		$this->assertStringContainsString( '<video crossorigin="anonymous"><source src="http://www.example.com/video1.mp4"></video>', $result );
		$this->assertStringContainsString( '<video crossorigin="anonymous" src="http://www.example.com/video3.mp4"></video>', $result );
		$this->assertStringContainsString( '<audio crossorigin="anonymous"><source src="http://www.example.com/audio1.mp3"></audio>', $result );
		$this->assertStringContainsString( '<audio crossorigin="anonymous" src="http://www.example.com/audio3.mp3"></audio>', $result );
		$this->assertStringContainsString( "<img src='$site_url/test3.jpg' alt=\"test\" />", $result );
		$this->assertStringContainsString( "<iframe src=\"$site_url\"></iframe>", $result );
		$this->assertStringContainsString( "<video><source src=\"$site_url/video2.mp4\"></video>", $result );
		$this->assertStringContainsString( "<video src=\"$site_url/video4.mp4\"></video>", $result );
		$this->assertStringContainsString( "<audio><source src=\"$site_url/audio2.mp3\"></audio>", $result );
		$this->assertStringContainsString( "<audio src=\"$site_url/audio4.mp3\"></audio>", $result );
		$this->assertStringContainsString( "<script async=\"\" src=\"$site_url\"></script>", $result );
		$this->assertStringContainsString( "<link href=\"$site_url/site.css\" rel=\"stylesheet\" />", $result );
	}

	/**
	 * @covers ::replace_in_dom
	 */
	public function test_replace_in_dom_invalid() {
		$html   = '<html><img src="http://www.example.com/test1.jpg" /><invalid /</html';
		$result = $this->call_private_method( $this->instance, 'replace_in_dom', [ $html ] );
		$this->assertStringContainsString( '<img crossorigin="anonymous" src="http://www.example.com/test1.jpg" />', $result );
	}

	/**
	 * @covers ::custom_print_media_templates
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_custom_print_media_templates() {
		require_once ABSPATH . WPINC . '/media-template.php';
		$output = get_echo( [ $this->instance, 'custom_print_media_templates' ] );
		$this->assertStringContainsString( '<audio crossorigin="anonymous"', $output );
		$this->assertStringContainsString( '<img crossorigin="anonymous"', $output );
		$this->assertStringContainsString( '<video crossorigin="anonymous"', $output );
	}
}
