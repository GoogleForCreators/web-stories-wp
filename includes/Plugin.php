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
use Google\Web_Stories\REST_API\Stories_Autosaves_Controller;
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

		// Beta version updater.
		$updater = new Updater();
		add_action( 'init', [ $updater, 'init' ], 9 );

		// REST API endpoints.
		// High priority so it runs after create_initial_rest_routes().
		add_action( 'rest_api_init', [ $this, 'register_rest_routes' ], 100 );

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
	}

	/**
	 * Registers REST API routes.
	 *
	 * @return void
	 */
	public function register_rest_routes() {
		$fonts_controller = new Fonts_Controller();
		$fonts_controller->register_routes();

		$link_controller = new Link_Controller();
		$link_controller->register_routes();

		$embed_controller = new Embed_Controller();
		$embed_controller->register_routes();

		$templates_autosaves = new Stories_Autosaves_Controller( Template_Post_Type::POST_TYPE_SLUG );
		$templates_autosaves->register_routes();

		$stories_autosaves = new Stories_Autosaves_Controller( Story_Post_Type::POST_TYPE_SLUG );
		$stories_autosaves->register_routes();
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
