<?php
/**
 * Class Oembed.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

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

namespace Google\Web_Stories;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Renderer\Image;
use WP_Post;

/**
 * Oembed class.
 */
class Oembed {
	/**
	 * Initializes the Oembed logic.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'embed_html', [ $this, 'embed_html' ], 10, 3 );
	}

	/**
	 * Filters the embed HTML output for a given post, if a story, return a story image embed.
	 *
	 * @since 1.6.0
	 *
	 * @param string  $output The default iframe tag to display embedded content.
	 * @param WP_Post $post   Current post object.
	 * @param int     $width  Width of the response.
	 *
	 * @returns string  $output
	 */
	public function embed_html( $output, $post, $width ) {
		if ( $post instanceof WP_Post && Story_Post_Type::POST_TYPE_SLUG === $post->post_type ) {
			$story = new Story();
			$story->load_from_post( $post );

			$image = new Image( $story );
			// Height from filter results in a oddly shaped image. This gives the correct width and a height that results in the correct height.
			$height = ceil( $width * 1.66666 );
			$output = $image->render(
				[
					'height' => $height,
					'width'  => $width,
				]
			);
		}

		return $output;
	}
}
