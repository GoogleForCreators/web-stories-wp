<?php
/**
 * Class Add_Stories_Caps
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

use Google\Web_Stories\Story_Post_Type;

/**
 * Class Add_Stories_Caps
 *
 * @package Google\Web_Stories\Migrations
 */
class Add_Stories_Caps extends Migrate_Base {
	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Experiments instance.
	 */
	private $story_post_type;

	/**
	 * Add_Stories_Caps constructor.
	 *
	 * @since 1.7.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Adds story capabilities to default user roles.
	 *
	 * @since 1.7.0
	 *
	 * @return void
	 */
	public function migrate() {
		$this->story_post_type->add_caps_to_roles();
	}
}
