<?php
/**
 * Class Story_Post_Type.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\HasMeta;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\REST_API\Stories_Controller;
use WP_Post;

/**
 * Class Story_Post_Type.
 *
 * @phpstan-import-type PostTypeArgs from \Google\Web_Stories\Post_Type_Base
 */
class Story_Post_Type extends Post_Type_Base implements HasRequirements, HasMeta {

	/**
	 * The slug of the stories post type.
	 */
	public const POST_TYPE_SLUG = 'web-story';

	/**
	 * The rewrite slug for this post type.
	 */
	public const REWRITE_SLUG = 'web-stories';

	/**
	 * Style Present options name.
	 */
	public const STYLE_PRESETS_OPTION = 'web_stories_style_presets';

	/**
	 * Publisher logo meta key.
	 */
	public const PUBLISHER_LOGO_META_KEY = 'web_stories_publisher_logo';

	/**
	 * Poster meta key.
	 */
	public const POSTER_META_KEY = 'web_stories_poster';

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private Settings $settings;


	/**
	 * Story post type constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Settings $settings Settings instance.
	 * @return void
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Registers the post type for stories.
	 *
	 * @since 1.0.0
	 *
	 * @todo  refactor
	 */
	public function register(): void {
		$this->register_post_type();
		$this->register_meta();

		add_filter( 'wp_insert_post_data', [ $this, 'change_default_title' ] );
		add_filter( 'wp_insert_post_empty_content', [ $this, 'filter_empty_content' ], 10, 2 );
		add_filter( 'bulk_post_updated_messages', [ $this, 'bulk_post_updated_messages' ], 10, 2 );
		add_action( 'clean_post_cache', [ $this, 'clear_user_posts_count' ], 10, 2 );
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because settings needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'settings' ];
	}

	/**
	 * Get post type slug.
	 *
	 * @since 1.14.0
	 */
	public function get_slug(): string {
		return self::POST_TYPE_SLUG;
	}

	/**
	 * Register post meta.
	 *
	 * @since 1.12.0
	 */
	public function register_meta(): void {
		$active_publisher_logo_id = absint( $this->settings->get_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, 0 ) );

		register_post_meta(
			$this->get_slug(),
			self::PUBLISHER_LOGO_META_KEY,
			[
				'sanitize_callback' => 'absint',
				'type'              => 'integer',
				'description'       => __( 'Publisher logo ID.', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => $active_publisher_logo_id,
				'single'            => true,
			]
		);

		register_post_meta(
			$this->get_slug(),
			self::POSTER_META_KEY,
			[
				'type'         => 'object',
				'description'  => __( 'Poster object', 'web-stories' ),
				'show_in_rest' => [
					'schema' => [
						'type'       => 'object',
						'properties' => [
							'needsProxy' => [
								'description' => __( 'If poster needs to be proxied', 'web-stories' ),
								'type'        => 'boolean',
							],
							'height'     => [
								'type'        => 'integer',
								'description' => __( 'Poster height', 'web-stories' ),
							],
							'url'        => [
								'description' => __( 'Poster URL.', 'web-stories' ),
								'type'        => 'string',
								'format'      => 'uri',
							],
							'width'      => [
								'description' => __( 'Poster width.', 'web-stories' ),
								'type'        => 'integer',
							],
						],
					],
				],
				'default'      => [],
				'single'       => true,
			]
		);
	}

	/**
	 * Filters the bulk action updated messages.
	 *
	 * @since 1.1.0
	 *
	 * @param array[]|mixed     $bulk_messages Arrays of messages, each keyed by the corresponding post type. Messages are
	 *                                         keyed with 'updated', 'locked', 'deleted', 'trashed', and 'untrashed'.
	 * @param array<string,int> $bulk_counts   Array of item counts for each message, used to build internationalized
	 *                                         strings.
	 * @return array|mixed Bulk counts.
	 *
	 * @template T
	 *
	 * @phpstan-return ($bulk_messages is array<T> ? array<T> : mixed)
	 */
	public function bulk_post_updated_messages( $bulk_messages, array $bulk_counts ) {
		if ( ! \is_array( $bulk_messages ) ) {
			return $bulk_messages;
		}
		$bulk_messages[ $this->get_slug() ] = [
			/* translators: %s: Number of stories. */
			'updated'   => _n( '%s story updated.', '%s stories updated.', $bulk_counts['updated'], 'web-stories' ),
			'locked'    => 1 === $bulk_counts['locked'] ? __( 'Story not updated, somebody is editing it.', 'web-stories' ) :
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
	 * @return array|mixed
	 *
	 * @template T
	 *
	 * @phpstan-return ($data is array<T> ? array<T> : mixed)
	 */
	public function change_default_title( $data ) {
		if ( ! \is_array( $data ) ) {
			return $data;
		}
		if ( $this->get_slug() === $data['post_type'] && 'auto-draft' === $data['post_status'] ) {
			$data['post_title'] = '';
		}

		return $data;
	}

	/**
	 * Filters whether the post should be considered "empty".
	 *
	 * Takes into account post_content_filtered for stories.
	 *
	 * @since 1.25.1
	 *
	 * @param bool|mixed $maybe_empty Whether the post should be considered "empty".
	 * @param array      $data        Array of post data.
	 * @return bool Whether the post should be considered "empty".
	 *
	 * @phpstan-param array{post_type: string, post_content_filtered: string} $data
	 */
	public function filter_empty_content( $maybe_empty, array $data ): bool {
		if ( $this->get_slug() === $data['post_type'] ) {
			return $maybe_empty && ! $data['post_content_filtered'];
		}

		return (bool) $maybe_empty;
	}

	/**
	 * Invalid cache.
	 *
	 * @since 1.10.0
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object.
	 */
	public function clear_user_posts_count( int $post_id, WP_Post $post ): void {
		if ( $this->get_slug() !== $post->post_type ) {
			return;
		}

		$cache_key   = "count_user_{$post->post_type}_{$post->post_author}";
		$cache_group = 'user_posts_count';
		wp_cache_delete( $cache_key, $cache_group );
	}

	/**
	 * Determines whether the post type should have an archive or not.
	 *
	 * @since 1.12.0
	 *
	 * @return bool|string Whether the post type should have an archive, or archive slug.
	 */
	public function get_has_archive() {
		$archive_page_option    = $this->settings->get_setting( $this->settings::SETTING_NAME_ARCHIVE );
		$custom_archive_page_id = (int) $this->settings->get_setting( $this->settings::SETTING_NAME_ARCHIVE_PAGE_ID );
		$has_archive            = true;

		if ( 'disabled' === $archive_page_option ) {
			$has_archive = false;
		} elseif (
			'custom' === $archive_page_option &&
			$custom_archive_page_id &&
			'publish' === get_post_status( $custom_archive_page_id )
		) {
			$uri = get_page_uri( $custom_archive_page_id );
			if ( $uri ) {
				$has_archive = urldecode( $uri );
			}
		}

		return $has_archive;
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		delete_post_meta_by_key( self::POSTER_META_KEY );
		delete_post_meta_by_key( self::PUBLISHER_LOGO_META_KEY );

		delete_option( self::STYLE_PRESETS_OPTION );
		parent::on_plugin_uninstall();
	}

	/**
	 * Register post type.
	 *
	 * @since 1.12.0
	 *
	 * @return array<string, mixed> Post type args.
	 *
	 * @phpstan-return PostTypeArgs
	 */
	protected function get_args(): array {
		return [
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
				'item_trashed'             => __( 'Story trashed.', 'web-stories' ),
			],
			'menu_icon'             => $this->get_post_type_icon(),
			'supports'              => [
				'title', // Used for amp-story[title].
				'author',
				'editor',
				'excerpt',
				'thumbnail', // Used for poster images.
				'revisions', // Without this, the REST API will return 404 for an autosave request.
				'custom-fields',
			],
			'rewrite'               => [
				'slug'       => self::REWRITE_SLUG,
				'with_front' => false,
				'feeds'      => true,
			],
			'public'                => true,
			'has_archive'           => $this->get_has_archive(),
			'exclude_from_search'   => true,
			'show_ui'               => true,
			'show_in_rest'          => true,
			'rest_namespace'        => self::REST_NAMESPACE,
			'rest_controller_class' => Stories_Controller::class,
			'capability_type'       => [ 'web-story', 'web-stories' ],
			'map_meta_cap'          => true,
		];
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
}
