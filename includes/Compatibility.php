<?php
/**
 * Class Compatibility
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

namespace Google\Web_Stories;

use WP_Error;

/**
 * Class Compatibility
 *
 * @package Google\Web_Stories
 */
class Compatibility {

	/**
	 * WP_Error object passed back.
	 *
	 * @var WP_Error
	 */
	protected $error;

	/**
	 * Compatibility constructor.
	 *
	 * @param WP_Error $error WP_Error object passed back.
	 */
	public function __construct( WP_Error $error ) {
		$this->error = $error;
	}

	/**
	 * Check to see if PHP version check passes.
	 *
	 * @return bool
	 */
	public function check_php_version() {
		if ( version_compare( PHP_VERSION, WEBSTORIES_MINIMUM_PHP_VERSION, '<' ) ) {
			/* translators: %s: PHP version number */
			$message = esc_html( sprintf( __( 'Web Stories requires PHP %s or higher.', 'web-stories' ), WEBSTORIES_MINIMUM_PHP_VERSION ) );
			$data    = [
				'title' => $message,
			];
			$this->error->add( 'failed_check_php_version', $message, $data );

			return false;
		}

		return true;
	}

	/**
	 * Check to see if WordPress version check passes.
	 *
	 * @return bool
	 */
	public function check_wp_version() {
		if ( version_compare( get_bloginfo( 'version', 'display' ), WEBSTORIES_MINIMUM_WP_VERSION, '<' ) ) {
			/* translators: %s: WordPress version number */
			$message = esc_html( sprintf( __( 'Web Stories requires WordPress %s or higher.', 'web-stories' ), WEBSTORIES_MINIMUM_WP_VERSION ) );
			$data    = [
				'title' => $message,
			];
			$this->error->add( 'failed_check_wp_version', $message, $data );

			return false;
		}

		return true;
	}


	/**
	 * Check to see PHP has been built with composer.
	 *
	 * @return bool
	 */
	public function check_php_built() {
		if ( ! class_exists( '\Google\Web_Stories\Plugin' ) ) {
			$message =
				sprintf(
				/* translators: %s: build commands. */
					__( 'You appear to be running an incomplete version of the plugin. Please run %s to finish installation.', 'web-stories' ),
					'<code>composer install &amp;&amp; npm install &amp;&amp; npm run build</code>'
				);
			$data = [
				'title' => esc_html__( 'Web Stories plugin could not be initialized.', 'web-stories' ),
			];
			$this->error->add( 'failed_check_php_built', $message, $data );

			return false;
		}

		return true;
	}

	/**
	 * Check to see if NPM was built.
	 *
	 * @return bool
	 */
	public function check_js_built() {
		if ( ! file_exists( WEBSTORIES_PLUGIN_DIR_PATH . '/assets/js/edit-story.js' ) ) {
			$message =
				sprintf(
				/* translators: %s: build commands. */
					__( 'You appear to be running an incomplete version of the plugin. Please run %s to finish installation.', 'web-stories' ),
					'<code>composer install &amp;&amp; npm install &amp;&amp; npm run build</code>'
				);
			$data = [
				'title' => esc_html__( 'Web Stories plugin could not be initialized.', 'web-stories' ),
			];
			$this->error->add( 'failed_check_js_built', $message, $data );

			return false;
		}

		return true;
	}

	/**
	 * Check to see if all required PHP extensions are installed.
	 *
	 * @return bool
	 */
	public function check_extensions() {
		$_web_stories_missing_extensions = [];
		foreach ( $this->get_required_extensions() as $_web_stories_required_extension => $_web_stories_required_constructs ) {
			if ( ! extension_loaded( $_web_stories_required_extension ) ) {
				$_web_stories_missing_extensions[] = "<code>$_web_stories_required_extension</code>";
			}
		}

		if ( count( $_web_stories_missing_extensions ) > 0 ) {
			$this->error->add(
				'missing_extension',
				sprintf(
				/* translators: %s is list of missing extensions */
					_n(
						'The following PHP extension is missing: %s. Please contact your host to finish installation.',
						'The following PHP extensions are missing: %s. Please contact your host to finish installation.',
						count( $_web_stories_missing_extensions ),
						'web-stories'
					),
					implode( ', ', $_web_stories_missing_extensions )
				)
			);

			return false;
		}

		return true;
	}

	/**
	 * Check to see if classes exist.
	 *
	 * @return bool
	 */
	public function check_classes() {
		$_web_stories_missing_classes = [];
		foreach ( $this->get_required_extensions() as $_web_stories_required_extension => $_web_stories_required_constructs ) {
			foreach ( $_web_stories_required_constructs as $_web_stories_construct_type => $_web_stories_constructs ) {
				if ( 'classes' !== $_web_stories_construct_type ) {
					continue;
				}

				foreach ( $_web_stories_constructs as $_web_stories_construct ) {
					if ( ! class_exists( $_web_stories_construct ) ) {
						$_web_stories_missing_classes[] = "<code>$_web_stories_construct</code>";
					}
				}
			}
		}

		if ( count( $_web_stories_missing_classes ) > 0 ) {
			$this->error->add(
				'missing_class',
				sprintf(
				/* translators: %s is list of missing extensions */
					_n(
						'The following PHP class is missing: %s. Please contact your host to finish installation.',
						'The following PHP classes are missing: %s. Please contact your host to finish installation.',
						count( $_web_stories_missing_classes ),
						'web-stories'
					),
					implode( ', ', $_web_stories_missing_classes )
				)
			);

			return false;
		}

		return true;
	}

	/**
	 * Check to see if all require functions exist.
	 *
	 * @return bool
	 */
	public function check_functions() {
		$_web_stories_missing_functions = [];
		foreach ( $this->get_required_extensions() as $_web_stories_required_extension => $_web_stories_required_constructs ) {
			foreach ( $_web_stories_required_constructs as $_web_stories_construct_type => $_web_stories_constructs ) {
				if ( 'functions' !== $_web_stories_construct_type ) {
					continue;
				}

				foreach ( $_web_stories_constructs as $_web_stories_construct ) {
					if ( ! function_exists( $_web_stories_construct ) ) {
						$_web_stories_missing_functions[] = "<code>$_web_stories_construct</code>";
					}
				}
			}
		}

		if ( count( $_web_stories_missing_functions ) > 0 ) {
			$this->error->add(
				'missing_function',
				sprintf(
				/* translators: %s is list of missing extensions */
					_n(
						'The following PHP function is missing: %s. Please contact your host to finish installation.',
						'The following PHP functions are missing: %s. Please contact your host to finish installation.',
						count( $_web_stories_missing_functions ),
						'web-stories'
					),
					implode( ', ', $_web_stories_missing_functions )
				)
			);

			return false;
		}

		return true;
	}

	/**
	 * Helper to return a list of extensions, functions and classes that are required.
	 *
	 * @return array
	 */
	protected function get_required_extensions() {
		$extensions = [
			'date'   => [
				'classes' => [
					'DateTimeImmutable',
				],
			],
			'dom'    => [
				'classes' => [
					'DOMAttr',
					'DOMComment',
					'DOMDocument',
					'DOMElement',
					'DOMNode',
					'DOMNodeList',
					'DOMText',
					'DOMXPath',
				],
			],
			'libxml' => [
				'functions' => [ 'libxml_use_internal_errors' ],
			],
			'spl'    => [
				'functions' => [ 'spl_autoload_register' ],
			],
		];

		/**
		 * Filters array of required extensions, classes and functions.
		 *
		 * @param array $extensions Array of extensions, classes and functions.
		 */
		return apply_filters( 'web_stories_required_extensions', $extensions );
	}

	/**
	 * Getter to get the error object.
	 *
	 * @return WP_Error
	 */
	public function get_error() {
		return $this->error;
	}
}
