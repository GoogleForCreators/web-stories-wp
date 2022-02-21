<?php
/**
 * Class Add_Stories_Caps
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

use Google\Web_Stories\User\Capabilities;

/**
 * Class Add_Stories_Caps
 */
class Add_Stories_Caps extends Migrate_Base {
	/**
	 * Capabilities instance.
	 *
	 * @var Capabilities Experiments instance.
	 */
	private $capabilities;

	/**
	 * Add_Stories_Caps constructor.
	 *
	 * @since 1.7.0
	 *
	 * @param Capabilities $capabilities Capabilities instance.
	 */
	public function __construct( Capabilities $capabilities ) {
		$this->capabilities = $capabilities;
	}

	/**
	 * Adds story capabilities to default user roles.
	 *
	 * @since 1.7.0
	 */
	public function migrate(): void {
		$this->capabilities->add_caps_to_roles();
	}
}
