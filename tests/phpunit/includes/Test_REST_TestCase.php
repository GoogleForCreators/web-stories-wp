<?php
/**
 * Test_Class class.
 *
 * Basic test that designed to replace WP_Test_REST_TestCase.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

namespace Google\Web_Stories\Tests;

/**
 * Class Test_REST_TestCase
 *
 * @package Google\Web_Stories\Tests
 */
abstract class Test_REST_TestCase extends Test_Case {
	use Capabilities_Setup, Kses_Setup;

	/**
	 * Copied from WordPress code.
	 *
	 * @link https://github.com/WordPress/wordpress-develop/blob/2382765afa36e10bf3c74420024ad4e85763a47c/tests/phpunit/includes/testcase-rest-api.php#L4-L18
	 *
	 * @param string     $code Status code.
	 * @param WP_REST_Response|WP_Error  $response Response object.
	 * @param int|null $status Status code.
	 *
	 * @return void
	 */
	protected function assertErrorResponse( $code, $response, $status = null ) {

		if ( is_a( $response, 'WP_REST_Response' ) ) {
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
