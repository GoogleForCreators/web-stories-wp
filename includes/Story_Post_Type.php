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

use Google\Web_Stories\REST_API\Stories_Controller;
use WP_Post_Type;
use WP_Rewrite;
use WP_Query;

/**
 * Class Story_Post_Type.
 */
class Story_Post_Type extends Service_Base {

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

		add_filter( 'rest_' . self::POST_TYPE_SLUG . '_collection_params', [ $this, 'filter_rest_collection_params' ], 10, 2 );

		add_filter( 'pre_handle_404', [ $this, 'redirect_post_type_archive_urls' ], 10, 2 );
		add_filter( '_wp_post_revision_fields', [ $this, 'filter_revision_fields' ], 10, 2 );
		add_filter( 'wp_insert_post_data', [ $this, 'change_default_title' ] );
		add_filter( 'bulk_post_updated_messages', [ $this, 'bulk_post_updated_messages' ], 10, 2 );
	}

	/**
	 * Base64 encoded svg icon.
	 *
	 * @since 1.0.0
	 *
	 * @return string Base64-encoded SVG icon.
	 */
	protected function get_post_type_icon() {
		return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAyMGM1LjUyMyAwIDEwLTQuNDc3IDEwLTEwUzE1LjUyMyAwIDEwIDAgMCA0LjQ3NyAwIDEwczQuNDc3IDEwIDEwIDEwek01LjUgNmExIDEgMCAwMTEtMUgxMWExIDEgMCAwMTEgMXY4YTEgMSAwIDAxLTEgMUg2LjVhMSAxIDAgMDEtMS0xVjZ6TTEzIDZhMSAxIDAgMDExIDF2NmExIDEgMCAwMS0xIDFWNnptMi43NSAxLjc1QS43NS43NSAwIDAwMTUgN3Y2YS43NS43NSAwIDAwLjc1LS43NXYtNC41eiIgZmlsbD0iI2EwYTVhYSIvPjwvc3ZnPg==';
	}

	/**
	 * Add story_author as allowed orderby value for REST API.
	 *
	 * @since 1.0.0
	 *
	 * @param array        $query_params Array of allowed query params.
	 * @param WP_Post_Type $post_type Post type.
	 *
	 * @return array Array of query params.
	 */
	public function filter_rest_collection_params( $query_params, $post_type ) {
		if ( self::POST_TYPE_SLUG !== $post_type->name ) {
			return $query_params;
		}

		if ( empty( $query_params['orderby'] ) ) {
			return $query_params;
		}
		$query_params['orderby']['enum'][] = 'story_author';
		return $query_params;
	}

	/**
	 * Filters the revision fields to ensure that JSON representation gets saved to Story revisions.
	 *
	 * @since 1.0.0
	 *
	 * @param array $fields Array of allowed revision fields.
	 * @param array $story Story post array.
	 *
	 * @return array Array of allowed fields.
	 */
	public function filter_revision_fields( $fields, $story ) {
		if ( self::POST_TYPE_SLUG === $story['post_type'] ) {
			$fields['post_content_filtered'] = __( 'Story data', 'web-stories' );
		}
		return $fields;
	}



	/**
	 * Handles redirects to the post type archive.
	 *
	 * Redirects requests to `/stories` (old) to `/web-stories` (new).
	 * Redirects requests to `/stories/1234` (old) to `/web-stories/1234` (new).
	 *
	 * @since 1.0.0
	 *
	 * @param bool     $bypass Pass-through of the pre_handle_404 filter value.
	 * @param WP_Query $query The WP_Query object.
	 * @return bool Whether to pass-through or not.
	 */
	public function redirect_post_type_archive_urls( $bypass, $query ) {
		global $wp_rewrite;

		// If a plugin has already utilized the pre_handle_404 function, return without action to avoid conflicts.
		if ( $bypass ) {
			return $bypass;
		}

		if ( ! $wp_rewrite instanceof WP_Rewrite || ! $wp_rewrite->using_permalinks() ) {
			return $bypass;
		}
		// 'pagename' is for most permalink types, name is for when the %postname% is used as a top-level field.
		if ( isset( $query->query['pagename'] ) && 'stories' === $query->query['pagename'] && ( 'stories' === $query->get( 'pagename' ) || 'stories' === $query->get( 'name' ) ) ) {
			$redirect_url = get_post_type_archive_link( self::POST_TYPE_SLUG );
			if (
				$query->get( 'page' ) &&
				is_numeric( $query->get( 'page' ) ) &&
				self::POST_TYPE_SLUG === get_post_type( absint( $query->get( 'page' ) ) )
			) {
				$redirect_url = get_permalink( absint( $query->get( 'page' ) ) );
			} elseif ( $query->get( 'feed' ) ) {
				$feed         = ( 'feed ' === $query->get( 'feed' ) ) ? $query->get( 'feed' ) : '';
				$redirect_url = get_post_type_archive_feed_link( self::POST_TYPE_SLUG, $feed );
			}

			if ( ! $redirect_url ) {
				return $bypass;
			}

			wp_safe_redirect( $redirect_url, 301 );
			exit;
		}

		return $bypass;
	}

	/**
	 * Filters the bulk action updated messages.
	 *
	 * @since 1.1.0
	 *
	 * @param array[] $bulk_messages Arrays of messages, each keyed by the corresponding post type. Messages are
	 *                               keyed with 'updated', 'locked', 'deleted', 'trashed', and 'untrashed'.
	 * @param int[]   $bulk_counts   Array of item counts for each message, used to build internationalized strings.
	 *
	 * @return array Bulk counts.
	 */
	public function bulk_post_updated_messages( array $bulk_messages, $bulk_counts ) {
		$bulk_messages[ self::POST_TYPE_SLUG ] = [
			/* translators: %s: Number of stories. */
			'updated'   => _n( '%s story updated.', '%s stories updated.', $bulk_counts['updated'], 'web-stories' ),
			'locked'    => ( 1 === $bulk_counts['locked'] ) ? __( '1 story not updated, somebody is editing it.', 'web-stories' ) :
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
	 * @param array $data Array of data to save.
	 *
	 * @return array
	 */
	public function change_default_title( $data ) {
		if ( self::POST_TYPE_SLUG === $data['post_type'] && 'auto-draft' === $data['post_status'] ) {
			$data['post_title'] = '';
		}
		return $data;
	}
}
