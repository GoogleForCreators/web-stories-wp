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

if (
	! class_exists( '\Google\Web_Stories\Plugin' ) ||
	! file_exists( WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/edit-story.js' )
) {
	/**
	 * Displays an admin notice about why the plugin is unable to load.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	function _print_missing_build_admin_notice() {
		?>
		<div class="notice notice-error">
			<p>
				<strong><?php esc_html_e( 'Web Stories plugin could not be initialized.', 'web-stories' ); ?></strong>
			</p>
			<p>
				<?php
					echo wp_kses(
						sprintf(
						/* translators: %s: build commands. */
							__( 'You appear to be running an incomplete version of the plugin. Please run %s to finish installation.', 'web-stories' ),
							'<code>composer install &amp;&amp; npm install &amp;&amp; npm run build</code>'
						),
						[
							'code' => [],
						]
					);
				?>
			</p>
		</div>
		<?php
	}

	add_action( 'admin_notices', __NAMESPACE__ . '\_print_missing_build_admin_notice' );
}

if ( ! class_exists( '\Google\Web_Stories\Plugin' ) ) {
	// In CLI context, existence of the JS files is not required.
	if ( ( defined( 'WP_CLI' ) && WP_CLI ) || 'true' === getenv( 'CI' ) || 'cli' === PHP_SAPI ) {
		$heading = esc_html__( 'Web Stories plugin could not be initialized.', 'web-stories' );
		$body    = sprintf(
			/* translators: %s: build commands. */
			esc_html__( 'You appear to be running an incomplete version of the plugin. Please run %s to finish installation.', 'web-stories' ),
			'`composer install && npm install && npm run build`'
		);

		if ( class_exists( '\WP_CLI' ) ) {
			\WP_CLI::warning( "$heading\n$body" );
		} else {
			echo "$heading\n$body\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	// However, we still need to stop further execution.
	return;
}

/**
 * Handles plugin activation.
 *
 * Throws an error if the site is running on PHP < 5.6
 *
 * @since 1.0.0
 *
 * @param bool $network_wide Whether to activate network-wide.
 *
 * @return void
 */
function activate( $network_wide = false ) {
	if ( version_compare( PHP_VERSION, WEBSTORIES_MINIMUM_PHP_VERSION, '<' ) ) {
		wp_die(
		/* translators: %s: PHP version number */
			esc_html( sprintf( __( 'Web Stories requires PHP %s or higher.', 'web-stories' ), WEBSTORIES_MINIMUM_PHP_VERSION ) ),
			esc_html__( 'Plugin could not be activated', 'web-stories' )
		);
	}

	if ( version_compare( get_bloginfo( 'version' ), WEBSTORIES_MINIMUM_WP_VERSION, '<' ) ) {
		wp_die(
		/* translators: %s: WordPress version number */
			esc_html( sprintf( __( 'Web Stories requires WordPress %s or higher.', 'web-stories' ), WEBSTORIES_MINIMUM_WP_VERSION ) ),
			esc_html__( 'Plugin could not be activated', 'web-stories' )
		);
	}

	$story = new Story_Post_Type( new Experiments() );
	$story->init();
	$story->add_caps_to_roles();
	if ( ! defined( '\WPCOM_IS_VIP_ENV' ) || false === \WPCOM_IS_VIP_ENV ) {
		flush_rewrite_rules( false ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.flush_rewrite_rules_flush_rewrite_rules
	}

	$database_upgrader = new Database_Upgrader();
	$database_upgrader->init();

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
	activate();
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
	if ( version_compare( PHP_VERSION, WEBSTORIES_MINIMUM_PHP_VERSION, '<' ) ) {
		return;
	}

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
