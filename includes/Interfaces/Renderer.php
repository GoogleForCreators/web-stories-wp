<?php
/**
 * Renderer Interface.
 *
 * Stories renderers should conform to this interface,
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

declare(strict_types = 1);

namespace Google\Web_Stories\Interfaces;

/**
 * Interface Renderer.
 */
interface Renderer {

	/**
	 * Initial actions to setup the renderer like,
	 * adding hooks and setting up states.
	 *
	 * @since 1.5.0
	 */
	public function init(): void;

	/**
	 * Render the markup for story.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,mixed> $args Array of rendering related arguments.
	 * @return string Rendering markup.
	 */
	public function render( array $args = [] ): string;

	/**
	 * Render a single story markup.
	 *
	 * @since 1.5.0
	 *
	 * @return mixed
	 */
	public function render_single_story_content();
}
