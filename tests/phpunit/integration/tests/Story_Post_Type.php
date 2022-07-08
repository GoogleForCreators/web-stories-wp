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

namespace Google\Web_Stories\Tests\Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Story_Post_Type
 */
class Story_Post_Type extends DependencyInjectedTestCase {
	use Capabilities_Setup;

	/**
	 * Admin user for test.
	 *
	 * @var int
	 */
	protected static $admin_id;

	/**
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * Test instance.
	 *
	 * @var \Google\Web_Stories\Story_Post_Type
	 */
	protected $instance;

	/**
	 * @var \Google\Web_Stories\Settings
	 */
	private $settings;

	/**
	 * Archive page ID.
	 *
	 * @var int
	 */
	protected static $archive_page_id;

	/**
	 * @param \WP_UnitTest_Factory $factory
	 */
	public static function wpSetUpBeforeClass( $factory ): void {
		self::$admin_id = $factory->user->create(
			[ 'role' => 'administrator' ]
		);

		self::$story_id = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Story_Post_Type Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$admin_id,
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/images/canola.jpg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		set_post_thumbnail( self::$story_id, $poster_attachment_id );

		self::$archive_page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );
	}

	public function set_up(): void {
		parent::set_up();

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );

		$this->settings = $this->injector->make( \Google\Web_Stories\Settings::class );
		$this->instance = new \Google\Web_Stories\Story_Post_Type( $this->settings, $experiments );

		$this->add_caps_to_roles();
	}

	public function tear_down(): void {
		$this->remove_caps_from_roles();

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		parent::tear_down();
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame(
			10,
			has_filter(
				'_wp_post_revision_fields',
				[
					$this->instance,
					'filter_revision_fields',
				]
			)
		);
		$this->assertSame( 10, has_filter( 'wp_insert_post_data', [ $this->instance, 'change_default_title' ] ) );
		$this->assertSame( 10, has_filter( 'wp_web-story_revisions_to_keep', [ $this->instance, 'revisions_to_keep' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'bulk_post_updated_messages',
				[
					$this->instance,
					'bulk_post_updated_messages',
				]
			)
		);
	}

	/**
	 * @covers ::get_post_type_icon
	 */
	public function test_get_post_type_icon(): void {
		$valid = $this->call_private_method( $this->instance, 'get_post_type_icon' );
		$this->assertStringContainsString( 'data:image/svg+xml;base64', $valid );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type(): void {

		$post_type = $this->instance->register_post_type();
		$this->assertTrue( $post_type->has_archive );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type_disabled(): void {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'disabled' );
		$post_type = $this->instance->register_post_type();
		$this->assertFalse( $post_type->has_archive );
	}

	/**
	 * @covers ::register_post_type
	 */
	public function test_register_post_type_default(): void {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'default' );
		$post_type = $this->instance->register_post_type();
		$this->assertTrue( $post_type->has_archive );
	}

	/**
	 * @covers ::register_meta
	 */
	public function test_register_meta(): void {
		$this->instance->register_meta();

		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::PUBLISHER_LOGO_META_KEY, $this->instance->get_slug() ) );
		$this->assertTrue( registered_meta_key_exists( 'post', $this->instance::POSTER_META_KEY, $this->instance->get_slug() ) );
	}

	/**
	 * @covers ::change_default_title
	 */
	public function test_change_default_title(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_type'    => $this->instance->get_slug(),
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
				'post_status'  => 'auto-draft',
				'post_title'   => 'Auto draft',
			]
		);

		$this->assertSame( '', $post->post_title );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_default(): void {
		$actual = $this->instance->get_has_archive();
		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_disabled_experiments(): void {
		$experiments    = new \Google\Web_Stories\Experiments( $this->settings );
		$this->instance = new \Google\Web_Stories\Story_Post_Type( $this->settings, $experiments );

		$actual = $this->instance->get_has_archive();
		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_disabled(): void {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'disabled' );

		$actual = $this->instance->get_has_archive();

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );

		$this->assertFalse( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_but_no_page(): void {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );

		$actual = $this->instance->get_has_archive();

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );

		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_but_invalid_page(): void {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, PHP_INT_MAX );

		$actual = $this->instance->get_has_archive();

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertTrue( $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom(): void {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$actual = $this->instance->get_has_archive();

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertIsString( $actual );
		$this->assertSame( urldecode( get_page_uri( self::$archive_page_id ) ), $actual );
	}

	/**
	 * @covers ::get_has_archive
	 */
	public function test_get_has_archive_custom_not_published(): void {
		update_option( $this->settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'draft',
			]
		);

		$actual = $this->instance->get_has_archive();

		delete_option( $this->settings::SETTING_NAME_ARCHIVE );
		delete_option( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		wp_update_post(
			[
				'ID'          => self::$archive_page_id,
				'post_status' => 'publish',
			]
		);

		$this->assertTrue( $actual );
	}

	/**
	 * Testing the revisions_to_keep() method.
	 *
	 * @param int $num      Number of revisions
	 * @param int $expected Expected string of CSS rules.
	 *
	 * @dataProvider data_test_revisions_to_keep
	 * @covers ::revisions_to_keep
	 */
	public function test_revisions_to_keep( $num, $expected ): void {
		$this->assertSame( $expected, $this->instance->revisions_to_keep( $num ) );
	}

	public function data_test_revisions_to_keep(): array {
		return [
			[
				'num'      => 0,
				'expected' => 0,
			],
			[
				'num'      => 10,
				'expected' => 10,
			],
			[
				'num'      => 6,
				'expected' => 6,
			],
			[
				'num'      => -1,
				'expected' => 10,
			],
			[
				'num'      => '10',
				'expected' => 10,
			],
			[
				'num'      => 'ten',
				'expected' => 0,
			],
			[
				'num'      => true,
				'expected' => 1,
			],
			[
				'num'      => false,
				'expected' => 0,
			],
		];
	}
}
