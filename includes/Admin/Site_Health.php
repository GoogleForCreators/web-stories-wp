<?php
/**
 * Site Health Class.
 *
 * Adds tests and debugging information for Site Health.
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Experiments;
use Google\Web_Stories\Infrastructure\Conditional;
use Google\Web_Stories\Service_Base;

/**
 * Class Site_Health
 */
class Site_Health extends Service_Base implements Conditional {
	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

	/**
	 * Site_Health constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Experiments $experiments Experiments instance.
	 * @return void
	 */
	public function __construct( Experiments $experiments ) {
		$this->experiments = $experiments;
	}

	/**
	 * Check whether the conditional object is currently needed.
	 *
	 * @since 1.8.0
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	public static function is_needed(): bool {
		return is_admin() && ! wp_doing_ajax();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.8.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'wp_loaded';
	}

	/**
	 * Adds the filters.
	 *
	 * @since 1.8.0
	 */
	public function register(): void {
		add_filter( 'debug_information', [ $this, 'add_debug_information' ] );
		add_filter( 'site_status_test_php_modules', [ $this, 'add_extensions' ] );
		add_filter( 'site_status_test_result', [ $this, 'modify_test_result' ] );
	}

	/**
	 * Adds debug information for Web stories.
	 *
	 * @since 1.8.0
	 *
	 * @param array|mixed $debugging_information The debugging information from Core.
	 * @return array|mixed The debugging information, with added information for Web stories.
	 */
	public function add_debug_information( $debugging_information ) {
		$enabled_experiments = [];
		foreach ( $this->experiments->get_experiments() as $experiment ) {
			$enabled = $this->experiments->is_experiment_enabled( $experiment['name'] );
			if ( $enabled ) {
				$enabled_experiments[ $experiment['label'] ] = $this->get_formatted_output( $enabled );
			}
		}
		if ( ! $enabled_experiments ) {
			$enabled_experiments = __( 'No experiments enabled', 'web-stories' );
		}
		if ( ! \is_array( $debugging_information ) ) {
			return $debugging_information;
		}
		$extra_data = [
			'web_stories' => [
				'label'       => esc_html__( 'Web Stories', 'web-stories' ),
				'description' => esc_html__( 'Debugging information for the Web Stories plugin.', 'web-stories' ),
				'fields'      => [
					'web_stories_version'             => [
						'label'   => 'WEBSTORIES_VERSION',
						'value'   => WEBSTORIES_VERSION,
						'private' => false,
					],
					'web_stories_db_version'          => [
						'label'   => 'WEBSTORIES_DB_VERSION',
						'value'   => WEBSTORIES_DB_VERSION,
						'private' => false,
					],
					'web_stories_amp_version'         => [
						'label'   => 'WEBSTORIES_AMP_VERSION',
						'value'   => WEBSTORIES_AMP_VERSION,
						'private' => false,
					],
					'web_stories_cdn_url'             => [
						'label'   => 'WEBSTORIES_CDN_URL',
						'value'   => WEBSTORIES_CDN_URL,
						'private' => false,
					],
					'web_stories_dev_mode'            => [
						'label'   => 'WEBSTORIES_DEV_MODE',
						'private' => false,
						'value'   => $this->get_formatted_output( WEBSTORIES_DEV_MODE ),
						'debug'   => WEBSTORIES_DEV_MODE,
					],
					'web_stories_theme_support'       => [
						'label'   => 'Theme supports',
						'value'   => $this->get_formatted_output( current_theme_supports( 'web-stories' ) ),
						'private' => false,
					],
					'web_stories_enabled_experiments' => [
						'label'   => 'Experiments',
						'value'   => $enabled_experiments,
						'private' => false,
					],
					'web_stories_libxml_version'      => [
						'label'   => 'libxml Version',
						'value'   => LIBXML_DOTTED_VERSION,
						'private' => false,
					],
				],
			],
		];

		return array_merge( $debugging_information, $extra_data );
	}

	/**
	 * Format the value as enabled or disabled.
	 *
	 * @since 1.8.0
	 *
	 * @param mixed $value Value to formatted.
	 */
	protected function get_formatted_output( $value ): string {
		return $value ? __( 'Enabled', 'web-stories' ) : __( 'Disabled', 'web-stories' );
	}

	/**
	 * Adds suggested PHP extensions to those that Core depends on.
	 *
	 * @since 1.8.0
	 *
	 * @param array|mixed $core_extensions The existing extensions from Core.
	 * @return array|mixed The extensions, including those for Web Stories.
	 */
	public function add_extensions( $core_extensions ) {
		if ( ! \is_array( $core_extensions ) ) {
			return $core_extensions;
		}
		$extensions = [
			'json'     => [
				'extension' => 'json',
				'function'  => 'json_encode',
				'required'  => false,
			],
			'libxml'   => [
				'extension' => 'libxml',
				'function'  => 'libxml_use_internal_errors',
				'required'  => false,

			],
			'date'     => [
				'extension' => 'date',
				'class'     => 'DateTimeImmutable',
				'required'  => false,
			],
			'dom'      => [
				'extension' => 'dom',
				'class'     => 'DOMNode',
				'required'  => false,
			],
			'mbstring' => [
				'extension' => 'mbstring',
				'required'  => false,
			],
			'spl'      => [
				'function' => 'spl_autoload_register',
				'required' => false,
			],
		];

		return array_merge( $core_extensions, $extensions );
	}

	/**
	 * Modify test results.
	 *
	 * @since 1.8.0
	 *
	 * @param array|mixed $test_result Site Health test result.
	 * @return array|mixed Modified test result.
	 */
	public function modify_test_result( $test_result ) {
		if ( ! \is_array( $test_result ) ) {
			return $test_result;
		}
		// Set the `https_status` test status to critical if its current status is recommended, along with adding to the
		// description for why its required for Web Stories.
		if ( isset( $test_result['test'], $test_result['status'], $test_result['description'] ) && 'https_status' === $test_result['test'] && 'recommended' === $test_result['status'] ) {
			$test_result['status']       = 'critical';
			$test_result['description'] .= '<p>' . __( 'Additionally, Web Stories requires HTTPS for most components to work properly, including iframes and videos.', 'web-stories' ) . '</p>';
		}

		return $test_result;
	}
}
