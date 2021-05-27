<?php
/**
 * Plugin Name: Web Stories Test Plugin: Status Check 200 Invalid
 * Plugin URI:  https://github.com/google/web-stories-wp
 * Description: Test plugin for status check with status 200.
 * Author:      Google
 * Author URI:  https://opensource.google.com/
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

namespace Google\Web_Stories\E2E_Tests;

use WP_HTTP_Response;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Filters the REST API response.
 *
 * @param WP_HTTP_Response $result  Result to send to the client. Usually a `WP_REST_Response`.
 * @param WP_REST_Server   $server  Server instance.
 * @param WP_REST_Request  $request Request used to generate the response.
 * @return WP_HTTP_Response Modified result.
 */
function filter_rest_response( $result, $server, $request ) {
	if ( '/web-stories/v1/status-check' === $request->get_route() ) {
		$result->set_status( 200 );
		$result->set_data( 'This is some unexpected content before the actual response.{"success":true}' );
	}

	return $result;
}

add_action( 'rest_post_dispatch', __NAMESPACE__ . '\filter_rest_response', 10, 3 );
