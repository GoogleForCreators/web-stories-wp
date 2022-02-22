<?php
/**
 * Class NextGen_Gallery
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class NextGen_Gallery.
 */
class NextGen_Gallery extends Service_Base {
	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 */
	public function register(): void {
		add_filter( 'run_ngg_resource_manager', [ $this, 'filter_run_ngg_resource_manager' ], PHP_INT_MAX );
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		return -2;
	}

	/**
	 * Filters NextGEN Gallery's resource manager behavior.
	 *
	 * Disables output buffering for Web Stories.
	 *
	 * @since 1.2.0
	 *
	 * @see https://github.com/imagely/nextgen-gallery/blob/9736cc05e63b6b4cceb10b8a9a1de276f5c1ad4b/non_pope/class.photocrati_resource_manager.php
	 *
	 * @param bool|mixed $valid_request Whether NextGEN Gallery's output buffer should run.
	 * @return bool|mixed Whether the output buffer should run.
	 */
	public function filter_run_ngg_resource_manager( $valid_request ) {
		$request_uri_path = $this->get_request_uri_path();

		if (
			// Plain permalinks.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! empty( $_GET[ Story_Post_Type::POST_TYPE_SLUG ] ) ||
			// Pretty permalinks.
			(
				$request_uri_path &&
				preg_match(
					'#/' . preg_quote( Story_Post_Type::REWRITE_SLUG, '#' ) . '/.*?$#',
					// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					$request_uri_path
				)
			)
		) {
			return false;
		}

		return $valid_request;
	}

	/**
	 * Returns the current request path.
	 *
	 * @since 1.15.0
	 *
	 * @return string|null Request URI path on success, null on failure.
	 */
	private function get_request_uri_path(): ?string {
		// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return null;
		}

		if ( ! \is_string( $_SERVER['REQUEST_URI'] ) ) {
			return null;
		}

		/**
		 * Request URI.
		 *
		 * @var string $request_uri
		 */
		$request_uri = $_SERVER['REQUEST_URI'];

		// phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		/**
		 * Request URI path.
		 *
		 * @var string|null|false $path
		 */
		$path = wp_parse_url( $request_uri, PHP_URL_PATH );

		if ( ! $path ) {
			return null;
		}

		return $path;
	}
}
