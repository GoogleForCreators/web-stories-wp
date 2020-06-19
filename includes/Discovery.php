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

use Google\Web_Stories\REST_API\Stories_Controller;
use WP_Post;

/**
 * Discovery class.
 */
class Discovery {

	const PUBLISHER_LOGOS_OPTION = 'web_stories_publisher_logos';
	/**
	 * Initialize discovery functionality.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'web_stories_story_head', [ $this, 'print_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_schemaorg_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_open_graph_metadata' ] );
		add_action( 'web_stories_story_head', [ $this, 'print_twitter_metadata' ] );

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
	 * @return void
	 */
	public function print_metadata() {
		?>
		<title><?php echo esc_html( wp_get_document_title() ); ?></title>
		<meta name="description" content="<?php echo esc_attr( wp_strip_all_tags( get_the_excerpt() ) ); ?>" />
		<?php
	}

	/**
	 * Prints the schema.org metadata on the single story template.
	 *
	 * @return void
	 */
	public function print_schemaorg_metadata() {
		$metadata = $this->get_schemaorg_metadata();

		?>
		<script type="application/ld+json"><?php echo wp_json_encode( $metadata, JSON_UNESCAPED_UNICODE ); ?></script>
		<?php
	}

	/**
	 * Get schema.org metadata for the current query.
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
		 * @param array $metadata The structured data.
		 * @param WP_Post $post The current post object.
		 */
		return apply_filters( 'web_stories_story_schema_metadata', $metadata, $post );
	}

	/**
	 * Prints Open Graph metadata.
	 *
	 * @return void
	 */
	public function print_open_graph_metadata() {
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
	 * @return void
	 */
	public function print_twitter_metadata() {
		?>
		<meta name="twitter:card" content="summary_large_image" />
		<?php

		if ( ! has_post_thumbnail() ) {
			return;
		}

		$poster = wp_get_attachment_image_url( (int) get_post_thumbnail_id(), Media::STORY_POSTER_IMAGE_SIZE );

		if ( ! $poster ) {
			return;
		}
		?>
		<meta property="twtter:image" content="<?php echo esc_url( $poster ); ?>">
		<?php
	}

	/**
	 * Gets a valid publisher logo URL. Loops through sizes and looks for a square image.
	 *
	 * @param integer $image_id Attachment ID.
	 *
	 * @return string|false Either the URL or false if error.
	 */
	private function get_valid_publisher_image( $image_id ) {
		$logo_image_url = false;

		// Get metadata for finding a square image.
		$metadata = wp_get_attachment_metadata( $image_id );
		if ( empty( $metadata ) ) {
			return $logo_image_url;
		}
		// First lets check if the image is square by default.
		$fullsize_img = wp_get_attachment_image_src( $image_id, 'full', false );
		if ( $metadata['width'] === $metadata['height'] && is_array( $fullsize_img ) ) {
			return array_shift( $fullsize_img );
		}

		if ( empty( $metadata['sizes'] ) ) {
			return $logo_image_url;
		}

		// Loop through other size to find a square image.
		foreach ( $metadata['sizes'] as $size ) {
			if ( $size['width'] === $size['height'] && $size['width'] >= 96 ) {
				$logo_img = wp_get_attachment_image_src( $image_id, [ $size['width'], $size['height'] ], false );
				if ( is_array( $logo_img ) ) {
					return array_shift( $logo_img );
				}
			}
		}

		// If a square image was not found, return the full size nevertheless,
		// the editor should take care of warning about incorrect size.
		return is_array( $fullsize_img ) ? array_shift( $fullsize_img ) : false;
	}

	/**
	 * Get the publisher logo.
	 *
	 * @link https://developers.google.com/search/docs/data-types/article#logo-guidelines
	 * @link https://amp.dev/documentation/components/amp-story/#publisher-logo-src-guidelines
	 *
	 * @return string Publisher logo image URL. WordPress logo if no site icon or custom logo defined, and no logo provided via 'amp_site_icon_url' filter.
	 */
	public function get_publisher_logo() {
		$logo_image_url = null;

		$publisher_logo_settings = get_option( self::PUBLISHER_LOGOS_OPTION, [] );
		$has_publisher_logo      = ! empty( $publisher_logo_settings['active'] );
		if ( $has_publisher_logo ) {
			$publisher_logo_id = absint( $publisher_logo_settings['active'] );
			$logo_image_url    = $this->get_valid_publisher_image( $publisher_logo_id );
		}

		// @todo Once we are enforcing setting publisher logo in the editor, we shouldn't need the fallback options.
		// Currently, it's marked as required but that's not actually enforced.

		// Finding fallback image.
		$custom_logo_id = get_theme_mod( 'custom_logo' );
		if ( empty( $logo_image_url ) && has_custom_logo() && $custom_logo_id ) {
			$logo_image_url = $this->get_valid_publisher_image( $custom_logo_id );
		}

		// Try Site Icon, though it is not ideal for non-Story because it should be square.
		$site_icon_id = get_option( 'site_icon' );
		if ( empty( $logo_image_url ) && $site_icon_id ) {
			$logo_image_url = $this->get_valid_publisher_image( $site_icon_id );
		}

		// Fallback to serving the WordPress logo.
		if ( empty( $logo_image_url ) ) {
			$logo_image_url = WEBSTORIES_PLUGIN_DIR_URL . 'assets/images/fallback-wordpress-publisher-logo.png';
		}

		/**
		 * Filters the publisher's logo.
		 *
		 * This should point to a square image.
		 *
		 * @param string $logo_image_url URL to the publisher's logo.
		 */
		return apply_filters( 'web_stories_publisher_logo', $logo_image_url );
	}


	/**
	 * Publisher logo placeholder for static content output which will be replaced server-side.
	 *
	 * Uses a fallback logo to always create valid AMP in FE.
	 *
	 * @return string
	 */
	public function get_publisher_logo_placeholder() {
		return WEBSTORIES_PLUGIN_DIR_URL . 'assets/images/fallback-wordpress-publisher-logo.png';
	}

	/**
	 * Returns the publisher data.
	 *
	 * @return array Publisher name and logo.
	 */
	public function get_publisher_data() {
		$publisher      = get_bloginfo( 'name' );
		$publisher_logo = $this->get_publisher_logo();

		return [
			'name' => $publisher,
			'logo' => $publisher_logo,
		];
	}
}
