<?php
/**
 * Class Archives
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

namespace Google\Web_Stories\Renderer;

use Google\Web_Stories\{AMP_Story_Player_Assets,Assets,Story_Post_Type, Service_Base};
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Embed;
use WP_Post;

/**
 * Class Archives
 *
 * @package Google\Web_Stories\Single
 */
class Archives extends Service_Base {

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	protected $assets;

	/**
	 * AMP_Story_Player_Assets instance.
	 *
	 * @var AMP_Story_Player_Assets AMP_Story_Player_Assets instance.
	 */
	protected $amp_story_player_assets;

	/**
	 * Archives constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Assets                  $assets            Assets instance.
	 * @param AMP_Story_Player_Assets $amp_story_player_assets AMP_Story_Player_Assets instance.
	 */
	public function __construct( Assets $assets, AMP_Story_Player_Assets $amp_story_player_assets ) {
		$this->assets                  = $assets;
		$this->amp_story_player_assets = $amp_story_player_assets;
	}

	/**
	 * Filter content and excerpt for search and post type archive.
	 *
	 * @since 1.7.0
	 *
	 * @return void
	 */
	public function register() {
		add_filter( 'the_content', [ $this, 'embed_player' ], PHP_INT_MAX );
		add_filter( 'the_excerpt', [ $this, 'embed_player' ], PHP_INT_MAX );
	}

	/**
	 * Change the content to an embedded player
	 *
	 * @since 1.0.0
	 *
	 * @param string $content Current content of filter.
	 *
	 * @return string
	 */
	public function embed_player( $content ) {
		$post = get_post();

		if ( is_feed() ) {
			return $content;
		}

		if ( ! is_search() && ! is_post_type_archive( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return $content;
		}

		if ( $post instanceof WP_Post && Story_Post_Type::POST_TYPE_SLUG === $post->post_type ) {
			$story = new Story();
			$story->load_from_post( $post );

			$embed   = new Embed( $story, $this->assets, $this->amp_story_player_assets );
			$content = $embed->render();
		}

		return $content;
	}
}
