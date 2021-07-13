<?php
/**
 * Class Single
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

namespace Google\Web_Stories\Renderer;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class Single
 *
 * @package Google\Web_Stories\Single
 */
class Single extends Service_Base {
	/**
	 * Initializes the Single logic.
	 *
	 * @since 1.7.0
	 *
	 * @return void
	 */
	public function register() {
		// Select the single-web-story.php template for Stories.
		add_filter( 'template_include', [ $this, 'filter_template_include' ], PHP_INT_MAX );

		add_filter( 'show_admin_bar', [ $this, 'show_admin_bar' ] ); // phpcs:ignore WordPressVIPMinimum.UserExperience.AdminBarRemoval.RemovalDetected
	}

	/**
	 * Set template for web-story post type.
	 *
	 * @since 1.0.0
	 *
	 * @param string $template Template.
	 *
	 * @return string Template.
	 */
	public function filter_template_include( $template ) {
		if ( is_singular( Story_Post_Type::POST_TYPE_SLUG ) && ! is_embed() ) {
			$template = WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/frontend/single-web-story.php';
		}

		return $template;
	}

	/**
	 * Filter if show admin bar on single post type.
	 *
	 * @since 1.0.0
	 *
	 * @param boolean $show Current value of filter.
	 *
	 * @return bool
	 */
	public function show_admin_bar( $show ) {
		if ( is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			$show = false;
		}

		return $show;
	}


}
