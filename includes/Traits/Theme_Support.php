<?php
/**
 * Trait Theme_Support
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

use Google\Web_Stories\Story_Post_Type;

/**
 * Trait Theme_Support
 *
 * @package Google\Web_Stories\Traits
 */
trait Theme_Support {
	use Post_Type;
	/**
	 * Merges user defined arguments into defaults array.
	 *
	 * Like wp_parse_args(), but recursive.
	 *
	 * @since 1.5.0
	 *
	 * @see wp_parse_args()
	 *
	 * @param array $args      Value to merge with $defaults.
	 * @param array $defaults Optional. Array that serves as the defaults. Default empty array.
	 * @return array Merged user defined values with defaults.
	 */
	private function parse_args( array $args, array $defaults = [] ) : array {
		$parsed_args = $defaults;

		foreach ( $args as $key => $value ) {
			if ( is_array( $value ) && isset( $parsed_args[ $key ] ) ) {
				$parsed_args[ $key ] = $this->parse_args( $value, $parsed_args[ $key ] );
			} else {
				$parsed_args[ $key ] = $value;
			}
		}

		return $parsed_args;
	}

	/**
	 * Get theme support configuration.
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	public function get_stories_theme_support() : array {
		$support = get_theme_support( 'web-stories' );
		$support = isset( $support[0] ) && is_array( $support[0] ) ? $support[0] : [];

		$has_archive = $this->get_post_type_has_archive( Story_Post_Type::POST_TYPE_SLUG );

		$default_support = [
			'customizer' => [
				'view_type'         => [
					'enabled' => [ 'circles' ],
					'default' => 'circles',
				],
				'title'             => [
					'enabled' => true,
					'default' => true,
				],
				'excerpt'           => [
					'enabled' => true,
					'default' => false,
				],
				'author'            => [
					'enabled' => true,
					'default' => true,
				],
				'date'              => [
					'enabled' => false,
					'default' => false,
				],
				'archive_link'      => [
					'enabled' => $has_archive,
					'default' => $has_archive,
					'label'   => __( 'View all stories', 'web-stories' ),
				],
				'sharp_corners'     => [
					'enabled' => false,
					'default' => false,
				],
				'order'             => [
					'default' => 'DESC',
				],
				'orderby'           => [
					'default' => 'post_date',
				],
				'circle_size'       => [
					'default' => 150,
				],
				'number_of_stories' => [
					'default' => 10,
				],
				'number_of_columns' => [
					'default' => 2,
				],
				'image_alignment'   => [
					'default' => is_rtl() ? 'right' : 'left',
				],
			],
		];

		$support = $this->parse_args( $support, $default_support );

		return $support;
	}
}
