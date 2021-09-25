<?php
/**
 * Class Migration_Meta_To_Term
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

use Google\Web_Stories\Media\Media_Source_Taxonomy;

/**
 * Class Migration_Meta_To_Term
 *
 * @package Google\Web_Stories\Migrations
 */
abstract class Migration_Meta_To_Term extends Migrate_Base {

	/**
	 * Media_Source_Taxonomy instance.
	 *
	 * @var Media_Source_Taxonomy Experiments instance.
	 */
	protected $media_source_taxonomy;

	/**
	 * Migration_Meta_To_Term constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Media_Source_Taxonomy $media_source_taxonomy Media_Source_Taxonomy instance.
	 */
	public function __construct( Media_Source_Taxonomy $media_source_taxonomy ) {
		$this->media_source_taxonomy = $media_source_taxonomy;
	}

	/**
	 * Migration media post meta to taxonomy term.
	 *
	 * @since 1.7.2
	 *
	 * @global \wpdb $wpdb WordPress database abstraction object.
	 *
	 * @return void
	 */
	public function migrate() {
		global $wpdb;

		$post_ids = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->prepare(
				"SELECT post_id FROM $wpdb->postmeta WHERE meta_key = %s",
				$this->get_post_meta_key()
			)
		);

		if ( is_array( $post_ids ) && ! empty( $post_ids ) ) {
			foreach ( $post_ids as $post_id ) {
				wp_set_object_terms( (int) $post_id, $this->get_term_name(), $this->media_source_taxonomy->get_taxonomy_slug() );
			}
		}
	}

	/**
	 * Get name of meta key to be used in migration.
	 * This method is designed for overridden.
	 *
	 * @since 1.7.2
	 *
	 * @return string
	 */
	abstract protected function get_post_meta_key();

	/**
	 * Get name of term to be used in migration.
	 * This method is designed for overridden.
	 *
	 * @since 1.7.2
	 *
	 * @return string
	 */
	protected function get_term_name(): string {
		return 'poster-generation';
	}
}
