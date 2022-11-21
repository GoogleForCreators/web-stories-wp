<?php
/**
 * Class Feed
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

namespace Google\Web_Stories\Renderer;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Image;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;

/**
 * Class Feed
 */
class Feed extends Service_Base {

	/**
	 * Filter RSS content fields.
	 *
	 * @since 1.7.0
	 */
	public function register(): void {
		add_filter( 'the_content_feed', [ $this, 'embed_image' ] );
		add_filter( 'the_excerpt_rss', [ $this, 'embed_image' ] );
	}

	/**
	 * Filter feed content for stories to render as an image.
	 *
	 * @since 1.0.0
	 *
	 * @param string|mixed $content Feed content.
	 * @return string|mixed
	 */
	public function embed_image( $content ) {
		$post = get_post();

		if ( $post instanceof WP_Post && Story_Post_Type::POST_TYPE_SLUG === $post->post_type ) {
			$story = new Story();
			$story->load_from_post( $post );

			$image   = new Image( $story );
			$content = $image->render();
		}

		return $content;
	}
}
