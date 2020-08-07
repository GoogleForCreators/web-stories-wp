<?php
/**
 * Admin class.
 *
 * Responsible for WordPress admin integration.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Renderer\Embed;
use WP_Post;
use WP_Screen;

/**
 * Admin class.
 */
class Admin {
	/**
	 * Initialize admin-related functionality.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'admin_body_class', [ $this, 'admin_body_class' ], 99 );
		add_filter( 'default_content', [ $this, 'prefill_post_content' ] );
		add_filter( 'default_title', [ $this, 'prefill_post_title' ] );
	}

	/**
	 * Filter the list of admin classes.
	 *
	 * Makes sure the admin menu is collapsed when accessing
	 * the dashboard and the editor.
	 *
	 * @param string $class Current classes.
	 *
	 * @return string $class List of Classes.
	 */
	public function admin_body_class( $class ) {
		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return $class;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return $class;
		}

		// Default WordPress posts list table screen.
		if ( 'edit' === $screen->base ) {
			return $class;
		}

		$class .= ' edit-story';

		// Overrides regular WordPress behavior by collapsing the admin menu by default.
		if ( false === strpos( $class, 'folded' ) ) {
			$class .= ' folded';
		}

		return $class;
	}

	/**
	 * Pre-fills post content with a web-story/embed block.
	 *
	 * @param string $content Default post content.
	 *
	 * @return string Pre-filled post content if applicable, or the default content otherwise.
	 */
	public function prefill_post_content( $content ) {
		if ( ! isset( $_GET['from-web-story'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $content;
		}

		$post_id = absint( sanitize_text_field( (string) wp_unslash( $_GET['from-web-story'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $post_id || Story_Post_Type::POST_TYPE_SLUG !== get_post_type( $post_id ) ) {
			return $content;
		}

		if ( ! current_user_can( 'read_post', $post_id ) ) {
			return $content;
		}

		$story = new Story();
		$story->load_from_post( $post_id );

		$renderer = new Embed( $story, 360, 600, 'none' );
		$html     = $renderer->render();

		$block_markup = '<!-- wp:web-stories/embed {"url":"%1$s","title":"%2$s","poster":"%3$s"} -->%4$s<!-- /wp:web-stories/embed -->';

		return sprintf(
			$block_markup,
			esc_url( $story->get_url() ),
			esc_js( $story->get_title() ),
			esc_url( $story->get_poster_portrait() ),
			$html
		);
	}

	/**
	 * Pre-fills post title with the story title.
	 *
	 * @param string $title Default post title.
	 *
	 * @return string Pre-filled post title if applicable, or the default title otherwise.
	 */
	public function prefill_post_title( $title ) {
		if ( ! isset( $_GET['from-web-story'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $title;
		}

		$post_id = absint( sanitize_text_field( (string) wp_unslash( $_GET['from-web-story'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $post_id ) {
			return $title;
		}

		if ( ! current_user_can( 'read_post', $post_id ) ) {
			return $title;
		}

		$post = get_post( $post_id );

		if ( ! $post instanceof WP_Post || Story_Post_Type::POST_TYPE_SLUG !== $post->post_type ) {
			return $title;
		}

		$story = new Story();
		$story->load_from_post( $post );

		// Not using get_the_title() because we need the raw title.
		// Otherwise it runs through wptexturize() and the like, which we want to avoid.
		return $story->get_title();
	}
}
