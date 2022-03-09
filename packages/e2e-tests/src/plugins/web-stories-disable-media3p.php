<?php
/**
 * Plugin Name: E2E Tests Disable 3P media.
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Disable 3P media.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 */

namespace Google\Web_Stories\E2E\Media3P;


function change_get_editor_settings( array $settings ): array {
	$settings['showMedia3p'] = false;

	return $settings;
}
add_filter( 'web_stories_editor_settings', __NAMESPACE__ . '\change_get_editor_settings' );
