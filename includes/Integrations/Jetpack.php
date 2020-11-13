<?php
/**
 * Class Jetpack
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

namespace Google\Web_Stories\Integrations;

use DOMElement;
use Google\Web_Stories\Discovery;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;
use WP_Screen;

/**
 * Class Jetpack.
 */
class Jetpack {
	/**
	 * Frontend.
	 *
	 * @var Discovery
	 */
	public $discovery;

	/**
	 * Constructor.
	 *
	 * @param Discovery $discovery Analytics instance.
	 */
	public function __construct( Discovery $discovery ) {
		$this->discovery = $discovery;
	}

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function init() {
		// See https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80.
		if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
			add_filter( 'wpcom_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		} else {
			add_filter( 'jetpack_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		}
		// Load at priority 2 - https://github.com/Automattic/jetpack/blob/e940e90c3f26a6f24f8e7fccd72a1dd6360be2b5/class.jetpack.php#L709.
		add_action( 'web_stories_story_head', [ $this, 'remove_jetpack_open_graph' ], 2 );
	}

	/**
	 * Adds the web story post type to Jetpack / WordPress.com sitemaps.
	 *
	 * @see https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80
	 *
	 * @since 1.2.0
	 *
	 * @param array $post_types Array of post types.
	 *
	 * @return array Modified list of post types.
	 */
	public function add_to_jetpack_sitemap( $post_types ) {
		$post_types[] = Story_Post_Type::POST_TYPE_SLUG;

		return $post_types;
	}

	/**
	 * Remove web stories open graph tags if jetpack is active.
	 *
	 * @return void
	 */
	public function remove_jetpack_open_graph() {
		/**
		 * Filter copied from jetpack.
		 *
		 * @see https://github.com/Automattic/jetpack/blob/e940e90c3f26a6f24f8e7fccd72a1dd6360be2b5/class.jetpack.php#L2126
		 *
		 * @param bool false Should Open Graph Meta tags be added. Default to false.
		 */
		if ( apply_filters( 'jetpack_enable_open_graph', false ) ) {
			remove_action( 'web_stories_story_head', [ $this->discovery, 'print_open_graph_metadata' ] );
			remove_action( 'web_stories_story_head', [ $this->discovery, 'print_twitter_metadata' ] );
		}
	}
}
