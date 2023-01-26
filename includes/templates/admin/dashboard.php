<?php
/**
 * Stories dashboard.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

use Google\Web_Stories\Admin\Dashboard;
use Google\Web_Stories\Services;

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

// don't load directly.
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

$dashboard_settings = Services::get( 'dashboard' )->get_dashboard_settings();

$init_script = <<<'JS'
	wp.domReady( function() {
	  webStories.initializeStoryDashboard( 'web-stories-dashboard', %s );
	} );
JS;

$script = sprintf( $init_script, wp_json_encode( $dashboard_settings ) );

wp_add_inline_script( Dashboard::SCRIPT_HANDLE, $script );

?>

<div class="web-stories-wp">
	<h1 class="screen-reader-text hide-if-no-js"><?php esc_html_e( 'Web Stories', 'web-stories' ); ?></h1>
	<div id="web-stories-dashboard" class="web-stories-dashboard-app-container hide-if-no-js">
		<h1 class="loading-message"><?php esc_html_e( 'Please wait...', 'web-stories' ); ?></h1>
	</div>

	<?php // JavaScript is disabled. ?>
	<div class="wrap hide-if-js web-stories-wp-no-js">
		<h1 class="wp-heading-inline"><?php esc_html_e( 'Web Stories', 'web-stories' ); ?></h1>
		<div class="notice notice-error notice-alt">
			<p><?php esc_html_e( 'Web Stories for WordPress requires JavaScript. Please enable JavaScript in your browser settings.', 'web-stories' ); ?></p>
		</div>
	</div>
</div>
