<?php

define( 'WEBSTORIES_VERSION', '0.0.0' );
define( 'WEBSTORIES_DB_VERSION', '0.0.0' );
define( 'WEBSTORIES_PLUGIN_FILE', dirname( __DIR__, 2 ) . '/web-stories.php' ); // phpcs:ignore PHPCompatibility.FunctionUse.NewFunctionParameters.dirname_levelsFound
define( 'WEBSTORIES_PLUGIN_DIR_PATH', dirname( WEBSTORIES_PLUGIN_FILE ) );
define( 'WEBSTORIES_PLUGIN_DIR_URL', 'https://example.com/wp-content/plugins/web-stories/' );
define( 'WEBSTORIES_ASSETS_URL', 'https://example.com/wp-content/plugins/web-stories/assets/' );
define( 'WEBSTORIES_CDN_URL', 'https://wp.stories.google/static/main/' );
define( 'WEBSTORIES_MINIMUM_PHP_VERSION', '5.6' );
define( 'WEBSTORIES_MINIMUM_WP_VERSION', '5.3' );
define( 'WEBSTORIES_DEV_MODE', true );

// WordPress.com VIP compatibility
define( 'WPCOM_IS_VIP_ENV', true );
function wpcom_vip_url_to_postid( $url ) {
	return 123;
}

class WP_CLI {
	public static function warning( $text ) {
	}
}

function is_amp_endpoint() {
	return false;
}
