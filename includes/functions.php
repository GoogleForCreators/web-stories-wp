<?php
/**
 * Miscellaneous functions.
 * These are mostly utility or wrapper functions.
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

namespace Google\Web_Stories;

/**
 * Render stories based on the passed arguments.
 *
 * @since 1.5.0
 *
 * @param array $attrs Arguments for displaying stories.
 * @param array $query_args Query arguments for stories.
 */
function render_stories( array $attrs = [], array $query_args = [] ): void {
	$stories_obj = new Story_Query( $attrs, $query_args );
	//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $stories_obj->render();
}

/**
 * Returns list of stories based on the arguments passed to it.
 *
 * @since 1.5.0
 *
 * @param array $attrs Arguments for displaying stories.
 * @param array $query_args Query arguments for stories.
 * @return array
 */
function get_stories( array $attrs = [], array $query_args = [] ): array {
	$stories_obj = new Story_Query( $attrs, $query_args );

	return $stories_obj->get_stories();
}

/**
 * Render stories based on customizer settings.
 *
 * @since 1.5.0
 */
function render_theme_stories(): void {
	$injector = Services::get_injector();
	if ( ! method_exists( $injector, 'make' ) ) {
		return;
	}

	$customizer = $injector->make( Admin\Customizer::class );
	//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $customizer->render_stories();
}
