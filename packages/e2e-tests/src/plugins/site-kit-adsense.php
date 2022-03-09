<?php
/**
 * Plugin Name: E2E Tests Site kit adsense mock
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Utility plugin to mock sitekit adsense
 * Author:      Google
 * Author URI:  https://opensource.google.com
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
