<?php
/**
 * Class Single
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

namespace Google\Web_Stories\Renderer;

use Google\Web_Stories\Context;
use Google\Web_Stories\Service_Base;

/**
 * Class Single
 */
class Single extends Service_Base {
	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Single constructor.
	 *
	 * @param Context $context Context instance.
	 */
	public function __construct( Context $context ) {
		$this->context = $context;
	}

	/**
	 * Initializes the Single logic.
	 *
	 * @since 1.7.0
	 */
	public function register(): void {
		// This is hooked to both the `template_include` and the `single_template` filters,
		// as an additional measure to improve compatibility with themes
		// overriding the template hierarchy in an unusual way, like the Sage theme does.
		add_filter( 'single_template', [ $this, 'filter_template_include' ], PHP_INT_MAX );
		add_filter( 'template_include', [ $this, 'filter_template_include' ], PHP_INT_MAX );

		add_filter( 'show_admin_bar', [ $this, 'show_admin_bar' ] ); // phpcs:ignore WordPressVIPMinimum.UserExperience.AdminBarRemoval.RemovalDetected
	}

	/**
	 * Filters the path of the queried template for single stories.
	 *
	 * @since 1.0.0
	 *
	 * @param string|mixed $template Absolute path to template file.
	 * @return string|mixed Filtered template file path.
	 */
	public function filter_template_include( $template ) {
		if ( $this->context->is_web_story() ) {
			return WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/frontend/single-web-story.php';
		}

		return $template;
	}

	/**
	 * Filter if show admin bar on single post type.
	 *
	 * @since 1.0.0
	 *
	 * @param bool|mixed $show Current value of filter.
	 * @return bool|mixed
	 */
	public function show_admin_bar( $show ) {
		if ( $this->context->is_web_story() ) {
			$show = false;
		}

		return $show;
	}


}
