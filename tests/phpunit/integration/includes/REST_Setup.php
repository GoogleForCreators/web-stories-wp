<?php
/**
 * REST_Setup trait.
 *
 * Add method assertErrorResponse to any test class.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Integration;

use Spy_REST_Server;
use WP_Error;
use WP_REST_Response;

/**
 * trait REST_Setup
 */
trait REST_Setup {
	use Capabilities_Setup, Kses_Setup;

	protected function set_up_rest(): void {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->add_caps_to_roles();

		$this->set_permalink_structure( '/%postname%/' );
	}

	protected function tear_down_rest(): void {
		/** @var \WP_REST_Server $wp_rest_server */
		global $wp_rest_server;
		$wp_rest_server = null;

		$this->remove_caps_from_roles();
	}

	/**
	 * Copied from WordPress code.
	 *
	 * @link https://github.com/WordPress/wordpress-develop/blob/2382765afa36e10bf3c74420024ad4e85763a47c/tests/phpunit/includes/testcase-rest-api.php#L4-L18
	 *
	 * @param string                    $code     Status code.
	 * @param WP_REST_Response|WP_Error $response Response object.
	 * @param int|null                  $status   Status code.
	 */
	protected function assertErrorResponse( $code, $response, $status = null ): void {

		if ( $response instanceof WP_REST_Response ) {
			$response = $response->as_error();
		}

		$this->assertWPError( $response );
		$this->assertSame( $code, $response->get_error_code() );

		if ( null !== $status ) {
			$data = $response->get_error_data();
			$this->assertArrayHasKey( 'status', $data );
			$this->assertSame( $status, $data['status'] );
		}
	}
}
