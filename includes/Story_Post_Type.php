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

use DOMElement;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\REST_API\Stories_Controller;
use Google\Web_Stories\Story_Renderer\Embed;
use Google\Web_Stories\Story_Renderer\Image;
use Google\Web_Stories\Traits\Assets;
use Google\Web_Stories\Traits\Publisher;
use Google\Web_Stories\Traits\Types;
use WP_Post;
use WP_Role;
use WP_Post_Type;
use WP_Screen;

/**
 * Class Story_Post_Type.
 */
class Story_Post_Type {
	use Publisher;
	use Types;
	use Assets;

	/**
	 * The slug of the stories post type.
	 *
	 * @var string
	 */
	const POST_TYPE_SLUG = 'web-story';

	/**
	 * Slug of the AMP validated URL post type.
	 *
	 * @var string
	 */
	const AMP_VALIDATED_URL_POST_TYPE = 'amp_validated_url';

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
	 * Dashboard constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Experiments $experiments Experiments instance.
	 */
	public function __construct( Experiments $experiments ) {
		$this->experiments = $experiments;
	}

	/**
	 * Registers the post type for stories.
	 *
	 * @todo refactor
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
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

		add_filter( 'option_amp-options', [ $this, 'filter_amp_options' ] );
		add_filter( 'amp_supportable_post_types', [ $this, 'filter_supportable_post_types' ] );
		add_filter( 'amp_validation_error_sanitized', [ $this, 'filter_amp_story_element_validation_error_sanitized' ], 10, 2 );
		add_filter( 'amp_to_amp_linking_element_excluded', [ $this, 'filter_amp_to_amp_linking_element_excluded' ], 10, 4 );

		add_filter( '_wp_post_revision_fields', [ $this, 'filter_revision_fields' ], 10, 2 );

		// Filter RSS content fields.
		add_filter( 'the_content_feed', [ $this, 'embed_image' ] );
		add_filter( 'the_excerpt_rss', [ $this, 'embed_image' ] );

		// Filter content and excerpt for search and post type archive.
		add_filter( 'the_content', [ $this, 'embed_player' ], PHP_INT_MAX );
		add_filter( 'the_excerpt', [ $this, 'embed_player' ], PHP_INT_MAX );

		add_filter( 'wp_insert_post_data', [ $this, 'change_default_title' ] );

		// See https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80.
		if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
			add_filter( 'wpcom_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		} else {
			add_filter( 'jetpack_sitemap_post_types', [ $this, 'add_to_jetpack_sitemap' ] );
		}
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
	 * Get the post type for the current request.
	 *
	 * @since 1.0.0
	 *
	 * @return string|null
	 */
	protected function get_request_post_type() {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( did_action( 'wp' ) && is_singular() ) {
			$post_type = get_post_type( get_queried_object_id() );
			return $post_type ?: null;
		}

		if (
			is_admin()
			&&
			isset( $_GET['action'], $_GET['post'] )
			&&
			'amp_validate' === $_GET['action']
			&&
			get_post_type( (int) $_GET['post'] ) === self::AMP_VALIDATED_URL_POST_TYPE
		) {
			return $this->get_validated_url_post_type( (int) $_GET['post'] );
		}

		$current_screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( $current_screen instanceof WP_Screen ) {
			$current_post = get_post();

			if ( self::AMP_VALIDATED_URL_POST_TYPE === $current_screen->post_type && $current_post instanceof WP_Post && $current_post->post_type === $current_screen->post_type ) {
				$validated_url_post_type = $this->get_validated_url_post_type( $current_post->ID );
				if ( $validated_url_post_type ) {
					return $validated_url_post_type;
				}
			}

			if ( $current_screen->post_type ) {
				return $current_screen->post_type;
			}

			return null;
		}

		if ( isset( $_SERVER['REQUEST_URI'] ) && false !== strpos( (string) wp_unslash( $_SERVER['REQUEST_URI'] ), '/web-stories/v1/web-story/' ) ) {
			return self::POST_TYPE_SLUG;
		}

		// phpcs:enable WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		return null;
	}

	/**
	 * Get the singular post type which is the queried object for the given validated URL post.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id Post ID for Validated URL Post.
	 *
	 * @return string|null Post type or null if validated URL is not for a singular post.
	 */
	protected function get_validated_url_post_type( $post_id ) {
		if ( empty( $post_id ) ) {
			return null;
		}

		$post = get_post( $post_id );
		if ( ! ( $post instanceof WP_Post ) ) {
			return null;
		}

		if ( self::AMP_VALIDATED_URL_POST_TYPE !== $post->post_type ) {
			return null;
		}

		$queried_object = get_post_meta( $post->ID, '_amp_queried_object', true );
		if ( isset( $queried_object['id'], $queried_object['type'] ) && 'post' === $queried_object['type'] ) {
			$post_type = get_post_type( $queried_object['id'] );
			if ( $post_type ) {
				return $post_type;
			}
		}
		return null;
	}

	/**
	 * Filter AMP options to force Standard mode (AMP-first) when a web story is being requested.
	 *
	 * @since 1.0.0
	 *
	 * @param array $options Options.
	 *
	 * @return array Filtered options.
	 */
	public function filter_amp_options( $options ) {
		if ( $this->get_request_post_type() === self::POST_TYPE_SLUG ) {
			$options['theme_support']          = 'standard';
			$options['supported_post_types'][] = self::POST_TYPE_SLUG;
			$options['supported_templates'][]  = 'is_singular';
		}
		return $options;
	}

	/**
	 * Filter the post types which are supportable.
	 *
	 * Remove web-stories from the list unless the currently requested post type is for a web-story. This is done in
	 * order to hide stories from the list of supportable post types on the AMP Settings screen.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $post_types Post types.
	 *
	 * @return array Supportable post types.
	 */
	public function filter_supportable_post_types( $post_types ) {
		if ( $this->get_request_post_type() === self::POST_TYPE_SLUG ) {
			$post_types = array_merge( $post_types, [ self::POST_TYPE_SLUG ] );
		} else {
			$post_types = array_diff( $post_types, [ self::POST_TYPE_SLUG ] );
		}

		return array_values( $post_types );
	}

	/**
	 * Filter amp_validation_error_sanitized to prevent invalid markup removal for the amp-story element.
	 *
	 * Since the amp-story element requires the poster-portrait-src attribute to be valid, when this attribute is absent
	 * the AMP plugin will try to remove the amp-story element altogether. This is not the preferred resolution! So
	 * instead, this will force the invalid markup to be kept. When this is done, the AMP plugin in Standard mode
	 * (which Web Stories enforces while serving singular web-story posts) will remove the amp attribute from the html
	 * element so that the page will not be advertised as AMP. This prevents GSC from complaining about a validation
	 * issue which we already know about.
	 *
	 * @since 1.0.0
	 * @link https://github.com/ampproject/amp-wp/blob/c6aed8f/includes/validation/class-amp-validation-manager.php#L1777-L1809
	 *
	 * @param null|bool $sanitized Whether sanitized. Null means sanitization is not overridden.
	 * @param array     $error Validation error being sanitized.
	 * @return null|bool Whether sanitized.
	 */
	public function filter_amp_story_element_validation_error_sanitized( $sanitized, $error ) {
		if (
			( isset( $error['node_type'], $error['node_name'], $error['parent_name'] ) ) &&
			(
				( XML_ELEMENT_NODE === $error['node_type'] && 'amp-story' === $error['node_name'] && 'body' === $error['parent_name'] ) ||
				( XML_ATTRIBUTE_NODE === $error['node_type'] && 'poster-portrait-src' === $error['node_name'] && 'amp-story' === $error['parent_name'] )
			)
		) {
			return false;
		}

		return $sanitized;
	}

	/**
	 * Filters whether AMP-to-AMP is excluded for an element.
	 *
	 * The element may be either a link (`a` or `area`) or a `form`.
	 *
	 * @param bool       $excluded Excluded. Default value is whether element already has a `noamphtml` link relation or the URL is among `excluded_urls`.
	 * @param string     $url      URL considered for exclusion.
	 * @param string[]   $rel      Link relations.
	 * @param DOMElement $element  The element considered for excluding from AMP-to-AMP linking. May be instance of `a`, `area`, or `form`.
	 * @return bool Whether AMP-to-AMP is excluded.
	 */
	public function filter_amp_to_amp_linking_element_excluded( $excluded, $url, $rel, $element ) {
		if ( $element instanceof DOMElement && $element->parentNode instanceof DOMElement && 'amp-story-player' === $element->parentNode->tagName ) {
			return true;
		}

		return $excluded;

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
			// custom editor after the 'current_screen' action when we can be certain the
			// $post_type, $post_type_object, $post globals are all set by WordPress.
			if ( did_action( 'current_screen' ) ) {
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

		wp_register_style(
			'roboto',
			'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
			[],
			WEBSTORIES_VERSION
		);

		$this->enqueue_script( self::WEB_STORIES_SCRIPT_HANDLE, [ Tracking::SCRIPT_HANDLE ] );
		$this->enqueue_style( self::WEB_STORIES_SCRIPT_HANDLE, [ 'roboto' ] );

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
	 * @return array
	 */
	public function get_editor_settings() {
		$post                     = get_post();
		$story_id                 = ( $post ) ? $post->ID : null;
		$rest_base                = self::POST_TYPE_SLUG;
		$has_publish_action       = false;
		$has_assign_author_action = false;
		$has_upload_media_action  = current_user_can( 'upload_files' );
		$post_type_object         = get_post_type_object( self::POST_TYPE_SLUG );

		if ( $post_type_object instanceof WP_Post_Type ) {
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
			'id'         => 'edit-story',
			'config'     => [
				'autoSaveInterval' => defined( 'AUTOSAVE_INTERVAL' ) ? AUTOSAVE_INTERVAL : null,
				'isRTL'            => is_rtl(),
				'locale'           => ( new Locale() )->get_locale_settings(),
				'allowedMimeTypes' => $this->get_allowed_mime_types(),
				'allowedFileTypes' => $this->get_allowed_file_types(),
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
					'users'   => '/wp/v2/users',
					'stories' => sprintf( '/web-stories/v1/%s', $rest_base ),
					'media'   => '/web-stories/v1/media',
					'link'    => '/web-stories/v1/link',
				],
				'metadata'         => [
					'publisher'       => $this->get_publisher_data(),
					'logoPlaceholder' => $this->get_publisher_logo_placeholder(),
				],
				'version'          => WEBSTORIES_VERSION,
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
		if ( 'stories' === $query->get( 'pagename' ) || 'stories' === $query->get( 'name' ) ) {
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
	 * Adds the web story post type to Jetpack / WordPress.com sitemaps.
	 *
	 * @see https://github.com/Automattic/jetpack/blob/4b85be883b3c584c64eeb2fb0f3fcc15dabe2d30/modules/custom-post-types/portfolios.php#L80
	 *
	 * @since 1.0.0
	 *
	 * @param array $post_types Array of post types.
	 *
	 * @return array Modified list of post types.
	 */
	public function add_to_jetpack_sitemap( $post_types ) {
		$post_types[] = self::POST_TYPE_SLUG;

		return $post_types;
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
}
