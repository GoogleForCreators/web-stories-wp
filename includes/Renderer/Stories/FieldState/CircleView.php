<?php
/**
 * Circle view based controls state.
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

declare(strict_types = 1);

namespace Google\Web_Stories\Renderer\Stories\FieldState;

use Google\Web_Stories\Renderer\Stories\Fields\BaseField;

/**
 * Class CircleView.
 */
final class CircleView extends BaseFieldState {

	/**
	 * Title field.
	 *
	 * @since 1.5.0
	 *
	 * @return \Google\Web_Stories\Interfaces\Field|BaseField
	 */
	public function title() {
		$label = parent::title()->label();

		return $this->prepare_field(
			[
				'label'  => $label,
				'show'   => false,
				'hidden' => false,
			]
		);
	}

	/**
	 * Author field.
	 *
	 * @return \Google\Web_Stories\Interfaces\Field|BaseField
	 */
	public function author() {
		$label = parent::author()->label();

		return $this->prepare_field(
			[
				'label'  => $label,
				'show'   => false,
				'hidden' => true,
			]
		);
	}

	/**
	 * Date field.
	 *
	 * @return \Google\Web_Stories\Interfaces\Field|BaseField
	 */
	public function date() {
		$label = parent::date()->label();

		return $this->prepare_field(
			[
				'label'  => $label,
				'show'   => false,
				'hidden' => true,
			]
		);
	}

	/**
	 * Sharp corners field.
	 *
	 * @return \Google\Web_Stories\Interfaces\Field|BaseField
	 */
	public function sharp_corners() {
		$label = parent::sharp_corners()->label();

		return $this->prepare_field(
			[
				'label'  => $label,
				'show'   => false,
				'hidden' => true,
			]
		);
	}

	/**
	 * Circle size field.
	 *
	 * @return BaseField
	 */
	public function circle_size() {
		$label = parent::circle_size()->label();

		return $this->prepare_field(
			[
				'label'  => $label,
				'show'   => true,
				'hidden' => false,
			]
		);
	}

}
