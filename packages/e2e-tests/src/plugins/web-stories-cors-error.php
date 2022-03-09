<?php
/**
 * Plugin Name: E2E Tests CORS error
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: CORS errors on purpose for testing.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

namespace Google\Web_Stories\E2E\CORS;

/**
 * Override the REST request to show an invalid response with cors errors.
 *
 * @since 1.19.0
 *
 * @param \WP_REST_Response $response Response object.
 *
 * @return \WP_REST_Response
 */
function change_response( $response, $post, $request ) {
	// Only filter requests for cors check.
	if ( $request['per_page'] !== 10 && $request['_fields'] !== 'source_url' ) {
		return $response;
	}
	/**
	 * Response data.
	 *
	 * @var array $data
	 */
	$data = $response->get_data();

	$data['source_url']             = 'https://ps.w.org/web-stories/assets/banner-772x250.png';
	$data['media_details']['sizes'] = [];

	$response->set_data( $data );

	return $response;
}

add_filter( 'web_stories_rest_prepare_attachment', __NAMESPACE__ . '\change_response', 20, 3 );
