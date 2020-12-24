<?php
/**
 * Class BaseFieldState.
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

use Google\Web_Stories\Interfaces\Field;
use Google\Web_Stories\Stories_Renderer\Fields\BaseField;
use Google\Web_Stories\Interfaces\FieldState;

/**
 * Class BaseFieldState.
 */
class BaseFieldState implements FieldState {
	/**
	 * Image align FieldState.
	 *
	 * @return Field
	 */
	public function image_align() {
		return new BaseField(
			[
				'label'    => __( 'Show images on right', 'web-stories' ),
				'show'     => false,
				'readonly' => true,
			]
		);
	}

	/**
	 * Excerpt FieldState.
	 *
	 * @return Field
	 */
	public function excerpt() {
		return new BaseField(
			[
				'label'    => __( 'Show Excerpt', 'web-stories' ),
				'show'     => false,
				'readonly' => true,
			]
		);
	}

	/**
	 * Author Field State.
	 *
	 * @return Field
	 */
	public function author() {
		return new BaseField(
			[
				'label'    => __( 'Show Author', 'web-stories' ),
				'show'     => true,
				'readonly' => false,
			]
		);
	}

	/**
	 * Date field state.
	 *
	 * @return Field
	 */
	public function date() {
		return new BaseField(
			[
				'label'    => __( 'Show Date', 'web-stories' ),
				'show'     => false,
				'readonly' => false,
			]
		);
	}

	/**
	 * Archive link field state.
	 *
	 * @return Field
	 */
	public function archive_link() {
		return new BaseField(
			[
				'label'    => __( 'Show "View All Stories" link', 'web-stories' ),
				'show'     => true,
				'readonly' => false,
			]
		);
	}

	/**
	 * Title field state.
	 *
	 * @return Field
	 */
	public function title() {
		return new BaseField(
			[
				'label'    => __( 'Show Title', 'web-stories' ),
				'show'     => true,
				'readonly' => true,
			]
		);
	}

	/**
	 * Sharp corners field state.
	 *
	 * @return Field
	 */
	public function sharp_corners() {
		return new BaseField(
			[
				'label'    => __( 'Show sharp corners', 'web-stories' ),
				'show'     => false,
				'readonly' => false,
			]
		);
	}

	/**
	 * Prepare a field object.
	 *
	 * @param array $args Arguments to build field.
	 *
	 * @return BaseField
	 */
	protected function prepare_field( array $args ) {
		return new BaseField( $args );
	}

}
