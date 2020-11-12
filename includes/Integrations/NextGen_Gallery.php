<?php
/**
 * Class NextGen_Gallery
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

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Story_Post_Type;

/**
 * Class NextGen_Gallery.
 */
class NextGen_Gallery {
	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'run_ngg_resource_manager', [ $this, 'filter_run_ngg_resource_manager' ], PHP_INT_MAX );
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
	 * @param bool $valid_request Whether NextGEN Gallery's output buffer should run.
	 *
	 * @return bool Whether the output buffer should run.
	 */
	public function filter_run_ngg_resource_manager( $valid_request ) {
		if (
			// Plain permalinks.
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			! empty( $_GET[ Story_Post_Type::POST_TYPE_SLUG ] ) ||
			// Pretty permalinks.
			(
				isset( $_SERVER['REQUEST_URI'] ) &&
				preg_match(
					'#/' . preg_quote( Story_Post_Type::REWRITE_SLUG, '#' ) . '/.*?$#',
					// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					wp_parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH )
				)
			)
		) {
			return false;
		}

		return $valid_request;
	}
}
