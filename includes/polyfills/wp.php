<?php
/**
 * WordPress compatibility.
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

if ( ! function_exists( 'wp_after_insert_post' ) ) {
	/**
	 * Fires actions after a post, its terms and meta data has been saved.
	 *
	 * Polyfill to ensure compatibility with new function added in WP 5.6.
	 *
	 * @since 1.2.0
	 *
	 * @param int|WP_Post  $post        The post ID or object that has been saved.
	 * @param bool         $update      Whether this is an existing post being updated.
	 * @param null|WP_Post $post_before Null for new posts, the WP_Post object prior
	 *                                  to the update for updated posts.
	 */
	function wp_after_insert_post( $post, $update, $post_before ) {
		$post = get_post( $post );
		if ( ! $post ) {
			return;
		}

		$post_id = $post->ID;

		/** This action is documented in wp-includes/post.php */
		do_action( 'wp_after_insert_post', $post_id, $post, $update, $post_before );
	}
}
