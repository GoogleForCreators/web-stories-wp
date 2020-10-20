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

	/**
	 * @covers ::check_extensions
	 */
	public function test_check_extensions() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$compatibility->set_extensions( $this->get_web_stories_required_extensions() );
		$results = $compatibility->check_extensions();
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
		$compatibility->set_extensions( $this->get_web_stories_required_extensions() );
		$results = $compatibility->check_classes();
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
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error, $this->get_web_stories_required_extensions() );
		$compatibility->set_extensions( $this->get_web_stories_required_extensions() );
		$results = $compatibility->check_functions();
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
		$compatibility->set_wp_version( '10.0.0' );
		$results = $compatibility->check_wp_version();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_wp_version', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( WEBSTORIES_MINIMUM_WP_VERSION, $error_message );
	}

	/**
	 * @covers ::get_php_version
	 */
	public function test_check_php_version() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$compatibility->set_php_version( '10.0.0' );
		$results = $compatibility->check_php_version();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_php_version', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( WEBSTORIES_MINIMUM_PHP_VERSION, $error_message );
	}

	/**
	 * @covers ::check_js_built
	 */
	public function test_check_js_built() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$compatibility->set_js_path( WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/fake.js' );
		$results = $compatibility->check_js_built();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_js_built', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( 'You appear to be running an incomplete version of the plugin.', $error_message );
	}


	/**
	 * @covers ::check_php_built
	 */
	public function test_check_php_built() {
		$web_stories_error = new WP_Error();
		$compatibility     = new \Google\Web_Stories\Compatibility( $web_stories_error );
		$compatibility->set_class_name( '\Google\Web_Stories\Fake' );
		$results = $compatibility->check_php_built();
		$this->assertFalse( $results );
		$error       = $compatibility->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_php_built', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertContains( 'You appear to be running an incomplete version of the plugin.', $error_message );
	}

	/**
	 * Mock extensions, classes and functions.
	 *
	 * @return array
	 */
	protected function get_web_stories_required_extensions() {
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
}
