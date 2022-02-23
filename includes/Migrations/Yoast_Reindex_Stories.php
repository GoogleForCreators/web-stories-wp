<?php
/**
 * Class Yoast_Reindex_Stories
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

namespace Google\Web_Stories\Migrations;

use Google\Web_Stories\Story_Post_Type;

/**
 * Class Yoast_Reindex_Stories
 */
class Yoast_Reindex_Stories extends Migrate_Base {

	/**
	 * Re-index stories in Yoast SEO if permalinks are outdated.
	 *
	 * @since 1.7.0
	 */
	public function migrate(): void {
		if (
			! function_exists( 'YoastSEO' ) ||
			! class_exists( '\Yoast\WP\SEO\Repositories\Indexable_Repository' ) ||
			! class_exists( '\Yoast\WP\SEO\Builders\Indexable_Builder' ) ||
			! is_a( YoastSEO(), '\Yoast\WP\SEO\Main' )
		) {
			return;
		}

		/**
		 * Indexable Repository.
		 *
		 * @var \Yoast\WP\SEO\Repositories\Indexable_Repository $repository Indexable Repository.
		 */
		$repository = YoastSEO()->classes->get( 'Yoast\WP\SEO\Repositories\Indexable_Repository' );

		/**
		 * Indexable Builder.
		 *
		 * @var \Yoast\WP\SEO\Builders\Indexable_Builder $builder Indexable Builder.
		 */
		$builder = YoastSEO()->classes->get( 'Yoast\WP\SEO\Builders\Indexable_Builder' );

		$indexable_before = $repository->find_for_post_type_archive( Story_Post_Type::POST_TYPE_SLUG, false );

		if ( ! $indexable_before || false === strpos( $indexable_before->permalink, '/web-stories/' ) ) {
			$builder->build_for_post_type_archive( Story_Post_Type::POST_TYPE_SLUG, $indexable_before );
		}

		// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.get_posts_get_posts -- False positive.
		$all_stories = get_posts(
			[
				'fields'                 => 'ids',
				'suppress_filters'       => false,
				'post_type'              => [ Story_Post_Type::POST_TYPE_SLUG ],
				'posts_per_page'         => 100,
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
			]
		);

		foreach ( $all_stories as $post_id ) {
			$indexable_before = $repository->find_by_id_and_type( $post_id, 'post', false );

			if ( ! $indexable_before || false === strpos( $indexable_before->permalink, '/web-stories/' ) ) {
				$builder->build_for_id_and_type( $post_id, 'post', $indexable_before );
			}
		}
	}
}
