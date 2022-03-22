<?php
/**
 * Class Story_Archive.
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

namespace Google\Web_Stories;

use WP_Post;
use WP_Query;
use WP_Rewrite;

/**
 * Class Story_Archive.
 */
class Story_Archive extends Service_Base {

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Analytics constructor.
	 *
	 * @since 1.13.0
	 *
	 * @param Settings        $settings        Settings instance.
	 * @param Story_Post_Type $story_post_type Experiments instance.
	 * @return void
	 */
	public function __construct( Settings $settings, Story_Post_Type $story_post_type ) {
		$this->settings        = $settings;
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Registers Filters and actions
	 *
	 * @since 1.13.0
	 */
	public function register(): void {
		add_filter( 'pre_handle_404', [ $this, 'redirect_post_type_archive_urls' ], 10, 2 );

		add_action( 'add_option_' . $this->settings::SETTING_NAME_ARCHIVE, [ $this, 'update_archive_setting' ] );
		add_action( 'update_option_' . $this->settings::SETTING_NAME_ARCHIVE, [ $this, 'update_archive_setting' ] );
		add_action( 'add_option_' . $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, [ $this, 'update_archive_setting' ] );
		add_action( 'update_option_' . $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, [ $this, 'update_archive_setting' ] );

		add_filter( 'display_post_states', [ $this, 'filter_display_post_states' ], 10, 2 );
		add_action( 'pre_get_posts', [ $this, 'pre_get_posts' ] );
		add_action( 'wp_trash_post', [ $this, 'on_remove_archive_page' ] );
		add_action( 'delete_post', [ $this, 'on_remove_archive_page' ] );
	}

	/**
	 * Handles redirects to the post type archive.
	 *
	 * @since 1.13.0
	 *
	 * @param bool|mixed $bypass Pass-through of the pre_handle_404 filter value.
	 * @param \WP_Query  $query  The WP_Query object.
	 * @return bool|mixed Whether to pass-through or not.
	 */
	public function redirect_post_type_archive_urls( $bypass, $query ) {
		global $wp_rewrite;

		if ( $bypass || ! \is_string( $this->story_post_type->get_has_archive() ) || ( ! $wp_rewrite instanceof WP_Rewrite || ! $wp_rewrite->using_permalinks() ) ) {
			return $bypass;
		}

		// 'pagename' is for most permalink types, name is for when the %postname% is used as a top-level field.
		if ( $this->story_post_type::REWRITE_SLUG === $query->get( 'pagename' ) || $this->story_post_type::REWRITE_SLUG === $query->get( 'name' ) ) {
			$redirect_url = get_post_type_archive_link( $this->story_post_type->get_slug() );

			if ( ! $redirect_url ) {
				return $bypass;
			}

			// Only exit if there was actually a location to redirect to.
			// Allows filtering location in tests to verify behavior.
			if ( wp_safe_redirect( $redirect_url, 301 ) ) {
				exit;
			}
		}

		return $bypass;
	}

	/**
	 * Clear rewrite rules on update on setting.
	 *
	 * @since 1.13.0
	 */
	public function update_archive_setting(): void {
		$this->story_post_type->unregister_post_type();
		$this->story_post_type->register_post_type();

		if ( ! \defined( '\WPCOM_IS_VIP_ENV' ) || false === \WPCOM_IS_VIP_ENV ) {
			flush_rewrite_rules( false );
		}
	}

	/**
	 * Modifies the current query to set up the custom archive page.
	 *
	 * @since 1.13.0
	 *
	 * @param WP_Query $query Current query instance, passed by reference.
	 */
	public function pre_get_posts( WP_Query $query ): void {
		if ( ! \is_string( $this->story_post_type->get_has_archive() ) ) {
			return;
		}

		if ( $query->is_admin || ! $query->is_main_query() ) {
			return;
		}

		if ( ! $query->is_post_type_archive( $this->story_post_type->get_slug() ) ) {
			return;
		}

		$custom_archive_page_id = (int) $this->settings->get_setting( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		$query->set( 'page_id', $custom_archive_page_id );
		$query->set( 'post_type', 'page' );
		$query->is_post_type_archive = false;
		$query->is_archive           = false;
		$query->is_singular          = true;
		$query->is_page              = true;
	}

	/**
	 * Resets archive settings when the custom archive page is trashed.
	 *
	 * @since 1.14.0
	 *
	 * @param int $postid Post ID.
	 */
	public function on_remove_archive_page( $postid ): void {
		if ( 'page' !== get_post_type( $postid ) ) {
			return;
		}

		$custom_archive_page_id = (int) $this->settings->get_setting( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		if ( $custom_archive_page_id !== $postid ) {
			return;
		}

		$this->settings->update_setting( $this->settings::SETTING_NAME_ARCHIVE, 'default' );
		$this->settings->update_setting( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID, 0 );
	}

	/**
	 * Filters the default post display states used in the posts list table.
	 *
	 * @since 1.13.0
	 *
	 * @param string[]|mixed $post_states An array of post display states.
	 * @param WP_Post|null   $post        The current post object.
	 * @return string[]|mixed Filtered post display states.
	 */
	public function filter_display_post_states( $post_states, $post ) {
		if ( ! \is_array( $post_states ) || ! $post ) {
			return $post_states;
		}

		if ( ! \is_string( $this->story_post_type->get_has_archive() ) ) {
			return $post_states;
		}

		$custom_archive_page_id = (int) $this->settings->get_setting( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );

		if ( $post->ID === $custom_archive_page_id ) {
			$post_states['web_stories_archive_page'] = __( 'Web Stories Archive Page', 'web-stories' );
		}

		return $post_states;
	}
}
