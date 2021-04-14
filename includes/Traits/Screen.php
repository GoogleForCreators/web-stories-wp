<?php
/**
 * Screen Publisher
 *
 * @package   Google\Web_Stories\Traits
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


namespace Google\Web_Stories\Traits;

use Google\Web_Stories\Story_Post_Type;
use WP_Screen;

/**
 * Trait Screen.
 *
 * @package Google\Web_Stories
 */
trait Screen {
	/**
	 * Helper to get current screen.
	 *
	 * @since 1.6.0
	 *
	 * @return false|WP_Screen
	 */
	protected function get_current_screen() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( ( $screen instanceof WP_Screen ) ) {
			return $screen;
		}

		return false;
	}

	/**
	 * Is this the editor screen.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_Screen|false $screen Screen value, defaults to null.
	 *
	 * @return bool
	 */
	protected function is_edit_screen( $screen = null ) {
		if ( null === $screen ) {
			$screen = $this->get_current_screen();
		}
		if ( ! $screen ) {
			return false;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return false;
		}

		return true;
	}


	/**
	 * Check if current screen is block editor.
	 *
	 * @since 1.6.0
	 *
	 * @param WP_Screen|false $screen Screen value, defaults to null.
	 *
	 * @return bool
	 */
	protected function is_block_editor( $screen = null ) {
		if ( null === $screen ) {
			$screen = $this->get_current_screen();
		}
		if ( ! $screen ) {
			return false;
		}

		return $screen->is_block_editor();
	}
}
