<?php
/**
 * Class Product_Meta
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\Shopping;

use Google\Web_Stories\Infrastructure\HasMeta;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class Product_Meta.
 *
 * @phpstan-import-type ProductData from \Google\Web_Stories\Shopping\Product
 */
class Product_Meta extends Service_Base implements HasMeta {
	/**
	 * The products meta key.
	 */
	public const PRODUCTS_POST_META_KEY = 'web_stories_products';


	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.22.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'story_post_type' ];
	}

	/**
	 * Init.
	 *
	 * @since 1.22.0
	 */
	public function register(): void {
		$this->register_meta();
	}

	/**
	 * Register meta
	 *
	 * @since 1.22.0
	 */
	public function register_meta(): void {
		register_meta(
			'post',
			self::PRODUCTS_POST_META_KEY,
			[
				'type'           => 'object',
				'description'    => __( 'Products', 'web-stories' ),
				'show_in_rest'   => [
					'schema' => [
						'type'                 => 'object',
						'properties'           => [],
						'additionalProperties' => true,
					],
				],
				'default'        => [],
				'single'         => true,
				'object_subtype' => $this->story_post_type::POST_TYPE_SLUG,
			]
		);
	}

	/**
	 * Get array of products from story ID.
	 *
	 * @since 1.22.0
	 *
	 * @param int $story_id ID of story.
	 * @return array<string, mixed>
	 *
	 * @phpstan-return ProductData[] $products
	 */
	public function get_products( int $story_id ): array {
		/**
		 * Product data.
		 *
		 * @var ProductData[]|false $products
		 */
		$products = get_post_meta( $story_id, self::PRODUCTS_POST_META_KEY, true );

		if ( ! \is_array( $products ) ) {
			return [];
		}

		return $products;
	}

}
