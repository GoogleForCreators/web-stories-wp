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

declare(strict_types = 1);

namespace Google\Web_Stories;

use Google\Web_Stories\Admin\Customizer;
use WP_Post;

/**
 * Render stories based on the passed arguments.
 *
 * @since 1.5.0
 *
 * @param array<string, string|int|bool> $attrs Arguments for displaying stories.
 * @param array<string, string|int|bool> $query_args Query arguments for stories.
 *
 * @phpstan-param array{view_type?: string, number_of_columns?: int, show_title?: bool, show_author?: bool, show_date?: bool, show_archive_link?: bool|string, show_excerpt?: bool, image_alignment?: string, class?: string, archive_link_label?: string, circle_size?: int, sharp_corners?: bool, order?: string, orderby?: string} $attrs
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
 * @param array<string, string|int|bool> $attrs Arguments for displaying stories.
 * @param array<string, string|int|bool> $query_args Query arguments for stories.
 * @return WP_Post[]
 *
 * @phpstan-param array{view_type?: string, number_of_columns?: int, show_title?: bool, show_author?: bool, show_date?: bool, show_archive_link?: bool|string, show_excerpt?: bool, image_alignment?: string, class?: string, archive_link_label?: string, circle_size?: int, sharp_corners?: bool, order?: string, orderby?: string} $attrs
 */
function get_stories( array $attrs = [], array $query_args = [] ): array {
	return ( new Story_Query( $attrs, $query_args ) )->get_stories();
}

/**
 * Render stories based on customizer settings.
 *
 * @since 1.5.0
 */
function render_theme_stories(): void {
	$injector = Services::get_injector();

	/**
	 * Customizer instance.
	 *
	 * @var Customizer $customizer Customizer instance.
	 */
	$customizer = $injector->make( Customizer::class );
	//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $customizer->render_stories();
}
