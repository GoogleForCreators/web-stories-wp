<?php
/**
 * Plugin Name: E2E Tests Disable 3P media.
 * Plugin URI:  https://github.com/google/web-stories-wp
 * Description: Disable 3P media.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 *
 * @package   Google\Site_Kit
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Web_Stories\E2E\Media3P;


function change_get_editor_settings( array $settings ): array {
	$settings['config']['showMedia3p'] = false;

	return $settings;
}
add_filter( 'web_stories_editor_settings', __NAMESPACE__ . '\change_get_editor_settings' );
