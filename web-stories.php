<?php
/**
 * Main plugin file.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * Plugin Name: Web Stories
 * Description: Visual storytelling for WordPress.
 * Plugin URI: https://wp.stories.google/
 * Author: Google
 * Author URI: https://opensource.google.com/
 * Version: 1.21.0-alpha.0
 * Requires at least: 5.5
 * Requires PHP: 7.2
 * Text Domain: web-stories
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2020 Google LLC
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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WEBSTORIES_VERSION', '1.21.0-alpha.0' );
define( 'WEBSTORIES_DB_VERSION', '3.0.14' );
define( 'WEBSTORIES_AMP_VERSION', '2.3.0-alpha' ); // Version of the AMP library included in the plugin.
define( 'WEBSTORIES_PLUGIN_FILE', __FILE__ );
define( 'WEBSTORIES_PLUGIN_DIR_PATH', plugin_dir_path( WEBSTORIES_PLUGIN_FILE ) );
define( 'WEBSTORIES_PLUGIN_DIR_URL', plugin_dir_url( WEBSTORIES_PLUGIN_FILE ) );
define( 'WEBSTORIES_MINIMUM_PHP_VERSION', '7.2.24' );
define( 'WEBSTORIES_MINIMUM_WP_VERSION', '5.5' );
define( 'WEBSTORIES_CDN_URL', 'https://wp.stories.google/static/main' );

if ( ! defined( 'WEBSTORIES_DEV_MODE' ) ) {
	define( 'WEBSTORIES_DEV_MODE', false );
}

/**
 * Setup web stories compatibility class.
 *
 * @SuppressWarnings(PHPMD.MissingImport)
 *
 * @since 1.2.0
 *
 * @return Web_Stories_Compatibility
 */
function web_stories_get_compat_instance() {
	$error      = new \WP_Error();
	$extensions = array(
		'date'   => array(
			'classes' => array(
				'DateTimeImmutable',
			),
		),
		'dom'    => array(
			'classes' => array(
				'DOMAttr',
				'DOMComment',
				'DOMDocument',
				'DOMElement',
				'DOMNode',
				'DOMNodeList',
				'DOMText',
				'DOMXPath',
			),
		),
		'json'   => array(
			'functions' => array(
				'json_decode',
				'json_encode',
			),
		),
		'libxml' => array(
			'functions' => array(
				'libxml_use_internal_errors',
				'libxml_clear_errors',
			),
		),
		'spl'    => array(
			'functions' => array(
				'spl_autoload_register',
			),
		),
	);

	// Load Compatibility class the old fashioned way.
	if ( ! class_exists( 'Web_Stories_Compatibility' ) ) {
		require_once WEBSTORIES_PLUGIN_DIR_PATH . '/includes/compat/Web_Stories_Compatibility.php';
	}

	$compatibility = new Web_Stories_Compatibility( $error );
	$compatibility->set_extensions( $extensions );
	$compatibility->set_php_version( WEBSTORIES_MINIMUM_PHP_VERSION );
	$compatibility->set_wp_version( WEBSTORIES_MINIMUM_WP_VERSION );
	$compatibility->set_required_files(
		array(
			WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/wp-story-editor.js',
			WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/wp-dashboard.js',
			WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/web-stories-block.js',
			WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php',
			WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php',
		)
	);

	return $compatibility;
}

/**
 * Displays an admin notice about why the plugin is unable to load.
 *
 * @since 1.0.0
 *
 * @return void
 */
function web_stories_print_admin_notice() {
	$compatibility = web_stories_get_compat_instance();

	$compatibility->run_checks();
	$_error = $compatibility->get_error();
	if ( ! $_error->errors ) {
		return;
	}

	?>
	<div class="notice notice-error">
		<p><strong><?php esc_html_e( 'Web Stories plugin could not be initialized.', 'web-stories' ); ?></strong></p>
		<ul>
			<?php
			foreach ( array_keys( $_error->errors ) as $error_code ) {
				$message = $_error->get_error_message( $error_code );
				printf( '<li>%s</li>', wp_kses( $message, array( 'code' => array() ) ) );
			}
			?>
		</ul>
	</div>
	<?php
}
add_action( 'admin_notices', 'web_stories_print_admin_notice' );

$web_stories_compatibility = web_stories_get_compat_instance();
if ( ( defined( 'WP_CLI' ) && WP_CLI ) || 'true' === getenv( 'CI' ) || 'cli' === PHP_SAPI ) {
	// Only check for built php files in a CLI context.
	$web_stories_compatibility->set_required_files(
		array(
			WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php',
			WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php',
		)
	);
	$web_stories_compatibility->run_checks();
	$_error = $web_stories_compatibility->get_error();
	if ( $_error->errors ) {
		$heading = esc_html__( 'Web Stories plugin could not be initialized.', 'web-stories' );
		if ( class_exists( '\WP_CLI' ) ) {
			\WP_CLI::warning( $heading );
		} else {
			echo "$heading\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		foreach ( array_keys( $_error->errors ) as $error_code ) {
			$message = $_error->get_error_message( $error_code );
			$body    = htmlspecialchars_decode( wp_strip_all_tags( $message ) );
			if ( class_exists( '\WP_CLI' ) ) {
				\WP_CLI::line( $body );
			} else {
				echo "$body\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		}

		return;
	}
}

if ( ! $web_stories_compatibility->check_required_files() || ! $web_stories_compatibility->check_php_version() || ! $web_stories_compatibility->check_wp_version() ) {
	// However, we still need to stop further execution.
	return;
}

unset( $web_stories_compatibility );

// Autoloader for dependencies.
if ( file_exists( WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php' ) ) {
	require WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php';
}

// Autoloader for plugin itself.
if ( file_exists( WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php' ) ) {
	require WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php';
}

// Main plugin initialization happens there so that this file is still parsable in PHP < 7.0.
require WEBSTORIES_PLUGIN_DIR_PATH . '/includes/namespace.php';
