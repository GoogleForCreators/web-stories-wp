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

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class Jetpack.
 */
class Jetpack extends Service_Base {
	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function register() {
		// See https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80.
		if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
			add_filter( 'wpcom_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		} else {
			add_filter( 'jetpack_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		}

		add_filter( 'jetpack_is_amp_request', [ $this, 'force_amp_request' ] );
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
	 * Force jetpack to see web stories as AMP.
	 *
	 * @since 1.2.0
	 *
	 * @param boolean $is_amp_request Is the request supposed to return valid AMP content.
	 *
	 * @return bool Whether the current request is an AMP request.
	 */
	public function force_amp_request( $is_amp_request ) {
		if ( ! is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return $is_amp_request;
		}
		return true;
	}
}
