<?php
/**
 * List view based controls state.
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

namespace Google\Web_Stories\Stories_Renderer\FieldState;

use Google\Web_Stories\Stories_Renderer\Fields\BaseField;

/**
 * Class Grid.
 */
final class ListView extends BaseFieldState {

	/**
	 * Excerpt field.
	 *
	 * @return \Google\Web_Stories\Interfaces\Field|BaseField
	 */
	public function excerpt() {
		$label = parent::excerpt()->label();

		return $this->prepare_field(
			[
				'label'    => $label,
				'show'     => true,
				'readonly' => false,
			]
		);
	}

	/**
	 * Author field.
	 *
	 * @return \Google\Web_Stories\Interfaces\Field|BaseField
	 */
	public function date() {
		$label = parent::date()->label();

		return $this->prepare_field(
			[
				'label'    => $label,
				'show'     => true,
				'readonly' => false,
			]
		);
	}

	/**
	 * Image align field.
	 *
	 * @return \Google\Web_Stories\Interfaces\Field|BaseField
	 */
	public function image_align() {
		$label = parent::image_align()->label();

		return $this->prepare_field(
			[
				'label'    => $label,
				'show'     => false,
				'readonly' => false,
			]
		);
	}
}
