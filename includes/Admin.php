<?php
/**
 * Admin class.
 *
 * Responsible for WordPress admin integration.
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

use WP_Screen;

/**
 * Admin class.
 */
class Admin {
	/**
	 * Initialize admin-related functionality.
	 *
	 * @return void
	 */
	public function init() {
		// Migrations.
		$database_upgrader = new Database_Upgrader();
		$database_upgrader->init();

		add_filter( 'admin_body_class', [ __CLASS__, 'admin_body_class' ], 99 );
	}

	/**
	 * Filter the list of admin classes.
	 *
	 * Makes sure the admin menu is collapsed when accessing
	 * the dashboard and the editor.
	 *
	 * @param string $class Current classes.
	 *
	 * @return string $class List of Classes.
	 */
	public static function admin_body_class( $class ) {
		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return $class;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return $class;
		}

		// Default WordPress posts list table screen.
		if ( 'edit' === $screen->base ) {
			return $class;
		}

		$class .= ' edit-story';

		// Overrides regular WordPress behavior by collapsing the admin menu by default.
		if ( false === strpos( $class, 'folded' ) ) {
			$class .= ' folded';
		}

		return $class;
	}
}
