<?php
/**
 * Template for web-story post type.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\HTML;

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

the_post();

$current_post = get_post();

if ( $current_post instanceof WP_Post ) {
	$story = new Story();
	$story->load_from_post( $current_post );
	$renderer = new HTML( $story );
	echo $renderer->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

// Some themes like the Sage theme override the WordPress template hierarchy in an unusual way,
// which the Single Renderer tries to work around with filters.
// However, that means this template potentially gets loaded twice when using such a theme, causing duplicate markup.
// Exiting here avoids that, while still guaranteeing the output buffer to function properly.
exit;
