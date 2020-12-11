<?php
/**
 * Base field class.
 *
 * @package Google\Web_Stories
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

namespace Google\Web_Stories\Stories_Renderer\Fields;

use Google\Web_Stories\Interfaces\Field;

/**
 * Class BaseField.
 *
 * @package Google\Web_Stories\Stories_Renderer\Fields
 */
class BaseField implements Field {
	/**
	 * Label for the field.
	 *
	 * @var string
	 */
	private $label;

	/**
	 * Flag for readonly field.
	 *
	 * @var bool
	 */
	private $readonly;

	/**
	 * Whether to show the field.
	 *
	 * @var bool
	 */
	private $show;

	/**
	 * BaseField constructor.
	 *
	 * @param array $args Arguments.
	 */
	public function __construct( array $args ) {
		$this->label    = isset( $args['label'] ) ? $args['label'] : '';
		$this->readonly = isset( $args['readonly'] ) ? (bool) $args['readonly'] : true;
		$this->show     = true;
	}

	/**
	 * Label for the field.
	 *
	 * @return string
	 */
	public function label() {
		return $this->label;
	}

	/**
	 * Flag for field display.
	 *
	 * @return bool
	 */
	public function show() {
		return $this->show;
	}

	/**
	 * Whether the field is readonly.
	 *
	 * @return bool
	 */
	public function readonly() {
		return $this->readonly;
	}
}
