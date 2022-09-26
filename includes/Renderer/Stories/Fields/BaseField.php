<?php
/**
 * Base field class.
 */

/**
 * Copyright 2020 Google LLC
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

namespace Google\Web_Stories\Renderer\Stories\Fields;

use Google\Web_Stories\Interfaces\Field;

/**
 * Class BaseField.
 */
class BaseField implements Field {
	/**
	 * Field label.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * Whether the field is enabled.
	 *
	 * @var bool
	 */
	private $hidden;

	/**
	 * Whether to display the field.
	 *
	 * @var bool
	 */
	private $show;

	/**
	 * BaseField constructor.
	 *
	 * @param array<string,string|bool> $args Arguments.
	 */
	public function __construct( array $args ) {
		$this->label  = isset( $args['label'] ) ? (string) $args['label'] : '';
		$this->hidden = ! isset( $args['hidden'] ) || $args['hidden'];
		$this->show   = ! isset( $args['show'] ) || $args['show'];
	}

	/**
	 * Label for the field.
	 *
	 * @return string
	 */
	public function label(): string {
		return $this->label;
	}

	/**
	 * Flag for field display.
	 *
	 * @return bool
	 */
	public function show(): bool {
		return $this->show;
	}

	/**
	 * Whether the field is hidden.
	 *
	 * @return bool
	 */
	public function hidden(): bool {
		return $this->hidden;
	}
}
