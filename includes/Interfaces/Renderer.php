<?php
/**
 * Renderer Interface.
 *
 * Stories renderers should conform to this interface,
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

namespace Google\Web_Stories\Interfaces;

use Google\Web_Stories\Interfaces\FieldState;

/**
 * Interface Renderer.
 *
 * @package Google\Web_Stories\Interfaces
 */
interface Renderer {

	/**
	 * Initial actions to setup the renderer like,
	 * adding hooks and setting up states.
	 *
	 * @return void
	 */
	public function init();

	/**
	 * Render the markup for story.
	 *
	 * @param array $args Array of rendering related arguments.
	 *
	 * @return string Rendering markup.
	 */
	public function render( array $args = [] );

	/**
	 * Render a single story markup.
	 *
	 * @return mixed
	 */
	public function render_single_story_content();

	/**
	 * This should return the fields state
	 * for the current view type.
	 *
	 * @return FieldState
	 */
	public function field();
}
