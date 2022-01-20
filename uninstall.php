
/**
 * Filters whether data should be erased when uninstalling the plugin.
 *
 * @since 1.0.0
 *
 * @param bool $erase Whether to erase data. Default false.
 */
$erase = (bool) apply_filters( 'web_stories_erase_data_on_uninstall', false );

if ( false === $erase ) {
	return;
}

require_once WEBSTORIES_PLUGIN_DIR_PATH . '/includes/uninstall.php';

if ( is_multisite() ) {
	\Google\Web_Stories\delete_site_options();
	$site_ids = get_sites(
		[
			'fields'                 => 'ids',
			'number'                 => '',
			'update_site_cache'      => false,
			'update_site_meta_cache' => false,
		]
	);

	foreach ( $site_ids as $site_id ) {
		// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.switch_to_blog_switch_to_blog
		switch_to_blog( $site_id );

		\Google\Web_Stories\delete_site();
	}

	restore_current_blog();
} else {
	\Google\Web_Stories\delete_site();
}
\Google\Web_Stories\delete_stories_user_meta();
