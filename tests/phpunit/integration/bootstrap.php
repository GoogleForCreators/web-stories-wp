<?php
/*
 * Copyright 2021 Google LLC
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

/**
 * PHPUnit bootstrap file.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

use DG\BypassFinals;
BypassFinals::enable();

require_once dirname( __DIR__, 3 ) . '/vendor/yoast/wp-test-utils/src/WPIntegration/bootstrap-functions.php';

$_tests_dir = Yoast\WPTestUtils\WPIntegration\get_path_to_wp_test_dir();

define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', dirname( __DIR__, 2 ) . '/vendor/yoast/phpunit-polyfills' );

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( __DIR__, 3 ) . '/web-stories.php';
}

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

Yoast\WPTestUtils\WPIntegration\bootstrap_it();

define( 'WEB_STORIES_TEST_DATA_DIR', __DIR__ . '/data' );

/*
 * The mocks in ServiceBasedPluginTest require the WP_Site class
 * (as required by SiteInitializationAware::on_site_initialization)
 * to exist so that it can be mocked.
 * Since this class only exists on Multisite, it is stubbed here conditionally
 * for the sole purpose of making the mocking work.
 */
if ( ! defined( 'WP_TESTS_MULTISITE' ) || ! WP_TESTS_MULTISITE ) {
	require_once __DIR__ . '/stubs/WP_Site.php';
}
