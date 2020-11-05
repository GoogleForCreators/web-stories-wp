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
 * Plugin URI: https://wp.stories.google/
 * Author: Google
 * Author URI: https://opensource.google.com/
 * Version: 1.1.0
 * Requires at least: 5.3
 * Requires PHP: 5.6
 * Text Domain: web-stories
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

define( 'WEBSTORIES_VERSION', '1.1.0' );
define( 'WEBSTORIES_DB_VERSION', '3.0.2' );
define( 'WEBSTORIES_AMP_VERSION', '2.0.5' ); // Version of the AMP library included in the plugin.
define( 'WEBSTORIES_PLUGIN_FILE', __FILE__ );
define( 'WEBSTORIES_PLUGIN_DIR_PATH', plugin_dir_path( WEBSTORIES_PLUGIN_FILE ) );
define( 'WEBSTORIES_PLUGIN_DIR_URL', plugin_dir_url( WEBSTORIES_PLUGIN_FILE ) );
define( 'WEBSTORIES_ASSETS_URL', WEBSTORIES_PLUGIN_DIR_URL . 'assets' );
define( 'WEBSTORIES_MINIMUM_PHP_VERSION', '5.6' );
define( 'WEBSTORIES_MINIMUM_WP_VERSION', '5.3' );

$cdn_version = false !== strpos( WEBSTORIES_VERSION, '+' ) ? 'main' : explode( '+', WEBSTORIES_VERSION )[0];

define( 'WEBSTORIES_CDN_URL', 'https://wp.stories.google/static/' . $cdn_version );

unset( $cdn_version );

if ( ! defined( 'WEBSTORIES_DEV_MODE' ) ) {
	define( 'WEBSTORIES_DEV_MODE', false );
}

// Autoloader for dependencies.
if ( file_exists( __DIR__ . '/third-party/vendor/scoper-autoload.php' ) ) {
	require __DIR__ . '/third-party/vendor/scoper-autoload.php';
}

// Autoloader for plugin itself.
if ( file_exists( __DIR__ . '/includes/vendor/autoload.php' ) ) {
	require __DIR__ . '/includes/vendor/autoload.php';
}

// Main plugin initialization happens there so that this file is still parsable in PHP < 5.6.
require __DIR__ . '/includes/namespace.php';
