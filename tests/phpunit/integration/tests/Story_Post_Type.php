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
	 * Story id.
	 *
	 * @var int
	 */
	protected static $story_id_meta;

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
		wp_maybe_generate_attachment_metadata( get_post( $poster_attachment_id ) );

		set_post_thumbnail( self::$story_id, $poster_attachment_id );

		self::$story_id_meta = $factory->post->create(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		add_post_meta(
			self::$story_id_meta,
			\Google\Web_Stories\Story_Post_Type::POSTER_META_KEY,
			[
				'url'        => 'http://www.example.com/image.png',
				'height'     => 1000,
				'width'      => 1000,
				'needsProxy' => false,
			]
		);

		self::$archive_page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );
	}

	public function set_up(): void {
		parent::set_up();

		$media = $this->injector->make( \Google\Web_Stories\Media\Image_Sizes::class );
		$media->register();

		$experiments = $this->createMock( \Google\Web_Stories\Experiments::class );
		$experiments->method( 'is_experiment_enabled' )
					->willReturn( true );

		$this->settings = $this->injector->make( $this->settings::class );
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

		$this->assertSame( 10, has_filter( 'wp_insert_post_data', [ $this->instance, 'change_default_title' ] ) );
		$this->assertSame( 10, has_filter( 'wp_insert_post_empty_content', [ $this->instance, 'filter_empty_content' ] ) );
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
		$this->assertSame( 10, has_filter( 'has_post_thumbnail', [ $this->instance, 'has_post_thumbnail' ] ) );
		$this->assertSame( 10, has_filter( 'post_thumbnail_html', [ $this->instance, 'post_thumbnail_html' ] ) );
	}

	/**
	 * @covers ::register
	 */
	public function test_register_disable_filters(): void {
		$instance = $this->injector->make( \Google\Web_Stories\Story_Post_Type::class );

		$this->assertSame( 10, has_filter( 'wp_insert_post_data', [ $instance, 'change_default_title' ] ) );
		$this->assertSame( 10, has_filter( 'wp_insert_post_empty_content', [ $instance, 'filter_empty_content' ] ) );
		$this->assertSame(
			10,
			has_filter(
				'bulk_post_updated_messages',
				[
					$instance,
					'bulk_post_updated_messages',
				]
			)
		);
		$this->assertFalse( has_filter( 'has_post_thumbnail', [ $instance, 'has_post_thumbnail' ] ) );
		$this->assertFalse( has_filter( 'post_thumbnail_html', [ $instance, 'post_thumbnail_html' ] ) );

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
	 * @covers ::filter_empty_content
	 */
	public function test_filter_empty_content(): void {
		$postarr = [
			'post_type'             => $this->instance->get_slug(),
			'post_content_filtered' => 'Not empty',
		];

		$empty_postarr = [
			'post_type'             => $this->instance->get_slug(),
			'post_content_filtered' => '',
		];

		$this->assertFalse( $this->instance->filter_empty_content( false, $postarr ) );
		$this->assertFalse( $this->instance->filter_empty_content( false, $empty_postarr ) );
		$this->assertFalse( $this->instance->filter_empty_content( true, $postarr ) );
		$this->assertTrue( $this->instance->filter_empty_content( true, $empty_postarr ) );
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
	 * @covers ::has_post_thumbnail
	 */
	public function test_has_post_thumbnail(): void {
		$this->instance->register();
		$result = has_post_thumbnail( self::$story_id );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::has_post_thumbnail
	 */
	public function test_has_post_thumbnail_meta_poster(): void {
		$this->instance->register();

		$result = has_post_thumbnail( self::$story_id_meta );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::post_thumbnail_html
	 * @dataProvider data_test_post_thumbnail_html
	 */
	public function test_post_thumbnail_html( $size, $attr, $height, $width ): void {
		$this->instance->register();
		$result = get_the_post_thumbnail( self::$story_id, $size, $attr );
		$this->assertStringContainsString( 'canola', $result );
		$this->assertStringContainsString( 'loading="lazy"', $result );
		if ( \is_array( $size ) ) {
			$this->assertStringContainsString( sprintf( 'height="%s"', $height ), $result );
			$this->assertStringContainsString( sprintf( 'width="%s"', $width ), $result );
		}
		foreach ( $attr as $name => $value ) {
			$this->assertStringContainsString( " $name=" . '"' . $value, $result );

		}
	}

	/**
	 * @covers ::post_thumbnail_html
	 * @dataProvider data_test_post_thumbnail_html
	 */
	public function test_post_thumbnail_html_poster_meta( $size, $attr ): void {
		$this->instance->register();
		$result = get_the_post_thumbnail( self::$story_id_meta, $size, $attr );
		$this->assertStringContainsString( 'http://www.example.com/image.png', $result );
		$this->assertStringContainsString( 'loading="lazy"', $result );
		if ( \is_array( $size ) ) {
			$this->assertStringContainsString( sprintf( 'height="%s"', $size[0] ), $result );
			$this->assertStringContainsString( sprintf( 'width="%s"', $size[1] ), $result );
		}
		foreach ( $attr as $name => $value ) {
			$this->assertStringContainsString( " $name=" . '"' . $value, $result );

		}
	}

	public function data_test_post_thumbnail_html(): array {
		return [
			'post-thumbnail' => [
				'size'   => 'post-thumbnail',
				'attr'   => [ 'alt' => 'test alt' ],
				'height' => '',
				'width'  => '',
			],
			'999x999'        => [
				'size'   => [ 999, 999 ],
				'attr'   => [ 'alt' => 'test alt' ],
				'height' => '480',
				'width'  => '640',
			],
			'100x100'        => [
				'size'   => [ 100, 100 ],
				'attr'   => [ 'alt' => 'test alt' ],
				'height' => '100',
				'width'  => '100',
			],
			'custom size'    => [
				'size'   => \Google\Web_Stories\Media\Image_Sizes::STORY_THUMBNAIL_IMAGE_SIZE,
				'attr'   => [ 'alt' => 'test alt' ],
				'height' => '100',
				'width'  => '100',
			],
			'sync'           => [
				'size'   => 'post-thumbnail',
				'attr'   => [ 'decoding' => 'sync' ],
				'height' => '',
				'width'  => '',
			],
			'custom class'   => [
				'size'   => 'post-thumbnail',
				'attr'   => [ 'class' => 'custom-class-name' ],
				'height' => '',
				'width'  => '',
			],
		];
	}
}
