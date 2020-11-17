<?php
/**
 * Class Discovery.
 *
 * Responsible for improved discovery of stories on the web.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

use Google\Web_Stories\Traits\Publisher;

use WP_Post;

/**
 * Discovery class.
 */
class Discovery {
	use Publisher;
	/**
	 * Initialize discovery functionality.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'web_stories_story_head', [ $this, 'print_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_schemaorg_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_open_graph_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_twitter_metadata' ] );

		add_action( 'web_stories_story_head', [ $this, 'print_feed_link' ], 4 );

		// @todo Check if there's something to skip in the new version.
		add_action( 'web_stories_story_head', 'rest_output_link_wp_head', 10, 0 );
		add_action( 'web_stories_story_head', 'wp_resource_hints', 2 );
		add_action( 'web_stories_story_head', 'feed_links', 2 );
		add_action( 'web_stories_story_head', 'feed_links_extra', 3 );
		add_action( 'web_stories_story_head', 'rsd_link' );
		add_action( 'web_stories_story_head', 'wlwmanifest_link' );
		add_action( 'web_stories_story_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );
		add_action( 'web_stories_story_head', 'noindex', 1 );
		add_action( 'web_stories_story_head', 'wp_generator' );
		add_action( 'web_stories_story_head', 'rel_canonical' );
		add_action( 'web_stories_story_head', 'wp_shortlink_wp_head', 10, 0 );
		add_action( 'web_stories_story_head', 'wp_site_icon', 99 );
		add_action( 'web_stories_story_head', 'wp_oembed_add_discovery_links' );
	}

	/**
	 * Prints general metadata on the single story template.
	 *
	 * Theme support for title tag is implied for stories.
	 *
	 * @see _wp_render_title_tag().
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function print_metadata() {
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
	 *
	 * @return void
	 */
	public function print_schemaorg_metadata() {
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
	 * @return array $metadata All schema.org metadata for the post.
	 */
	protected function get_schemaorg_metadata() {
		$publisher = $this->get_publisher_data();

		$metadata = [
			'@context'  => 'http://schema.org',
			'publisher' => [
				'@type' => 'Organization',
				'name'  => $publisher['name'],
				// @todo: Provide width, height, caption, et al.
				'logo'  => [
					'@type' => 'ImageObject',
					'url'   => $publisher['logo'],
				],
			],
		];

		/**
		 * We're expecting a post object.
		 *
		 * @var WP_Post $post
		 */
		$post = get_queried_object();

		if ( $post instanceof WP_Post ) {
			$metadata = array_merge(
				$metadata,
				[
					'@type'            => 'Article',
					'mainEntityOfPage' => get_permalink( $post ),
					'headline'         => get_the_title( $post ),
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

			if ( has_post_thumbnail( $post->ID ) ) {
				$metadata['image'] = wp_get_attachment_image_url( (int) get_post_thumbnail_id( $post->ID ), 'full' );
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
	 * Prints Open Graph metadata.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function print_open_graph_metadata() {
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
		?>
		<meta property="og:locale" content="<?php echo esc_attr( get_bloginfo( 'language' ) ); ?>" />
		<meta property="og:type" content="article" />
		<meta property="og:title" content="<?php the_title_attribute(); ?>" />
		<meta property="og:url" content="<?php the_permalink(); ?>">
		<meta property="og:site_name" content="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
		<meta property="og:description" content="<?php echo esc_attr( wp_strip_all_tags( get_the_excerpt() ) ); ?>" />
		<?php
		if ( ! get_post() ) {
			return;
		}
		?>
		<meta property="article:published_time" content="<?php echo esc_attr( (string) get_the_date( 'c' ) ); ?>">
		<meta property="article:modified_time" content="<?php echo esc_attr( (string) get_the_modified_date( 'c' ) ); ?>">
		<?php

		if ( ! has_post_thumbnail() ) {
			return;
		}

		$poster = wp_get_attachment_image_src( (int) get_post_thumbnail_id(), 'full' );

		if ( ! $poster ) {
			return;
		}
		?>
		<meta property="og:image" content="<?php echo esc_url( $poster[0] ); ?>">
		<meta property="og:image:width" content="<?php echo esc_attr( $poster[1] ); ?>">
		<meta property="og:image:height" content="<?php echo esc_attr( $poster[2] ); ?>">
		<?php
	}

	/**
	 * Prints Twitter card metadata.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function print_twitter_metadata() {
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
		?>
		<meta name="twitter:card" content="summary_large_image" />
		<?php

		if ( ! has_post_thumbnail() ) {
			return;
		}

		$poster = wp_get_attachment_image_url( (int) get_post_thumbnail_id(), Media::POSTER_PORTRAIT_IMAGE_SIZE );

		if ( ! $poster ) {
			return;
		}
		?>
		<meta property="twitter:image" content="<?php echo esc_url( $poster ); ?>">
		<?php
	}

	/**
	 * Add RSS feed link for stories, if theme supports automatic-feed-links.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function print_feed_link() {
		if ( ! current_theme_supports( 'automatic-feed-links' ) ) {
			return;
		}

		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );
		if ( ! ( $post_type_object instanceof \WP_Post_Type ) ) {
			return;
		}

		$feed_url = add_query_arg(
			'post_type',
			Story_Post_Type::POST_TYPE_SLUG,
			get_feed_link()
		);

		$name = '';
		if ( property_exists( $post_type_object->labels, 'name' ) ) {
			$name = $post_type_object->labels->name;
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
			esc_url( $feed_url )
		);
	}
}
