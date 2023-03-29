<?php
/**
 * Class Plugin_Status
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2023 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2023 Google LLC
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

namespace Google\Web_Stories\Integrations;

/**
 * Class Plugin_Status.
 */
class Plugin_Status {
	/**
	 * Array of arrays of plugin data, keyed by plugin file name.
	 *
	 * @see get_plugin_data()
	 *
	 * @var array<string, array<string, string|bool>>
	 */
	protected array $plugins = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( ! \function_exists( '\get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$this->plugins = get_plugins();
	}

	/**
	 * Retrieves all plugin files with plugin data.
	 *
	 * @since 1.30.0
	 *
	 * @return array<string, array<string, string|bool>>
	 */
	public function get_plugins(): array {
		return $this->plugins;
	}
}
