<?php
/**
 * Stories script data class.
 *
 * Stories data which will be required by various JS scripts.
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

namespace Google\Web_Stories\Traits;

use function Google\Web_Stories\fields_states;
use function Google\Web_Stories\get_layouts;

/**
 * Trait Stories_Script_Data.
 *
 * @package Google\Web_Stories
 */
trait Stories_Script_Data {
	/**
	 * Returns data array for use in inline script.
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	private function get_script_data() {
		$views      = get_layouts();
		$view_types = [];

		foreach ( $views as $view_key => $view_label ) {
			$view_types[] = [
				'label' => $view_label,
				'value' => $view_key,
			];
		}

		$field_states = fields_states();

		return [
			'views'  => $view_types,
			'fields' => $field_states,
		];
	}

}
