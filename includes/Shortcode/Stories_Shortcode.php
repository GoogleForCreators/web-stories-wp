<?php
/**
 * Class Stories_Shortcode.
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

namespace Google\Web_Stories\Shortcode;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Story_Query as Stories;

/**
 * Class Stories_Shortcode
 *
 * @phpstan-import-type StoryAttributes from \Google\Web_Stories\Story_Query
 */
class Stories_Shortcode extends Service_Base {

	/**
	 * Shortcode name.
	 */
	public const SHORTCODE_NAME = 'web_stories';

	/**
	 * Initializes the Stories shortcode.
	 *
	 * @since 1.5.0
	 */
	public function register(): void {
		add_shortcode( self::SHORTCODE_NAME, [ $this, 'render_stories' ] );
	}

	/**
	 * Callback for the shortcode.
	 *
	 * This will render the stories according to given
	 * shortcode attributes.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,string|int>|string $attrs Shortcode attributes.
	 * @return string Story markup.
	 */
	public function render_stories( $attrs ): string {
		$default_pairs = [
			'view'               => 'circles',
			'number_of_columns'  => 1,
			'title'              => 'false',
			'excerpt'            => 'false',
			'author'             => 'false',
			'date'               => 'false',
			'archive_link'       => 'false',
			'archive_link_label' => __( 'View all stories', 'web-stories' ),
			'image_alignment'    => 'left',
			'class'              => '',
			'circle_size'        => 150,
			'number_of_stories'  => 10,
			'order'              => 'DESC',
			'orderby'            => 'post_date',
			'sharp_corners'      => 'false',
		];

		$taxonomies = get_object_taxonomies( Story_Post_Type::POST_TYPE_SLUG );

		foreach ( $taxonomies as $taxonomy ) {
			$default_pairs[ $taxonomy ] = '';
		}

		// Initialize '$attrs' when not an array OR is an empty string.
		if ( empty( $attrs ) || ! is_array( $attrs) ) {
			$attrs = [];
		}

		$attributes = shortcode_atts(
			$default_pairs,
			$attrs,
			self::SHORTCODE_NAME
		);

		$stories = new Stories( $this->prepare_story_attrs( $attributes ), $this->prepare_story_args( $attributes ) );

		return $stories->render();
	}

	/**
	 * Prepare story attributes.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,string|int> $attributes Shortcode attributes.
	 * @return array<string,string|int> Attributes to pass to Story_Query class.
	 *
	 * @phpstan-return StoryAttributes
	 */
	private function prepare_story_attrs( array $attributes ): array {
		return [
			'view_type'          => (string) $attributes['view'],
			'number_of_columns'  => (int) $attributes['number_of_columns'],
			'show_title'         => ( 'true' === $attributes['title'] ),
			'show_author'        => ( 'true' === $attributes['author'] ),
			'show_date'          => ( 'true' === $attributes['date'] ),
			'show_excerpt'       => ( 'true' === $attributes['excerpt'] ),
			'show_archive_link'  => ( 'true' === $attributes['archive_link'] ),
			'archive_link_label' => (string) $attributes['archive_link_label'],
			'image_alignment'    => (string) $attributes['image_alignment'],
			'class'              => (string) $attributes['class'],
			'circle_size'        => (int) $attributes['circle_size'],
			'sharp_corners'      => ( 'true' === $attributes['sharp_corners'] ),
		];
	}

	/**
	 * Prepare story arguments.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,int|string> $attributes Array of arguments for Story Query.
	 * @return array<string,mixed> Array of story arguments to pass to Story_Query.
	 */
	private function prepare_story_args( array $attributes ): array {
		$args = [
			// Show 100 stories at most to avoid 500 errors.
			'posts_per_page' => min( (int) $attributes['number_of_stories'], 100 ), // phpcs:ignore WordPress.WP.PostsPerPage.posts_per_page_posts_per_page
			'order'          => 'ASC' === $attributes['order'] ? 'ASC' : 'DESC',
			'orderby'        => $attributes['orderby'],
		];

		$taxonomies           = get_object_taxonomies( Story_Post_Type::POST_TYPE_SLUG );
		$should_add_tax_query = false;

		foreach ( $taxonomies as $taxonomy ) {
			if ( '' !== $attributes[ $taxonomy ] ) {
				$should_add_tax_query = true;
				break;
			}
		}

		if ( $should_add_tax_query ) {
			$tax_query = [
				'relation' => 'OR',
			];

			foreach ( $taxonomies as $taxonomy ) {
				$tax_query[] = [
					'taxonomy' => $taxonomy,
					'field'    => 'name',
					'terms'    => $attributes[ $taxonomy ] ? array_map( 'trim', explode( ',', (string) $attributes[ $taxonomy ] ) ) : [],
				];
			}
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
			$args['tax_query'] = $tax_query;
		}
		return $args;
	}
}
