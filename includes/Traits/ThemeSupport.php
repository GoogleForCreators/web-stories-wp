<?php
/**
 * Trait ThemeSupport
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

use function Google\Web_Stories\get_stories_order;

/**
 * Trait ThemeSupport
 *
 * @package Google\Web_Stories\Traits
 */
trait ThemeSupport {
	/**
	 * Get theme support.
	 *
	 * @return array
	 */
	public function get_stories_theme_support() {
		$theme_support = get_theme_support( 'web-stories' );
		$theme_support = ! empty( $theme_support[0] ) && is_array( $theme_support[0] ) ? $theme_support[0] : [];

		$default_theme_support = [
			'view-type'                 => [
				'circles' => __( 'Circles', 'web-stories' ),
			],
			'view-type-default'         => 'circles',
			'grid-columns-default'      => 2,
			'title'                     => true,
			'title-default'             => true,
			'author'                    => true,
			'author-default'            => true,
			'date'                      => false,
			'date-default'              => false,
			'stories-archive-link'      => true,
			'stories-archive-label'     => __( 'View all stories', 'web-stories' ),
			'number-of-stories'         => 10,
			'order'                     => get_stories_order(),
			'order-default'             => 'latest',
			'show-story-poster-default' => true,
		];

		$theme_support                         = wp_parse_args( $theme_support, $default_theme_support );
		$theme_support['number-of-stories']    = (int) $theme_support['number-of-stories'];
		$theme_support['grid-columns-default'] = (int) $theme_support['grid-columns-default'];

		return $theme_support;
	}
}
