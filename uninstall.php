<?php
/**
 * Plugin uninstall handler.
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

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	return;
}

if ( ! defined( 'WEBSTORIES_VERSION' ) ) {
	define( 'WEBSTORIES_VERSION', '1' );
}

if ( ! defined( 'WEBSTORIES_DEV_MODE' ) ) {
	define( 'WEBSTORIES_DEV_MODE', false );
}

if ( ! defined( 'WEBSTORIES_PLUGIN_DIR_FILE' ) ) {
	define( 'WEBSTORIES_PLUGIN_FILE', __DIR__ . '/web-stories.php' );
}

if ( ! defined( 'WEBSTORIES_PLUGIN_DIR_PATH' ) ) {
	define( 'WEBSTORIES_PLUGIN_DIR_PATH', __DIR__ );
}

if ( ! defined( 'WEBSTORIES_PLUGIN_DIR_URL' ) ) {
	define( 'WEBSTORIES_PLUGIN_DIR_URL', plugin_dir_url( WEBSTORIES_PLUGIN_FILE ) );
}

// Autoloader for dependencies.
if ( file_exists( WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php' ) ) {
	require WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php';
}

// Autoloader for plugin itself.
if ( file_exists( WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php' ) ) {
	require WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php';
}

\Google\Web_Stories\PluginFactory::create()->register();

$erase = (bool) get_option( \Google\Web_Stories\Settings::SETTING_NAME_DATA_REMOVAL );

/**
 * Filters whether data should be erased when uninstalling the plugin.
 *
 * @since 1.0.0
 *
 * @param bool $erase Whether to erase data. Default false.
 */
$erase = (bool) apply_filters( 'web_stories_erase_data_on_uninstall', $erase );

if ( false === $erase ) {
	return;
}

$uninstaller = \Google\Web_Stories\UninstallerFactory::create();
$uninstaller->register();
$uninstaller->on_site_uninstall();
$uninstaller->remove_options();
