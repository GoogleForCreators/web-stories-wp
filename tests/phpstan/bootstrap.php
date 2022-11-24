<?php
/*
 * Global constants used in the analysed code need to be defined in bootstrap files.
 */
if ( ! defined( 'WEBSTORIES_VERSION' ) ) {
	define( 'WEBSTORIES_VERSION', '0.0.0' );
}
if ( ! defined( 'WEBSTORIES_DB_VERSION' ) ) {
	define( 'WEBSTORIES_DB_VERSION', '0.0.0' );
}
if ( ! defined( 'WEBSTORIES_AMP_VERSION' ) ) {
	define( 'WEBSTORIES_AMP_VERSION', '0.0.0' );
}
if ( ! defined( 'WEBSTORIES_PLUGIN_FILE' ) ) {
	define( 'WEBSTORIES_PLUGIN_FILE', dirname( __DIR__, 2 ) . '/web-stories.php' ); // phpcs:ignore PHPCompatibility.FunctionUse.NewFunctionParameters.dirname_levelsFound
}
if ( ! defined( 'WEBSTORIES_PLUGIN_DIR_PATH' ) ) {
	define( 'WEBSTORIES_PLUGIN_DIR_PATH', dirname( WEBSTORIES_PLUGIN_FILE ) );
}
define( 'WEBSTORIES_PLUGIN_DIR_URL', 'https://example.com/wp-content/plugins/web-stories/' );
define( 'WEBSTORIES_CDN_URL', 'https://wp.stories.google/static/main/' );
define( 'WEBSTORIES_MINIMUM_PHP_VERSION', '5.6' );
define( 'WEBSTORIES_MINIMUM_WP_VERSION', '5.3' );
define( 'WEBSTORIES_DEV_MODE', true );

define( 'WPCOM_IS_VIP_ENV', true );

define( 'AMP__VERSION', '1.2.3' );
