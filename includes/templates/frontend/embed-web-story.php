<?php
/**
 * Template for embedded web-story.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Image;

/**
 * Copyright 2021 Google LLC
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

get_header( 'embed' );

if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		$current_post = get_post();

		if ( $current_post instanceof WP_Post && has_post_thumbnail( $current_post ) ) {
			$story = new Story();
			$story->load_from_post( $current_post );
			$renderer = new Image( $story );
			echo $renderer->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			get_template_part( 'embed', 'content' );
		}
	endwhile;
else :
	get_template_part( 'embed', '404' );
endif;

get_footer( 'embed' );
