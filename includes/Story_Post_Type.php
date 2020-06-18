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
use WP_Post;
use WP_Screen;

/**
 * Class Story_Post_Type.
 */
class Story_Post_Type {
	/**
	 * The slug of the stories post type.
	 *
	 * @var string
	 */
	const POST_TYPE_SLUG = 'web-story';

	/**
	 * Web Stories editor script handle.
	 *
	 * @var string
	 */
	const WEB_STORIES_SCRIPT_HANDLE = 'edit-story';

	/**
	 * Web Stories editor style handle.
	 *
	 * @var string
	 */
	const WEB_STORIES_STYLE_HANDLE = 'edit-story';

	/**
	 * The rewrite slug for this post type.
	 *
	 * @var string
	 */
	const REWRITE_SLUG = 'stories';

	/**
	 * Publisher logo placeholder for static content output which will be replaced server-side.
	 *
	 * Uses a fallback logo to always create valid AMP in FE.
	 *
	 * @var string
	 */
	const PUBLISHER_LOGO_PLACEHOLDER = WEBSTORIES_PLUGIN_DIR_URL . 'assets/images/fallback-wordpress-publisher-logo.png';

	/**
	 * Registers the post type for stories.
	 *
	 * @todo refactor
	 *
	 * @return void
	 */
	public static function init() {
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
					'featured_image'           => __( 'Featured Image', 'web-stories' ),
					'set_featured_image'       => __( 'Set featured image', 'web-stories' ),
					'remove_featured_image'    => __( 'Remove featured image', 'web-stories' ),
					'use_featured_image'       => __( 'Use as featured image', 'web-stories' ),
					'filter_items_list'        => __( 'Filter stories list', 'web-stories' ),
					'items_list_navigation'    => __( 'Stories list navigation', 'web-stories' ),
					'items_list'               => __( 'Stories list', 'web-stories' ),
					'item_published'           => __( 'Story published.', 'web-stories' ),
					'item_published_privately' => __( 'Story published privately.', 'web-stories' ),
					'item_reverted_to_draft'   => __( 'Story reverted to draft.', 'web-stories' ),
					'item_scheduled'           => __( 'Story scheduled', 'web-stories' ),
					'item_updated'             => __( 'Story updated.', 'web-stories' ),
					'menu_name'                => _x( 'Stories', 'admin menu', 'web-stories' ),
					'name_admin_bar'           => _x( 'Story', 'add new on admin bar', 'web-stories' ),
				],
				'menu_icon'             => 'dashicons-book',
				'supports'              => [
					'title', // Used for amp-story[title].
					'author',
					'editor',
					'excerpt',
					'thumbnail', // Used for poster images.
					'revisions', // Without this, the REST API will return 404 for an autosave request.
				],
				'rewrite'               => [
					'slug' => self::REWRITE_SLUG,
				],
				'public'                => true,
				'show_ui'               => true,
				'show_in_rest'          => true,
				'rest_controller_class' => Stories_Controller::class,
			]
		);

		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'admin_enqueue_scripts' ] );
		add_filter( 'show_admin_bar', [ __CLASS__, 'show_admin_bar' ] ); // phpcs:ignore WordPressVIPMinimum.UserExperience.AdminBarRemoval.RemovalDetected
		add_filter( 'replace_editor', [ __CLASS__, 'replace_editor' ], 10, 2 );

		add_filter( 'rest_' . self::POST_TYPE_SLUG . '_collection_params', [ __CLASS__, 'filter_rest_collection_params' ], 10, 2 );

		// Select the single-web-story.php template for Stories.
		add_filter( 'template_include', [ __CLASS__, 'filter_template_include' ] );

		// @todo Improve AMP plugin compatibility, see https://github.com/google/web-stories-wp/issues/967
		add_filter(
			'amp_skip_post',
			static function( $skipped, $post ) {
				if ( self::POST_TYPE_SLUG === get_post_type( $post ) ) {
					$skipped = true;
				}
				return $skipped;
			},
			PHP_INT_MAX,
			2
		);

		add_filter( '_wp_post_revision_fields', [ __CLASS__, 'filter_revision_fields' ], 10, 2 );
	}

	/**
	 * Add story_author as allowed orderby value for REST API.
	 *
	 * @param array         $query_params Array of allowed query params.
	 * @param \WP_Post_Type $post_type Post type.
	 * @return array Array of query params.
	 */
	public static function filter_rest_collection_params( $query_params, $post_type ) {
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
	 * @param array $fields Array of allowed revision fields.
	 * @param array $story Story post array.
	 * @return array Array of allowed fields.
	 */
	public static function filter_revision_fields( $fields, $story ) {
		if ( self::POST_TYPE_SLUG === $story['post_type'] ) {
			$fields['post_content_filtered'] = __( 'Story data', 'web-stories' );
		}
		return $fields;
	}

	/**
	 * Filter if show admin bar on single post type.
	 *
	 * @param boolean $show Current value of filter.
	 *
	 * @return bool
	 */
	public static function show_admin_bar( $show ) {
		if ( is_singular( self::POST_TYPE_SLUG ) ) {
			$show = false;
		}

		return $show;
	}

	/**
	 * Highjack editor with custom editor.
	 *
	 * @param bool    $replace Bool if to replace editor or not.
	 * @param WP_Post $post    Current post object.
	 *
	 * @return bool
	 */
	public static function replace_editor( $replace, $post ) {
		if ( self::POST_TYPE_SLUG === get_post_type( $post ) ) {
			$replace = true;
			// In lieu of an action being available to actually load the replacement editor, include it here
			// after the current_screen action has occurred because the replace_editor filter fires twice.
			if ( did_action( 'current_screen' ) ) {
				require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/edit-story.php';
			}
		}

		return $replace;
	}

	/**
	 *
	 * Enqueue scripts for the element editor.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public static function admin_enqueue_scripts( $hook ) {
		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return;
		}

		if ( self::POST_TYPE_SLUG !== $screen->post_type ) {
			return;
		}

		// Only output scripts and styles where in edit screens.
		if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) {
			return;
		}

		// Force media model to load.
		wp_enqueue_media();

		$asset_file   = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/js/' . self::WEB_STORIES_SCRIPT_HANDLE . '.asset.php';
		$asset        = is_readable( $asset_file ) ? require $asset_file : [];
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$version      = isset( $asset['version'] ) ? $asset['version'] : [];

		wp_enqueue_script(
			self::WEB_STORIES_SCRIPT_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/' . self::WEB_STORIES_SCRIPT_HANDLE . '.js',
			$dependencies,
			$version,
			false
		);

		wp_set_script_translations( self::WEB_STORIES_SCRIPT_HANDLE, 'web-stories' );

		$settings = self::get_editor_settings();

		wp_localize_script(
			self::WEB_STORIES_SCRIPT_HANDLE,
			'webStoriesEditorSettings',
			$settings
		);

		wp_register_style(
			'roboto',
			'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
			[],
			WEBSTORIES_VERSION
		);

		wp_enqueue_style(
			self::WEB_STORIES_STYLE_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/css/' . self::WEB_STORIES_STYLE_HANDLE . '.css',
			[ 'roboto' ],
			$version
		);

		// Dequeue forms.css, see https://github.com/google/web-stories-wp/issues/349 .
		wp_styles()->registered['wp-admin']->deps = array_diff(
			wp_styles()->registered['wp-admin']->deps,
			[ 'forms' ]
		);
	}

	/**
	 * Get edittor settings as an array.
	 *
	 * @return array
	 */
	public static function get_editor_settings() {
		$post                     = get_post();
		$story_id                 = ( $post ) ? $post->ID : null;
		$rest_base                = self::POST_TYPE_SLUG;
		$has_publish_action       = false;
		$has_assign_author_action = false;
		$has_upload_media_action  = current_user_can( 'upload_files' );
		$post_type_object         = get_post_type_object( self::POST_TYPE_SLUG );

		if ( $post_type_object instanceof \WP_Post_Type ) {
			$rest_base = ! empty( $post_type_object->rest_base ) ? $post_type_object->rest_base : $post_type_object->name;
			if ( property_exists( $post_type_object->cap, 'publish_posts' ) ) {
				$has_publish_action = current_user_can( $post_type_object->cap->publish_posts );
			}
			if ( property_exists( $post_type_object->cap, 'edit_others_posts' ) ) {
				$has_assign_author_action = current_user_can( $post_type_object->cap->edit_others_posts );
			}
		}

		// Media settings.
		$max_upload_size = wp_max_upload_size();
		if ( ! $max_upload_size ) {
			$max_upload_size = 0;
		}

		$preview_query_args = [
			'preview_id'    => $story_id,
			// Leveraging the default WP post preview logic.
			'preview_nonce' => wp_create_nonce( 'post_preview_' . $story_id ),
		];

		$settings = [
			'id'     => 'edit-story',
			'config' => [
				'autoSaveInterval' => defined( 'AUTOSAVE_INTERVAL' ) ? AUTOSAVE_INTERVAL : null,
				'isRTL'            => is_rtl(),
				'timeFormat'       => get_option( 'time_format' ),
				'allowedMimeTypes' => Media::get_allowed_mime_types(),
				'allowedFileTypes' => Media::get_allowed_file_types(),
				'postType'         => self::POST_TYPE_SLUG,
				'storyId'          => $story_id,
				'previewLink'      => get_preview_post_link( $story_id, $preview_query_args ),
				'maxUpload'        => $max_upload_size,
				'capabilities'     => [
					'hasPublishAction'      => $has_publish_action,
					'hasAssignAuthorAction' => $has_assign_author_action,
					'hasUploadMediaAction'  => $has_upload_media_action,
				],
				'api'              => [
					'stories' => sprintf( '/wp/v2/%s', $rest_base ),
					'media'   => '/wp/v2/media',
					'users'   => '/wp/v2/users',
					'fonts'   => '/web-stories/v1/fonts',
					'link'    => '/web-stories/v1/link',
				],
				'metadata'         => [
					'publisher'       => Discovery::get_publisher_data(),
					'logoPlaceholder' => self::PUBLISHER_LOGO_PLACEHOLDER,
					'fallbackPoster'  => plugins_url( 'assets/images/fallback-poster.jpg', WEBSTORIES_PLUGIN_FILE ),
				],
			],
			'flags'  => [
				/**
				 * Description: Enables user facing animations.
				 * Author: @mariano-formidable
				 * Issue: 1903
				 * Creation date: 2020-06-08
				 */
				'enableAnimation'              => false,
				/**
				 * Description: Flag for hover dropdown menu for media element in media library.
				 * Author: @joannag6
				 * Issue: #1319 and #354
				 * Creation date: 2020-05-20
				 */
				'mediaDropdownMenu'            => false,
				/**
				 * Description: Flag for new font picker with typeface previews in style panel.
				 * Author: @carlos-kelly
				 * Issue: #1300
				 * Creation date: 2020-06-02
				 */
				'newFontPicker'                => false,
				/**
				 * Description: Flag for hiding/enabling the keyboard shortcuts button.
				 * Author: @dmmulroy
				 * Issue: #2094
				 * Creation date: 2020-06-04
				 */
				'showKeyboardShortcutsButton'  => false,
				/**
				 * Description: Flag for hiding/enabling text sets.
				 * Author: @dmmulroy
				 * Issue: #2097
				 * Creation date: 2020-06-04
				 */
				'showTextSets'                 => false,
				/**
				 * Description: Flag for hiding/enabling the pre publish tab.
				 * Author: @dmmulroy
				 * Issue: #2095
				 * Creation date: 2020-06-04
				 */
				'showPrePublishTab'            => false,
				/**
				 * Description: Flag for displaying the animation tab/panel.
				 * Author: @dmmulroy
				 * Issue: #2092
				 * Creation date: 2020-06-04
				 */
				'showAnimationTab'             => false,
				/**
				 * Description: Flag for hiding/enabling the text magic and helper mode icons.
				 * Author: @dmmulroy
				 * Issue: #2044
				 * Creation date: 2020-06-04
				 */
				'showTextMagicAndHelperMode'   => false,
				/**
				 * Description: Flag for hiding/enabling the search input on the text and shapes panes.
				 * Author: @dmmulroy
				 * Issue: #2098
				 * Creation date: 2020-06-04
				 */
				'showTextAndShapesSearchInput' => false,
				/**
				 * Description: Flag for the 3P Media tab.
				 * Author: @diegovar
				 * Issue: #2508
				 * Creation date: 2020-06-17
				 */
				'media3pTab'                   => false,
			],

		];

		return $settings;
	}

	/**
	 * Set template for web-story post type.
	 *
	 * @param string $template Template.
	 *
	 * @return string Template.
	 */
	public static function filter_template_include( $template ) {
		if ( is_singular( self::POST_TYPE_SLUG ) && ! is_embed() ) {
			$template = WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/single-web-story.php';
		}

		return $template;
	}
}
