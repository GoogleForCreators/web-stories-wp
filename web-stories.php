<?php
/**
 * Main plugin file.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 *
 * Plugin Name: Web Stories
 * Description: Visual storytelling for WordPress.
 * Plugin URI: https://github.com/google/web-stories-wp
 * Author: Google
 * Author URI: https://opensource.google.com/
 * Version: 1.0.0-alpha
 * Requires at least: 5.3
 * Requires PHP: 5.6
 * Text Domain: web-stories
 * Domain Path: /languages/
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WEBSTORIES_VERSION', '1.0.0-alpha' );
define( 'WEBSTORIES_PLUGIN_FILE', __FILE__ );

if ( PHP_VERSION_ID < 50600 ) {
	return;
}

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	include __DIR__ . '/vendor/autoload.php';
}

/**
 * Initializes the plugin.
 */
function _web_stories_init() {
	\Google\Web_Stories\Story_Post_Type::register();
}

add_action( 'init', '_web_stories_init' );

/**
 * Register AMP REST API endpoints.
 */
function _web_stories_rest_api() {
	// Fonts.
	$controller = new \Google\Web_Stories\REST_API\Fonts_Controller();
	$controller->register_routes();
}

add_action( 'rest_api_init', '_web_stories_rest_api', 10 );
