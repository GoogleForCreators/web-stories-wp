<?php
/**
 * PHPUnit bootstrap file.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

require_once __DIR__ . '/../../../vendor/yoast/wp-test-utils/src/BrainMonkey/bootstrap.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../../third-party/vendor/scoper-autoload.php';

define( 'WEBSTORIES_VERSION', '1.0.0' );
define( 'WEBSTORIES_DB_VERSION', '1.0.0' );
define( 'WEBSTORIES_AMP_VERSION', '1.0.0' );

if ( ! defined( 'WEBSTORIES_PLUGIN_DIR_PATH' ) ) {
	define( 'WEBSTORIES_PLUGIN_DIR_PATH', dirname( __DIR__, 3 ) );
}

if ( ! defined( 'WEBSTORIES_PLUGIN_FILE' ) ) {
	define( 'WEBSTORIES_PLUGIN_FILE', WEBSTORIES_PLUGIN_DIR_PATH . 'web-stories.php' );
}
