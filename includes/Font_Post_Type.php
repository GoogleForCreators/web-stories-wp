<?php
/**
 * Class Font_Post_Type.
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

use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\REST_API\Font_Controller;

/**
 * Class Font_Post_Type.
 *
 * @phpstan-import-type PostTypeArgs from \Google\Web_Stories\Post_Type_Base
 */
class Font_Post_Type extends Post_Type_Base implements HasRequirements {

	/**
	 * The slug of the font post type.
	 */
	public const POST_TYPE_SLUG = 'web-story-font';

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
	 */
	public function get_slug(): string {
		return self::POST_TYPE_SLUG;
	}

	/**
	 * Registers the post type for fonts.
	 *
	 * @since 1.16.0
	 *
	 * @return array<string, mixed> Post type args.
	 *
	 * @phpstan-return PostTypeArgs
	 */
	protected function get_args(): array {
		/**
		 * The edit_posts capability.
		 *
		 * @var string $edit_posts
		 */
		$edit_posts = $this->story_post_type->get_cap_name( 'edit_posts' );

		// Only admins are allowed to modify custom fonts,
		// but anyone who can create stories should be able to use them.
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
			'supports'              => [
				'title',
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
