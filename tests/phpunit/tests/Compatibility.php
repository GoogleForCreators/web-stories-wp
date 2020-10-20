<?php
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


namespace Google\Web_Stories\Tests;

use WP_Error;

/**
 * @coversDefaultClass \Google\Web_Stories\Compatibility
 */
class Compatibility extends \WP_UnitTestCase {
	public function setUp() {
		parent::setUp();
		add_filter( 'web_stories_required_extensions', [ $this, 'mock_web_stories_required_extensions' ] );
		add_filter( 'bloginfo', [ $this, 'mock_bloginfo' ], 20, 2 );
	}

	public function tearDown() {
		parent::tearDown();
		remove_filter( 'bloginfo', [ $this, 'mock_bloginfo' ], 20 );
	}


	/**
	 * @covers ::check_extensions
	 */
	public function test_check_extensions() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$results           = $compatibility->check_extensions();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'missing_extension', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( 'fake_extension', $error_message );
	}

	/**
	 * @covers ::check_classes
	 */
	public function test_check_classes() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$results           = $compatibility->check_classes();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'missing_class', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( 'FAKE_CLASS', $error_message );
	}

	/**
	 * @covers ::check_functions
	 */
	public function test_check_functions() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$results           = $compatibility->check_functions();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'missing_function', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( 'fake_function', $error_message );
	}

	/**
	 * @covers ::check_wp_version
	 */
	public function test_check_wp_version() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$results           = $compatibility->check_wp_version();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_wp_version', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( WEBSTORIES_MINIMUM_WP_VERSION, $error_message );
	}

	/**
	 * Mock extensions, classes and functions.
	 *
	 * @return array
	 */
	public function mock_web_stories_required_extensions() {
		return [
			'fake_extension' => [
				'classes'   => [
					'FAKE_CLASS',
				],
				'functions' => [
					'fake_function',
				],
			],
		];
	}

	/**
	 * Mock the version to 1.5.0.
	 *
	 * @param $output
	 * @param $show
	 *
	 * @return string
	 */
	public function mock_bloginfo( $output, $show ) {
		if ( 'version' !== $show ) {
			return $output;
		}

		return '1.5.0';
	}
}
