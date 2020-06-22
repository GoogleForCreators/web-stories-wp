<?php
/**
 * Plugin uninstall handler.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Template_Post_Type;

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

/**
 * Filters whether data should be erased when uninstalling the plugin.
 *
 * @param bool $erase Whether to erase data. Default false.
 */
$erase = (bool) apply_filters( 'web_stories_erase_data_on_uninstall', false );

if ( false === $erase ) {
	return;
}

require_once WEBSTORIES_PLUGIN_DIR_PATH . '/includes/uninstall.php';

\Google\Web_Stories\delete_options();

if ( is_multisite() ) {
	\Google\Web_Stories\delete_site_options();
}

\Google\Web_Stories\delete_post_meta();

\Google\Web_Stories\delete_posts();
