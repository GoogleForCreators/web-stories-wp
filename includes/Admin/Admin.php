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

declare(strict_types = 1);

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Context;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Image;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;

/**
 * Admin class.
 */
class Admin extends Service_Base {

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private Settings $settings;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private Context $context;

	/**
	 * Single constructor.
	 *
	 * @param Settings $settings Settings instance.
	 * @param Context  $context Context instance.
	 */
	public function __construct( Settings $settings, Context $context ) {
		$this->settings = $settings;
		$this->context  = $context;
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
		add_filter( 'display_media_states', [ $this, 'media_states' ], 10, 2 );
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
	 * @param string|mixed $class_name Current classes.
	 * @return string|mixed List of Classes.
	 */
	public function admin_body_class( $class_name ) {
		if ( ! \is_string( $class_name ) ) {
			return $class_name;
		}

		if ( ! $this->context->is_story_editor() ) {
			return $class_name;
		}

		// Default WordPress posts list table screen and dashboard.
		if ( 'post' !== $this->context->get_screen_base() ) {
			return $class_name;
		}

		$class_name .= ' edit-story';

		// Overrides regular WordPress behavior by collapsing the admin menu by default.
		if ( ! str_contains( $class_name, 'folded' ) ) {
			$class_name .= ' folded';
		}

		return $class_name;
	}

	/**
	 * Pre-fills post content with a web-story/embed block.
	 *
	 * @since 1.0.0
	 *
	 * @param string|mixed $content Default post content.
	 * @param WP_Post|null $post    Post object.
	 * @return string|mixed Pre-filled post content if applicable, or the default content otherwise.
	 */
	public function prefill_post_content( $content, ?WP_Post $post ) {
		if ( ! $post ) {
			return $content;
		}

		if ( ! isset( $_GET['from-web-story'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $content;
		}

		/**
		 * Story ID.
		 *
		 * @var string $from_web_story
		 */
		$from_web_story = $_GET['from-web-story']; // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		$post_id = absint( sanitize_text_field( (string) wp_unslash( $from_web_story ) ) );

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

		if ( ! $story->get_title() ) {
			$story->set_title( __( 'Web Story', 'web-stories' ) );
		}

		$args = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];

		if ( ! use_block_editor_for_post( $post ) ) {
			$content = '[web_stories_embed url="%1$s" title="%2$s" poster="%3$s" width="%4$s" height="%5$s" align="%6$s"]';

			return \sprintf(
				$content,
				esc_url( $story->get_url() ),
				esc_attr( $story->get_title() ),
				esc_url( $story->get_poster_portrait() ),
				absint( $args['width'] ),
				absint( $args['height'] ),
				esc_attr( $args['align'] )
			);
		}

		$story->set_poster_sizes( '' );
		$story->set_poster_srcset( '' );
		$renderer = new Image( $story );
		$html     = $renderer->render( $args );

		$content = '<!-- wp:web-stories/embed {"blockType":"url","url":"%1$s","title":"%2$s","poster":"%3$s","width":"%4$s","height":"%5$s","align":"%6$s","stories": [%7$s]} -->%8$s<!-- /wp:web-stories/embed -->';
		// note $story->get_url should not be escaped here (esc_url()) see https://github.com/GoogleForCreators/web-stories-wp/issues/11371.
		return \sprintf(
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

		/**
		 * Story ID.
		 *
		 * @var string $from_web_story
		 */
		$from_web_story = $_GET['from-web-story']; // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		$post_id = absint( sanitize_text_field( (string) wp_unslash( $from_web_story ) ) );

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

	/**
	 * Adds active publisher logo to media state output.
	 *
	 * @since 1.23.0
	 *
	 * @param mixed   $media_states Array of media states.
	 * @param WP_Post $post         Post object.
	 * @return mixed Filtered media states.
	 */
	public function media_states( $media_states, WP_Post $post ) {
		if ( ! \is_array( $media_states ) ) {
			return $media_states;
		}

		$active_publisher_logo_id = absint( $this->settings->get_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO ) );

		if ( $post->ID === $active_publisher_logo_id ) {
			$media_states[] = __( 'Web Stories Publisher Logo', 'web-stories' );
		}
		return $media_states;
	}
}
