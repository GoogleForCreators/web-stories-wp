<?php
/**
 * Trait Feed
 *
 * @package   Google\Web_Stories\Traits
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

namespace Google\Web_Stories\Traits;

/**
 * Trait Feed
 *
 * @package Google\Web_Stories\Traits
 */
trait Feed {
	/**
	 * Renders the story in an RSS feed context.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string Rendered block type output.
	 */
	protected function render_story_for_feed( array $attributes ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		ob_start();
		require WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/frontend/single-web-story-feed.php';
		return (string) ob_get_clean();
	}
}
