<?php
/**
 * Class BaseFieldState.
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

use Google\Web_Stories\Interfaces\Field;
use Google\Web_Stories\Interfaces\FieldState;
use Google\Web_Stories\Renderer\Stories\Fields\BaseField;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class BaseFieldState.
 */
class BaseFieldState implements FieldState {

	/**
	 * Post type has archive.
	 */
	protected bool $has_archive = false;

	/**
	 * Constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->has_archive = (bool) $story_post_type->get_has_archive();
	}

	/**
	 * Image alignment FieldState.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function image_alignment() {
		return new BaseField(
			[
				'label'  => __( 'Image Alignment', 'web-stories' ),
				'show'   => false,
				'hidden' => true,
			]
		);
	}

	/**
	 * Excerpt FieldState.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function excerpt() {
		return new BaseField(
			[
				'label'  => __( 'Display Excerpt', 'web-stories' ),
				'show'   => false,
				'hidden' => true,
			]
		);
	}

	/**
	 * Author Field State.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function author() {
		return new BaseField(
			[
				'label'  => __( 'Display Author', 'web-stories' ),
				'show'   => true,
				'hidden' => false,
			]
		);
	}

	/**
	 * Date field state.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function date() {
		return new BaseField(
			[
				'label'  => __( 'Display Date', 'web-stories' ),
				'show'   => false,
				'hidden' => false,
			]
		);
	}

	/**
	 * Archive link field state.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function archive_link() {
		return new BaseField(
			[
				'label'  => __( 'Display Archive Link', 'web-stories' ),
				'show'   => $this->has_archive,
				'hidden' => ! $this->has_archive,
			]
		);
	}

	/**
	 * Title field state.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function title() {
		return new BaseField(
			[
				'label'  => __( 'Display Title', 'web-stories' ),
				'show'   => true,
				'hidden' => true,
			]
		);
	}

	/**
	 * Sharp corners field state.
	 *
	 * @since 1.5.0
	 *
	 * @return Field
	 */
	public function sharp_corners() {
		return new BaseField(
			[
				'label'  => __( 'Use Sharp Corners', 'web-stories' ),
				'show'   => false,
				'hidden' => false,
			]
		);
	}

	/**
	 * Circle size field.
	 *
	 * @since 1.5.0
	 *
	 * @return BaseField
	 */
	public function circle_size() {
		return new BaseField(
			[
				'label' => __( 'Circle Size', 'web-stories' ),
				'show'  => false,
			]
		);
	}

	/**
	 * Number of columns field.
	 *
	 * @since 1.5.0
	 *
	 * @return BaseField
	 */
	public function number_of_columns() {
		return new BaseField(
			[
				'label' => __( 'Number of Columns', 'web-stories' ),
				'show'  => false,
			]
		);
	}

	/**
	 * Prepare a field object.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string,bool|string> $args Arguments to build field.
	 * @return BaseField
	 */
	protected function prepare_field( array $args ): BaseField {
		return new BaseField( $args );
	}

}
