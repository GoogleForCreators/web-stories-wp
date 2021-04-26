<?php
/**
 * Class Page_Template_Post_Type.
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

use Google\Web_Stories\REST_API\Stories_Base_Controller;
use Google\Web_Stories\Traits\Post_Type;

/**
 * Class Page_Template_Post_Type.
 */
class Page_Template_Post_Type extends Service_Base {
	use Post_Type;
	/**
	 * The slug of the page template post type.
	 * Limited to web-story-page as web-story-page-template goes over character limit.
	 *
	 * @var string
	 */
	const POST_TYPE_SLUG = 'web-story-page';

	/**
	 * Registers the post type for page templates.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function register() {
		$edit_posts   = $this->get_post_type_cap_name( Story_Post_Type::POST_TYPE_SLUG, 'edit_posts' );
		$delete_posts = $this->get_post_type_cap_name( Story_Post_Type::POST_TYPE_SLUG, 'delete_posts' );
		$capabilities = [
			'edit_post'              => $edit_posts,
			'read_post'              => $edit_posts,
			'delete_post'            => $delete_posts,
			'edit_posts'             => $edit_posts,
			'edit_others_posts'      => $edit_posts,
			'delete_posts'           => $delete_posts,
			'publish_posts'          => $edit_posts,
			'read_private_posts'     => $edit_posts,
			'delete_private_posts'   => $delete_posts,
			'delete_published_posts' => $delete_posts,
			'delete_others_posts'    => $delete_posts,
			'edit_private_posts'     => $edit_posts,
			'edit_published_posts'   => $edit_posts,
			'create_posts'           => $edit_posts,
		];

		register_post_type(
			self::POST_TYPE_SLUG,
			[
				'labels'                => [
					'name'                     => _x( 'Page Templates', 'post type general name', 'web-stories' ),
					'singular_name'            => _x( 'Page Template', 'post type singular name', 'web-stories' ),
					'add_new'                  => _x( 'Add New', 'page template', 'web-stories' ),
					'add_new_item'             => __( 'Add New Page Template', 'web-stories' ),
					'edit_item'                => __( 'Edit Page Template', 'web-stories' ),
					'new_item'                 => __( 'New Page Template', 'web-stories' ),
					'view_item'                => __( 'View Page Template', 'web-stories' ),
					'view_items'               => __( 'View Page Templates', 'web-stories' ),
					'search_items'             => __( 'Search Page Templates', 'web-stories' ),
					'not_found'                => __( 'No page templates found.', 'web-stories' ),
					'not_found_in_trash'       => __( 'No page templates found in Trash.', 'web-stories' ),
					'all_items'                => __( 'All Page Templates', 'web-stories' ),
					'archives'                 => __( 'Page Template Archives', 'web-stories' ),
					'attributes'               => __( 'Page Template Attributes', 'web-stories' ),
					'insert_into_item'         => __( 'Insert into page template', 'web-stories' ),
					'uploaded_to_this_item'    => __( 'Uploaded to this page template', 'web-stories' ),
					'featured_image'           => _x( 'Featured Image', 'page template', 'web-stories' ),
					'set_featured_image'       => _x( 'Set featured image', 'page template', 'web-stories' ),
					'remove_featured_image'    => _x( 'Remove featured image', 'page template', 'web-stories' ),
					'use_featured_image'       => _x( 'Use as featured image', 'page template', 'web-stories' ),
					'filter_by_date'           => __( 'Filter by date', 'web-stories' ),
					'filter_items_list'        => __( 'Filter page templates list', 'web-stories' ),
					'items_list_navigation'    => __( 'Page Templates list navigation', 'web-stories' ),
					'items_list'               => __( 'Page Templates list', 'web-stories' ),
					'item_published'           => __( 'Page Template published.', 'web-stories' ),
					'item_published_privately' => __( 'Page Template published privately.', 'web-stories' ),
					'item_reverted_to_draft'   => __( 'Page Template reverted to draft.', 'web-stories' ),
					'item_scheduled'           => __( 'Page Template scheduled', 'web-stories' ),
					'item_updated'             => __( 'Page Template updated.', 'web-stories' ),
					'menu_name'                => _x( 'Page Templates', 'admin menu', 'web-stories' ),
					'name_admin_bar'           => _x( 'Page Template', 'add new on admin bar', 'web-stories' ),
					'item_link'                => _x( 'Page Template Link', 'navigation link block title', 'web-stories' ),
					'item_link_description'    => _x( 'A link to a page template.', 'navigation link block description', 'web-stories' ),
				],
				'supports'              => [
					'title',
					'author',
					'excerpt',
				],
				'capabilities'          => $capabilities,
				'public'                => false,
				'show_ui'               => false,
				'show_in_rest'          => true,
				'rest_controller_class' => Stories_Base_Controller::class,
			]
		);
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority() {
		return 11;
	}
}
