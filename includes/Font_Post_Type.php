<?php
/**
 * Class Font_Post_Type.
 *
 * @package   Google\Web_Templates
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

use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\REST_API\Font_Controller;

/**
 * Class Font_Post_Type.
 */
class Font_Post_Type extends Post_Type_Base implements HasRequirements {

	/**
	 * The slug of the font post type.
	 *
	 * @var string
	 */
	const POST_TYPE_SLUG = 'web-story-font';

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Font_Post_Type constructor.
	 *
	 * @since 1.16.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Get post type slug.
	 *
	 * @since 1.16.0
	 *
	 * @return string
	 */
	public function get_slug(): string {
		return self::POST_TYPE_SLUG;
	}

	/**
	 * Registers the post type for fonts.
	 *
	 * @since 1.16.0
	 *
	 * @return array
	 */
	protected function get_args(): array {
		$edit_posts = $this->story_post_type->get_cap_name( 'edit_posts' );

		$capabilities = [
			'edit_post'              => 'manage_options',
			'read_post'              => $edit_posts,
			'delete_post'            => 'manage_options',
			'edit_posts'             => 'manage_options',
			'edit_others_posts'      => 'manage_options',
			'delete_posts'           => 'manage_options',
			'publish_posts'          => 'manage_options',
			'read_private_posts'     => 'manage_options',
			'delete_private_posts'   => 'manage_options',
			'delete_published_posts' => 'manage_options',
			'delete_others_posts'    => 'manage_options',
			'edit_private_posts'     => 'manage_options',
			'edit_published_posts'   => 'manage_options',
			'create_posts'           => 'manage_options',
		];

		return [
			'labels'                => [
				'name'                     => _x( 'Fonts', 'post type general name', 'web-stories' ),
				'singular_name'            => _x( 'Font', 'post type singular name', 'web-stories' ),
				'add_new'                  => _x( 'Add New', 'font', 'web-stories' ),
				'add_new_item'             => __( 'Add New Font', 'web-stories' ),
				'edit_item'                => __( 'Edit Font', 'web-stories' ),
				'new_item'                 => __( 'New Font', 'web-stories' ),
				'view_item'                => __( 'View Font', 'web-stories' ),
				'view_items'               => __( 'View Fonts', 'web-stories' ),
				'search_items'             => __( 'Search Fonts', 'web-stories' ),
				'not_found'                => __( 'No fonts found.', 'web-stories' ),
				'not_found_in_trash'       => __( 'No fonts found in Trash.', 'web-stories' ),
				'all_items'                => __( 'All Fonts', 'web-stories' ),
				'archives'                 => __( 'Font Archives', 'web-stories' ),
				'attributes'               => __( 'Font Attributes', 'web-stories' ),
				'insert_into_item'         => __( 'Insert into font', 'web-stories' ),
				'uploaded_to_this_item'    => __( 'Uploaded to this font', 'web-stories' ),
				'featured_image'           => _x( 'Featured Image', 'font', 'web-stories' ),
				'set_featured_image'       => _x( 'Set featured image', 'font', 'web-stories' ),
				'remove_featured_image'    => _x( 'Remove featured image', 'font', 'web-stories' ),
				'use_featured_image'       => _x( 'Use as featured image', 'font', 'web-stories' ),
				'filter_by_date'           => __( 'Filter by date', 'web-stories' ),
				'filter_items_list'        => __( 'Filter fonts list', 'web-stories' ),
				'items_list_navigation'    => __( 'Fonts list navigation', 'web-stories' ),
				'items_list'               => __( 'Fonts list', 'web-stories' ),
				'item_published'           => __( 'Font published.', 'web-stories' ),
				'item_published_privately' => __( 'Font published privately.', 'web-stories' ),
				'item_reverted_to_draft'   => __( 'Font reverted to draft.', 'web-stories' ),
				'item_scheduled'           => __( 'Font scheduled', 'web-stories' ),
				'item_updated'             => __( 'Font updated.', 'web-stories' ),
				'menu_name'                => _x( 'Fonts', 'admin menu', 'web-stories' ),
				'name_admin_bar'           => _x( 'Font', 'add new on admin bar', 'web-stories' ),
				'item_link'                => _x( 'Font Link', 'navigation link block title', 'web-stories' ),
				'item_link_description'    => _x( 'A link to a font.', 'navigation link block description', 'web-stories' ),
			],
			'supports'              => [
				'title',
				'author',
				'excerpt',
			],
			'capabilities'          => $capabilities,
			'rewrite'               => false,
			'public'                => false,
			'show_ui'               => false,
			'show_in_rest'          => true,
			'rest_namespace'        => self::REST_NAMESPACE,
			'rest_base'             => 'fonts',
			'rest_controller_class' => Font_Controller::class,
		];
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.16.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'story_post_type' ];
	}
}
