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
		// Migrations.
		$database_upgrader = new Database_Upgrader();
		$database_upgrader->init();

		add_filter( 'admin_body_class', [ __CLASS__, 'admin_body_class' ], 99 );
		add_filter( 'default_content', [ __CLASS__, 'prefill_post_content' ] );
		add_filter( 'default_title', [ __CLASS__, 'prefill_post_title' ] );
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
	public static function admin_body_class( $class ) {
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
	public static function prefill_post_content( $content ) {
		$embed_story = isset( $_GET['from-web-story'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $embed_story ) {
			return $content;
		}

		$post_id = absint( $_GET['from-web-story'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
		if ( $post_id && Story_Post_Type::POST_TYPE_SLUG === get_post_type( $post_id ) && current_user_can( 'read_post', $post_id ) ) {
			$url        = (string) get_the_permalink( $post_id );
			$title      = (string) get_the_title( $post_id );
			$has_poster = has_post_thumbnail( $post_id );

			ob_start();

			if ( $has_poster ) {
				$poster = (string) wp_get_attachment_image_url( (int) get_post_thumbnail_id( $post_id ), Media::STORY_POSTER_IMAGE_SIZE );
				?>
				<!-- wp:web-stories/embed {"url":"<?php echo esc_js( $url ); ?>","title":"<?php echo esc_js( $title ); ?>","poster":"<?php echo esc_url( $poster ); ?>"} -->
				<div class="wp-block-web-stories-embed alignnone">
					<amp-story-player style="width:360px;height:600px" data-testid="amp-story-player"><a
							href="<?php echo esc_url( $url ); ?>"
							style="--story-player-poster:url('<?php echo esc_url( $poster ); ?>')"><?php echo $title; ?></a>
					</amp-story-player>
				</div>
				<!-- /wp:web-stories/embed -->
				<?php
			} else {
				?>
				<!-- wp:web-stories/embed {"url":"<?php echo esc_url( $url ); ?>","title":"<?php echo esc_js( $title ); ?>","poster":""} -->
				<div class="wp-block-web-stories-embed alignnone">
					<amp-story-player style="width:360px;height:600px" data-testid="amp-story-player"><a
							href="<?php echo esc_url( $url ); ?>"
							><?php echo $title; ?></a>
					</amp-story-player>
				</div>
				<!-- /wp:web-stories/embed -->
				<?php
			}

			return (string) ob_get_clean();
		}
		// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped

		return $content;
	}

	/**
	 * Pre-fills post title with the story title.
	 *
	 * @param string $title Default post title.
	 *
	 * @return string Pre-filled post title if applicable, or the default title otherwise.
	 */
	public static function prefill_post_title( $title ) {
		$embed_story = isset( $_GET['from-web-story'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $embed_story ) {
			return $title;
		}

		$post_id = absint( $_GET['from-web-story'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( $post_id && Story_Post_Type::POST_TYPE_SLUG === get_post_type( $post_id ) && current_user_can( 'read_post', $post_id ) ) {
			$post = get_post( $post_id );

			if ( $post instanceof \WP_Post ) {
				return $post->post_title;
			}
		}

		return $title;
	}
}
