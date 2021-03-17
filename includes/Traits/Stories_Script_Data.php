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

use Google\Web_Stories\Stories_Renderer\FieldStateFactory\Factory;

/**
 * Trait Stories_Script_Data.
 *
 * @package Google\Web_Stories
 */
trait Stories_Script_Data {
	use Layout;
	/**
	 * Returns data array for use in inline script.
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	private function get_script_data() {
		$views      = $this->get_layouts();
		$view_types = [];

		foreach ( $views as $view_key => $view_label ) {
			$view_types[] = [
				'label' => $view_label,
				'value' => $view_key,
			];
		}

		$field_states = $this->fields_states();

		return [
			'views'  => $view_types,
			'fields' => $field_states,
		];
	}

	/**
	 * Wrapper function for fetching field states
	 * based on the view types.
	 *
	 * Mainly uses FieldState and Fields classes.
	 *
	 * @since 1.5.0
	 *
	 * @return array
	 */
	protected function fields_states() {
		$views = $this->get_layouts();

		$fields = [
			'title',
			'author',
			'date',
			'image_alignment',
			'excerpt',
			'sharp_corners',
			'archive_link',
			'circle_size',
			'number_of_columns',
		];

		$field_states = [];
		$factory      = new Factory();

		foreach ( array_keys( $views ) as $view_type ) {
			$field_state = $factory->get_field( (string) $view_type );
			foreach ( $fields as $field ) {
				$field_states[ $view_type ][ $field ] = [
					'show'   => $field_state->$field()->show(),
					'label'  => $field_state->$field()->label(),
					'hidden' => $field_state->$field()->hidden(),
				];
			}
		}

		return $field_states;
	}
}
