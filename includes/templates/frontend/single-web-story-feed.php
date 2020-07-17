<?php
/**
 * Template for feed web-story post type.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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
// phpcs:disable  VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable

if ( empty( $attributes ) ) {
	return;
}

$url             = (string) $attributes['url'];
$web_story_title = (string) $attributes['title'];

?>

<div class="wp-block-web-stories-embed">
	<a href="<?php echo esc_url( $url ); ?>">
		<?php
		if ( ! empty( $attributes['poster'] ) ) {
			printf(
				'<img src="%1$s" width="%2$d" height="%3$d" alt="%4$s" />',
				esc_url( $attributes['poster'] ),
				absint( $attributes['width'] ),
				absint( $attributes['height'] ),
				esc_attr( $web_story_title )
			);
		} else {
			echo esc_html( $web_story_title );
		}
		?>
	</a>
</div>
