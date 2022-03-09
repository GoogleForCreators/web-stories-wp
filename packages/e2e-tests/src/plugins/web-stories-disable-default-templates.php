<?php
/**
 * Plugin Name: E2E Tests Disable default templates
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Disable default templates.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 */

namespace Google\Web_Stories\E2E\DefaultTemplates;

function change_get_settings( array $settings ): array {
	$settings['canViewDefaultTemplates'] = false;

	return $settings;
}
add_filter( 'web_stories_editor_settings', __NAMESPACE__ . '\change_get_settings' );
add_filter( 'web_stories_dashboard_settings', __NAMESPACE__ . '\change_get_settings' );
