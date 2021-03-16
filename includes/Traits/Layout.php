<?php
/**
 * Layouts method.
 *
 * @package   Google\Web_Stories
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

/**
 * Trait Layout
 *
 * @package Google\Web_Stories\Traits
 */
trait Layout {
	/**
	 * Get supported layouts for web stories.
	 *
	 * @since 1.5.0
	 *
	 * @return mixed|void
	 */
	protected function get_layouts() {
		return [
			'carousel' => __( 'Box Carousel', 'web-stories' ),
			'circles'  => __( 'Circle Carousel', 'web-stories' ),
			'grid'     => __( 'Grid', 'web-stories' ),
			'list'     => __( 'List', 'web-stories' ),
		];
	}
}
