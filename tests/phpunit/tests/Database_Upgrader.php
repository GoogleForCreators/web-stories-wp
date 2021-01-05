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

/**
 * Class Database_Upgrader
 *
 * @package Google\Web_Stories\Tests
 * @coversDefaultClass \Google\Web_Stories\Database_Upgrader
 *
 */
class Database_Upgrader extends \WP_UnitTestCase {

	use Private_Access;

	public function setUp() {
		parent::setUp();
		delete_option( \Google\Web_Stories\Database_Upgrader::OPTION );
		delete_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION );
	}

	/**
	 * @covers ::init
	 */
	public function test_init_sets_missing_options() {
		$object = new \Google\Web_Stories\Database_Upgrader();
		$object->init();
		$this->assertSame( WEBSTORIES_DB_VERSION, get_option( $object::OPTION ) );
		$this->assertSame( '0.0.0', get_option( $object::PREVIOUS_OPTION ) );
	}

	/**
	 * @covers ::init
	 */
	public function test_init_does_not_override_previous_version_if_there_was_no_update() {
		add_option( \Google\Web_Stories\Database_Upgrader::OPTION, WEBSTORIES_DB_VERSION );
		add_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION, '1.2.3' );

		$object = new \Google\Web_Stories\Database_Upgrader();
		$object->init();
		$this->assertSame( WEBSTORIES_DB_VERSION, get_option( $object::OPTION ) );
		$this->assertSame( '1.2.3', get_option( $object::PREVIOUS_OPTION ) );
	}

	/**
	 * @covers ::v_2_replace_conic_style_presets
	 */
	public function test_v_2_replace_conic_style_presets() {
		$radial_preset = [
			[
				'color'              => [],
				'backgroundColor'    =>
					[
						'type'     => 'radial',
						'stops'    => [],
						'rotation' => 0.5,
					],
				'backgroundTextMode' => 'FILL',
			],
		];
		$presets       = [
			'fillColors' => [
				[
					'type'     => 'conic',
					'stops'    =>
						[
							[
								'color'    => [],
								'position' => 0,
							],
							[
								'color'    => [],
								'position' => 0.7,
							],
						],
					'rotation' => 0.5,
				],
			],
			'textColors' => [
				[
					'color' => [],
				],
			],
			'textStyles' => [
				[
					'color'              => [],
					'backgroundColor'    =>
						[
							'type'     => 'conic',
							'stops'    => [],
							'rotation' => 0.5,
						],
					'backgroundTextMode' => 'FILL',
					'font'               => [],
				],
				$radial_preset,
			],
		];
		add_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION, $presets );

		$object = new \Google\Web_Stories\Database_Upgrader();
		$this->call_private_method( $object, 'v_2_replace_conic_style_presets' );

		$style_presets = get_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
		$this->assertSame( $style_presets['textStyles'][1], $radial_preset );
		$this->assertSame( $style_presets['textStyles'][0]['backgroundColor']['type'], 'linear' );
		$this->assertSame( $style_presets['fillColors'][0]['type'], 'linear' );
		$this->assertSame(
			$style_presets['textColors'],
			[
				[
					'color' => [],
				],
			]
		);

		delete_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
	}

	/**
	 * @covers ::remove_broken_text_styles
	 */
	public function test_remove_broken_text_styles() {
		$presets = [
			'textStyles' => [
				[
					'color' => [
						'r' => 255,
						'g' => 255,
						'b' => 255,
					],
					'font'  => [],
				],
				[
					'color' => [
						'type'  => 'solid',
						'color' => [
							'r' => 255,
							'g' => 255,
							'b' => 255,
						],
					],
					'font'  => [],
				],
			],
			'textColors' => [],
			'fillColors' => [],
		];
		add_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION, $presets );

		$object = new \Google\Web_Stories\Database_Upgrader();
		$this->call_private_method( $object, 'remove_broken_text_styles' );

		$style_presets = get_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
		$this->assertSame(
			$style_presets['textStyles'],
			[
				[
					'color' => [
						'type'  => 'solid',
						'color' => [
							'r' => 255,
							'g' => 255,
							'b' => 255,
						],
					],
					'font'  => [],
				],
			]
		);

		delete_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
	}

	/**
	 * @covers ::unify_color_presets
	 */
	public function test_unify_color_presets() {
		$presets = [
			'textStyles' => [],
			'textColors' => [
				[
					'color' => [
						'r' => 255,
						'g' => 255,
						'b' => 255,
					],
				],
			],
			'fillColors' => [
				[
					'color' => [
						'r' => 1,
						'g' => 1,
						'b' => 1,
					],
				],
			],
		];
		add_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION, $presets );

		$object = new \Google\Web_Stories\Database_Upgrader();
		$this->call_private_method( $object, 'unify_color_presets' );

		$style_presets = get_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
		$this->assertSame(
			$style_presets['colors'],
			[
				[
					'color' => [
						'r' => 1,
						'g' => 1,
						'b' => 1,
					],
				],
				[
					'color' => [
						'r' => 255,
						'g' => 255,
						'b' => 255,
					],
				],
			]
		);
		delete_option( \Google\Web_Stories\Story_Post_Type::STYLE_PRESETS_OPTION );
	}

	/**
	 * @covers ::update_publisher_logos
	 */
	public function test_update_publisher_logos() {
		$object = new \Google\Web_Stories\Database_Upgrader();

		update_option( \Google\Web_Stories\Settings::SETTING_NAME_PUBLISHER_LOGOS, [ 'active' => 123 ] );

		$this->call_private_method( $object, 'update_publisher_logos' );

		$all_publisher_logos   = get_option( \Google\Web_Stories\Settings::SETTING_NAME_PUBLISHER_LOGOS );
		$active_publisher_logo = (int) get_option( \Google\Web_Stories\Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO );

		$this->assertEqualSets( [ 123 ], $all_publisher_logos );
		$this->assertSame( 123, $active_publisher_logo );
	}

	/**
	 * @covers ::add_poster_generation_media_source
	 */
	public function test_add_poster_generation_media_source() {


		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );
		add_post_meta( $poster_attachment_id, \Google\Web_Stories\Media::POSTER_POST_META_KEY, 'true' );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media::POSTER_ID_POST_META_KEY, $poster_attachment_id );

		$object = new \Google\Web_Stories\Database_Upgrader();

		$this->call_private_method( $object, 'add_poster_generation_media_source' );

		$terms = wp_get_post_terms( $poster_attachment_id, \Google\Web_Stories\Media::STORY_MEDIA_TAXONOMY );
		$slugs = wp_list_pluck( $terms, 'slug' );
		$this->assertCount( 1, $terms );
		$this->assertEqualSets( [ 'poster-generation' ], $slugs );
	}


	/**
	 * @covers ::remove_unneeded_attachment_meta
	 */
	public function test_remove_unneeded_attachment_meta() {
		$video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/test-image.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( $video_attachment_id, $poster_attachment_id );
		add_post_meta( $poster_attachment_id, \Google\Web_Stories\Media::POSTER_POST_META_KEY, 'true' );
		add_post_meta( $video_attachment_id, \Google\Web_Stories\Media::POSTER_ID_POST_META_KEY, $poster_attachment_id );

		$object = new \Google\Web_Stories\Database_Upgrader();

		$this->call_private_method( $object, 'remove_unneeded_attachment_meta' );

		$meta = get_post_meta( $poster_attachment_id, \Google\Web_Stories\Media::POSTER_POST_META_KEY, true );

		$this->assertSame( '', $meta );
	}

	/**
	 * @group ms-required
	 */
	public function test_init_sets_missing_options_multisite() {
		$blog_id = (int) self::factory()->blog->create();

		switch_to_blog( $blog_id );

		$db_version   = get_option( \Google\Web_Stories\Database_Upgrader::OPTION );
		$prev_version = get_option( \Google\Web_Stories\Database_Upgrader::PREVIOUS_OPTION );

		restore_current_blog();

		$this->assertSame( WEBSTORIES_DB_VERSION, $db_version );
		$this->assertSame( '0.0.0', $prev_version );
	}
}
