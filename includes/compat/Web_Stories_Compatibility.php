<?php
/**
 * Class Compatibility
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

/**
 * Class Compatibility
 *
 * @since 1.2.0
 */
class Web_Stories_Compatibility {

	/**
	 * WP_Error object passed back.
	 *
	 * @since 1.2.0
	 *
	 * @var WP_Error
	 */
	protected $error;

	/**
	 * WordPress version.
	 *
	 * @since 1.2.0
	 *
	 * @var string
	 */
	protected $wp_version;

	/**
	 * PHP version.
	 *
	 * @since 1.2.0
	 *
	 * @var string
	 */
	protected $php_version;

	/**
	 * Array of extensions.
	 *
	 * @since 1.2.0
	 *
	 * @var array<string, array{functions?: string[], classes?: string[]}>
	 */
	protected $extensions = array();

	/**
	 * Array of required files.
	 *
	 * @since 1.2.0
	 *
	 * @var string[]
	 */
	protected $required_files = array();

	/**
	 * Compatibility constructor.
	 *
	 * @since 1.2.0
	 *
	 * @param WP_Error $error       WP_Error object passed back.
	 */
	public function __construct( WP_Error $error ) { // phpcs:ignore SlevomatCodingStandard.Namespaces.FullyQualifiedExceptions.NonFullyQualifiedException
		$this->error = $error;
	}

	/**
	 * Check to see if PHP version check passes.
	 *
	 * @since 1.2.0
	 *
	 * @return bool
	 */
	public function check_php_version() {
		if ( version_compare( PHP_VERSION, $this->get_php_version(), '<' ) ) {
			/* translators: %s: PHP version number */
			$message = esc_html( sprintf( __( 'Web Stories requires PHP %s or higher.', 'web-stories' ), $this->get_php_version() ) );
			$data    = array(
				'title' => $message,
			);
			$this->add_to_error( 'failed_check_php_version', $message, $data );

			return false;
		}

		return true;
	}

	/**
	 * Check to see if WordPress version check passes.
	 *
	 * @since 1.2.0
	 *
	 * @return bool
	 */
	public function check_wp_version() {
		if ( version_compare( get_bloginfo( 'version' ), $this->get_wp_version(), '<' ) ) {
			/* translators: %s: WordPress version number */
			$message = esc_html( sprintf( __( 'Web Stories requires WordPress %s or higher.', 'web-stories' ), $this->get_wp_version() ) );
			$data    = array(
				'title' => $message,
			);
			$this->add_to_error( 'failed_check_wp_version', $message, $data );

			return false;
		}

		return true;
	}

	/**
	 * Check if required files.
	 *
	 * @since 1.2.0
	 *
	 * @return bool
	 */
	public function check_required_files() {
		$required_files = $this->get_required_files();
		if ( $required_files ) {
			foreach ( $required_files as $required_file ) {
				if ( ! is_readable( $required_file ) ) {
					$message =
						sprintf(
						/* translators: %s: build commands. */
							__( 'You appear to be running an incomplete version of the plugin. Please run %s to finish installation.', 'web-stories' ),
							'<code>composer install &amp;&amp; npm install &amp;&amp; npm run build</code>'
						);
					$data = array(
						'title' => esc_html__( 'Web Stories plugin could not be initialized.', 'web-stories' ),
					);
					$this->add_to_error( 'failed_check_required_files', $message, $data );

					return false;
				}
			}
		}

		return true;
	}

	/**
	 * Check to see if all required PHP extensions are installed.
	 *
	 * @since 1.2.0
	 *
	 * @return bool
	 */
	public function check_extensions() {
		$missing_extensions = array();
		foreach ( array_keys( $this->get_extensions() ) as $required_extension ) {
			if ( ! extension_loaded( $required_extension ) ) {
				$missing_extensions[] = "<code>$required_extension</code>";
			}
		}

		if ( count( $missing_extensions ) > 0 ) {
			$this->add_to_error(
				'missing_extension',
				sprintf(
					/* translators: %s is list of missing extensions */
					_n(
						'The following PHP extension is missing: %s. Please contact your host to finish installation.',
						'The following PHP extensions are missing: %s. Please contact your host to finish installation.',
						count( $missing_extensions ),
						'web-stories'
					),
					implode( ', ', $missing_extensions )
				)
			);

			return false;
		}

		return true;
	}

	/**
	 * Check to see if classes exist.
	 *
	 * @since 1.2.0
	 *
	 * @return bool
	 */
	public function check_classes() {
		$missing_classes = array();
		foreach ( $this->get_extensions() as $required_constructs ) {
			foreach ( $required_constructs as $construct_type => $constructs ) {
				if ( 'classes' !== $construct_type ) {
					continue;
				}

				foreach ( $constructs as $construct ) {
					if ( ! class_exists( $construct ) ) {
						$missing_classes[] = "<code>$construct</code>";
					}
				}
			}
		}

		if ( count( $missing_classes ) > 0 ) {
			$this->add_to_error(
				'missing_class',
				sprintf(
					/* translators: %s is list of missing extensions */
					_n(
						'The following PHP class is missing: %s. Please contact your host to finish installation.',
						'The following PHP classes are missing: %s. Please contact your host to finish installation.',
						count( $missing_classes ),
						'web-stories'
					),
					implode( ', ', $missing_classes )
				)
			);

			return false;
		}

		return true;
	}

	/**
	 * Check to see if all require functions exist.
	 *
	 * @since 1.2.0
	 *
	 * @return bool
	 */
	public function check_functions() {
		$missing_functions = array();
		foreach ( $this->get_extensions() as $required_constructs ) {
			foreach ( $required_constructs as $construct_type => $constructs ) {
				if ( 'functions' !== $construct_type ) {
					continue;
				}

				foreach ( $constructs as $construct ) {
					if ( ! function_exists( $construct ) ) {
						$missing_functions[] = "<code>$construct</code>";
					}
				}
			}
		}

		if ( count( $missing_functions ) > 0 ) {
			$this->add_to_error(
				'missing_function',
				sprintf(
				/* translators: %s is list of missing extensions */
					_n(
						'The following PHP function is missing: %s. Please contact your host to finish installation.',
						'The following PHP functions are missing: %s. Please contact your host to finish installation.',
						count( $missing_functions ),
						'web-stories'
					),
					implode( ', ', $missing_functions )
				)
			);

			return false;
		}

		return true;
	}

	/**
	 * Run checks in admin.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function run_checks() {
		$this->check_php_version();
		$this->check_wp_version();
		$this->check_required_files();
		$this->check_extensions();
		$this->check_classes();
		$this->check_functions();
	}

	/**
	 * Get min WP version.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_wp_version() {
		return $this->wp_version;
	}

	/**
	 * Get min PHP version.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @return string
	 */
	public function get_php_version() {
		return $this->php_version;
	}

	/**
	 * Array of extensions.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @return array<string, array{functions?: string[], classes?: string[]}>
	 */
	public function get_extensions() {
		return $this->extensions;
	}

	/**
	 * Get JavaScript path.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @return string[]
	 */
	public function get_required_files() {
		return $this->required_files;
	}

	/**
	 * Getter to get the error object.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @return WP_Error
	 */
	public function get_error() {
		return $this->error;
	}

	/**
	 * Set WordPress version.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @param string $wp_version WordPress version.
	 * @return void
	 */
	public function set_wp_version( $wp_version ) {
		$this->wp_version = $wp_version;
	}

	/**
	 * Set PHP version.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @param string $php_version PHP version.
	 * @return void
	 */
	public function set_php_version( $php_version ) {
		$this->php_version = $php_version;
	}

	/**
	 * Set extensions.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @param array<string, array{functions?: string[], classes?: string[]}> $extensions Array of extensions.
	 * @return void
	 */
	public function set_extensions( array $extensions ) {
		$this->extensions = $extensions;
	}

	/**
	 * Array of require files.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.2.0
	 *
	 * @param string[] $required_files Array of require files.
	 * @return void
	 */
	public function set_required_files( array $required_files ) {
		$this->required_files = $required_files;
	}

	/**
	 * Helper to add error code to WP_Error object.
	 *
	 * @param string|int $code    Error code.
	 * @param string     $message Error message.
	 * @param mixed      $data    Optional. Error data.
	 * @return void
	 */
	protected function add_to_error( $code, $message, $data = '' ) {
		if ( ! in_array( $code, $this->error->get_error_codes(), true ) ) {
			$this->error->add( $code, $message, $data );
		}
	}
}
