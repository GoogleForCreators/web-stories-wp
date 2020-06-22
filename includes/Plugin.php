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
		$media = new Media();
		add_action( 'init', [ $media, 'init' ], 9 );

		$story = new Story_Post_Type();
		add_action( 'init', [ $story, 'init' ] );

		$template = new Template_Post_Type();
		add_action( 'init', [ $template, 'init' ] );

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
}
