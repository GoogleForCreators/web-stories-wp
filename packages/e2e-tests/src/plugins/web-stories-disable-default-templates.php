<?php
/**
 * Plugin Name: E2E Tests Disable default templates
 * Plugin URI:  https://github.com/google/web-stories-wp
 * Description: Disable default templates.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 *
 * @package   Google\Site_Kit
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Web_Stories\E2E\DefaultTemplates;

function change_get_settings( array $settings ): array {
	$settings['canViewDefaultTemplates'] = false;

	return $settings;
}
add_filter( 'web_stories_editor_settings', __NAMESPACE__ . '\change_get_settings' );
add_filter( 'web_stories_dashboard_settings', __NAMESPACE__ . '\change_get_settings' );
