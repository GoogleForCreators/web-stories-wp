<?php
/**
 * Class Template_Post_Type.
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

/**
 * Class Template_Post_Type.
 */
class Template_Post_Type {
	/**
	 * The slug of the template post type.
	 *
	 * @var string
	 */
	const POST_TYPE_SLUG = 'web-story-template';

	/**
	 * Registers the post type for story templates.
	 *
	 * @return void
	 */
	public function init() {
		register_post_type(
			self::POST_TYPE_SLUG,
			[
				'labels'                => [
					'name'                     => _x( 'Templates', 'post type general name', 'web-stories' ),
					'singular_name'            => _x( 'Template', 'post type singular name', 'web-stories' ),
					'add_new'                  => _x( 'Add New', 'story template', 'web-stories' ),
					'add_new_item'             => __( 'Add New Template', 'web-stories' ),
					'edit_item'                => __( 'Edit Template', 'web-stories' ),
					'new_item'                 => __( 'New Template', 'web-stories' ),
					'view_item'                => __( 'View Template', 'web-stories' ),
					'view_items'               => __( 'View Templates', 'web-stories' ),
					'search_items'             => __( 'Search Templates', 'web-stories' ),
					'not_found'                => __( 'No templates found.', 'web-stories' ),
					'not_found_in_trash'       => __( 'No templates found in Trash.', 'web-stories' ),
					'all_items'                => __( 'All Templates', 'web-stories' ),
					'archives'                 => __( 'Template Archives', 'web-stories' ),
					'attributes'               => __( 'Template Attributes', 'web-stories' ),
					'insert_into_item'         => __( 'Insert into template', 'web-stories' ),
					'uploaded_to_this_item'    => __( 'Uploaded to this template', 'web-stories' ),
					'featured_image'           => __( 'Featured Image', 'web-stories' ),
					'set_featured_image'       => __( 'Set featured image', 'web-stories' ),
					'remove_featured_image'    => __( 'Remove featured image', 'web-stories' ),
					'use_featured_image'       => __( 'Use as featured image', 'web-stories' ),
					'filter_items_list'        => __( 'Filter stories list', 'web-stories' ),
					'items_list_navigation'    => __( 'Templates list navigation', 'web-stories' ),
					'items_list'               => __( 'Templates list', 'web-stories' ),
					'item_published'           => __( 'Template published.', 'web-stories' ),
					'item_published_privately' => __( 'Template published privately.', 'web-stories' ),
					'item_reverted_to_draft'   => __( 'Template reverted to draft.', 'web-stories' ),
					'item_scheduled'           => __( 'Template scheduled', 'web-stories' ),
					'item_updated'             => __( 'Template updated.', 'web-stories' ),
					'menu_name'                => _x( 'Templates', 'admin menu', 'web-stories' ),
					'name_admin_bar'           => _x( 'Template', 'add new on admin bar', 'web-stories' ),
				],
				'supports'              => [
					'title',
					'author',
					'excerpt',
					'thumbnail', // Used for poster images.
				],
				'public'                => false,
				'show_ui'               => false,
				'show_in_rest'          => true,
				'rest_controller_class' => Stories_Base_Controller::class,
			]
		);
	}
}
