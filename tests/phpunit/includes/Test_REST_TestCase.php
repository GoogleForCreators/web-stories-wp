<?php

namespace Google\Web_Stories\Tests;

abstract class Test_REST_TestCase extends Test_Case {
	use Capabilities_Setup, Kses_Setup;

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
