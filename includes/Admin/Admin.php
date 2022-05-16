<?php
/**
 * Admin class.
 *
 * Responsible for WordPress admin integration.
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Context;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Image;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;

/**
 * Admin class.
 */
class Admin extends Service_Base {
	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Single constructor.
	 *
	 * @param Context $context Context instance.
	 */
	public function __construct( Context $context ) {
		$this->context = $context;
	}

	/**
	 * Initialize admin-related functionality.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		add_filter( 'admin_body_class', [ $this, 'admin_body_class' ], 99 );
		add_filter( 'default_content', [ $this, 'prefill_post_content' ], 10, 2 );
		add_filter( 'default_title', [ $this, 'prefill_post_title' ] );
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'admin_init';
	}

	/**
	 * Filter the list of admin classes.
	 *
	 * Makes sure the admin menu is collapsed when accessing
	 * the dashboard and the editor.
	 *
	 * @since 1.0.0
	 *
	 * @param string|mixed $class Current classes.
	 * @return string|mixed $class List of Classes.
	 */
	public function admin_body_class( $class ) {
		if ( ! $this->context->is_story_editor() ) {
			return $class;
		}

		// Default WordPress posts list table screen and dashboard.
		if ( 'post' !== $this->context->get_screen_base() ) {
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
	 * @since 1.0.0
	 *
	 * @param string|mixed $content Default post content.
	 * @param \WP_Post     $post    Post object.
	 * @return string|mixed Pre-filled post content if applicable, or the default content otherwise.
	 */
	public function prefill_post_content( $content, $post ) {
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
		if ( ! $story->load_from_post( $post_id ) ) {
			return $content;
		}

		$args = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];

		if ( ! use_block_editor_for_post( $post ) ) {

			$content = '[web_stories_embed url="%1$s" title="%2$s" poster="%3$s" width="%4$s" height="%5$s" align="%6$s"]';

			return sprintf(
				$content,
				esc_url( $story->get_url() ),
				esc_attr( $story->get_title() ),
				esc_url( $story->get_poster_portrait() ),
				absint( $args['width'] ),
				absint( $args['height'] ),
				esc_attr( $args['align'] )
			);
		}

		$renderer = new Image( $story );
		$html     = $renderer->render( $args );

		$content = '<!-- wp:web-stories/embed {"blockType":"url","url":"%1$s","title":"%2$s","poster":"%3$s","width":"%4$s","height":"%5$s","align":"%6$s","stories": [%7$s]} -->%8$s<!-- /wp:web-stories/embed -->';
		// note $story->get_url should not be escaped here (esc_url()) see https://github.com/GoogleForCreators/web-stories-wp/issues/11371.
		return sprintf(
			$content,
			$story->get_url(),
			esc_js( $story->get_title() ),
			esc_url( $story->get_poster_portrait() ),
			absint( $args['width'] ),
			absint( $args['height'] ),
			esc_js( $args['align'] ),
			absint( $post_id ),
			$html
		);
	}

	/**
	 * Pre-fills post title with the story title.
	 *
	 * @since 1.0.0
	 *
	 * @param string|mixed $title Default post title.
	 * @return string|mixed Pre-filled post title if applicable, or the default title otherwise.
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

		// Not using get_the_title() because we need the raw title.
		// Otherwise it runs through wptexturize() and the like, which we want to avoid.
		return $post->post_title;
	}
}
