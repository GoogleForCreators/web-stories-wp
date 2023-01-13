<?php
/**
 * Class Archives
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

use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Embed;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;

/**
 * Class Archives
 */
class Archives extends Service_Base {

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	protected Assets $assets;

	/**
	 * AMP_Story_Player_Assets instance.
	 *
	 * @var AMP_Story_Player_Assets AMP_Story_Player_Assets instance.
	 */
	protected AMP_Story_Player_Assets $amp_story_player_assets;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	protected Context $context;

	/**
	 * Archives constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Assets                  $assets            Assets instance.
	 * @param AMP_Story_Player_Assets $amp_story_player_assets AMP_Story_Player_Assets instance.
	 * @param Context                 $context                 Context instance.
	 */
	public function __construct( Assets $assets, AMP_Story_Player_Assets $amp_story_player_assets, Context $context ) {
		$this->assets                  = $assets;
		$this->amp_story_player_assets = $amp_story_player_assets;
		$this->context                 = $context;
	}

	/**
	 * Filter content and excerpt for search and post type archive.
	 *
	 * @since 1.7.0
	 */
	public function register(): void {
		add_filter( 'the_content', [ $this, 'embed_player' ], PHP_INT_MAX );
		add_filter( 'the_excerpt', [ $this, 'embed_player' ], PHP_INT_MAX );
	}

	/**
	 * Change the content to an embedded player
	 *
	 * @since 1.0.0
	 *
	 * @param string|mixed $content Current content of filter.
	 * @return string|mixed
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

			$embed   = new Embed( $story, $this->assets, $this->context );
			$content = $embed->render();
		}

		return $content;
	}
}
