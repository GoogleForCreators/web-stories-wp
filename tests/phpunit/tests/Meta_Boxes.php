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

use Google\Web_Stories\Story_Post_Type;

/**
 * @coversDefaultClass \Google\Web_Stories\Meta_Boxes
 */
class Meta_Boxes extends Test_Case {
	/**
	 * Story ID.
	 *
	 * @var int
	 */
	protected static $story_id;

	public static function wpSetUpBeforeClass( $factory ) {
		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Meta Boxes Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$meta_boxes = new \Google\Web_Stories\Meta_Boxes();
		$meta_boxes->register();
		$has_action = has_action(
			'add_meta_boxes_' . Story_Post_Type::POST_TYPE_SLUG,
			[
				$meta_boxes,
				'remove_meta_boxes',
			]
		);

		remove_all_filters( 'add_meta_boxes_' . Story_Post_Type::POST_TYPE_SLUG );

		$this->assertSame( PHP_INT_MAX, $has_action );
	}

	/**
	 * @covers ::get_meta_box_url
	 */
	public function test_get_meta_box_url() {
		$meta_boxes = new \Google\Web_Stories\Meta_Boxes();
		$url        = $meta_boxes->get_meta_box_url( self::$story_id );

		$this->assertContains( 'wp-admin/post.php', $url );
		$this->assertContains( 'meta-box-loader=1', $url );
		$this->assertContains( 'meta-box-loader-nonce=', $url );
	}

	/**
	 * @covers ::remove_meta_boxes
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_remove_meta_boxes() {
		require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';

		global $wp_meta_boxes, $current_screen;

		$current_screen = convert_to_screen( Story_Post_Type::POST_TYPE_SLUG );

		add_action( 'add_meta_boxes', [ $this, 'register_test_meta_boxes' ] );

		// Registers default meta boxes.
		register_and_do_post_meta_boxes( get_post( self::$story_id ) );

		$registered_meta_boxes = [];

		foreach ( \Google\Web_Stories\Meta_Boxes::LOCATIONS as $location ) {
			foreach ( [ 'high', 'core', 'default', 'low' ] as $priority ) {
				if ( ! isset( $wp_meta_boxes[ $current_screen->id ][ $location ][ $priority ] ) ) {
					continue;
				}

				foreach ( $wp_meta_boxes[ $current_screen->id ][ $location ][ $priority ] as $meta_box ) {
					if ( false === $meta_box ) {
						continue;
					}

					$registered_meta_boxes[] = $meta_box['id'];
				}
			}
		}

		unset( $wp_meta_boxes, $current_screen );
		remove_all_filters( 'add_meta_boxes' );

		$this->assertEqualSets(
			[ 'bar', 'foobar' ],
			$registered_meta_boxes
		);
	}

	/**
	 * @covers ::get_meta_boxes_per_location
	 * @runInSeparateProcess
	 * @preserveGlobalState disabled
	 */
	public function test_get_meta_boxes_per_location() {
		require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';

		global $wp_meta_boxes, $current_screen;

		$current_screen = convert_to_screen( Story_Post_Type::POST_TYPE_SLUG );

		add_action( 'add_meta_boxes', [ $this, 'register_test_meta_boxes' ] );

		// Registers default meta boxes.
		register_and_do_post_meta_boxes( get_post( self::$story_id ) );

		$meta_boxes = new \Google\Web_Stories\Meta_Boxes();
		$actual     = $meta_boxes->get_meta_boxes_per_location();

		unset( $wp_meta_boxes, $current_screen );
		remove_all_filters( 'add_meta_boxes' );

		$this->assertArrayHasKey( 'normal', $actual );
		$this->assertArrayHasKey( 'advanced', $actual );
		$this->assertEqualSets(
			[
				[
					'id'    => 'bar',
					'title' => 'Bar',
				],
			],
			$actual['normal']
		);
		$this->assertEqualSets(
			[
				[
					'id'    => 'foobar',
					'title' => 'Foobar',
				],
			],
			$actual['advanced']
		);
	}

	public function register_test_meta_boxes() {
		add_meta_box( 'foo', 'Foo', '__return_empty_string', null, 'normal', 'default', [ '__back_compat_meta_box' => true ] );
		add_meta_box( 'bar', 'Bar', '__return_empty_string', null, 'normal', 'default', [ '__back_compat_meta_box' => false ] );
		add_meta_box( 'baz', 'Baz', '__return_empty_string', null, 'advanced', 'default', [ '__back_compat_meta_box' => true ] );
		add_meta_box( 'foobar', 'Foobar', '__return_empty_string', null, 'advanced', 'default', [ '__back_compat_meta_box' => false ] );
	}
}
