<?php
/**
 * Class Migrate_Meta_Type
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

use Google\Web_Stories\Media\Media;

/**
 * Class Add_Media_Source
 *
 * @package Google\Web_Stories\Migrations
 */
class Migrate_Meta_Type extends Migrate_Base {
	/**
	 * Change bool value to string value.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function migrate() {
		global $wpdb;

		$data = $wpdb->get_results( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT * FROM $wpdb->postmeta WHERE meta_key = %s",
				Media::IS_MUTED_POST_META_KEY
			),
			ARRAY_A
		);

		foreach ( $data as $post ) {
			if ( '' === $post['meta_value'] ) {
				update_post_meta( (int) $post['post_id'], Media::IS_MUTED_POST_META_KEY, 'has-audio' );
			}

			if ( '1' === $post['meta_value'] ) {
				update_post_meta( (int) $post['post_id'], Media::IS_MUTED_POST_META_KEY, 'muted' );
			}
		}
	}
}
