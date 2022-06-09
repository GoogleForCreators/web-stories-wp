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

use Google\Web_Stories\Settings;

/**
 * @coversDefaultClass \Google\Web_Stories\Discovery
 */
class Discovery extends DependencyInjectedTestCase {

	/**
	 * @var \Google\Web_Stories\Discovery
	 */
	private $instance;

	/**
	 * User ID.
	 *
	 * @var int
	 */
	protected static $user_id;

	/**
	 * Story ID.
	 *
	 * @var int
	 */
	protected static $story_id;

	/**
	 * Image attachment id.
	 *
	 * @var int
	 */
	protected static $attachment_id;

	/**
	 * Archive page ID.
	 *
	 * @var int
	 */
	protected static $archive_page_id;

	/**
	 * @param $factory
	 */
	public static function wpSetUpBeforeClass( $factory ): void {
		self::$user_id = $factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		self::$story_id      = $factory->post->create(
			[
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_title'   => 'Discovery Test Story',
				'post_status'  => 'publish',
				'post_content' => 'Example content',
				'post_author'  => self::$user_id,
			]
		);
		self::$attachment_id = $factory->attachment->create_object(
			DIR_TESTDATA . '/images/canola.jpg',
			self::$story_id,
			[
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);

		wp_maybe_generate_attachment_metadata( get_post( self::$attachment_id ) );
		set_post_thumbnail( self::$story_id, self::$attachment_id );

		add_theme_support( 'automatic-feed-links' );

		self::$archive_page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );
	}

	public static function tear_down_after_class(): void {
		remove_theme_support( 'automatic-feed-links' );

		parent::tear_down_after_class();
	}

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Discovery::class );

		$this->set_permalink_structure( '/%postname%/' );
		$this->go_to( get_permalink( self::$story_id ) );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $this->instance, 'print_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $this->instance, 'print_schemaorg_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $this->instance, 'print_open_graph_metadata' ] ) );
		$this->assertSame( 10, has_action( 'web_stories_story_head', [ $this->instance, 'print_twitter_metadata' ] ) );
		$this->assertSame( 4, has_action( 'web_stories_story_head', [ $this->instance, 'print_feed_link' ] ) );

	}

	/**
	 * @covers ::print_metadata
	 */
	public function test_print_metadata(): void {
		$output = get_echo( [ $this->instance, 'print_metadata' ] );
		$this->assertStringContainsString( '<title>', $output );
	}

	/**
	 * @covers ::print_schemaorg_metadata
	 */
	public function test_print_schemaorg_metadata(): void {
		$output = get_echo( [ $this->instance, 'print_schemaorg_metadata' ] );
		$this->assertStringContainsString( 'application/ld+json', $output );
	}

	/**
	 * @covers ::get_schemaorg_metadata
	 */
	public function test_get_schemaorg_metadata(): void {
		$result = $this->call_private_method( $this->instance, 'get_schemaorg_metadata' );
		$this->assertArrayHasKey( 'mainEntityOfPage', $result );
		$this->assertArrayHasKey( 'headline', $result );
		$this->assertArrayHasKey( 'datePublished', $result );
		$this->assertArrayHasKey( 'dateModified', $result );
		$this->assertArrayHasKey( 'author', $result );
		$this->assertArrayHasKey( 'image', $result );
	}

	/**
	 * @covers ::print_open_graph_metadata
	 */
	public function test_print_open_graph_metadata(): void {
		$output = get_echo( [ $this->instance, 'print_open_graph_metadata' ] );
		$this->assertStringContainsString( 'og:locale', $output );
		$this->assertStringContainsString( 'og:type', $output );
		$this->assertStringContainsString( 'og:description', $output );
		$this->assertStringContainsString( 'article:published_time', $output );
		$this->assertStringContainsString( 'article:modified_time', $output );
		$this->assertStringContainsString( 'og:image', $output );
	}

	/**
	 * @covers ::get_open_graph_metadata
	 */
	public function test_get_open_graph_metadata(): void {
		$result = $this->call_private_method( $this->instance, 'get_open_graph_metadata' );
		$this->assertArrayHasKey( 'og:locale', $result );
		$this->assertArrayHasKey( 'og:type', $result );
		$this->assertArrayHasKey( 'og:description', $result );
		$this->assertArrayHasKey( 'article:published_time', $result );
		$this->assertArrayHasKey( 'article:modified_time', $result );
		$this->assertArrayHasKey( 'og:image', $result );
	}

	/**
	 * @covers ::print_feed_link
	 */
	public function test_print_feed_link(): void {
		$output = get_echo( [ $this->instance, 'print_feed_link' ] );
		$this->assertStringContainsString( '<link rel="alternate"', $output );
		$this->assertStringContainsString( get_bloginfo( 'name' ), $output );
	}

	/**
	 * @covers ::print_feed_link
	 */
	public function test_print_feed_link_custom_archive(): void {
		update_option( Settings::SETTING_NAME_ARCHIVE, 'custom' );
		update_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID, self::$archive_page_id );

		$output = get_echo( [ $this->instance, 'print_feed_link' ] );

		delete_option( Settings::SETTING_NAME_ARCHIVE );
		delete_option( Settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$this->assertStringContainsString( '<link rel="alternate"', $output );
		$this->assertStringContainsString( get_bloginfo( 'name' ), $output );
	}


	/**
	 * @covers ::print_twitter_metadata
	 */
	public function test_print_twitter_metadata(): void {
		$output = get_echo( [ $this->instance, 'print_twitter_metadata' ] );
		$this->assertStringContainsString( 'twitter:card', $output );
		$this->assertStringContainsString( 'twitter:image', $output );
		$this->assertStringContainsString( 'twitter:image:alt', $output );
		$this->assertStringContainsString( 'Discovery Test Story', $output );
	}

	/**
	 * @covers ::get_twitter_metadata
	 */
	public function test_get_twitter_metadata(): void {
		$result = $this->call_private_method( $this->instance, 'get_twitter_metadata' );
		$this->assertArrayHasKey( 'twitter:card', $result );
		$this->assertArrayHasKey( 'twitter:image', $result );
		$this->assertArrayHasKey( 'twitter:image:alt', $result );
		$this->assertSame( 'Discovery Test Story', $result['twitter:image:alt'] );
	}

	/**
	 * @covers ::get_poster
	 */
	public function test_get_poster(): void {
		$result = $this->call_private_method( $this->instance, 'get_poster', [ self::$story_id ] );
		$this->assertArrayHasKey( 'src', $result );
		$this->assertArrayHasKey( 'height', $result );
		$this->assertArrayHasKey( 'width', $result );
	}

	/**
	 * @covers ::get_poster
	 */
	public function test_get_poster_no(): void {
		$result = $this->call_private_method( $this->instance, 'get_poster', [ -99 ] );
		$this->assertFalse( $result );
	}

	/**
	 * @covers ::get_product_data
	 */
	public function test_get_product_data(): void {

		$product_data = [
			[
				'aggregateRating'      => [
					'ratingValue' => 5,
					'reviewCount' => 1,
					'reviewUrl'   => 'http://www.example.com/product/t-shirt-with-logo',
				],
				'ratingValue'          => 0,
				'reviewCount'          => 0,
				'reviewUrl'            => 'http://www.example.com/product/t-shirt-with-logo',
				'productBrand'         => 'Google',
				'productDetails'       => 'This is a simple product.',
				'productId'            => 'wc-36',
				'productImages'        => [
					[
						'url' => 'http://www.example.com/wp-content/uploads/2019/01/t-shirt-with-logo-1-4.jpg',
						'alt' => '',
					],
				],
				'productPrice'         => 18,
				'productPriceCurrency' => 'USD',
				'productTitle'         => 'T-Shirt with Logo',
				'productUrl'           => 'http://www.example.com/product/t-shirt-with-logo',
			],
		];

		$result = $this->call_private_method( $this->instance, 'get_product_data', [ $product_data ] );

		$expected = [
			'products' =>
				[

					'@type'           => 'ItemList',
					'numberOfItems'   => '1',
					'itemListElement' =>
						[
							[
								'@type'           => 'Product',
								'brand'           => 'Google',
								'productID'       => 'wc-36',
								'url'             => 'http://www.example.com/product/t-shirt-with-logo',
								'name'            => 'T-Shirt with Logo',
								'description'     => 'This is a simple product.',
								'image'           => 'http://www.example.com/wp-content/uploads/2019/01/t-shirt-with-logo-1-4.jpg',
								'aggregateRating' => [
									'@type'       => 'AggregateRating',
									'ratingValue' => 5,
									'reviewCount' => 1,
									'url'         => 'http://www.example.com/product/t-shirt-with-logo',
								],
								'offers'          => [
									[
										'@type'         => 'Offer',
										'price'         => 18,
										'priceCurrency' => 'USD',
									],
								],
							],
						],
				],
		];

		$this->assertEqualSets( $expected, $result );
	}

	/**
	 * @covers ::get_product_data
	 */
	public function test_get_product_data_empty_story(): void {
		$result = $this->call_private_method( $this->instance, 'get_product_data', [ [] ] );

		$expected = [];

		$this->assertEqualSets( $expected, $result );
	}
}
