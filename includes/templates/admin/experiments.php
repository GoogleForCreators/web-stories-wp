<?php
/**
 * Experiments page.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Settings;

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

?>
	<div id="web-stories-experiments" class="wrap">
		<h1><?php esc_html_e( 'Experimental Settings', 'web-stories' ); ?></h1>
		<?php settings_errors(); ?>
		<form method="post" action="options.php">
			<?php settings_fields( Settings::SETTING_GROUP_EXPERIMENTS ); ?>
			<?php do_settings_sections( Experiments::PAGE_NAME ); ?>
			<?php submit_button(); ?>
		</form>
	</div>
<?php
