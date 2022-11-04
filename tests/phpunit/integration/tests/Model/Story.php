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

namespace Google\Web_Stories\Tests\Integration\Model;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Model\Story
 */
class Story extends TestCase {
	/**
	 * @covers ::__construct
	 */
	public function test_init(): void {
		$data  = [
			'title' => 'test title',
			'url'   => 'https://www.google.com',
		];
		$story = new \Google\Web_Stories\Model\Story( $data );

		$this->assertEquals( $story->get_title(), $data['title'] );
		$this->assertEquals( $story->get_url(), $data['url'] );
	}

	/**
	 * @covers ::load_from_post
	 */
	public function test_load_from_post(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
	}

	/**
	 * @covers ::load_from_post
	 * @covers ::load_products_from_post
	 */
	public function test_load_from_post_with_product(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		add_post_meta(
			$post->ID,
			\Google\Web_Stories\Shopping\Product_Meta::PRODUCTS_POST_META_KEY,
			[
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

			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
		$this->assertIsArray( $story->get_products() );
		$this->assertInstanceOf( \Google\Web_Stories\Shopping\Product::class, $story->get_products()[0] );
	}

	/**
	 * @covers ::load_from_post
	 * @covers ::load_videos_from_post
	 */
	public function test_load_from_post_with_video(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		add_post_meta(
			$post->ID,
			\Google\Web_Stories\Media\Video\Video_Meta::VIDEOS_POST_META_KEY,
			[
				[
					'length'       => 60,
					'src'          => 'http://www.example.com/test.mp4',
					'poster'       => 'http://www.example.com/test.jpg',
					'alt'          => 'Alt text',
					'creationDate' => '2022-09-28T15:44:54',
				],

			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
		$this->assertIsArray( $story->get_videos() );
		$this->assertInstanceOf( \Google\Web_Stories\Model\Video::class, $story->get_videos()[0] );
	}

	/**
	 * @covers ::load_from_post
	 * @covers ::load_poster_from_post
	 */
	public function test_load_from_post_with_poster(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => WEB_STORIES_TEST_DATA_DIR . '/paint.jpeg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		wp_maybe_generate_attachment_metadata( get_post( $poster_attachment_id ) );
		set_post_thumbnail( $post->ID, $poster_attachment_id );

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		wp_delete_attachment( $poster_attachment_id, true );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
		$this->assertStringContainsString( 'paint-640x853.jpeg', $story->get_poster_portrait() );
		$this->assertNotEmpty( $story->get_poster_sizes() );
		$this->assertIsString( $story->get_poster_sizes() );
		$this->assertNotEmpty( $story->get_poster_srcset() );
		$this->assertIsString( $story->get_poster_srcset() );
	}

	/**
	 * @covers ::load_from_post
	 * @covers ::load_poster_from_post
	 */
	public function test_load_from_post_with_poster_meta(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		add_post_meta(
			$post->ID,
			\Google\Web_Stories\Story_Post_Type::POSTER_META_KEY,
			[
				'url'        => 'http://www.example.com/image.png',
				'height'     => 1000,
				'width'      => 1000,
				'needsProxy' => false,
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
		$this->assertEquals( 'http://www.example.com/image.png', $story->get_poster_portrait() );
		$this->assertEqualSets( [ 1000, 1000 ], $story->get_poster_portrait_size() );
		$this->assertEmpty( $story->get_poster_srcset() );
	}

	/**
	 * @covers ::load_from_post
	 * @covers ::load_poster_from_post
	 */
	public function test_load_from_post_with_poster_and_poster_meta(): void {
		$post = self::factory()->post->create_and_get(
			[
				'post_title'   => 'test title',
				'post_type'    => \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG,
				'post_content' => '<html><head></head><body><amp-story></amp-story></body></html>',
			]
		);

		$poster_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => WEB_STORIES_TEST_DATA_DIR . '/paint.jpeg',
				'post_parent'    => 0,
				'post_mime_type' => 'image/jpeg',
				'post_title'     => 'Test Image',
			]
		);
		wp_maybe_generate_attachment_metadata( get_post( $poster_attachment_id ) );
		set_post_thumbnail( $post->ID, $poster_attachment_id );

		add_post_meta(
			$post->ID,
			\Google\Web_Stories\Story_Post_Type::POSTER_META_KEY,
			[
				'url'        => 'http://www.example.com/image.png',
				'height'     => 1000,
				'width'      => 1000,
				'needsProxy' => false,
			]
		);

		$story = new \Google\Web_Stories\Model\Story();
		$story->load_from_post( $post );

		wp_delete_attachment( $poster_attachment_id, true );

		$this->assertEquals( $story->get_title(), 'test title' );
		$this->assertEquals( $story->get_url(), get_permalink( $post ) );
		$this->assertStringContainsString( 'paint-640x853.jpeg', $story->get_poster_portrait() );
		$this->assertNotEmpty( $story->get_poster_sizes() );
		$this->assertIsString( $story->get_poster_sizes() );
		$this->assertNotEmpty( $story->get_poster_srcset() );
		$this->assertIsString( $story->get_poster_srcset() );
	}
}
