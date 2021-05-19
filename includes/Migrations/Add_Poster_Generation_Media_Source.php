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

use Google\Web_Stories\Media\Media;

/**
 * Class Add_Poster_Generation_Media_Source
 *
 * @package Google\Web_Stories\Migrations
 */
class Add_Poster_Generation_Media_Source extends Migration_Meta_To_Term {

	/**
	 * Migration media post meta to taxonomy term.
	 *
	 * @since 1.7.0
	 *
	 * @return void
	 */
	public function migrate() {
		wp_insert_term( $this->get_term_name(), Media::STORY_MEDIA_TAXONOMY );
		$this->migrate_post_meta();
	}

	/**
	 * Get name of meta key to be used in migration.
	 *
	 * @since 1.7.2
	 *
	 * @return string
	 */
	protected function get_post_meta_key() {
		return Media::POSTER_POST_META_KEY;
	}
}
