<?php
/**
 * Class Add_Media_Source_Editor
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

use Google\Web_Stories\Media\Media_Source_Taxonomy;

/**
 * Class Add_Media_Source
 */
abstract class Add_Media_Source extends Migrate_Base {
	/**
	 * Media_Source_Taxonomy instance.
	 *
	 * @var Media_Source_Taxonomy Experiments instance.
	 */
	protected $media_source_taxonomy;

	/**
	 * Add_Media_Source constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Media_Source_Taxonomy $media_source_taxonomy Media_Source_Taxonomy instance.
	 */
	public function __construct( Media_Source_Taxonomy $media_source_taxonomy ) {
		$this->media_source_taxonomy = $media_source_taxonomy;
	}

	/**
	 * Add the editor term, to make sure it exists.
	 *
	 * @since 1.9.0
	 */
	public function migrate(): void {
		wp_insert_term( $this->get_term(), $this->media_source_taxonomy->get_taxonomy_slug() );
	}

	/**
	 * Override this method.
	 *
	 * @since 1.9.0
	 */
	abstract protected function get_term(): string;
}
