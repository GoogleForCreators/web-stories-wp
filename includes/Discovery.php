<?php
/**
 * Class Discovery.
 *
 * Responsible for improved discovery of stories on the web.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Shopping\Product_Meta;
use WP_Post;

/**
 * Discovery class.
 *
 * @phpstan-import-type ProductData from \Google\Web_Stories\Shopping\Product
 */
class Discovery extends Service_Base implements HasRequirements {

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Product_Meta instance.
	 *
	 * @var Product_Meta Product_Meta instance.
	 */
	private $product_meta;

	/**
	 * Constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 * @param Product_Meta    $product_meta Product_Meta instance.
	 */
	public function __construct( Story_Post_Type $story_post_type, Product_Meta $product_meta ) {
		$this->story_post_type = $story_post_type;
		$this->product_meta    = $product_meta;
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'story_post_type', 'product_meta' ];
	}

	/**
	 * Initialize discovery functionality.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		add_action( 'web_stories_story_head', [ $this, 'print_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_schemaorg_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_open_graph_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_twitter_metadata' ] );

		add_action( 'web_stories_story_head', [ $this, 'print_feed_link' ], 4 );
		add_action( 'wp_head', [ $this, 'print_feed_link' ], 4 );

		// @todo Check if there's something to skip in the new version.
		add_action( 'web_stories_story_head', 'rest_output_link_wp_head', 10, 0 );
		add_action( 'web_stories_story_head', 'wp_resource_hints', 2 );
		add_action( 'web_stories_story_head', 'feed_links', 2 );
		add_action( 'web_stories_story_head', 'feed_links_extra', 3 );
		add_action( 'web_stories_story_head', 'rsd_link' );
		add_action( 'web_stories_story_head', 'wlwmanifest_link' );
		add_action( 'web_stories_story_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );
		add_action( 'web_stories_story_head', 'wp_generator' );
		add_action( 'web_stories_story_head', 'rel_canonical' );
		add_action( 'web_stories_story_head', 'wp_shortlink_wp_head', 10, 0 );
		add_action( 'web_stories_story_head', 'wp_site_icon', 99 );
		add_action( 'web_stories_story_head', 'wp_oembed_add_discovery_links' );
		add_action( 'web_stories_story_head', 'wp_robots', 1 );
	}

	/**
	 * Prints general metadata on the single story template.
	 *
	 * Theme support for title tag is implied for stories.
	 *
	 * @since 1.0.0
	 *
	 * @see _wp_render_title_tag().
	 */
	public function print_metadata(): void {
		/**
		 * Filters filter to enable / disable metadata
		 *
		 * @since 1.2.0
		 *
		 * @param bool $enable_open_graph Enable / disable metadata. Default to true.
		 */
		$enable_metadata = apply_filters( 'web_stories_enable_metadata', true );
		if ( ! $enable_metadata ) {
			return;
		}
		?>
		<title><?php echo esc_html( wp_get_document_title() ); ?></title>
		<meta name="description" content="<?php echo esc_attr( wp_strip_all_tags( get_the_excerpt() ) ); ?>" />
		<?php
	}

	/**
	 * Prints the schema.org metadata on the single story template.
	 *
	 * @since 1.0.0
	 */
	public function print_schemaorg_metadata(): void {
		/**
		 * Filters filter to enable / disable schemaorg metadata.
		 *
		 * @since 1.2.0
		 *
		 * @param bool $enable_schemaorg_metadata Enable / disable schemaorg metadata. Default to true.
		 */
		$enable_schemaorg_metadata = apply_filters( 'web_stories_enable_schemaorg_metadata', true );
		if ( ! $enable_schemaorg_metadata ) {
			return;
		}
		$metadata = $this->get_schemaorg_metadata();

		?>
		<script type="application/ld+json"><?php echo wp_json_encode( $metadata, JSON_UNESCAPED_UNICODE ); ?></script>
		<?php
	}

	/**
	 * Get schema.org metadata for the current query.
	 *
	 * @since 1.0.0
	 *
	 * @see https://developers.google.com/search/docs/guides/enable-web-stories
	 *
	 * @return array<string,mixed> $metadata All schema.org metadata for the post.
	 */
	protected function get_schemaorg_metadata(): array {
		/**
		 * We're expecting a post object.
		 *
		 * @var WP_Post $post
		 */
		$post = get_queried_object();

		$story = new Story();
		$story->load_from_post( $post );

		$metadata = [
			'@context'  => 'http://schema.org',
			'publisher' => [
				'@type' => 'Organization',
				'name'  => $story->get_publisher_name(),
			],
		];

		if ( $post instanceof WP_Post ) {
			$url  = $story->get_publisher_logo_url();
			$size = $story->get_publisher_logo_size();
			if ( ! empty( $url ) && ! empty( $size ) ) {
				$metadata['publisher']['logo'] = [
					'@type'  => 'ImageObject',
					'url'    => $url,
					'width'  => $size[0],
					'height' => $size[1],
				];
			}

			$poster      = $story->get_poster_portrait();
			$poster_size = $story->get_poster_portrait_size();
			if ( $poster && $poster_size ) {
				$metadata['image'] = [
					'@type'  => 'ImageObject',
					'url'    => $poster,
					'width'  => $poster_size[0],
					'height' => $poster_size[1],
				];

			}

			$metadata = array_merge(
				$metadata,
				[
					'@type'            => 'Article',
					'mainEntityOfPage' => $story->get_url(),
					'headline'         => $story->get_title(),
					'datePublished'    => mysql2date( 'c', $post->post_date_gmt, false ),
					'dateModified'     => mysql2date( 'c', $post->post_modified_gmt, false ),
				]
			);

			$post_author = get_userdata( (int) $post->post_author );

			if ( $post_author ) {
				$metadata['author'] = [
					'@type' => 'Person',
					'name'  => html_entity_decode( $post_author->display_name, ENT_QUOTES, get_bloginfo( 'charset' ) ),
				];
			}


			/**
			 * List of products.
			 *
			 * @phpstan-var ProductData[] $products
			 */
			$products         = $this->product_meta->get_products( $post->ID );
			$product_metadata = $this->get_product_data( $products );
			if ( $product_metadata ) {
				$metadata = array_merge( $product_metadata, $metadata );
			}
		}

		/**
		 * Filters the schema.org metadata for a given story.
		 *
		 * @since 1.0.0
		 *
		 * @param array $metadata The structured data.
		 * @param WP_Post $post The current post object.
		 */
		return apply_filters( 'web_stories_story_schema_metadata', $metadata, $post );
	}

	/**
	 * Get product schema data.
	 *
	 * @since 1.22.0
	 *
	 * @param array<int, array<string, mixed>> $products Array of products.
	 * @return array<string, array<string, array<int, array<string, mixed>>|string>>
	 *
	 * @phpstan-param ProductData[] $products
	 */
	protected function get_product_data( array $products ): array {
		if ( ! $products ) {
			return [];
		}
		$product_data = [];
		foreach ( $products as $product ) {
			$data = [
				'@type'       => 'Product',
				'brand'       => $product['productBrand'] ?? '',
				'productID'   => $product['productId'] ?? '',
				'url'         => $product['productUrl'] ?? '',
				'name'        => $product['productTitle'] ?? '',
				'description' => $product['productDetails'] ?? '',
				'offers'      => [
					[
						'@type'         => 'Offer',
						'price'         => $product['productPrice'] ?? 0,
						'priceCurrency' => $product['productPriceCurrency'] ?? '',
					],
				],
			];
			if ( isset( $product['productImages'] ) && $product['productImages'] ) {
				$data['image'] = $product['productImages'][0]['url'];
			}
			if ( ! empty( $product['aggregateRating']['reviewCount'] ) ) {
				$data['aggregateRating'] = [
					'@type'       => 'AggregateRating',
					'ratingValue' => $product['aggregateRating']['ratingValue'] ?? 0,
					'reviewCount' => $product['aggregateRating']['reviewCount'],
					'url'         => $product['aggregateRating']['reviewUrl'] ?? '',
				];
			}
			$product_data[] = $data;
		}

		return [
			'mainEntity' => [
				'@type'           => 'ItemList',
				'numberOfItems'   => (string) \count( $products ),
				'itemListElement' => $product_data,
			],
		];
	}

	/**
	 * Prints Open Graph metadata.
	 *
	 * @since 1.0.0
	 */
	public function print_open_graph_metadata(): void {
		/**
		 * Filters filter to enable / disable open graph metadata.
		 *
		 * @since 1.2.0
		 *
		 * @param bool $enable_open_graph_metadata Enable / disable open graph metadata. Default to true.
		 */
		$enable_open_graph_metadata = apply_filters( 'web_stories_enable_open_graph_metadata', true );
		if ( ! $enable_open_graph_metadata ) {
			return;
		}

		$metadata = $this->get_open_graph_metadata();

		foreach ( $metadata as $name => $value ) {
			printf( '<meta property="%s" content="%s" />', esc_attr( $name ), esc_attr( (string) $value ) );
		}
	}

	/**
	 * Get Open Graph metadata.
	 *
	 * @since 1.3.0
	 *
	 * @return array<string, string|int>
	 */
	protected function get_open_graph_metadata(): array {
		$metadata = [
			'og:locale'    => get_bloginfo( 'language' ),
			'og:site_name' => get_bloginfo( 'name' ),
		];

		/**
		 * We're expecting a post object.
		 *
		 * @var WP_Post $post
		 */
		$post = get_queried_object();

		if ( $post instanceof WP_Post ) {

			$story = new Story();
			$story->load_from_post( $post );

			$metadata['og:type']                = 'article';
			$metadata['og:title']               = $story->get_title();
			$metadata['og:url']                 = $story->get_url();
			$metadata['og:description']         = wp_strip_all_tags( get_the_excerpt( $post ) );
			$metadata['article:published_time'] = (string) get_the_date( 'c', $post );
			$metadata['article:modified_time']  = (string) get_the_modified_date( 'c', $post );

			$poster_url   = $story->get_poster_portrait();
			$poster_sizes = $story->get_poster_portrait_size();
			if ( $poster_url && $poster_sizes ) {
				$metadata['og:image']        = esc_url( $poster_url );
				$metadata['og:image:width']  = $poster_sizes[0];
				$metadata['og:image:height'] = $poster_sizes[1];
			}
		}

		/**
		 * Filters the open graph metadata for a given story.
		 *
		 * @since 1.3.0
		 *
		 * @param array $metadata The structured data.
		 * @param WP_Post $post The current post object.
		 */
		return apply_filters( 'web_stories_story_open_graph_metadata', $metadata, $post );
	}

	/**
	 * Prints Twitter card metadata.
	 *
	 * @since 1.0.0
	 */
	public function print_twitter_metadata(): void {
		/**
		 * Filters filter to enable / disable twitter metadata.
		 *
		 * @since 1.2.0
		 *
		 * @param bool $enable_twitter_metadata Enable / disable twitter metadata. Default to true.
		 */
		$enable_twitter_metadata = apply_filters( 'web_stories_enable_twitter_metadata', true );
		if ( ! $enable_twitter_metadata ) {
			return;
		}
		$metadata = $this->get_twitter_metadata();

		foreach ( $metadata as $name => $value ) {
			printf( '<meta name="%s" content="%s" />', esc_attr( $name ), esc_attr( $value ) );
		}
	}

	/**
	 * Get Twitter card metadata.
	 *
	 * @since 1.3.0
	 *
	 * @return array<string, string> Twitter card metadata.
	 */
	protected function get_twitter_metadata(): array {
		$metadata = [
			'twitter:card' => 'summary_large_image',
		];

		/**
		 * We're expecting a post object.
		 *
		 * @var WP_Post $post
		 */
		$post = get_queried_object();

		if ( $post instanceof WP_Post ) {
			$story = new Story();
			$story->load_from_post( $post );
			$poster = $story->get_poster_portrait();
			if ( $poster ) {
				$metadata['twitter:image']     = esc_url( $poster );
				$metadata['twitter:image:alt'] = $story->get_title();
			}
		}

		/**
		 * Filters the twitter metadata for a given story.
		 *
		 * @since 1.3.0
		 *
		 * @param array $metadata The structured data.
		 * @param WP_Post $post The current post object.
		 */
		return apply_filters( 'web_stories_story_twitter_metadata', $metadata, $post );
	}

	/**
	 * Add RSS feed link for stories, if theme supports automatic-feed-links.
	 *
	 * @since 1.0.0
	 */
	public function print_feed_link(): void {
		if ( ! current_theme_supports( 'automatic-feed-links' ) ) {
			return;
		}

		$name = $this->story_post_type->get_label( 'name' );
		if ( ! $name ) {
			return;
		}

		$feed = get_post_type_archive_feed_link( $this->story_post_type->get_slug() );
		if ( ! $feed ) {
			return;
		}

		/* translators: Separator between blog name and feed type in feed links. */
		$separator = _x( '&raquo;', 'feed link', 'web-stories' );
		/* translators: 1: Blog name, 2: Separator (raquo), 3: Post type name. */
		$post_type_title = esc_html__( '%1$s %2$s %3$s Feed', 'web-stories' );

		$title = sprintf( $post_type_title, get_bloginfo( 'name' ), $separator, $name );

		printf(
			'<link rel="alternate" type="%s" title="%s" href="%s">',
			esc_attr( feed_content_type() ),
			esc_attr( $title ),
			esc_url( $feed )
		);
	}
}
