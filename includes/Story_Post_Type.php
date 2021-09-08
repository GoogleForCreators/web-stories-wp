<?php
/**
 * Class Story_Post_Type.
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

use Google\Web_Stories\Infrastructure\PluginDeactivationAware;
use Google\Web_Stories\Infrastructure\SiteInitializationAware;
use Google\Web_Stories\REST_API\Stories_Controller;
use WP_Post;
use WP_Site;

/**
 * Class Story_Post_Type.
 */
class Story_Post_Type extends Service_Base implements PluginDeactivationAware, SiteInitializationAware {

	/**
	 * The slug of the stories post type.
	 *
	 * @var string
	 */
	const POST_TYPE_SLUG = 'web-story';

	/**
	 * The rewrite slug for this post type.
	 *
	 * @var string
	 */
	const REWRITE_SLUG = 'web-stories';

	/**
	 * Style Present options name.
	 *
	 * @var string
	 */
	const STYLE_PRESETS_OPTION = 'web_stories_style_presets';

	/**
	 * Registers the post type for stories.
	 *
	 * @todo refactor
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register() {
		register_post_type(
			self::POST_TYPE_SLUG,
			[
				'labels'                => [
					'name'                     => _x( 'Stories', 'post type general name', 'web-stories' ),
					'singular_name'            => _x( 'Story', 'post type singular name', 'web-stories' ),
					'add_new'                  => _x( 'Add New', 'story', 'web-stories' ),
					'add_new_item'             => __( 'Add New Story', 'web-stories' ),
					'edit_item'                => __( 'Edit Story', 'web-stories' ),
					'new_item'                 => __( 'New Story', 'web-stories' ),
					'view_item'                => __( 'View Story', 'web-stories' ),
					'view_items'               => __( 'View Stories', 'web-stories' ),
					'search_items'             => __( 'Search Stories', 'web-stories' ),
					'not_found'                => __( 'No stories found.', 'web-stories' ),
					'not_found_in_trash'       => __( 'No stories found in Trash.', 'web-stories' ),
					'all_items'                => __( 'All Stories', 'web-stories' ),
					'archives'                 => __( 'Story Archives', 'web-stories' ),
					'attributes'               => __( 'Story Attributes', 'web-stories' ),
					'insert_into_item'         => __( 'Insert into story', 'web-stories' ),
					'uploaded_to_this_item'    => __( 'Uploaded to this story', 'web-stories' ),
					'featured_image'           => _x( 'Featured Image', 'story', 'web-stories' ),
					'set_featured_image'       => _x( 'Set featured image', 'story', 'web-stories' ),
					'remove_featured_image'    => _x( 'Remove featured image', 'story', 'web-stories' ),
					'use_featured_image'       => _x( 'Use as featured image', 'story', 'web-stories' ),
					'filter_items_list'        => __( 'Filter stories list', 'web-stories' ),
					'filter_by_date'           => __( 'Filter by date', 'web-stories' ),
					'items_list_navigation'    => __( 'Stories list navigation', 'web-stories' ),
					'items_list'               => __( 'Stories list', 'web-stories' ),
					'item_published'           => __( 'Story published.', 'web-stories' ),
					'item_published_privately' => __( 'Story published privately.', 'web-stories' ),
					'item_reverted_to_draft'   => __( 'Story reverted to draft.', 'web-stories' ),
					'item_scheduled'           => __( 'Story scheduled', 'web-stories' ),
					'item_updated'             => __( 'Story updated.', 'web-stories' ),
					'menu_name'                => _x( 'Stories', 'admin menu', 'web-stories' ),
					'name_admin_bar'           => _x( 'Story', 'add new on admin bar', 'web-stories' ),
					'item_link'                => _x( 'Story Link', 'navigation link block title', 'web-stories' ),
					'item_link_description'    => _x( 'A link to a story.', 'navigation link block description', 'web-stories' ),
				],
				'menu_icon'             => $this->get_post_type_icon(),
				'supports'              => [
					'title', // Used for amp-story[title].
					'author',
					'editor',
					'excerpt',
					'thumbnail', // Used for poster images.
					'revisions', // Without this, the REST API will return 404 for an autosave request.
				],
				'rewrite'               => [
					'slug'       => self::REWRITE_SLUG,
					'with_front' => false,
				],
				'public'                => true,
				'has_archive'           => true,
				'exclude_from_search'   => true,
				'show_ui'               => true,
				'show_in_rest'          => true,
				'rest_controller_class' => Stories_Controller::class,
				'capability_type'       => [ 'web-story', 'web-stories' ],
				'map_meta_cap'          => true,
			]
		);

		add_filter( '_wp_post_revision_fields', [ $this, 'filter_revision_fields' ], 10, 2 );
		add_filter( 'wp_insert_post_data', [ $this, 'change_default_title' ] );
		add_filter( 'bulk_post_updated_messages', [ $this, 'bulk_post_updated_messages' ], 10, 2 );
		add_action( 'clean_post_cache', [ $this, 'clear_user_posts_count' ], 10, 2 );
	}

	/**
	 * Act on site initialization.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being initialized.
	 * @return void
	 */
	public function on_site_initialization( WP_Site $site ) {
		$this->register();
	}

	/**
	 * Act on plugin deactivation.
	 *
	 * @since 1.6.0
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 * @return void
	 */
	public function on_plugin_deactivation( $network_wide ) {
		unregister_post_type( self::POST_TYPE_SLUG );
	}

	/**
	 * Base64 encoded svg icon.
	 *
	 * @since 1.0.0
	 *
	 * @return string Base64-encoded SVG icon.
	 */
	protected function get_post_type_icon(): string {
		return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAyMGM1LjUyMyAwIDEwLTQuNDc3IDEwLTEwUzE1LjUyMyAwIDEwIDAgMCA0LjQ3NyAwIDEwczQuNDc3IDEwIDEwIDEwek01LjUgNmExIDEgMCAwMTEtMUgxMWExIDEgMCAwMTEgMXY4YTEgMSAwIDAxLTEgMUg2LjVhMSAxIDAgMDEtMS0xVjZ6TTEzIDZhMSAxIDAgMDExIDF2NmExIDEgMCAwMS0xIDFWNnptMi43NSAxLjc1QS43NS43NSAwIDAwMTUgN3Y2YS43NS43NSAwIDAwLjc1LS43NXYtNC41eiIgZmlsbD0iI2EwYTVhYSIvPjwvc3ZnPg==';
	}

	/**
	 * Filters the revision fields to ensure that JSON representation gets saved to Story revisions.
	 *
	 * @since 1.0.0
	 *
	 * @param array|mixed $fields Array of allowed revision fields.
	 * @param array       $story  Story post array.
	 *
	 * @return array|mixed Array of allowed fields.
	 */
	public function filter_revision_fields( $fields, $story ) {
		if ( ! is_array( $fields ) ) {
			return $fields;
		}
		if ( self::POST_TYPE_SLUG === $story['post_type'] ) {
			$fields['post_content_filtered'] = __( 'Story data', 'web-stories' );
		}
		return $fields;
	}

	/**
	 * Filters the bulk action updated messages.
	 *
	 * @since 1.1.0
	 *
	 * @param array[]|mixed $bulk_messages Arrays of messages, each keyed by the corresponding post type. Messages are
	 *                               keyed with 'updated', 'locked', 'deleted', 'trashed', and 'untrashed'.
	 * @param int[]         $bulk_counts   Array of item counts for each message, used to build internationalized strings.
	 *
	 * @return array|mixed Bulk counts.
	 */
	public function bulk_post_updated_messages( $bulk_messages, $bulk_counts ) {
		if ( ! is_array( $bulk_messages ) ) {
			return $bulk_messages;
		}
		$bulk_messages[ self::POST_TYPE_SLUG ] = [
			/* translators: %s: Number of stories. */
			'updated'   => _n( '%s story updated.', '%s stories updated.', $bulk_counts['updated'], 'web-stories' ),
			'locked'    => ( 1 === $bulk_counts['locked'] ) ? __( 'Story not updated, somebody is editing it.', 'web-stories' ) :
				/* translators: %s: Number of stories. */
				_n( '%s story not updated, somebody is editing it.', '%s stories not updated, somebody is editing them.', $bulk_counts['locked'], 'web-stories' ),
			/* translators: %s: Number of stories. */
			'deleted'   => _n( '%s story permanently deleted.', '%s stories permanently deleted.', $bulk_counts['deleted'], 'web-stories' ),
			/* translators: %s: Number of stories. */
			'trashed'   => _n( '%s story moved to the Trash.', '%s stories moved to the Trash.', $bulk_counts['trashed'], 'web-stories' ),
			/* translators: %s: Number of stories. */
			'untrashed' => _n( '%s story restored from the Trash.', '%s stories restored from the Trash.', $bulk_counts['untrashed'], 'web-stories' ),
		];

		return $bulk_messages;
	}

	/**
	 * Reset default title to empty string for auto-drafts.
	 *
	 * @since 1.0.0
	 *
	 * @param array|mixed $data Array of data to save.
	 *
	 * @return array|mixed
	 */
	public function change_default_title( $data ) {
		if ( ! is_array( $data ) ) {
			return $data;
		}
		if ( self::POST_TYPE_SLUG === $data['post_type'] && 'auto-draft' === $data['post_status'] ) {
			$data['post_title'] = '';
		}
		return $data;
	}

	/**
	 * Invalid cache.
	 *
	 * @since 1.10.0
	 *
	 * @param int     $post_id   Post ID.
	 * @param WP_Post $post  Post object.
	 *
	 * @return void
	 */
	public function clear_user_posts_count( $post_id, $post ) {
		if ( ! $post instanceof WP_Post || self::POST_TYPE_SLUG !== $post->post_type ) {
			return;
		}

		$cache_key   = "count_user_{$post->post_type}_{$post->post_author}";
		$cache_group = 'user_posts_count';
		wp_cache_delete( $cache_key, $cache_group );
	}
}
