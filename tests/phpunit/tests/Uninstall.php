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

require_once WEBSTORIES_PLUGIN_DIR_PATH . '/includes/uninstall.php';

class Uninstall extends Test_Case {
	protected static $attachment_ids;

	protected static $user_id;

	public function setUp() {
		parent::setUp();
		self::$attachment_ids = self::factory()->attachment->create_many( 5 );
		foreach ( self::$attachment_ids as $attachment_id ) {
			add_post_meta( $attachment_id, 'web_stories_is_poster', '1' );
			add_post_meta( $attachment_id, 'web_stories_poster_id', '999' );
		}
		self::factory()->post->create_many( 5, [ 'post_type' => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG ] );
		self::factory()->post->create_many( 5, [ 'post_type' => \Google\Web_Stories\Template_Post_Type::POST_TYPE_SLUG ] );
		update_option( \Google\Web_Stories\Database_Upgrader::OPTION, '2.0.0' );
		update_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION, '1.0.0' );
		set_transient( 'web_stories_link_data_fdsf', 'hello' );
		set_site_transient( 'web_stories_updater', 'hello' );
		self::$user_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
		add_user_meta( self::$user_id, \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, true );
		add_user_meta( self::$user_id, \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY, [ 'hello' => 'world' ] );
	}

	public function test_delete_options() {
		$this->assertSame( '2.0.0', get_option( \Google\Web_Stories\Database_Upgrader::OPTION ) );
		$this->assertSame( '1.0.0', get_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION ) );
		\Google\Web_Stories\delete_options();
		$this->assertFalse( get_option( \Google\Web_Stories\Database_Upgrader::OPTION ) );
		$this->assertFalse( get_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION ) );
		$this->assertFalse( get_transient( 'web_stories_link_data_fdsf' ) );
	}

	public function test_delete_posts() {
		\Google\Web_Stories\delete_posts();
		$cpt_posts = get_posts(
			[
				'fields'           => 'ids',
				'suppress_filters' => false,
				'post_type'        => [
					\Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
					\Google\Web_Stories\Template_Post_Type::POST_TYPE_SLUG,
				],
				'posts_per_page'   => - 1,
			]
		);
		$this->assertCount( 0, $cpt_posts );
	}

	public function test_delete_stories_post_meta() {
		\Google\Web_Stories\delete_stories_post_meta();
		self::$attachment_ids = self::factory()->attachment->create_many( 5 );
		foreach ( self::$attachment_ids as $attachment_id ) {
			$this->assertSame( '', get_post_meta( $attachment_id, 'web_stories_is_poster', true ) );
			$this->assertSame( '', get_post_meta( $attachment_id, 'web_stories_poster_id', true ) );
		}
	}

	public function test_delete_stories_user_meta() {
		\Google\Web_Stories\delete_stories_user_meta();
		$user_meta = get_user_meta( self::$user_id );
		$this->assertArrayNotHasKey( \Google\Web_Stories\User_Preferences::OPTIN_META_KEY, $user_meta );
		$this->assertArrayNotHasKey( \Google\Web_Stories\User_Preferences::ONBOARDING_META_KEY, $user_meta );
	}


	/**
	 * @group ms-required
	 */
	public function test_delete_site_options() {
		\Google\Web_Stories\delete_site_options();
		$this->assertFalse( get_site_transient( 'web_stories_updater' ) );
	}
}
