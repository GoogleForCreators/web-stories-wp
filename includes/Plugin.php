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

		// Migrations.

		$database_upgrader = new Database_Upgrader();
		add_action( 'admin_init', [ $database_upgrader, 'init' ] );

		// Gutenberg Blocks.
		$embed_block = new Embed_Block();
		add_action( 'init', [ $embed_block, 'init' ] );
	}
}
