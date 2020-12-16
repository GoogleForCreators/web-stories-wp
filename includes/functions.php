<?php
/**
 * Miscellaneous functions.
 * These are mostly utility or wrapper functions.
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
namespace Google\Web_Stories;

/**
 * Fetch stories based on customizer settings.
 *
 * @param array $args Arguments for fetching stories.
 *
 * @return string|void
 */
function stories( $args = [] ) {
	$story_query = new Story_Query( $args );
	//phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	echo $story_query->render();
}
