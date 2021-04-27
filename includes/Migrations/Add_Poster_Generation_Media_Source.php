<?php
/**
 * Class Add_Poster_Generation_Media_Source
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


namespace Google\Web_Stories\Migrations;

use Google\Web_Stories\Media;

/**
 * Class Add_Poster_Generation_Media_Source
 *
 * @package Google\Web_Stories\Migrations
 */
class Add_Poster_Generation_Media_Source extends Migrate_Base {

	/**
	 * Migration media post meta to taxonomy term.
	 *
	 * @since 1.7.0
	 *
	 * @global \wpdb $wpdb WordPress database abstraction object.
	 *
	 * @return void
	 */
	public function migrate() {
		global $wpdb;

		wp_insert_term( 'poster-generation', Media::STORY_MEDIA_TAXONOMY );

		$post_ids = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT post_id FROM $wpdb->postmeta WHERE meta_key = %s",
				Media::POSTER_POST_META_KEY
			)
		);

		if ( is_array( $post_ids ) && ! empty( $post_ids ) ) {
			foreach ( $post_ids as $post_id ) {
				wp_set_object_terms( (int) $post_id, 'poster-generation', Media::STORY_MEDIA_TAXONOMY );
			}
		}
	}
}
