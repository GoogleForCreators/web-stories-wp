<?php
/**
 * Main Plugin class.
 *
 * Responsible for initializing the plugin.
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

use Google\Web_Stories\REST_API\Embed_Controller;
use Google\Web_Stories\REST_API\Fonts_Controller;
use Google\Web_Stories\REST_API\Link_Controller;
use WP_Post;

/**
 * Plugin class.
 */
class Plugin {
	/**
	 * Initialize plugin functionality.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'init', [ Media::class, 'init' ], 9 );
		add_action( 'init', [ Story_Post_Type::class, 'init' ] );
		add_action( 'init', [ Template_Post_Type::class, 'init' ] );

		// REST API endpoints.

		$fonts_controller = new Fonts_Controller();
		add_action( 'rest_api_init', [ $fonts_controller, 'register_routes' ] );

		$link_controller = new Link_Controller();
		add_action( 'rest_api_init', [ $link_controller, 'register_routes' ] );

		$embed_controller = new Embed_Controller();
		add_action( 'rest_api_init', [ $embed_controller, 'register_routes' ] );

		// Dashboard.
		$dashboard = new Dashboard();
		add_action( 'init', [ $dashboard, 'init' ] );

		// Admin-related functionality.
		$admin = new Admin();
		add_action( 'admin_init', [ $admin, 'init' ] );

		// Gutenberg Blocks.
		$embed_block = new Embed_Block();
		add_action( 'init', [ $embed_block, 'init' ] );

		// Frontend.
		$discovery = new Discovery();
		add_action( 'init', [ $discovery, 'init' ] );

		add_filter( 'googlesitekit_amp_gtag_opt', [ $this, 'filter_site_kit_gtag_opt' ] );

		// Everything else.
		add_filter( 'wp_kses_allowed_html', [ __CLASS__, 'filter_kses_allowed_html' ], 10, 2 );
	}

	/**
	 * Filter the allowed tags for KSES to allow for amp-story children.
	 *
	 * @param array|string $allowed_tags Allowed tags.
	 *
	 * @return array|string Allowed tags.
	 */
	public static function filter_kses_allowed_html( $allowed_tags ) {
		if ( ! is_array( $allowed_tags ) ) {
			return $allowed_tags;
		}

		$story_components = [
			'amp-story'                 => [
				'background-audio'     => true,
				'live-story'           => true,
				'live-story-disabled'  => true,
				'poster-landscape-src' => true,
				'poster-portrait-src'  => true,
				'poster-square-src'    => true,
				'publisher'            => true,
				'publisher-logo-src'   => true,
				'standalone'           => true,
				'supports-landscape'   => true,
				'title'                => true,
			],
			'amp-story-page'            => [
				'auto-advance-after' => true,
				'background-audio'   => true,
				'id'                 => true,
			],
			'amp-story-page-attachment' => [
				'theme' => true,
			],
			'amp-story-grid-layer'      => [
				'position' => true,
				'template' => true,
			],
			'amp-story-cta-layer'       => [],
			'amp-img'                   => [
				'alt'                       => true,
				'attribution'               => true,
				'data-amp-bind-alt'         => true,
				'data-amp-bind-attribution' => true,
				'data-amp-bind-src'         => true,
				'data-amp-bind-srcset'      => true,
				'lightbox'                  => true,
				'lightbox-thumbnail-id'     => true,
				'media'                     => true,
				'noloading'                 => true,
				'object-fit'                => true,
				'object-position'           => true,
				'placeholder'               => true,
				'src'                       => true,
				'srcset'                    => true,
			],
			'amp-video'                 => [
				'album'                      => true,
				'alt'                        => true,
				'artist'                     => true,
				'artwork'                    => true,
				'attribution'                => true,
				'autoplay'                   => true,
				'controls'                   => true,
				'controlslist'               => true,
				'crossorigin'                => true,
				'data-amp-bind-album'        => true,
				'data-amp-bind-alt'          => true,
				'data-amp-bind-artist'       => true,
				'data-amp-bind-artwork'      => true,
				'data-amp-bind-attribution'  => true,
				'data-amp-bind-controls'     => true,
				'data-amp-bind-controlslist' => true,
				'data-amp-bind-loop'         => true,
				'data-amp-bind-poster'       => true,
				'data-amp-bind-preload'      => true,
				'data-amp-bind-src'          => true,
				'data-amp-bind-title'        => true,
				'disableremoteplayback'      => true,
				'dock'                       => true,
				'lightbox'                   => true,
				'lightbox-thumbnail-id'      => true,
				'loop'                       => true,
				'media'                      => true,
				'muted'                      => true,
				'noaudio'                    => true,
				'noloading'                  => true,
				'object-fit'                 => true,
				'object-position'            => true,
				'placeholder'                => true,
				'poster'                     => true,
				'preload'                    => true,
				'rotate-to-fullscreen'       => true,
				'src'                        => true,
			],
			'img'                       => [
				'alt'           => true,
				'attribution'   => true,
				'border'        => true,
				'decoding'      => true,
				'height'        => true,
				'importance'    => true,
				'intrinsicsize' => true,
				'ismap'         => true,
				'loading'       => true,
				'longdesc'      => true,
				'sizes'         => true,
				'src'           => true,
				'srcset'        => true,
				'srcwidth'      => true,
			],
		];

		$allowed_tags = array_merge( $allowed_tags, $story_components );

		foreach ( $allowed_tags as &$allowed_tag ) {
			$allowed_tag['animate-in']          = true;
			$allowed_tag['animate-in-duration'] = true;
			$allowed_tag['animate-in-delay']    = true;
			$allowed_tag['animate-in-after']    = true;
			$allowed_tag['layout']              = true;
		}

		return $allowed_tags;
	}

	/**
	 * Filters the gtag configuration options for the amp-analytics tag.
	 *
	 * @see https://blog.amp.dev/2019/08/28/analytics-for-your-amp-stories/
	 * @see https://github.com/ampproject/amphtml/blob/master/extensions/amp-story/amp-story-analytics.md
	 *
	 * @param array $gtag_opt Array of gtag configuration options.
	 * @return array Modified configuration options.
	 */
	public function filter_site_kit_gtag_opt( $gtag_opt ) {
		if ( ! is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return $gtag_opt;
		}

		$post = get_post();

		if ( ! $post instanceof WP_Post ) {
			return $gtag_opt;
		}

		$title       = get_the_title( $post );
		$story_id    = $post->ID;
		$tracking_id = $gtag_opt['vars']['gtag_id'];

		$gtag_opt['triggers'] = $gtag_opt['triggers'] ?: [];

		if ( ! isset( $gtag_opt['triggers']['storyProgress'] ) ) {
			$gtag_opt['triggers']['storyProgress'] = [
				'on'   => 'story-page-visible',
				'vars' => [
					'event_name'     => 'custom',
					'event_action'   => 'story_progress',
					'event_category' => $title,
					'event_label'    => $story_id,
					'send_to'        => [
						$tracking_id,
					],
				],
			];
		}

		if ( ! isset( $gtag_opt['triggers']['storyEnd'] ) ) {
			$gtag_opt['triggers']['storyEnd'] = [
				'on'   => 'story-last-page-visible',
				'vars' => [
					'event_name'     => 'custom',
					'event_action'   => 'story_complete',
					'event_category' => $title,
					'send_to'        => [
						$tracking_id,
					],
				],
			];
		}

		return $gtag_opt;
	}
}
