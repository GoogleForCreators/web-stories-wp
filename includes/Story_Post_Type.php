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

use Google\Web_Stories\Infrastructure\Activateable;
use Google\Web_Stories\Infrastructure\Deactivateable;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\REST_API\Stories_Controller;
use Google\Web_Stories\Story_Renderer\Embed;
use Google\Web_Stories\Story_Renderer\Image;
use Google\Web_Stories\Traits\Assets;
use Google\Web_Stories\Traits\Post_Type;
use Google\Web_Stories\Traits\Publisher;
use Google\Web_Stories\Traits\Screen;
use Google\Web_Stories\Traits\Types;
use WP_Post;
use WP_Role;
use WP_Post_Type;

/**
 * Class Story_Post_Type.
 *
 * @SuppressWarnings(PHPMD.ExcessivePublicCount)
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 * @SuppressWarnings(PHPMD.ExcessiveClassLength)
 * @SuppressWarnings(PHPMD.TooManyFields)
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 */
class Story_Post_Type extends Service_Base implements Activateable, Deactivateable {
	use Publisher;
	use Types;
	use Assets;
	use Screen;
	use Post_Type;

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
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

	/**
	 * Decoder instance.
	 *
	 * @var Decoder Decoder instance.
	 */
	private $decoder;

	/**
	 * Meta boxes instance.
	 *
	 * @var Meta_Boxes
	 */
	private $meta_boxes;

	/**
	 * Locale instance.
	 *
	 * @var Locale Locale instance.
	 */
	private $locale;

	/**
	 * Register_Font instance.
	 *
	 * @var Register_Font Register_Font instance.
	 */
	private $register_font;


	/**
	 * Dashboard constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Experiments   $experiments   Experiments instance.
	 * @param Meta_Boxes    $meta_boxes    Meta_Boxes instance.
	 * @param Decoder       $decoder       Decoder instance.
	 * @param Locale        $locale        Locale instance.
	 * @param Register_Font $register_font Register_Font instance.
	 */
	public function __construct( Experiments $experiments, Meta_Boxes $meta_boxes, Decoder $decoder, Locale $locale, Register_Font $register_font ) {
		$this->experiments   = $experiments;
		$this->meta_boxes    = $meta_boxes;
		$this->decoder       = $decoder;
		$this->locale        = $locale;
		$this->register_font = $register_font;
	}

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

		add_action( 'admin_enqueue_scripts', [ $this, 'admin_enqueue_scripts' ] );
		add_filter( 'show_admin_bar', [ $this, 'show_admin_bar' ] ); // phpcs:ignore WordPressVIPMinimum.UserExperience.AdminBarRemoval.RemovalDetected
		add_filter( 'replace_editor', [ $this, 'replace_editor' ], 10, 2 );
		add_filter( 'use_block_editor_for_post_type', [ $this, 'filter_use_block_editor_for_post_type' ], 10, 2 );

		add_filter( 'rest_' . self::POST_TYPE_SLUG . '_collection_params', [ $this, 'filter_rest_collection_params' ], 10, 2 );

		// Select the single-web-story.php template for Stories.
		add_filter( 'template_include', [ $this, 'filter_template_include' ], PHP_INT_MAX );
		add_filter( 'pre_handle_404', [ $this, 'redirect_post_type_archive_urls' ], 10, 2 );

		add_filter( '_wp_post_revision_fields', [ $this, 'filter_revision_fields' ], 10, 2 );

		// Filter RSS content fields.
		add_filter( 'the_content_feed', [ $this, 'embed_image' ] );
		add_filter( 'the_excerpt_rss', [ $this, 'embed_image' ] );

		// Filter content and excerpt for search and post type archive.
		add_filter( 'the_content', [ $this, 'embed_player' ], PHP_INT_MAX );
		add_filter( 'the_excerpt', [ $this, 'embed_player' ], PHP_INT_MAX );

		add_filter( 'wp_insert_post_data', [ $this, 'change_default_title' ] );

		add_filter( 'bulk_post_updated_messages', [ $this, 'bulk_post_updated_messages' ], 10, 2 );
		add_filter( 'site_option_upload_filetypes', [ $this, 'filter_list_of_allowed_filetypes' ] );
	}

	/**
	 * Activate the service.
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 * @return void
	 */
	public function activate( $network_wide ) {
		$this->add_caps_to_roles();
	}

	/**
	 * Deactivate the service.
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 * @return void
	 */
	public function deactivate( $network_wide ) {
		$this->remove_caps_from_roles();
		unregister_post_type( self::POST_TYPE_SLUG );
	}

	/**
	 * Adds story capabilities to default user roles.
	 *
	 * This gives WordPress site owners more granular control over story management,
	 * as they can customize this to their liking.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function add_caps_to_roles() {
		$post_type_object = get_post_type_object( self::POST_TYPE_SLUG );

		if ( ! $post_type_object ) {
			return;
		}

		$all_capabilities = array_values( (array) $post_type_object->cap );

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );
		$author        = get_role( 'author' );
		$contributor   = get_role( 'contributor' );

		if ( $administrator instanceof WP_Role ) {
			foreach ( $all_capabilities as $cap ) {
				$administrator->add_cap( $cap );
			}
		}

		if ( $editor instanceof WP_Role ) {
			foreach ( $all_capabilities as $cap ) {
				$editor->add_cap( $cap );
			}
		}

		if ( $author instanceof WP_Role ) {
			$author->add_cap( 'edit_web-stories' );
			$author->add_cap( 'edit_published_web-stories' );
			$author->add_cap( 'delete_web-stories' );
			$author->add_cap( 'delete_published_web-stories' );
			$author->add_cap( 'publish_web-stories' );
		}

		if ( $contributor instanceof WP_Role ) {
			$contributor->add_cap( 'edit_web-stories' );
			$contributor->add_cap( 'delete_web-stories' );
		}

		/**
		 * Fires when adding the custom capabilities to existing roles.
		 *
		 * Can be used to add the capabilities to other, custom roles.
		 *
		 * @since 1.0.0
		 *
		 * @param array $all_capabilities List of all post type capabilities, for reference.
		 */
		do_action( 'web_stories_add_capabilities', $all_capabilities );
	}

	/**
	 * Removes story capabilities from all user roles.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function remove_caps_from_roles() {
		$post_type_object = get_post_type_object( self::POST_TYPE_SLUG );

		if ( ! $post_type_object ) {
			return;
		}

		$all_capabilities = array_values( (array) $post_type_object->cap );
		$all_capabilities = array_filter(
			$all_capabilities,
			function ( $value ) {
				return 'read' !== $value;
			}
		);
		$all_roles        = wp_roles();
		$roles            = array_values( (array) $all_roles->role_objects );
		foreach ( $roles as $role ) {
			if ( $role instanceof WP_Role ) {
				foreach ( $all_capabilities as $cap ) {
					$role->remove_cap( $cap );
				}
			}
		}

		/**
		 * Fires when removing the custom capabilities from existing roles.
		 *
		 * Can be used to remove the capabilities from other, custom roles.
		 *
		 * @since 1.0.0
		 *
		 * @param array $all_capabilities List of all post type capabilities, for reference.
		 */
		do_action( 'web_stories_remove_capabilities', $all_capabilities );
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
	 * Filter if show admin bar on single post type.
	 *
	 * @since 1.0.0
	 *
	 * @param boolean $show Current value of filter.
	 *
	 * @return bool
	 */
	public function show_admin_bar( $show ) {
		if ( is_singular( self::POST_TYPE_SLUG ) ) {
			$show = false;
		}

		return $show;
	}

	/**
	 * Replace default post editor with our own implementation.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.0.0
	 *
	 * @param bool    $replace Bool if to replace editor or not.
	 * @param WP_Post $post    Current post object.
	 *
	 * @return bool Whether the editor has been replaced.
	 */
	public function replace_editor( $replace, $post ) {
		if ( self::POST_TYPE_SLUG === get_post_type( $post ) ) {

			// Since the 'replace_editor' filter can be run multiple times, only load the
			// custom editor after the 'current_screen' action and when we can be certain the
			// $post_type, $post_type_object, $post globals are all set by WordPress.
			if ( isset( $GLOBALS['post'] ) && $post === $GLOBALS['post'] && did_action( 'current_screen' ) ) {
				require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/admin/edit-story.php';
			}

			return true;
		}

		return $replace;
	}

	/**
	 * Filters whether post type supports the block editor.
	 *
	 * Disables the block editor and associated logic (like enqueueing assets)
	 * for the story post type.
	 *
	 * @since 1.0.0
	 *
	 * @param bool   $use_block_editor  Whether the post type can be edited or not. Default true.
	 * @param string $post_type         The post type being checked.
	 *
	 * @return bool Whether to use the block editor.
	 */
	public function filter_use_block_editor_for_post_type( $use_block_editor, $post_type ) {
		if ( self::POST_TYPE_SLUG === $post_type ) {
			return false;
		}

		return $use_block_editor;
	}

	/**
	 *
	 * Enqueue scripts for the element editor.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function admin_enqueue_scripts( $hook ) {
		if ( ! $this->is_edit_screen() ) {
			return;
		}

		// Only output scripts and styles where in edit screens.
		if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) {
			return;
		}

		// Force media model to load.
		wp_enqueue_media();

		$this->register_font->register();

		$script_dependencies = [ Tracking::SCRIPT_HANDLE ];

		if ( $this->experiments->is_experiment_enabled( 'customMetaBoxes' ) ) {
			$script_dependencies[] = 'postbox';
		}

		$this->enqueue_script( self::WEB_STORIES_SCRIPT_HANDLE, $script_dependencies );

		$font_handle = $this->register_font->get_handle();
		$this->enqueue_style( self::WEB_STORIES_SCRIPT_HANDLE, [ $font_handle ] );

		wp_localize_script(
			self::WEB_STORIES_SCRIPT_HANDLE,
			'webStoriesEditorSettings',
			$this->get_editor_settings()
		);

		// Dequeue forms.css, see https://github.com/google/web-stories-wp/issues/349 .
		$this->remove_admin_style( [ 'forms' ] );
	}

	/**
	 * Get editor settings as an array.
	 *
	 * @since 1.0.0
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @return array
	 */
	public function get_editor_settings() {
		$post                     = get_post();
		$story_id                 = ( $post ) ? $post->ID : null;
		$rest_base                = $this->get_post_type_rest_base( self::POST_TYPE_SLUG );
		$has_publish_action       = $this->get_post_type_cap( self::POST_TYPE_SLUG, 'publish_posts' );
		$has_assign_author_action = $this->get_post_type_cap( self::POST_TYPE_SLUG, 'edit_others_posts' );
		$has_upload_media_action  = current_user_can( 'upload_files' );

		if ( $story_id ) {
			$this->setup_lock( $story_id );
		}

		// Media settings.
		$max_upload_size = wp_max_upload_size();
		if ( ! $max_upload_size ) {
			$max_upload_size = 0;
		}

		$is_demo = ( isset( $_GET['web-stories-demo'] ) && (bool) $_GET['web-stories-demo'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		$dashboard_url = add_query_arg(
			[
				'post_type' => self::POST_TYPE_SLUG,
				'page'      => 'stories-dashboard',
			],
			admin_url( 'edit.php' )
		);

		$dashboard_settings_url = add_query_arg(
			[
				'post_type' => self::POST_TYPE_SLUG,
				'page'      => 'stories-dashboard#/editor-settings',
			],
			admin_url( 'edit.php' )
		);

		/** This filter is documented in wp-admin/includes/ajax-actions.php */
		$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

		$user = wp_get_current_user();
		/** This filter is documented in wp-admin/includes/post.php */
		$show_locked_dialog = apply_filters( 'show_post_locked_dialog', true, $post, $user );

		$nonce = wp_create_nonce( 'wp_rest' );

		$mime_types       = $this->get_allowed_mime_types();
		$mime_image_types = $this->get_allowed_image_mime_types();

		$page_templates_rest_base = $this->get_post_type_rest_base( Page_Template_Post_Type::POST_TYPE_SLUG );

		$settings = [
			'id'         => 'web-stories-editor',
			'config'     => [
				'autoSaveInterval'      => defined( 'AUTOSAVE_INTERVAL' ) ? AUTOSAVE_INTERVAL : null,
				'isRTL'                 => is_rtl(),
				'locale'                => $this->locale->get_locale_settings(),
				'allowedFileTypes'      => $this->get_allowed_file_types(),
				'allowedImageFileTypes' => $this->get_file_type_exts( $mime_image_types ),
				'allowedImageMimeTypes' => $mime_image_types,
				'allowedMimeTypes'      => $mime_types,
				'postType'              => self::POST_TYPE_SLUG,
				'storyId'               => $story_id,
				'dashboardLink'         => $dashboard_url,
				'dashboardSettingsLink' => $dashboard_settings_url,
				'assetsURL'             => trailingslashit( WEBSTORIES_ASSETS_URL ),
				'cdnURL'                => trailingslashit( WEBSTORIES_CDN_URL ),
				'maxUpload'             => $max_upload_size,
				'isDemo'                => $is_demo,
				'capabilities'          => [
					'hasPublishAction'      => $has_publish_action,
					'hasAssignAuthorAction' => $has_assign_author_action,
					'hasUploadMediaAction'  => $has_upload_media_action,
				],
				'api'                   => [
					'users'         => '/web-stories/v1/users/',
					'currentUser'   => '/web-stories/v1/users/me/',
					'stories'       => sprintf( '/web-stories/v1/%s/', $rest_base ),
					'pageTemplates' => sprintf( '/web-stories/v1/%s/', $page_templates_rest_base ),
					'media'         => '/web-stories/v1/media/',
					'link'          => '/web-stories/v1/link/',
					'statusCheck'   => '/web-stories/v1/status-check/',
					'metaBoxes'     => $this->meta_boxes->get_meta_box_url( (int) $story_id ),
					'storyLocking'  => rest_url( sprintf( '/web-stories/v1/%s/%s/lock', $rest_base, $story_id ) ),
				],
				'metadata'              => [
					'publisher' => $this->get_publisher_data(),
				],
				'postLock'              => [
					'interval'         => $time_window,
					'showLockedDialog' => $show_locked_dialog,
				],
				'version'               => WEBSTORIES_VERSION,
				'nonce'                 => $nonce,
				'encodeMarkup'          => $this->decoder->supports_decoding(),
				'metaBoxes'             => $this->meta_boxes->get_meta_boxes_per_location(),
				'ffmpegCoreUrl'         => trailingslashit( WEBSTORIES_CDN_URL ) . 'js/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js',
			],
			'flags'      => array_merge(
				$this->experiments->get_experiment_statuses( 'general' ),
				$this->experiments->get_experiment_statuses( 'editor' )
			),
			'publicPath' => WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/',
		];

		/**
		 * Filters settings passed to the web stories editor.
		 *
		 * @since 1.0.0
		 *
		 * @param array $settings Array of settings passed to web stories editor.
		 */
		return apply_filters( 'web_stories_editor_settings', $settings );
	}

	/**
	 * Setup up post lock.
	 *
	 * @since 1.5.0
	 *
	 * @param int $story_id Post id of story.
	 *
	 * @return void
	 */
	protected function setup_lock( $story_id ) {
		if ( ! $this->get_post_type_cap( self::POST_TYPE_SLUG, 'edit_posts' ) ) {
			return;
		}
		// Make sure these functions are loaded.
		if ( ! function_exists( 'wp_check_post_lock' ) || ! function_exists( 'wp_set_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}

		// Check current lock.
		$lock_user_id = wp_check_post_lock( $story_id );
		if ( ! $lock_user_id ) {
			// If no lock set, create new lock.
			wp_set_post_lock( $story_id );
		}
	}

	/**
	 * Set template for web-story post type.
	 *
	 * @since 1.0.0
	 *
	 * @param string $template Template.
	 *
	 * @return string Template.
	 */
	public function filter_template_include( $template ) {
		if ( is_singular( self::POST_TYPE_SLUG ) && ! is_embed() ) {
			$template = WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/frontend/single-web-story.php';
		}

		return $template;
	}

	/**
	 * Handles redirects to the post type archive.
	 *
	 * Redirects requests to `/stories` (old) to `/web-stories` (new).
	 * Redirects requests to `/stories/1234` (old) to `/web-stories/1234` (new).
	 *
	 * @since 1.0.0
	 *
	 * @param bool      $bypass Pass-through of the pre_handle_404 filter value.
	 * @param \WP_Query $query The WP_Query object.
	 * @return bool Whether to pass-through or not.
	 */
	public function redirect_post_type_archive_urls( $bypass, $query ) {
		global $wp_rewrite;

		// If a plugin has already utilized the pre_handle_404 function, return without action to avoid conflicts.
		if ( $bypass ) {
			return $bypass;
		}

		if ( ! $wp_rewrite instanceof \WP_Rewrite || ! $wp_rewrite->using_permalinks() ) {
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
	 * Filter feed content for stories to render as an image.
	 *
	 * @since 1.0.0
	 *
	 * @param string $content Feed content.
	 *
	 * @return string
	 */
	public function embed_image( $content ) {
		$post = get_post();

		if ( $post instanceof WP_Post && self::POST_TYPE_SLUG === $post->post_type ) {
			$story = new Story();
			$story->load_from_post( $post );

			$image   = new Image( $story );
			$content = $image->render();
		}

		return $content;
	}

	/**
	 * Change the content to an embedded player
	 *
	 * @since 1.0.0
	 *
	 * @param string $content Current content of filter.
	 *
	 * @return string
	 */
	public function embed_player( $content ) {
		$post = get_post();

		if ( is_feed() ) {
			return $content;
		}

		if ( ! is_search() && ! is_post_type_archive( self::POST_TYPE_SLUG ) ) {
			return $content;
		}

		if ( $post instanceof WP_Post && self::POST_TYPE_SLUG === $post->post_type ) {
			$story = new Story();
			$story->load_from_post( $post );

			$embed   = new Embed( $story );
			$content = $embed->render();
		}

		return $content;
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

	/**
	 * Add VTT file type to allow file in multisite.
	 *
	 * @param string $value List of allowed file types.
	 * @return string List of allowed file types.
	 */
	public function filter_list_of_allowed_filetypes( $value ) {
		$filetypes = explode( ' ', $value );
		if ( ! in_array( 'vtt', $filetypes, true ) ) {
			$filetypes[] = 'vtt';
			$value       = implode( ' ', $filetypes );
		}

		return $value;
	}
}
