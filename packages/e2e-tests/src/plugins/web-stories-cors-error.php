<?php
/**
 * Plugin Name: E2E Tests CORS error
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: CORS errors on purpose for testing.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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
