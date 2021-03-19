<?php
/**
 * Field state factory.
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

namespace Google\Web_Stories\Stories_Renderer\FieldStateFactory;

use Google\Web_Stories\Interfaces\FieldState;
use Google\Web_Stories\Interfaces\FieldStateFactory;
use Google\Web_Stories\Stories_Renderer\FieldState\CarouselView;
use Google\Web_Stories\Stories_Renderer\FieldState\CircleView;
use Google\Web_Stories\Stories_Renderer\FieldState\GridView;
use Google\Web_Stories\Stories_Renderer\FieldState\ListView;

/**
 * Class Factory
 *
 * @package Google\Web_Stories\Stories_Renderer\FieldStateFactory
 */
class Factory implements FieldStateFactory {
	/**
	 * Returns field state for the provided view type.
	 *
	 * @since 1.5.0
	 *
	 * @param string $view View Type.
	 *
	 * @return FieldState
	 */
	public function get_field( $view = 'grid' ) {
		switch ( $view ) {
			case 'grid':
				return new GridView();
			case 'list':
				return new ListView();
			case 'circles':
				return new CircleView();
			case 'carousel':
				return new CarouselView();
			default:
				$default_field_state = new CircleView();

				/**
				 * Filters the field state object.
				 *
				 * This depicts
				 *
				 * @since 1.5.0
				 *
				 * @param FieldState $default_field_state Field state object.
				 */
				$field_state = apply_filters( 'web_stories_default_field_state', $default_field_state );

				return $field_state instanceof FieldState ? $field_state : $default_field_state;
		}
	}
}
