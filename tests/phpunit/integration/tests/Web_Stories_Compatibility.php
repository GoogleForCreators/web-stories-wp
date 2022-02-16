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

namespace Google\Web_Stories\Tests\Integration;

/**
 * @coversDefaultClass \Web_Stories_Compatibility
 */
class Web_Stories_Compatibility extends TestCase {
	/**
	 * @var \Web_Stories_Compatibility
	 */
	protected $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = \web_stories_get_compat_instance();
		$extensions     = [
			'fake_extension' => [
				'classes'   => [
					'FAKE_CLASS',
				],
				'functions' => [
					'fake_function',
				],
			],
		];
		$this->instance->set_extensions( $extensions );
	}

	/**
	 * @covers ::check_extensions
	 */
	public function test_check_extensions(): void {
		$results = $this->instance->check_extensions();
		$this->assertFalse( $results );
		$error       = $this->instance->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'missing_extension', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertStringContainsString( 'fake_extension', $error_message );
	}

	/**
	 * @covers ::check_classes
	 */
	public function test_check_classes(): void {
		$results = $this->instance->check_classes();
		$this->assertFalse( $results );
		$error       = $this->instance->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'missing_class', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertStringContainsString( 'FAKE_CLASS', $error_message );
	}

	/**
	 * @covers ::check_functions
	 */
	public function test_check_functions(): void {
		$results = $this->instance->check_functions();
		$this->assertFalse( $results );
		$error       = $this->instance->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'missing_function', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertStringContainsString( 'fake_function', $error_message );
	}

	/**
	 * @covers ::check_wp_version
	 */
	public function test_check_wp_version(): void {
		$this->instance->set_wp_version( '10.0.0' );
		$results = $this->instance->check_wp_version();
		$this->assertFalse( $results );
		$error       = $this->instance->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_wp_version', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertStringContainsString( $this->instance->get_wp_version(), $error_message );
	}

	/**
	 * @covers ::check_php_version
	 */
	public function test_check_php_version(): void {
		$this->instance->set_php_version( '10.0.0' );
		$results = $this->instance->check_php_version();
		$this->assertFalse( $results );
		$error       = $this->instance->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_php_version', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertStringContainsString( $this->instance->get_php_version(), $error_message );
	}

	/**
	 * @covers ::check_required_files
	 */
	public function test_check_required_files(): void {
		$this->instance->set_required_files( [ WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/fake.js' ] );
		$results = $this->instance->check_required_files();
		$this->assertFalse( $results );
		$error       = $this->instance->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_required_files', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertStringContainsString( 'You appear to be running an incomplete version of the plugin.', $error_message );
	}

	/**
	 * @covers ::check_required_files
	 * @covers ::add_to_error
	 */
	public function test_add_to_error(): void {
		$this->instance->set_required_files( [ WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/fake.js' ] );
		$results  = $this->instance->check_required_files();
		$results2 = $this->instance->check_required_files();
		$this->assertFalse( $results );
		$this->assertFalse( $results2 );
		$error       = $this->instance->get_error();
		$error_codes = $error->get_error_codes();
		$this->assertContains( 'failed_check_required_files', $error_codes );
		$error_message = $error->get_error_message();
		$this->assertStringContainsString( 'You appear to be running an incomplete version of the plugin.', $error_message );
		$messages = $error->get_error_messages( 'failed_check_required_files' );
		$this->assertCount( 1, $messages );
	}
}
