<?php
/**
 * Plugin Name: E2E Tests Site kit adsense mock
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Utility plugin to mock sitekit adsense
 * Author:      Google
 * Author URI:  https://opensource.google.com
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\E2E\Sitekit\Adsense;

define( 'GOOGLESITEKIT_VERSION', '1.0.0' );

/**
 * Force adsense to be enabled.
 *
 * @param $current
 *
 * @return string[]
 */
function mock_enable_active_modules( $current ) {
	return [ 'adsense' ];
}
add_filter( 'pre_option_googlesitekit_active_modules', __NAMESPACE__ . '\mock_enable_active_modules' );


/**
 * Force adsense snippet to be enabled.
 *
 * @param $current
 *
 * @return string[]
 */
function mock_enable_adsense_settings( $current ) {
	return [
		'useSnippet'       => true,
		'webStoriesAdUnit' => '123456',
		'clientID'         => '98765',
	];
}
add_filter( 'pre_option_googlesitekit_adsense_settings', __NAMESPACE__ . '\mock_enable_adsense_settings' );
