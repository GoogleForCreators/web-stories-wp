<?php
/**
 * Plugin initialization file.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

namespace Google\Web_Stories;

use WP_Error;
use WP_Site;

// Load Compatibility class the old fashioned way.
if ( ! class_exists( '\Google\Web_Stories\Compatibility' ) ) {
	require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/Compatibility.php';
}

global $web_stories_compatibility;

$web_stories_error = new WP_Error();
$extensions        = [
	'date'   => [
		'classes' => [
			'DateTimeImmutable',
		],
	],
	'dom'    => [
		'classes' => [
			'DOMAttr',
			'DOMComment',
			'DOMDocument',
			'DOMElement',
			'DOMNode',
			'DOMNodeList',
			'DOMText',
			'DOMXPath',
		],
	],
	'json'   => [
		'functions' => [
			'json_decode',
			'json_encode',
		],
	],
	'libxml' => [
		'functions' => [
			'libxml_use_internal_errors',
		],
	],
	'spl'    => [
		'functions' => [
			'spl_autoload_register',
		],
	],
];

$web_stories_compatibility = new Compatibility( $web_stories_error );
$web_stories_compatibility->set_extensions( $extensions );
$web_stories_compatibility->set_php_version( WEBSTORIES_MINIMUM_PHP_VERSION );
$web_stories_compatibility->set_wp_version( WEBSTORIES_MINIMUM_WP_VERSION );
$web_stories_compatibility->set_required_files(
	[
		WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/edit-story.js',
		WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/stories-dashboard.js',
		WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/web-stories-embed-block.js',
		WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php',
		WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php',
	]
);

/**
 * Displays an admin notice about why the plugin is unable to load.
 *
 * @since 1.0.0
 *
 * @return void
 */
function _print_missing_build_admin_notice() {
	global $web_stories_compatibility;

	$web_stories_compatibility->run_checks();
	$_error = $web_stories_compatibility->get_error();
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
				printf( '<li>%s</li>', wp_kses( $message, [ 'code' => [] ] ) );
			}
			?>
		</ul>
	</div>
	<?php
}

add_action( 'admin_notices', __NAMESPACE__ . '\_print_missing_build_admin_notice' );

if ( ( defined( 'WP_CLI' ) && WP_CLI ) || 'true' === getenv( 'CI' ) || 'cli' === PHP_SAPI ) {
	// Only check for built php files in a CLI context.
	$web_stories_compatibility->set_required_files(
		[
			WEBSTORIES_PLUGIN_DIR_PATH . '/third-party/vendor/scoper-autoload.php',
			WEBSTORIES_PLUGIN_DIR_PATH . '/includes/vendor/autoload.php',
		]
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

if ( ! $web_stories_compatibility->check_required_files() ) {
	// However, we still need to stop further execution.
	return;
}
/**
 * Run logic to setup a new site with web stories.
 *
 * @since 1.2.0
 *
 * @return void
 */
function setup_new_site() {
	$story = new Story_Post_Type( new Experiments() );
	$story->init();
	$story->add_caps_to_roles();
	if ( ! defined( '\WPCOM_IS_VIP_ENV' ) || false === \WPCOM_IS_VIP_ENV ) {
		flush_rewrite_rules( false ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.flush_rewrite_rules_flush_rewrite_rules
	}

	$database_upgrader = new Database_Upgrader();
	$database_upgrader->init();
}

/**
 * Handles plugin activation.
 *
 * Throws an error if the site is running on PHP < 5.6
 *
 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
 *
 * @since 1.0.0
 *
 * @param bool $network_wide Whether to activate network-wide.
 *
 * @return void
 */
function activate( $network_wide = false ) {
	global $web_stories_compatibility;

	$web_stories_compatibility->check_php_version();
	$web_stories_compatibility->check_wp_version();
	$_error = $web_stories_compatibility->get_error();
	if ( $_error->errors ) {
		wp_die(
			$_error, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			esc_html__( 'Plugin could not be activated', 'web-stories' )
		);
	}

	setup_new_site();

	do_action( 'web_stories_activation', $network_wide );
}

/**
 * Hook into new site when they are created and run activation hook.
 *
 * @since 1.0.0
 *
 * @param int|WP_Site $site Site ID or object.
 *
 * @return void
 */
function new_site( $site ) {
	if ( ! is_multisite() ) {
		return;
	}
	$site = get_site( $site );
	if ( ! $site ) {
		return;
	}
	$site_id = (int) $site->blog_id;
	switch_to_blog( $site_id );
	setup_new_site();
	restore_current_blog();
}
add_action( 'wp_initialize_site', __NAMESPACE__ . '\new_site', PHP_INT_MAX );


/**
 * Hook into delete site.
 *
 * @since 1.1.0
 *
 * @param WP_Error    $error Unused.
 * @param int|WP_Site $site Site ID or object.
 *
 * @return void
 */
function remove_site( $error, $site ) {
	if ( ! is_multisite() ) {
		return;
	}
	$site = get_site( $site );
	if ( ! $site ) {
		return;
	}
	$site_id = (int) $site->blog_id;
	$story   = new Story_Post_Type( new Experiments() );
	switch_to_blog( $site_id );
	$story->remove_caps_from_roles();
	restore_current_blog();
}
add_action( 'wp_validate_site_deletion', __NAMESPACE__ . '\remove_site', PHP_INT_MAX, 2 );

/**
 * Handles plugin deactivation.
 *
 * @since 1.0.0
 *
 * @param bool $network_wide Whether to deactivate network-wide.
 *
 * @return void
 */
function deactivate( $network_wide ) {
	unregister_post_type( Story_Post_Type::POST_TYPE_SLUG );
	if ( ! defined( '\WPCOM_IS_VIP_ENV' ) || false === \WPCOM_IS_VIP_ENV ) {
		flush_rewrite_rules( false ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.flush_rewrite_rules_flush_rewrite_rules
	}

	do_action( 'web_stories_deactivation', $network_wide );
}

register_activation_hook( WEBSTORIES_PLUGIN_FILE, __NAMESPACE__ . '\activate' );
register_deactivation_hook( WEBSTORIES_PLUGIN_FILE, __NAMESPACE__ . '\deactivate' );

global $web_stories;

$web_stories = new Plugin();
$web_stories->register();

/**
 * Web stories Plugin Instance
 *
 * @return Plugin
 */
function get_plugin_instance() {
	global $web_stories;
	return $web_stories;
}
