<?php
/**
 * Class Add_Media_Source_Editor
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
 * Class Add_Media_Source
 *
 * @package Google\Web_Stories\Migrations
 */
abstract class Add_Media_Source extends Migrate_Base {
	/**
	 * Add the editor term, to make sure it exists.
	 *
	 * @since 1.9.0
	 *
	 * @return void
	 */
	public function migrate() {
		wp_insert_term( $this->get_term(), Media_Source_Taxonomy::TAXONOMY_SLUG );
	}

	/**
	 * Override this method.
	 *
	 * @since 1.9.0
	 *
	 * @return string
	 */
	abstract protected function get_term(): string;
}
