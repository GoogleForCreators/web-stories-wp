<?php
/**
 * Stories script data class.
 *
 * Stories data which will be required by various JS scripts.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Renderer\Stories\FieldStateFactory\Factory;

/**
 * Class Stories_Script_Data.
 */
class Stories_Script_Data {

	/**
	 * Injector instance.
	 *
	 * @var Injector Injector instance.
	 */
	private $injector;

	/**
	 * Factory constructor.
	 *
	 * @param Injector $injector Injector instance.
	 */
	public function __construct( Injector $injector ) {
		$this->injector = $injector;
	}

	/**
	 * Returns data array for use in inline script.
	 *
	 * @since 1.5.0
	 *
	 * @return array<string,array<string|int,array<string, mixed>>> Script data.
	 */
	public function get_script_data(): array {
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
	 * @return array<string,array<string,array<string,array<string,string|bool>>>> Field states.
	 */
	public function fields_states(): array {
		$field_states = [];
		/**
		 * Factory instance.
		 *
		 * @var Factory
		 */
		$factory = $this->injector->make( Factory::class );

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

	/**
	 * Get supported layouts for web stories.
	 *
	 * @since 1.14.0
	 *
	 * @return array<string,string>
	 */
	public function get_layouts(): array {
		return [
			'carousel' => __( 'Box Carousel', 'web-stories' ),
			'circles'  => __( 'Circle Carousel', 'web-stories' ),
			'grid'     => __( 'Grid', 'web-stories' ),
			'list'     => __( 'List', 'web-stories' ),
		];
	}
}
