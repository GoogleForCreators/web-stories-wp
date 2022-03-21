<?php
/**
 * Plugin Name: E2E Tests Disable default templates
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Disable default templates.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 *
 * @copyright 2022 Google LLC
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

namespace Google\Web_Stories\E2E\DefaultTemplates;

function change_get_settings( array $settings ): array {
	$settings['canViewDefaultTemplates'] = false;

	return $settings;
}
add_filter( 'web_stories_editor_settings', __NAMESPACE__ . '\change_get_settings' );
add_filter( 'web_stories_dashboard_settings', __NAMESPACE__ . '\change_get_settings' );
