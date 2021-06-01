<?php
/**
 * Plugin Name: E2E Tests Upload capability.
 * Plugin URI:  https://github.com/google/web-stories-wp
 * Description:  Upload capability.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 *
 * @package   Google\Site_Kit
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Web_Stories\E2E\Uploads;

/**
 * Change web editor settings to set upload capabilities to false.
 *
 * @param array $settings
 *
 * @return array
 */
function change_editor_settings( array $settings ) {
	$settings['config']['capabilities']['hasUploadMediaAction'] = false;

	return $settings;
}
add_filter( 'web_stories_editor_settings', __NAMESPACE__ . '\change_editor_settings'  );

/**
 * Change dashboard settings to set upload capabilities to false.
 *
 * @param array $settings
 *
 * @return array
 */
function change_dashboard_settings( array $settings ) {
	$settings['config']['capabilities']['canUploadFiles'] = false;

	return $settings;
}
add_filter( 'web_stories_dashboard_settings', __NAMESPACE__ . '\change_dashboard_settings'  );
