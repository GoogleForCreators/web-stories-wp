<?php

/**
 * Get details about a specific video by GUID:
 *
 * @param $guid string
 * @return stdClass
 */
function videopress_get_video_details( $guid ) {
}

/**
 * This is a mock of the internal VideoPress method, which is meant to duplicate the functionality
 * of the WPCOM API, so that the Jetpack REST API returns the same data with no modifications.
 *
 * @param int $blog_id Blog ID.
 * @param int $post_id Post ID.
 * @return bool|stdClass
 */
function video_get_info_by_blogpostid( $blog_id, $post_id ) {
}

class Jetpack_Options {
	/**
	 * Filters the requested option.
	 * This is a wrapper around `get_option_from_database` so that we can filter the option.
	 *
	 * @param string $name Option name. It must come _without_ `jetpack_%` prefix. The method will prefix the option name.
	 * @param mixed  $default (optional).
	 *
	 * @return mixed
	 */
	public static function get_option( $name, $default = false ) {
	}
}

class Jetpack {
	/**
	 * Is Jetpack active?
	 * The method only checks if there's an existing token for the master user. It doesn't validate the token.
	 *
	 * This method is deprecated since 9.6.0. Please use one of the methods provided by the Manager class in the Connection package,
	 * or Jetpack::is_connection_ready if you want to know when the Jetpack plugin starts considering the connection ready to be used.
	 *
	 * Since this method has a wide spread use, we decided not to throw any deprecation warnings for now.
	 *
	 * @deprecated 9.6.0
	 *
	 * @return bool
	 */
	public static function is_active() {
	}
}
